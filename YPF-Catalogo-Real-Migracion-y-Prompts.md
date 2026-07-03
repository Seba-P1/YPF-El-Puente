# YPF El Puente — Catálogo Real + Menú en Dos Niveles
## Migración SQL + Prompts Antigravity
*AXPE Soluciones Digitales — Ejecutar en el orden exacto que aparece en este documento*

---

> **ORDEN DE EJECUCIÓN — no saltear pasos**
> 1. Correr la SECCIÓN A completa en el SQL Editor de Supabase
> 2. Ejecutar los prompts de la SECCIÓN B en Antigravity, en orden numérico
> 3. Recién después de eso, subir el Excel real desde el botón "Cargar catálogo completo"
> 4. Como paso manual final, entrar a Productos y marcar `destacado` en los que quieras
>    mostrar en la portada — esto no se automatiza, es una decisión de curación tuya

---

# SECCIÓN A — MIGRACIÓN DE BASE DE DATOS
### Ejecutar en el SQL Editor de Supabase, de arriba a abajo

```sql
-- ═══════════════════════════════════════════════════════════
-- PASO 1 — Columnas nuevas
-- ═══════════════════════════════════════════════════════════

ALTER TABLE public.productos
  ADD COLUMN IF NOT EXISTS es_sin_tacc BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.uploads_historial
  ADD COLUMN IF NOT EXISTS modo TEXT;
  -- valores esperados: 'actualizar' | 'catalogo_completo'


-- ═══════════════════════════════════════════════════════════
-- PASO 2 — Eliminar el catálogo inventado
-- (Los productos de "hamburguesas" y "cafeteria" fueron extraídos por
--  Sebastián directamente de full.ypf.com como referencia visual, NO son
--  los productos reales de YPF El Puente. Se reemplazan por el catálogo
--  real que manda YPF Central.
--  Marca Full NO se toca: esos 14 productos fueron confirmados como reales
--  por YPF en la reunión, quedan con precio manual hasta tener su propio
--  archivo de precios.)
-- ═══════════════════════════════════════════════════════════

DELETE FROM public.productos WHERE categoria_slug = 'hamburguesas';
DELETE FROM public.productos WHERE categoria_slug = 'cafeteria';

DELETE FROM public.categorias WHERE slug = 'hamburguesas';


-- ═══════════════════════════════════════════════════════════
-- PASO 3 — Categorías reales (mismos nombres que usa YPF en el Excel)
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.categorias (slug, nombre, descripcion, subtitulo, orden, activa)
VALUES
  ('comidas_calientes', 'Comidas Calientes', 'Sabores que reconfortan.', 'Hamburguesas, combos y más', 1, true),
  ('comidas_frias',      'Comidas Frías',      'Frescura en cada bocado.', 'Sándwiches, ensaladas y más', 2, true),
  ('cafeteria',          'Cafetería',          'Lo primero es el café.',  'El café más elegido por los argentinos.', 3, true),
  ('panaderia',          'Panadería',          'Recién horneado, todos los días.', 'Facturas, budines y más', 4, true),
  ('combos',             'Combos',             'Más completo, mejor precio.', 'La forma más conveniente de pedir', 5, true),
  ('sin_categoria',      'Sin categorizar',    'Productos pendientes de revisión', NULL, 99, false)
ON CONFLICT (slug) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  subtitulo = EXCLUDED.subtitulo,
  orden = EXCLUDED.orden,
  activa = EXCLUDED.activa;

-- Nota: 'cafeteria' ya existía (con productos falsos que se borraron en el
-- Paso 2). Este INSERT ... ON CONFLICT actualiza sus textos sin duplicar
-- la fila ni romper el FK de 'marca_full' que no se toca.


-- ═══════════════════════════════════════════════════════════
-- PASO 4 — Verificación (correr y revisar el resultado)
-- ═══════════════════════════════════════════════════════════

SELECT slug, nombre, activa, orden FROM public.categorias ORDER BY orden;

SELECT categoria_slug, count(*) AS productos
FROM public.productos
GROUP BY categoria_slug
ORDER BY categoria_slug;
-- Después de este paso, marca_full debe seguir mostrando 14.
-- hamburguesas y la vieja cafeteria no deben aparecer más en este resultado.
```

---

# SECCIÓN B — PROMPTS PARA ANTIGRAVITY
### Ejecutar en este orden. Cada prompt es autocontenido.

---

## PROMPT 1 — Parser del Excel real de YPF Central

**Archivo:** `lib/excel/parser.ts` (reescritura completa)
**También modificar:** el archivo donde está definido el tipo `ExcelRow` (probablemente `types/index.ts`)
**Dependencia:** Ninguna — este es el primer prompt

```
Reescribí completamente lib/excel/parser.ts. El archivo actual usa detección
de columnas por keyword genérico (PLU, PRECIO, VENTA) — eso queda obsoleto.
Ahora conocemos la estructura EXACTA del archivo real que manda YPF Central,
así que el parser debe leerla de forma precisa, no adivinar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTRUCTURA REAL DEL ARCHIVO (hoja "Precios Productos")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El archivo tiene DOS filas de encabezado (fila 1 y fila 2), luego los datos
desde la fila 3. La fila 1 tiene celdas combinadas (merged cells) que agrupan
varias columnas bajo un mismo título. ExcelJS solo puebla la celda ancla de
un merge — las demás celdas del mismo grupo devuelven null.

FILA 1 (grupos, con celdas vacías entre cada ancla):
  Columna D: "PRECIO ANTERIOR"  (agrupa columnas D-I)
  Columna J: "PRECIO NUEVO"     (agrupa columnas J-O)
  (hay más grupos después de la O que no nos interesan)

FILA 2 (encabezados reales, 32 columnas):
  A: Código
  B: Descripción
  C: Categoria
  D-I: Super Premium | Premium | Alto | Medio Alto | Medio | Bajo   (PRECIO ANTERIOR)
  J-O: Super Premium | Premium | Alto | Medio Alto | Medio | Bajo   (PRECIO NUEVO)
  P en adelante: CAMBIO PRECIO, Volumen, Unidad de medida, IVA, etc. (ignorar)

EL DATO QUE NECESITAMOS es "PRECIO NUEVO" → columna "Premium", que en la
estructura real cae en la columna K (índice 11, 1-based). YPF El Puente
está clasificada como estación "Premium" — TODOS los 375 productos reales
tienen valor únicamente en esa columna, las demás (Super Premium, Alto,
Medio Alto, Medio, Bajo) están vacías.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN PRINCIPAL: parseExcelFile(file: File): Promise<ExcelRow[]>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PASO 1 — Cargar el workbook con ExcelJS (igual que el código actual):
  const buffer = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const worksheet = workbook.worksheets[0]

PASO 2 — Reconstruir la fila 1 con "forward-fill" (rellenar los huecos
de las celdas combinadas con el último valor no vacío hacia la derecha):

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

  const fila1 = worksheet.getRow(1)
  const fila2 = worksheet.getRow(2)
  const colCount = fila2.cellCount

  const grupoPorColumna = forwardFillRow(fila1, colCount)
  const headerPorColumna: string[] = []
  fila2.eachCell({ includeEmpty: true }, (cell, col) => {
    headerPorColumna[col - 1] = String(cell.value ?? '').trim()
  })

PASO 3 — Localizar las columnas fijas (Código, Descripción, Categoria)
con verificación defensiva. Estas están SIEMPRE en A, B, C, pero igual
hay que confirmar que el header dice lo esperado, para detectar si YPF
cambió el formato:

  if (!headerPorColumna[0]?.toLowerCase().includes('cod')) {
    throw new Error(
      `La columna A no parece ser "Código" (encontré: "${headerPorColumna[0]}"). ` +
      `El formato del archivo puede haber cambiado — revisar manualmente.`
    )
  }
  if (!headerPorColumna[1]?.toLowerCase().includes('descrip')) {
    throw new Error(
      `La columna B no parece ser "Descripción" (encontré: "${headerPorColumna[1]}"). ` +
      `El formato del archivo puede haber cambiado — revisar manualmente.`
    )
  }
  if (!headerPorColumna[2]?.toLowerCase().includes('categ')) {
    throw new Error(
      `La columna C no parece ser "Categoria" (encontré: "${headerPorColumna[2]}"). ` +
      `El formato del archivo puede haber cambiado — revisar manualmente.`
    )
  }
  const COL_CODIGO = 1
  const COL_DESCRIPCION = 2
  const COL_CATEGORIA = 3

PASO 4 — Localizar dinámicamente la columna de precio: la que tiene
grupoPorColumna conteniendo "PRECIO NUEVO" (case-insensitive) Y
headerPorColumna exactamente igual a "Premium" (case-insensitive, trim):

  let colPrecio: number | null = null
  for (let i = 0; i < colCount; i++) {
    const grupo = grupoPorColumna[i]?.toUpperCase() ?? ''
    const sub = headerPorColumna[i]?.toLowerCase().trim() ?? ''
    if (grupo.includes('PRECIO NUEVO') && sub === 'premium') {
      colPrecio = i + 1 // 1-based para ExcelJS
      break
    }
  }

  if (!colPrecio) {
    const pares = headerPorColumna.map((h, i) => `[${grupoPorColumna[i]} / ${h}]`).join(', ')
    throw new Error(
      `No se encontró la columna "PRECIO NUEVO / Premium". ` +
      `Encabezados detectados: ${pares}. ` +
      `El formato del archivo puede haber cambiado — revisar manualmente.`
    )
  }

PASO 5 — Recorrer las filas de datos desde la fila 3, mapear cada una:

  const rows: ExcelRow[] = []
  const codigosVistos = new Map<string, ExcelRow>() // para deduplicar

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < 3) return

    const rawCodigo = row.getCell(COL_CODIGO).value
    if (rawCodigo === null || rawCodigo === undefined || rawCodigo === '') return

    // El código puede venir como número (1229) — convertir sin decimales
    const codigo_plu = typeof rawCodigo === 'number'
      ? String(Math.trunc(rawCodigo))
      : String(rawCodigo).trim()

    if (!codigo_plu) return

    const rawNombre = row.getCell(COL_DESCRIPCION).value
    const nombre = String(rawNombre ?? '').trim()
    if (!nombre) return

    const rawCategoria = row.getCell(COL_CATEGORIA).value
    const categoriaOriginal = String(rawCategoria ?? '').trim()

    const rawPrecio = row.getCell(colPrecio!).value
    const precio = typeof rawPrecio === 'number' ? rawPrecio : parseFloat(String(rawPrecio ?? '0'))

    if (isNaN(precio) || precio <= 0) return

    const categoria_slug = mapearCategoria(categoriaOriginal, nombre)
    const es_sin_tacc = nombre.toUpperCase().includes('SIN TACC')

    const fila: ExcelRow = { codigo_plu, nombre, precio, categoria_slug, es_sin_tacc }

    // Deduplicar: si el código ya apareció antes en este archivo, se
    // sobreescribe (nos quedamos con la última ocurrencia). Esto es
    // necesario porque el archivo real de YPF puede repetir códigos
    // (ej: código 1820 aparece dos veces en un archivo de ejemplo).
    codigosVistos.set(codigo_plu, fila)
  })

  return Array.from(codigosVistos.values())

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCIÓN: mapearCategoria(categoriaOriginal, nombre): string
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  function mapearCategoria(categoriaOriginal: string, nombre: string): string {
    const cat = categoriaOriginal.toLowerCase().trim()

    let slug: string
    if (cat.includes('cafet')) slug = 'cafeteria'
    else if (cat.includes('calient')) slug = 'comidas_calientes'
    else if (cat.includes('fria') || cat.includes('frías') || cat.includes('frias')) slug = 'comidas_frias'
    else if (cat.includes('panader')) slug = 'panaderia'
    else slug = 'sin_categoria'

    // Los combos son transversales: si el nombre empieza con "Combo",
    // esto tiene PRIORIDAD sobre la categoría de origen, sin importar
    // si el Excel lo tenía en Comidas Calientes o Frías.
    if (nombre.trim().toLowerCase().startsWith('combo')) {
      return 'combos'
    }

    return slug
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTUALIZAR EL TIPO ExcelRow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buscar la definición actual de ExcelRow (probablemente en types/index.ts)
y reemplazarla por:

  export interface ExcelRow {
    codigo_plu: string
    nombre: string
    precio: number
    categoria_slug: string
    es_sin_tacc: boolean
  }

También actualizar UploadResult para reportar más detalle:

  export interface UploadResult {
    actualizados: number
    nuevos: number
    omitidos: number      // filas del archivo cuyo código no existe (solo modo 'actualizar')
    sinTacc: number        // cuántas de las filas procesadas tenían es_sin_tacc = true
    errores: number
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANTENER SIN CAMBIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

La función formatearPrecioARS() al final del archivo se queda exactamente
igual, no tocarla. La validación de extensión de archivo (.xlsx/.xls/.csv)
al inicio de parseExcelFile también se mantiene igual.
```

---

## PROMPT 2 — API Route de importación con dos modos

**Archivo:** `app/api/upload-excel/route.ts` (reescritura completa)
**Dependencia:** Prompt 1 completo (necesita el nuevo shape de ExcelRow)

```
Reescribí completamente app/api/upload-excel/route.ts para soportar dos
modos de carga distintos: 'actualizar' y 'catalogo_completo'. Mantener
toda la lógica de autenticación y verificación de rol admin EXACTAMENTE
como está en el archivo actual — no tocar esa parte.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMBIOS EN EL PASO 2 (parseo del body)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const body = await request.json()
const { rows, filename, modo } = body

if (modo !== 'actualizar' && modo !== 'catalogo_completo') {
  return NextResponse.json(
    { error: 'Modo inválido. Debe ser "actualizar" o "catalogo_completo".' },
    { status: 400 }
  )
}

if (!Array.isArray(rows) || rows.length === 0) {
  return NextResponse.json({ error: 'El array de filas está vacío o no es válido.' }, { status: 400 })
}

const MAX_ROWS = 2000
if (rows.length > MAX_ROWS) {
  return NextResponse.json({ error: `Demasiadas filas (máximo ${MAX_ROWS}).` }, { status: 413 })
}

// Validar cada fila con el nuevo shape
for (let i = 0; i < rows.length; i++) {
  const row = rows[i]
  if (!row.codigo_plu || typeof row.codigo_plu !== 'string') {
    return NextResponse.json({ error: `Fila ${i + 1}: codigo_plu es obligatorio.` }, { status: 400 })
  }
  if (!row.nombre || typeof row.nombre !== 'string') {
    return NextResponse.json({ error: `Fila ${i + 1}: nombre es obligatorio.` }, { status: 400 })
  }
  if (typeof row.precio !== 'number' || row.precio <= 0) {
    return NextResponse.json({ error: `Fila ${i + 1}: precio debe ser un número positivo.` }, { status: 400 })
  }
  if (!row.categoria_slug || typeof row.categoria_slug !== 'string') {
    return NextResponse.json({ error: `Fila ${i + 1}: categoria_slug es obligatorio.` }, { status: 400 })
  }
}

// Deduplicación defensiva por codigo_plu (por si el cliente mandó
// duplicados igual — nos quedamos con la última ocurrencia). Esto evita
// el error de Postgres "ON CONFLICT DO UPDATE command cannot affect
// row a second time" cuando dos filas del mismo batch tienen el mismo
// codigo_plu.
const rowsDedup = Array.from(
  new Map(rows.map((r: any) => [r.codigo_plu, r])).values()
) as any[]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 4 — Determinar existentes (igual que antes, pero sobre rowsDedup)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const allPlus = rowsDedup.map((r) => r.codigo_plu as string)
const { data: existingProducts } = await adminClient
  .from('productos')
  .select('codigo_plu')
  .in('codigo_plu', allPlus)

const existingSet = new Set((existingProducts as any[])?.map((p) => p.codigo_plu) ?? [])

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 5 — Filtrar filas según el modo, ANTES del upsert
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let filasAProcesar: any[]
let omitidos = 0

if (modo === 'actualizar') {
  // Solo tocar productos que YA existen. Todo lo demás se cuenta como
  // omitido y NO se inserta.
  filasAProcesar = rowsDedup.filter((r) => existingSet.has(r.codigo_plu))
  omitidos = rowsDedup.length - filasAProcesar.length
} else {
  // catalogo_completo: procesar todas las filas (existentes + nuevas)
  filasAProcesar = rowsDedup
}

let actualizados = 0
let nuevos = 0
let sinTaccCount = 0
let errores = 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 6 — Upsert en batches
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANTE: para filas que YA existen, el objeto de upsert NUNCA debe
incluir categoria_slug, disponible, destacado, badge, orden ni imagen_url
— esos campos son curados a mano por el administrador y una carga de
precios no debe pisarlos. Solo se actualizan nombre, precio y es_sin_tacc.

Para filas NUEVAS (solo puede pasar en modo 'catalogo_completo'), el
producto se crea con disponible = false — queda OCULTO del sitio público
hasta que un admin lo revise y lo active manualmente desde el panel. Esto
es intencional: evita que un archivo de cientos de productos aparezca sin
curar en la página que ven los clientes.

const BATCH_SIZE = 50
for (let i = 0; i < filasAProcesar.length; i += BATCH_SIZE) {
  const batch = filasAProcesar.slice(i, i + BATCH_SIZE)

  const upsertData = batch.map((row) => {
    const isExisting = existingSet.has(row.codigo_plu)
    if (isExisting) {
      return {
        codigo_plu: row.codigo_plu,
        nombre: row.nombre,
        precio: row.precio,
        es_sin_tacc: row.es_sin_tacc,
        updated_at: new Date().toISOString(),
      }
    }
    return {
      codigo_plu: row.codigo_plu,
      nombre: row.nombre,
      precio: row.precio,
      categoria_slug: row.categoria_slug,
      es_sin_tacc: row.es_sin_tacc,
      disponible: false,
      destacado: false,
      orden: 0,
    }
  })

  const { error: upsertError } = await adminClient
    .from('productos')
    .upsert(upsertData, { onConflict: 'codigo_plu', ignoreDuplicates: false })

  if (upsertError) {
    console.error(`Batch upsert error (rows ${i + 1}-${i + batch.length}):`, upsertError)
    errores += batch.length
  } else {
    batch.forEach((row) => {
      if (row.es_sin_tacc) sinTaccCount++
      if (existingSet.has(row.codigo_plu)) {
        actualizados++
      } else {
        nuevos++
      }
    })
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 7 — Guardar historial (agregar el campo modo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

await adminClient.from('uploads_historial').insert({
  nombre_archivo: filename || 'archivo.xlsx',
  total_filas: rows.length,
  productos_actualizados: actualizados,
  productos_nuevos: nuevos,
  productos_error: errores,
  modo,
})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 8 — Retornar resultado enriquecido
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

return NextResponse.json({
  success: errores === 0,
  result: {
    actualizados,
    nuevos,
    omitidos,
    sinTacc: sinTaccCount,
    errores,
  },
})
```

---

## PROMPT 3 — Panel Admin: dos botones de carga

**Archivos:**
`components/admin/ExcelUploader.tsx` (reescritura, ahora parametrizado por `modo`)
`app/(admin)/admin/precios/page.tsx` (actualizar para renderizar dos instancias)

**Dependencia:** Prompts 1 y 2 completos

```
IMPORTANTE — CONSISTENCIA VISUAL: el proyecto ya usa un sistema de diseño
basado en shadcn/ui con clases de tema (bg-primary, text-foreground,
text-muted-foreground, bg-muted, rounded-xl) y componentes GlassCard,
Button, Table, Badge ya existentes. Seguir ese mismo patrón — NO usar
estilos inline con colores hexadecimales hardcodeados en estos archivos
del admin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
components/admin/ExcelUploader.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agregar una prop nueva al componente:

interface ExcelUploaderProps {
  modo: 'actualizar' | 'catalogo_completo'
}

export function ExcelUploader({ modo }: ExcelUploaderProps) { ... }

COPYS CONDICIONALES según el modo (usar un objeto de configuración al
inicio del componente):

const config = modo === 'actualizar'
  ? {
      titulo: 'Actualizar Precios',
      descripcion: 'Sincronizá precios y nombres de los productos que ya tenés cargados. Los códigos que no reconozcamos se omiten — no se crea nada nuevo.',
      colorAcento: 'primary',       // usa las clases bg-primary / text-primary existentes
      textoBotonConfirmar: 'Confirmar y actualizar precios →',
      advertencia: 'Esta acción actualiza precio, nombre y la marca Sin Tacc de los productos existentes. No cambia categoría, disponibilidad ni imagen.',
    }
  : {
      titulo: 'Cargar Catálogo Completo',
      descripcion: 'Importá TODOS los productos del archivo de YPF Central, incluyendo los que todavía no tenés cargados.',
      colorAcento: 'orange',        // usar clases de advertencia (ej: bg-orange-500/10, text-orange-600 ya usadas en el resto del admin)
      textoBotonConfirmar: 'Confirmar e importar catálogo completo →',
      advertencia: 'Los productos NUEVOS se crean OCULTOS (no aparecen en la página pública) hasta que los revises y actives manualmente desde Productos → filtro "Inactivos". Los productos que ya existen se actualizan igual que en "Actualizar Precios".',
    }

FLUJO DE ESTADOS: mantener exactamente los mismos 6 estados que ya existen
(idle, parsing, preview, uploading, success, error) — no cambiar esa
máquina de estados, solo lo que se muestra en cada uno.

CAMBIOS EN EL ESTADO 'preview':

1. Agregar un resumen por categoría ANTES de la tabla de muestra:
   Calcular con un reduce sobre parsedRows: cuántas filas cayeron en cada
   categoria_slug, y cuántas tienen es_sin_tacc = true.

   Mostrar como fila de badges (usar el componente Badge existente):
   "Comidas Calientes: 149" · "Cafetería: 127" · "Comidas Frías: 66" ·
   "Panadería: 33" · "Combos: X" · "Sin Tacc: Y"

2. La tabla de muestra ahora tiene más columnas — cambiar el TableHeader:
   Código PLU | Nombre | Categoría detectada | Precio | Sin Tacc

   Cada fila de "Sin Tacc" muestra un Badge verde chico "Sí" si
   row.es_sin_tacc es true, o nada si es false.

3. Si modo === 'catalogo_completo', agregar un AlertTriangle box (mismo
   estilo que ya usa el componente para la advertencia de irreversibilidad)
   con el texto de config.advertencia, en color naranja.

4. El botón de confirmar debe enviar el modo en el body del fetch:

   body: JSON.stringify({
     filename: file?.name,
     rows: parsedRows,
     modo,
   })

CAMBIOS EN EL ESTADO 'success':

Agregar dos cards nuevas a la grilla de resultado (ya hay 4: Procesados,
Actualizados, Nuevos, Errores) — ahora son 6:
  - "Sin Tacc" con uploadResult.sinTacc
  - "Omitidos" con uploadResult.omitidos (solo relevante en modo
    'actualizar' — en modo 'catalogo_completo' este valor siempre es 0,
    mostrar igual pero sin destacarlo)

Si modo === 'catalogo_completo' Y uploadResult.nuevos > 0, agregar un
mensaje debajo de las cards:
  "X productos nuevos quedaron ocultos, pendientes de revisión."
  con un botón/link que navegue a /admin/productos (usar next/link)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app/(admin)/admin/precios/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reemplazar el único <ExcelUploader /> por dos instancias, una junto a la
otra en desktop (grid grid-cols-1 lg:grid-cols-2 gap-6) y apiladas en
mobile:

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ExcelUploader modo="actualizar" />
  <ExcelUploader modo="catalogo_completo" />
</div>

Actualizar también la tabla de "Historial de Actualizaciones" debajo:
agregar una columna "Modo" que muestre un Badge distinto según
item.modo ('actualizar' → badge azul "Actualización", 'catalogo_completo'
→ badge naranja "Catálogo completo", null/undefined → badge gris "—" para
compatibilidad con registros históricos previos a este cambio).
```

---

## PROMPT 4 — Placeholder visual para productos sin imagen

**Archivo nuevo:** `components/public/ProductImagePlaceholder.tsx`
**Dependencia:** Ninguna — puede ejecutarse en paralelo a los prompts 1-3

```
Crear un componente placeholder para productos sin imagen_url cargada.
Debe verse intencional y prolijo, con la misma estética oscura de FULL
(fondo degradado gris/oscuro, NO un ícono de "imagen rota" genérico).

interface ProductImagePlaceholderProps {
  categoriaSlug: string
  size?: number   // default 200
}

export function ProductImagePlaceholder({ categoriaSlug, size = 200 }: ProductImagePlaceholderProps) {
  const iconoPorCategoria: Record<string, LucideIcon> = {
    comidas_calientes: Flame,
    comidas_frias: Salad,
    cafeteria: Coffee,
    panaderia: Croissant,
    combos: Package,
    marca_full: Star,
    sin_categoria: HelpCircle,
  }

  const Icono = iconoPorCategoria[categoriaSlug] ?? ImageOff

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%), #1A1D27',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icono size={size * 0.32} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
    </div>
  )
}

Importar de lucide-react: Flame, Salad, Coffee, Croissant, Package, Star,
HelpCircle, ImageOff.

Este componente se usa en dos lugares (que van a modificarse en los
Prompts 5 y 6): cada vez que producto.imagen_url sea null o vacío, en
lugar de renderizar next/image se renderiza <ProductImagePlaceholder
categoriaSlug={producto.categoria_slug} />.
```

---

## PROMPT 5 — Portada `/full`: solo destacados + botón al menú completo

**Archivos:**
`lib/supabase/queries.ts` (agregar función nueva)
`app/(public)/full/page.tsx` (modificar data fetching)
`components/public/FullNavbar.tsx` (agregar botón CTA)

**Dependencia:** Prompt 4 completo (usa el placeholder)

```
IMPORTANTE — CONSISTENCIA VISUAL: estos son archivos PÚBLICOS, distintos
al admin. Mantener el patrón ya usado en /full: estilos inline con la
paleta oscura de YPF (fondo #06080F/#0A0A0F, azul #005A9C/#0070C0,
amarillo #FFD100), Framer Motion para animaciones. NO introducir clases
de shadcn/ui acá — ese sistema es solo para el admin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
lib/supabase/queries.ts — agregar esta función nueva
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getProductosDestacados(): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .eq('destacado', true)
    .order('orden', { ascending: true })

  if (error) throw error
  return data ?? []
}

No modificar ni eliminar getProductosByCategoria() — sigue existiendo,
la va a usar la nueva página /full/menu del Prompt 6.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app/(public)/full/page.tsx — cambios en el data fetching
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reemplazar el fetch de productos por categoría (que traía TODOS los
productos de hamburguesas/cafeteria/marca_full) por:

const [destacados, categorias] = await Promise.all([
  getProductosDestacados(),
  getCategorias(),
])

const porCategoria = (slug: string) =>
  destacados.filter((p) => p.categoria_slug === slug)

Luego, para cada FullCategorySection que ya existe en la página, pasar
productos={porCategoria('comidas_calientes')} en vez de la lista completa
(ajustar también los slugs de cafeteria y marca_full si corresponde,
usando los nuevos slugs reales: comidas_calientes, cafeteria, marca_full
— comidas_frias y panaderia y combos NO tienen sección en la portada,
solo aparecen en el catálogo completo del Prompt 6).

MANEJO DE SECCIÓN VACÍA (caso importante — recién migrado, puede que
Sebastián todavía no haya marcado ningún destacado):

Dentro de FullCategorySection, si productos.length === 0, en vez de
renderizar la grilla vacía, mostrar un estado alternativo centrado:

  <div style={{ textAlign: 'center', padding: '80px 24px' }}>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 20 }}>
      Estamos preparando esta sección.
    </p>
    <a href="/full/menu" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      color: '#FFD100', fontSize: 15, fontWeight: 700, textDecoration: 'none',
    }}>
      Ver el menú completo →
    </a>
  </div>

Esto evita que la portada se vea rota mientras Sebastián todavía no picoteó
los destacados después de la migración.

También, dentro de FullProductCard (o donde se renderice la imagen),
agregar el fallback al ProductImagePlaceholder:

  {producto.imagen_url ? (
    <Image src={producto.imagen_url} ... />
  ) : (
    <ProductImagePlaceholder categoriaSlug={producto.categoria_slug} size={260} />
  )}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
components/public/FullNavbar.tsx — botón "Ir al Menú Completo"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agregar un botón CTA destacado, distinto visualmente de los links de
sección (Hamburguesas/Cafetería/Marca Full que hacen scroll interno).
Este botón NAVEGA a otra página, no hace scroll:

<a
  href="/full/menu"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 36,
    padding: '0 16px',
    borderRadius: 9999,
    background: 'rgba(255,209,0,0.12)',
    border: '1px solid rgba(255,209,0,0.35)',
    color: '#FFD100',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }}
>
  Ver Menú Completo →
</a>

Ubicarlo en la navbar, entre los links de sección y el botón del carrito
(visible tanto en desktop como en mobile — en mobile puede ir como ícono
+ texto corto "Menú" si el espacio es limitado, usar tu criterio de
ui-ux-pro-max-skill para la versión compacta).
```

---

## PROMPT 6 — Nueva página `/full/menu`: catálogo completo

**Archivos nuevos:**
`app/(public)/full/menu/page.tsx`
`components/public/CatalogoProductCard.tsx`
`components/public/CatalogoFiltros.tsx`

**También modificar:** `lib/supabase/queries.ts` (agregar función)
**Dependencia:** Prompts 4 y 5 completos

```
IMPORTANTE — MISMA CONSISTENCIA VISUAL que el Prompt 5: estilos inline,
paleta oscura YPF, Framer Motion. Esta página es pública.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
lib/supabase/queries.ts — función nueva
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getCatalogoCompleto(): Promise<Producto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .order('categoria_slug', { ascending: true })
    .order('nombre', { ascending: true })

  if (error) throw error
  return data ?? []
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app/(public)/full/menu/page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client' — necesita estado para búsqueda, filtros y paginación.

DATA FETCHING: useEffect al montar, llamar getCatalogoCompleto() (via un
API route interno o Server Action, ya que este componente es client —
crear app/api/catalogo/route.ts que simplemente hace
return NextResponse.json(await getCatalogoCompleto()) y el componente
lo consume con fetch('/api/catalogo')).
Mostrar skeleton mientras carga (reusar el patrón de skeleton ya usado
en otras páginas del proyecto).

LAYOUT:
  <FullNavbar />
  <header con título "Menú Completo" y subtítulo "Todos nuestros productos, en un solo lugar">
  <CatalogoFiltros ... />   (buscador + pills de categoría + toggle Sin Tacc)
  <grilla de <CatalogoProductCard /> — ver abajo>
  <paginación>
  <footer>

ESTADO:
  const [productos, setProductos] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos')
  const [soloSinTacc, setSoloSinTacc] = useState(false)
  const [pagina, setPagina] = useState(1)

  const ITEMS_POR_PAGINA = 48

FILTRADO (useMemo, encadenado):
  1. Filtrar por categoriaActiva (si no es 'todos', comparar categoria_slug)
  2. Filtrar por soloSinTacc (si true, solo es_sin_tacc === true)
  3. Filtrar por busqueda (nombre.toLowerCase().includes(busqueda.toLowerCase()))
  4. Resetear pagina a 1 cada vez que cambia cualquiera de los tres filtros
     de arriba (usar un useEffect con esas tres variables como dependencia)

PAGINACIÓN:
  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA)
  const paginados = filtrados.slice((pagina-1)*ITEMS_POR_PAGINA, pagina*ITEMS_POR_PAGINA)

  Controles simples: "Anterior" / "Siguiente" + "Página X de Y", mismo
  estilo visual que el resto del sitio (fondo oscuro, texto blanco/gris).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
components/public/CatalogoFiltros.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Props: { busqueda, onBusqueda, categoriaActiva, onCategoria, soloSinTacc, onSinTacc }

Sticky debajo de la navbar (position: sticky, top: 68px, z-index: 30),
fondo rgba(0,0,0,0.9) + backdrop-blur, mismo patrón visual que
FullSearchBar del /full original — de hecho podés reusar gran parte de
ese componente como base.

BUSCADOR: igual al de FullSearchBar (input con ícono Search, pill
redondeada, fondo semitransparente).

PILLS DE CATEGORÍA (scroll horizontal si no entran):
  Todos | 🔥 Comidas Calientes | 🥗 Comidas Frías | ☕ Cafetería |
  🥐 Panadería | 📦 Combos | ⭐ Marca Full

TOGGLE SIN TACC — visualmente distinto de las pills de categoría (es un
filtro adicional, no excluyente con la categoría): un chip con ícono
(usar un ícono de trigo tachado o similar de lucide, ej: WheatOff) que
al activarse queda con fondo verde/resaltado, separado un poco a la
derecha de las pills de categoría.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
components/public/CatalogoProductCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este es un card DENSO, distinto al FullProductCard flotante de la
portada — estilo grilla compacta tipo PedidosYa/MercadoLibre.

interface CatalogoProductCardProps {
  producto: Producto
}

ESTRUCTURA (a diferencia del FullProductCard, este SÍ tiene un card
visual con fondo, no es transparente flotante):

  <div style={{
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }}>

    {/* Imagen cuadrada */}
    <div style={{ aspectRatio: '1/1', position: 'relative', background: '#0D1120' }}>
      {producto.imagen_url ? (
        <Image src={producto.imagen_url} alt={producto.nombre} fill style={{ objectFit: 'cover' }} />
      ) : (
        <ProductImagePlaceholder categoriaSlug={producto.categoria_slug} size={9999} />
        {/* nota: si ProductImagePlaceholder no soporta fill-mode, ajustar
           para que ocupe el 100% del contenedor con position absolute inset 0 */}
      )}
      {producto.es_sin_tacc && (
        <span style={{
          position: 'absolute', top: 8, left: 8,
          background: 'rgba(34,197,94,0.9)', color: 'white',
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
        }}>
          SIN TACC
        </span>
      )}
    </div>

    {/* Info */}
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <p style={{
        fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', minHeight: 34,
      }}>
        {producto.nombre}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#FFD100' }}>
          {formatearPrecioARS(producto.precio)}
        </span>
        <button onClick={handleAdd} style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'rgba(0,90,156,0.85)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <Plus size={16} color="white" />
        </button>
      </div>
    </div>
  </div>

GRILLA CONTENEDORA en la página:
  display: grid
  grid-template-columns: repeat(2, 1fr)   mobile
  grid-template-columns: repeat(4, 1fr)   tablet (sm)
  grid-template-columns: repeat(6, 1fr)   desktop (lg)
  gap: 12px

handleAdd: mismo patrón que el resto del sitio — useCartStore().addItem(producto)
+ toast.success(`${producto.nombre} agregado`).
```

---

# NOTAS FINALES

```
PENDIENTES QUE QUEDAN FUERA DE ESTE PAQUETE (no son de código):

1. Marca Full (14 productos) sigue sin archivo de precios propio de YPF.
   Quedan con precio editable a mano desde el panel hasta que consigas
   ese archivo en la próxima reunión.

2. Después de correr la migración SQL y subir el Excel real por primera
   vez con "Cargar catálogo completo", TODOS los productos nuevos van a
   estar ocultos (disponible = false). Entrá a Productos → filtro
   Inactivos, revisá, y activá los que quieras mostrar. Después marcá
   destacado = true en un puñado (4-5 por categoría) para que la portada
   /full tenga contenido — sin ese paso manual, la portada va a mostrar
   el mensaje de "Estamos preparando esta sección" en cada categoría.

3. El código de "Doble Clásica" ($6.000, muy por debajo del resto de
   hamburguesas que rondan los $16-19mil) puede ser un error de carga de
   YPF — confirmalo con Ariel antes de darlo por bueno.

4. Convención de nombre de archivo para las imágenes que te van a mandar:
   el nombre del archivo debe ser exactamente el código del producto
   (ej: 25543.jpg), sin ceros adelante ni texto extra. Le podés pasar el
   texto que armamos antes a quien te las envíe.

CHECKLIST DE VERIFICACIÓN:
[ ] SQL de la Sección A corrido sin errores en Supabase
[ ] Verificación del Paso 4 muestra marca_full con 14 productos, sin
    'hamburguesas' en la lista de categorías
[ ] Parser nuevo detecta correctamente Código/Descripción/Categoria/Premium
[ ] Subir el Excel real con "Actualizar Precios" en un catálogo vacío
    debe reportar 0 actualizados, 0 nuevos, ~375 omitidos (todavía no hay
    nada cargado) — esto confirma que el modo funciona como se espera
[ ] Subir el mismo archivo con "Cargar Catálogo Completo" debe crear
    ~375 productos nuevos, todos con disponible = false
[ ] La categoría de cada producto importado coincide con lo esperado
    (Comidas Calientes / Frías / Cafetería / Panadería / Combos)
[ ] Los nombres que contienen "SIN TACC" tienen es_sin_tacc = true
[ ] Los nombres que empiezan con "Combo" quedan en categoria_slug = 'combos'
    sin importar su categoría original en el Excel
[ ] Portada /full no rompe visualmente si una sección no tiene destacados
[ ] Botón "Ver Menú Completo" navega correctamente a /full/menu
[ ] /full/menu muestra los ~375 productos disponibles, filtro por
    categoría y Sin Tacc funcionan, buscador funciona, paginación funciona
[ ] Productos sin imagen_url muestran el placeholder prolijo, no un
    ícono de imagen rota
```

---

*YPF El Puente — Catálogo Real*
*AXPE Soluciones Digitales — Río Colorado, Patagonia, Argentina*
