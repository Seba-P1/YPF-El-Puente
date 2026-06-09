'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateProductoImagen } from '@/lib/supabase/actions'
import { toast } from 'sonner'

interface ImageUploaderProps {
  productoId: string
  productoNombre: string
  imagenActual: string | null
  onUploadSuccess: (imagenUrl: string, imagenPath: string) => void
  onClose: () => void
}

type UploadState = 'idle' | 'preview' | 'uploading' | 'error'

export function ImageUploader({
  productoId,
  productoNombre,
  imagenActual,
  onUploadSuccess,
  onClose,
}: ImageUploaderProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setState('error')
      setErrorMessage('Formato no válido. Asegurate de subir una imagen PNG.')
      return
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setState('preview')
      setErrorMessage(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleCancel = () => {
    setFile(null)
    setPreviewUrl(null)
    setState('idle')
    setErrorMessage(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setState('uploading')
    const supabase = createClient()

    try {
      // 1. Remove previous image if exists (to keep storage clean)
      // Extract the path from the URL if needed, or if we had it passed down
      if (imagenActual) {
        // Find the path part after the bucket name
        const match = imagenActual.match(/productos-imagenes\/(.+)$/)
        if (match && match[1]) {
          const oldPath = match[1]
          await supabase.storage.from('productos-imagenes').remove([oldPath])
        }
      }

      // 2. Generate new unique file name
      const fileName = `${productoId}-${Date.now()}.png`

      // 3. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('productos-imagenes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // 4. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('productos-imagenes')
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      // 5. Update product record in DB
      await updateProductoImagen(productoId, publicUrl, fileName)

      // 6. Success handling
      toast.success('Imagen actualizada correctamente')
      onUploadSuccess(publicUrl, fileName)
      onClose()

    } catch (error: any) {
      console.error('Error uploading image:', error)
      setState('error')
      setErrorMessage(error.message || 'Error desconocido al subir la imagen')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Actualizar Imagen</h2>
            <p className="text-sm text-gray-500 mt-1 truncate max-w-[250px] sm:max-w-sm">
              {productoNombre}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={state === 'uploading'}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
          
          {state === 'idle' && (
            <div
              {...getRootProps()}
              className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                isDragActive ? 'border-[#005A9C] bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-center font-medium text-gray-900 mb-2">
                Arrastrá y soltá una imagen aquí
              </p>
              <p className="text-center text-sm text-gray-500 max-w-xs">
                O hacé click para seleccionar un archivo desde tu computadora.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                <AlertCircle className="w-4 h-4" />
                Solo se permiten archivos PNG.
              </div>
            </div>
          )}

          {state === 'preview' && previewUrl && (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="relative w-48 h-48 mb-6 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 shadow-inner p-4 flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain filter drop-shadow-xl"
                />
              </div>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#005A9C] hover:bg-[#004a80] shadow-md transition-colors"
                >
                  Confirmar y subir
                </button>
              </div>
              <p className="mt-4 text-xs text-center text-gray-500 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                La imagen debe tener el fondo transparente.
              </p>
            </div>
          )}

          {state === 'uploading' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#005A9C] animate-spin" />
              </div>
              <p className="font-bold text-gray-900">Subiendo imagen...</p>
              <p className="text-sm text-gray-500">Por favor, no cierres esta ventana.</p>
            </div>
          )}

          {state === 'error' && (
            <div className="w-full flex flex-col items-center justify-center text-center space-y-4 animate-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <X className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Hubo un error</p>
                <p className="text-sm text-gray-500">{errorMessage}</p>
              </div>
              <button
                onClick={handleCancel}
                className="mt-4 py-3 px-8 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Volver a intentar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
