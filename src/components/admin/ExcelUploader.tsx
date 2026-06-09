'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileSpreadsheet, Upload, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { parseExcelFile } from '@/lib/excel/parser'
import { formatearPrecioARS } from '@/lib/excel/parser'
import type { ExcelRow, UploadResult } from '@/types'
import { useRouter } from 'next/navigation'

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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* State: IDLE */}
      {state === 'idle' && (
        <div
          {...getRootProps()}
          className={`p-12 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[350px] ${
            isDragActive ? 'bg-blue-50/50' : 'hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
            isDragActive ? 'bg-blue-100 text-[#005A9C]' : 'bg-gray-100 text-gray-400'
          }`}>
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 text-center">
            {isDragActive ? 'Soltá el archivo aquí' : 'Actualizar Precios'}
          </h3>
          <p className="text-gray-500 text-center max-w-sm mb-8">
            Arrastrá y soltá el archivo Excel (.xlsx) enviado por YPF Central, o hacé click para seleccionarlo desde tu computadora.
          </p>
          <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
            Seleccionar archivo
          </button>
        </div>
      )}

      {/* State: PARSING */}
      {state === 'parsing' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-[#005A9C] animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Leyendo el archivo...</h3>
          <p className="text-gray-500">Analizando columnas y extrayendo precios.</p>
        </div>
      )}

      {/* State: PREVIEW */}
      {state === 'preview' && (
        <div className="flex flex-col">
          <div className="p-6 lg:p-8 bg-blue-50/30 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">Vista Previa</h3>
              <p className="text-gray-600">
                Archivo: <span className="font-semibold text-gray-900">{file?.name}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="px-2.5 py-1 bg-[#005A9C]/10 text-[#005A9C] font-bold rounded-lg">
                  {parsedRows.length} productos detectados
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 max-w-sm">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                Esta acción es irreversible. Verificá que los datos de la muestra sean correctos antes de confirmar.
              </p>
            </div>
          </div>

          <div className="p-0 border-b border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4">Código PLU</th>
                  <th className="px-8 py-4">Precio Detectado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parsedRows.slice(0, 10).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50/50">
                    <td className="px-8 py-3 font-mono text-gray-900 font-medium">
                      {row.codigo_plu}
                    </td>
                    <td className="px-8 py-3 font-bold text-[#005A9C]">
                      {formatearPrecioARS(row.precio)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedRows.length > 10 && (
              <div className="p-4 text-center bg-gray-50 text-gray-500 text-sm font-medium border-t border-gray-100">
                Y {parsedRows.length - 10} productos más...
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8 flex gap-4 bg-gray-50/50">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmUpload}
              className="flex-1 py-4 bg-[#005A9C] text-white font-bold rounded-2xl shadow-lg hover:bg-[#004a80] transition-colors"
            >
              Confirmar y actualizar precios →
            </button>
          </div>
        </div>
      )}

      {/* State: UPLOADING */}
      {state === 'uploading' && (
        <div className="p-12 flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-[#005A9C] animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Actualizando base de datos...</h3>
          <p className="text-gray-500 mb-8 text-center max-w-sm">
            Esto puede tardar unos segundos dependiendo de la cantidad de productos en el Excel. No cierres la ventana.
          </p>
          <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#005A9C] rounded-full animate-[progress_1s_ease-in-out_infinite_alternate]" />
          </div>
        </div>
      )}

      {/* State: SUCCESS */}
      {state === 'success' && uploadResult && (
        <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            ¡Precios actualizados!
          </h3>
          <p className="text-gray-500 mb-8 max-w-md">
            El archivo se procesó correctamente y los precios ya están visibles en la página web.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-10">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Procesados</p>
              <p className="text-3xl font-black text-gray-900">{parsedRows.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-sm font-medium text-blue-600/80 mb-1">Actualizados</p>
              <p className="text-3xl font-black text-blue-700">{uploadResult.actualizados}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-sm font-medium text-green-600/80 mb-1">Nuevos Creados</p>
              <p className="text-3xl font-black text-green-700">{uploadResult.nuevos}</p>
            </div>
            <div className={`p-4 rounded-2xl border ${uploadResult.errores > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-sm font-medium mb-1 ${uploadResult.errores > 0 ? 'text-red-600/80' : 'text-gray-500'}`}>Errores</p>
              <p className={`text-3xl font-black ${uploadResult.errores > 0 ? 'text-red-700' : 'text-gray-900'}`}>{uploadResult.errores}</p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-colors"
          >
            Subir otro archivo
          </button>
        </div>
      )}

      {/* State: ERROR */}
      {state === 'error' && (
        <div className="p-12 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
            <XCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Error al procesar</h3>
          <p className="text-gray-600 mb-8 max-w-md bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 font-medium">
            {errorMessage}
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => { setState('idle'); setErrorMessage(null); }}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-800 transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
