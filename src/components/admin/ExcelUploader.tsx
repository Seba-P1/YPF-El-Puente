'use client'

import { useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { parseExcelFile } from '@/lib/excel/parser'
import { formatearPrecioARS } from '@/lib/format'
import type { ExcelRow, UploadResult } from '@/types'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type UploaderState = 'idle' | 'parsing' | 'preview' | 'uploading' | 'success' | 'error'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface ExcelUploaderProps {
  modo: 'actualizar' | 'catalogo_completo'
}

const MODO_CONFIG = {
  actualizar: {
    titulo: 'Actualizar Precios',
    descripcion:
      'Sincronizá precios y nombres de los productos que ya tenés cargados. Los códigos que no reconozcamos se omiten — no se crea nada nuevo.',
    colorAcento: 'primary',
    textoBotonConfirmar: 'Confirmar y actualizar precios →',
    advertencia:
      'Esta acción actualiza precio, nombre y la marca Sin Tacc de los productos existentes. No cambia categoría, disponibilidad ni imagen.',
  },
  catalogo_completo: {
    titulo: 'Cargar Catálogo Completo',
    descripcion:
      'Importá TODOS los productos del archivo de YPF Central, incluyendo los que todavía no tenés cargados.',
    colorAcento: 'orange',
    textoBotonConfirmar: 'Confirmar e importar catálogo completo →',
    advertencia:
      'Los productos NUEVOS se crean OCULTOS (no aparecen en la página pública) hasta que los revises y actives manualmente desde Productos → filtro "Inactivos". Los productos que ya existen se actualizan igual que en "Actualizar Precios".',
  },
} as const

export function ExcelUploader({ modo }: ExcelUploaderProps) {
  const router = useRouter()
  const config = MODO_CONFIG[modo]
  const [state, setState] = useState<UploaderState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ExcelRow[]>([])
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isCatalogo = modo === 'catalogo_completo'

  // Category breakdown for preview
  const categoryBreakdown = useMemo(() => {
    if (parsedRows.length === 0) return []
    const counts: Record<string, number> = {}
    let sinTaccCount = 0
    for (const row of parsedRows) {
      counts[row.categoria_slug] = (counts[row.categoria_slug] || 0) + 1
      if (row.es_sin_tacc) sinTaccCount++
    }
    const entries = Object.entries(counts).map(([slug, count]) => ({ slug, count }))
    entries.push({ slug: 'Sin TACC', count: sinTaccCount })
    return entries
  }, [parsedRows])

  const CATEGORY_LABELS: Record<string, string> = {
    comidas_calientes: 'Comidas Calientes',
    comidas_frias: 'Comidas Frías',
    cafeteria: 'Cafetería',
    panaderia: 'Panadería',
    combos: 'Combos',
    marca_full: 'Marca Full',
    sin_categoria: 'Sin categorizar',
    'Sin TACC': 'Sin TACC',
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        setState('error')
        const reason = rejectedFiles[0].errors[0]?.code
        if (reason === 'file-too-large') {
          setErrorMessage(`El archivo supera el límite de ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
        } else {
          setErrorMessage('El formato del archivo no es válido. Solo se permiten .xlsx, .xls o .csv')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]
        setFile(selectedFile)
        setState('parsing')
        setErrorMessage(null)

        try {
          const rows = await parseExcelFile(selectedFile)
          setParsedRows(rows)
          setState('preview')
        } catch (error: any) {
          setState('error')
          setErrorMessage(error.message || 'Error al procesar el archivo Excel')
        }
      }
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
  })

  const handleCancel = () => {
    setFile(null)
    setParsedRows([])
    setState('idle')
    setErrorMessage(null)
    setUploadResult(null)
  }

  const handleConfirmUpload = async () => {
    setState('uploading')

    try {
      const res = await fetch('/api/upload-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file?.name,
          rows: parsedRows,
          modo,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'Error al procesar la actualización en el servidor'
        )
      }

      setUploadResult(data.result)
      setState('success')
      router.refresh()
    } catch (error: any) {
      setState('error')
      setErrorMessage(error.message)
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      {/* State: IDLE */}
      {state === 'idle' && (
        <div
          {...getRootProps()}
          className={`p-12 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[350px] ${
            isDragActive ? 'bg-primary/5' : 'hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
              isDragActive
                ? isCatalogo
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2 text-center tracking-tight">
            {isDragActive ? 'Soltá el archivo aquí' : config.titulo}
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm">
            {config.descripcion}
          </p>
          <Button variant="outline" size="lg" className="rounded-xl shadow-sm">
            Seleccionar archivo
          </Button>
        </div>
      )}

      {/* State: PARSING */}
      {state === 'parsing' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              isCatalogo ? 'bg-orange-500/10' : 'bg-primary/10'
            }`}
          >
            <Loader2
              className={`w-10 h-10 animate-spin ${
                isCatalogo ? 'text-orange-500' : 'text-primary'
              }`}
            />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
            Leyendo el archivo...
          </h3>
          <p className="text-muted-foreground text-sm">
            Analizando columnas y extrayendo productos.
          </p>
        </div>
      )}

      {/* State: PREVIEW */}
      {state === 'preview' && (
        <div className="flex flex-col">
          <div
            className={`p-6 lg:p-8 border-b flex flex-col gap-4 ${
              isCatalogo ? 'bg-orange-500/5' : 'bg-primary/5'
            }`}
          >
            <div>
              <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight">
                Vista Previa
              </h3>
              <p className="text-muted-foreground text-sm">
                Archivo:{' '}
                <span className="font-semibold text-foreground">{file?.name}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span
                  className={`px-2.5 py-1 font-bold rounded-lg ${
                    isCatalogo
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {parsedRows.length} productos detectados
                </span>
              </div>
            </div>

            {/* Category breakdown badges */}
            <div className="flex flex-wrap gap-2">
              {categoryBreakdown.map(({ slug, count }) => (
                <Badge
                  key={slug}
                  variant="secondary"
                  className={`text-xs font-semibold ${
                    slug === 'Sin TACC'
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                      : ''
                  }`}
                >
                  {CATEGORY_LABELS[slug] || slug}: {count}
                </Badge>
              ))}
            </div>

            {/* Catalog mode warning */}
            {isCatalogo && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700 dark:text-orange-400 font-medium leading-relaxed">
                  {config.advertencia}
                </p>
              </div>
            )}

            {!isCatalogo && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium leading-relaxed">
                  {config.advertencia}
                </p>
              </div>
            )}
          </div>

          <div className="p-0 border-b overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-6 font-semibold">Código PLU</TableHead>
                  <TableHead className="px-6 font-semibold">Nombre</TableHead>
                  <TableHead className="px-6 font-semibold">Categoría</TableHead>
                  <TableHead className="px-6 font-semibold">Precio</TableHead>
                  <TableHead className="px-6 font-semibold">Sin TACC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 font-mono text-foreground font-medium">
                      {row.codigo_plu}
                    </TableCell>
                    <TableCell className="px-6 text-foreground max-w-[200px] truncate">
                      {row.nombre}
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground text-xs">
                      {CATEGORY_LABELS[row.categoria_slug] || row.categoria_slug}
                    </TableCell>
                    <TableCell className="px-6 font-bold text-primary">
                      {formatearPrecioARS(row.precio)}
                    </TableCell>
                    <TableCell className="px-6">
                      {row.es_sin_tacc && (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 text-[10px]">
                          Sí
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {parsedRows.length > 10 && (
              <div className="p-4 text-center bg-muted/30 text-muted-foreground text-sm font-medium border-t">
                Y {parsedRows.length - 10} productos más...
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8 flex gap-4 bg-muted/20">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmUpload}
              className={`flex-1 h-12 rounded-xl font-bold shadow-lg ${
                isCatalogo
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : ''
              }`}
            >
              {config.textoBotonConfirmar}
            </Button>
          </div>
        </div>
      )}

      {/* State: UPLOADING */}
      {state === 'uploading' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              isCatalogo ? 'bg-orange-500/10' : 'bg-primary/10'
            }`}
          >
            <Upload
              className={`w-10 h-10 animate-bounce ${
                isCatalogo ? 'text-orange-500' : 'text-primary'
              }`}
            />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
            {isCatalogo
              ? 'Importando catálogo completo...'
              : 'Actualizando base de datos...'}
          </h3>
          <p className="text-muted-foreground mb-8 text-center max-w-sm text-sm">
            Esto puede tardar unos segundos dependiendo de la cantidad de productos en
            el Excel. No cierres la ventana.
          </p>
          <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className={`absolute top-0 bottom-0 left-0 w-1/2 rounded-full animate-[progress_1s_ease-in-out_infinite_alternate] ${
                isCatalogo ? 'bg-orange-500' : 'bg-primary'
              }`}
            />
          </div>
        </div>
      )}

      {/* State: SUCCESS */}
      {state === 'success' && uploadResult && (
        <div className="p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-5 text-green-600 dark:text-green-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">
            {isCatalogo ? '¡Catálogo importado!' : '¡Precios actualizados!'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md text-sm">
            {isCatalogo
              ? 'El catálogo completo se procesó correctamente. Los productos nuevos están ocultos hasta que los revises.'
              : 'El archivo se procesó correctamente y los precios ya están visibles en la página web.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-2xl mb-8 min-w-0">
            <div className="bg-muted/50 p-3 rounded-xl border min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Procesados
              </p>
              <p className="text-2xl font-black text-foreground truncate">
                {parsedRows.length}
              </p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 min-w-0">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-0.5">
                Actualizados
              </p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 truncate">
                {uploadResult.actualizados}
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 min-w-0">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-0.5">
                Full Principal sinc.
              </p>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-300 truncate">
                {uploadResult.sincronizadosCurados}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20 min-w-0">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-0.5">
                Nuevos
              </p>
              <p className="text-2xl font-black text-green-700 dark:text-green-300 truncate">
                {uploadResult.nuevos}
              </p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 min-w-0">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-0.5">
                Sin TACC
              </p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 truncate">
                {uploadResult.sinTacc}
              </p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 min-w-0">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-0.5">
                Omitidos
              </p>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300 truncate">
                {uploadResult.omitidos}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl border min-w-0 ${
                uploadResult.errores > 0
                  ? 'bg-destructive/10 border-destructive/20'
                  : 'bg-muted/50 border'
              }`}
            >
              <p
                className={`text-xs font-medium mb-0.5 ${
                  uploadResult.errores > 0
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }`}
              >
                Errores
              </p>
              <p
                className={`text-2xl font-black truncate ${
                  uploadResult.errores > 0
                    ? 'text-destructive'
                    : 'text-foreground'
                }`}
              >
                {uploadResult.errores}
              </p>
            </div>
          </div>

          {isCatalogo && uploadResult.nuevos > 0 && (
            <div className="mb-5 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex flex-col items-center gap-2 max-w-md">
              <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                {uploadResult.nuevos} productos nuevos quedaron ocultos,
                pendientes de revisión.
              </p>
              <Link
                href="/admin/productos"
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Ir a Productos →
              </Link>
            </div>
          )}

          <Button
            onClick={handleCancel}
            size="lg"
            className="rounded-xl font-bold shadow-lg"
          >
            Subir otro archivo
          </Button>
        </div>
      )}

      {/* State: ERROR */}
      {state === 'error' && (
        <div className="p-12 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 text-destructive">
            <XCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">
            Error al procesar
          </h3>
          <p className="text-destructive mb-8 max-w-md bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-sm font-medium">
            {errorMessage}
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl font-bold"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setState('idle')
                setErrorMessage(null)
              }}
              className="rounded-xl font-bold shadow-md"
            >
              Intentar nuevamente
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
