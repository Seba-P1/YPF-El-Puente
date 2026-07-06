import ExcelJS from 'exceljs'
import type { ExcelRow } from '@/types'

// ═══════════════════════════════════════════════════════════
// Category mapping from Excel originals to our database slugs
// ═══════════════════════════════════════════════════════════

function mapearCategoria(categoriaOriginal: string, nombre: string): string {
  const cat = categoriaOriginal.toLowerCase().trim()

  let slug: string
  if (cat.includes('cafet')) slug = 'cafeteria'
  else if (cat.includes('calient')) slug = 'comidas_calientes'
  else if (cat.includes('fria') || cat.includes('frías') || cat.includes('frias'))
    slug = 'comidas_frias'
  else if (cat.includes('panader')) slug = 'panaderia'
  else slug = 'sin_categoria'

  // Combos are cross-category: if the name starts with "Combo",
  // it overrides whatever category the Excel had.
  if (nombre.trim().toLowerCase().startsWith('combo')) {
    return 'combos'
  }

  return slug
}

// ═══════════════════════════════════════════════════════════
// Forward-fill helper for merged-cell rows
// ═══════════════════════════════════════════════════════════

function forwardFillRow(row: ExcelJS.Row, colCount: number): string[] {
  const result: string[] = []
  let ultimo = ''
  for (let col = 1; col <= colCount; col++) {
    const valor = String(row.getCell(col).value ?? '').trim()
    if (valor) ultimo = valor
    result.push(ultimo)
  }
  return result
}

function normalizarTexto(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

// ═══════════════════════════════════════════════════════════
// Main parser — reads the exact structure of the YPF Central file
// ═══════════════════════════════════════════════════════════

/**
 * Parse the official YPF Central Excel file and extract product data.
 *
 * The file has TWO header rows (row 1 = merged group headers, row 2 = column
 * headers) and data rows starting from row 3. We read the fixed "PRECIO NUEVO /
 * Premium" column (column K for a Premium-tier station like Río Colorado).
 */
export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
  // Validate file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !['xlsx', 'xls', 'csv'].includes(extension)) {
    throw new Error(
      `Formato no soportado: .${extension ?? 'unknown'}. Solo se aceptan archivos .xlsx, .xls o .csv`
    )
  }

  const buffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    throw new Error('El archivo no contiene hojas de cálculo')
  }

  // ── STEP 1: Reconstruct row 1 & 2 and detect format ──
  const fila1 = worksheet.getRow(1)
  const fila2 = worksheet.getRow(2)
  
  const val1A = normalizarTexto(String(fila1.getCell(1).value ?? ''))
  const val2A = normalizarTexto(String(fila2.getCell(1).value ?? ''))
  
  // Format B has "codigo" on row 1 and data starts directly on row 2 (which starts with a PLU number like 1230).
  const isFormatB = val1A === 'codigo' || val1A === 'cod' || /^\d+$/.test(val2A)
  
  let COL_CODIGO = 1
  let COL_DESCRIPCION = 2
  let COL_CATEGORIA = 3
  let colPrecio: number | null = null
  let startRow = 3

  if (isFormatB) {
    // FORMAT B: Single header row. Row 1 = Headers, Row 2+ = Data.
    startRow = 2
    const colCount = fila1.cellCount
    
    // Find Code, Description, Category and Price dynamically
    for (let col = 1; col <= colCount; col++) {
      const val = normalizarTexto(String(fila1.getCell(col).value ?? ''))
      if (val === 'codigo' || val === 'cod' || val.includes('plu')) {
        COL_CODIGO = col
      } else if (val === 'producto' || val.includes('descrip') || val === 'nombre') {
        COL_DESCRIPCION = col
      } else if (val.includes('categ')) {
        COL_CATEGORIA = col
      } else if (val.includes('precio') || val.includes('valor') || val.includes('monto')) {
        colPrecio = col
      }
    }
    
    // Fallback if not found
    if (!colPrecio) colPrecio = 5
  } else {
    // FORMAT A: Dual header rows. Row 1 = Group headers, Row 2 = Sub headers, Row 3+ = Data.
    startRow = 3
    const colCount = fila2.cellCount
    const grupoPorColumna = forwardFillRow(fila1, colCount)
    const headerPorColumna: string[] = []
    
    fila2.eachCell({ includeEmpty: true }, (cell, col) => {
      headerPorColumna[col - 1] = String(cell.value ?? '').trim()
    })

    const colA = normalizarTexto(headerPorColumna[0] ?? '')
    const colB = normalizarTexto(headerPorColumna[1] ?? '')
    const colC = normalizarTexto(headerPorColumna[2] ?? '')

    if (!colA.includes('cod')) {
      throw new Error(
        `La columna A no parece ser "Código" (encontré: "${headerPorColumna[0]}"). ` +
          `El formato del archivo puede haber cambiado — revisar manualmente.`
      )
    }
    if (!colB.includes('descrip') && !colB.includes('nombre')) {
      throw new Error(
        `La columna B no parece ser "Descripción" (encontré: "${headerPorColumna[1]}"). ` +
          `El formato del archivo puede haber cambiado — revisar manualmente.`
      )
    }
    if (!colC.includes('categ')) {
      throw new Error(
        `La columna C no parece ser "Categoría" (encontré: "${headerPorColumna[2]}"). ` +
          `El formato del archivo puede haber cambiado — revisar manualmente.`
      )
    }

    COL_CODIGO = 1
    COL_DESCRIPCION = 2
    COL_CATEGORIA = 3

    // Dynamically locate the price column in dual-header format
    for (let i = 0; i < colCount; i++) {
      const grupo = normalizarTexto(grupoPorColumna[i] ?? '')
      const sub = normalizarTexto(headerPorColumna[i] ?? '')
      if (grupo.includes('precio nuevo') && sub === 'premium') {
        colPrecio = i + 1
        break
      }
    }

    if (!colPrecio) {
      const pares = headerPorColumna
        .map((h, i) => `[${grupoPorColumna[i]} / ${h}]`)
        .join(', ')
      throw new Error(
        `No se encontró la columna "PRECIO NUEVO / Premium". ` +
          `Encabezados detectados: ${pares}. ` +
          `El formato del archivo puede haber cambiado — revisar manualmente.`
      )
    }
  }

  // ── STEP 4: Iterate data rows from startRow onward ──
  const codigosVistos = new Map<string, ExcelRow>()

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < startRow) return

    const rawCodigo = row.getCell(COL_CODIGO).value
    if (rawCodigo === null || rawCodigo === undefined || rawCodigo === '') return

    // Code may come as number (1229) — convert without decimals
    const codigo_plu =
      typeof rawCodigo === 'number'
        ? String(Math.trunc(rawCodigo))
        : String(rawCodigo).trim()

    if (!codigo_plu) return

    const rawNombre = row.getCell(COL_DESCRIPCION).value
    const nombre = String(rawNombre ?? '').trim()
    if (!nombre) return

    const rawCategoria = row.getCell(COL_CATEGORIA).value
    const categoriaOriginal = String(rawCategoria ?? '').trim()

    const rawPrecio = row.getCell(colPrecio!).value
    const precio =
      typeof rawPrecio === 'number' ? rawPrecio : parseFloat(String(rawPrecio ?? '0'))

    if (isNaN(precio) || precio <= 0) return

    const categoria_slug = mapearCategoria(categoriaOriginal, nombre)
    const nameUpper = nombre.toUpperCase()
    const es_sin_tacc =
      nameUpper.includes('SIN TACC') ||
      nameUpper.includes('SIN T.A.C.C.') ||
      nameUpper.includes('S/TACC') ||
      nameUpper.includes('S/ TACC') ||
      nameUpper.includes('SINTACC') ||
      nameUpper.includes('SIN GLUTEN') ||
      nameUpper.includes('S.G.') ||
      nameUpper.includes('S/G')

    const fila: ExcelRow = { codigo_plu, nombre, precio, categoria_slug, es_sin_tacc }

    // Deduplicate: if the code already appeared, keep the last occurrence.
    // The real YPF file can repeat codes (e.g. code 1820 appears twice).
    codigosVistos.set(codigo_plu, fila)
  })

  return Array.from(codigosVistos.values())
}

/**
 * Format a number as Argentine Peso currency string.
 * Example: 2500 → "$2.500,00"
 */
export function formatearPrecioARS(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio)
}