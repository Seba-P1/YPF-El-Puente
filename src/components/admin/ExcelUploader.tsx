'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileSpreadsheet, Upload, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { parseExcelFile } from '@/lib/excel/parser'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { ExcelRow, UploadResult } from '@/types'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type UploaderState = 'idle' | 'parsing' | 'preview' | 'uploading' | 'success' | 'error'

export function ExcelUploader() {
  const router = useRouter()
  const [state, setState] = useState<UploaderState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<ExcelRow[]>([])
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setState('error')
      setErrorMessage('El formato del archivo no es válido. Solo se permiten .xlsx, .xls o .csv')
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
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
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
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la actualización en el servidor')
      }

      setUploadResult(data.result)
      setState('success')
      router.refresh() // Refresh the page to update the history table

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
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
            isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2 text-center tracking-tight">
            {isDragActive ? 'Soltá el archivo aquí' : 'Actualizar Precios'}
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm">
            Arrastrá y soltá el archivo Excel (.xlsx) enviado por YPF Central, o hacé click para seleccionarlo desde tu computadora.
          </p>
          <Button variant="outline" size="lg" className="rounded-xl shadow-sm">
            Seleccionar archivo
          </Button>
        </div>
      )}

      {/* State: PARSING */}
      {state === 'parsing' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Leyendo el archivo...</h3>
          <p className="text-muted-foreground text-sm">Analizando columnas y extrayendo precios.</p>
        </div>
      )}

      {/* State: PREVIEW */}
      {state === 'preview' && (
        <div className="flex flex-col">
          <div className="p-6 lg:p-8 bg-primary/5 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight">Vista Previa</h3>
              <p className="text-muted-foreground text-sm">
                Archivo: <span className="font-semibold text-foreground">{file?.name}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-lg">
                  {parsedRows.length} productos detectados
                </span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 max-w-sm">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium leading-relaxed">
                Esta acción es irreversible. Verificá que los datos de la muestra sean correctos antes de confirmar.
              </p>
            </div>
          </div>

          <div className="p-0 border-b overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="px-8 font-semibold">Código PLU</TableHead>
                  <TableHead className="px-8 font-semibold">Precio Detectado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-8 font-mono text-foreground font-medium">
                      {row.codigo_plu}
                    </TableCell>
                    <TableCell className="px-8 font-bold text-primary">
                      {formatearPrecioARS(row.precio)}
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
              className="flex-1 h-12 rounded-xl font-bold shadow-lg"
            >
              Confirmar y actualizar precios →
            </Button>
          </div>
        </div>
      )}

      {/* State: UPLOADING */}
      {state === 'uploading' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-primary animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Actualizando base de datos...</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-sm text-sm">
            Esto puede tardar unos segundos dependiendo de la cantidad de productos en el Excel. No cierres la ventana.
          </p>
          <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-primary rounded-full animate-[progress_1s_ease-in-out_infinite_alternate]" />
          </div>
        </div>
      )}

      {/* State: SUCCESS */}
      {state === 'success' && uploadResult && (
        <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">
            ¡Precios actualizados!
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md text-sm">
            El archivo se procesó correctamente y los precios ya están visibles en la página web.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-10">
            <div className="bg-muted/50 p-4 rounded-xl border">
              <p className="text-sm font-medium text-muted-foreground mb-1">Procesados</p>
              <p className="text-3xl font-black text-foreground">{parsedRows.length}</p>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Actualizados</p>
              <p className="text-3xl font-black text-blue-700 dark:text-blue-300">{uploadResult.actualizados}</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Nuevos</p>
              <p className="text-3xl font-black text-green-700 dark:text-green-300">{uploadResult.nuevos}</p>
            </div>
            <div className={`p-4 rounded-xl border ${uploadResult.errores > 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/50 border'}`}>
              <p className={`text-sm font-medium mb-1 ${uploadResult.errores > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>Errores</p>
              <p className={`text-3xl font-black ${uploadResult.errores > 0 ? 'text-destructive' : 'text-foreground'}`}>{uploadResult.errores}</p>
            </div>
          </div>

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
          <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">Error al procesar</h3>
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
              onClick={() => { setState('idle'); setErrorMessage(null); }}
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
