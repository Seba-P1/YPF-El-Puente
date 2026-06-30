import ExcelJS from 'exceljs'
import type { ExcelRow } from '@/types'

const PLU_CANDIDATES = ['PLU', 'CODIGO', 'COD', 'EAN', 'BARCODE', 'ARTICULO']
const PRICE_CANDIDATES = ['PRECIO', 'PRICE', 'VENTA', 'PVP', 'IMPORTE']
const PREFERRED_PRICE = ['VENTA', 'PVP']

/**
 * Detect a column header that matches one of the candidate keywords.
 * Returns the actual header name or null if no match found.
 */
function detectColumn(
  headers: string[],
  candidates: string[],
  preferred?: string[]
): string | null {
  const normalizedHeaders = headers.map((h) => h.toUpperCase().trim())

  // Check preferred candidates first
  if (preferred) {
    for (const pref of preferred) {
      const index = normalizedHeaders.findIndex((h) => h.includes(pref))
      if (index >= 0) return headers[index]
    }
  }

  // Fall back to any matching candidate
  for (const candidate of candidates) {
    const index = normalizedHeaders.findIndex((h) => h.includes(candidate))
    if (index >= 0) return headers[index]
  }

  return null
}

/**
 * Parse an Excel/CSV file from YPF Central and extract PLU code-price pairs.
 * Automatically detects column headers regardless of their exact naming.
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

  // Get headers from the first row
  const headerRow = worksheet.getRow(1)
  const headers: string[] = []
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? '').trim()
  })

  if (headers.length === 0 || headers.every(h => !h)) {
    throw new Error('El archivo no contiene encabezados válidos')
  }

  const pluColumn = detectColumn(headers, PLU_CANDIDATES)
  const priceColumn = detectColumn(headers, PRICE_CANDIDATES, PREFERRED_PRICE)

  if (!pluColumn) {
    throw new Error(
      `No se encontró la columna de código PLU. Headers encontrados: ${headers.join(', ')}. ` +
        `Se buscó: ${PLU_CANDIDATES.join(', ')}`
    )
  }

  if (!priceColumn) {
    throw new Error(
      `No se encontró la columna de precio. Headers encontrados: ${headers.join(', ')}. ` +
        `Se buscó: ${PRICE_CANDIDATES.join(', ')}`
    )
  }

  const pluColIndex = headers.indexOf(pluColumn) + 1 // 1-based index
  const priceColIndex = headers.indexOf(priceColumn) + 1

  const rows: ExcelRow[] = []

  // Iterate data rows starting from row 2
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // Skip header row

    const rawPlu = row.getCell(pluColIndex).value
    const rawPrice = row.getCell(priceColIndex).value

    // Clean PLU code: convert to string, remove spaces and dots
    const codigo_plu = String(rawPlu ?? '')
      .trim()
      .replace(/[\s.]/g, '')

    // Parse price as positive number
    const precio = parseFloat(
      String(rawPrice ?? '0')
        .replace(/[^\d.,\-]/g, '')
        .replace(',', '.')
    )

    // Skip invalid rows
    if (!codigo_plu || isNaN(precio) || precio <= 0) return

    rows.push({ codigo_plu, precio })
  })

  return rows
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