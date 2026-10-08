'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateProductoImagen } from '@/lib/supabase/actions'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Client-side image compression — converts any image to WebP (with mobile fallbacks)
// ---------------------------------------------------------------------------

/** Readable file size string */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

interface CompressionResult {
  blob: Blob
  contentType: string
  extension: string
  finalSize: number
}

/**
 * Compress an image to WebP (or JPEG fallback) on the client side.
 * If compression fails or is unsupported on mobile, gracefully returns the original file.
 */
async function compressImageForUpload(
  file: File,
  quality = 0.92,
  maxDimension = 2048,
): Promise<CompressionResult> {
  const originalExt = file.name.match(/\.\w+$/)?.[0]?.toLowerCase() || '.jpg'

  // If already small WebP, upload directly
  if (file.type === 'image/webp' && file.size < 500_000) {
    return {
      blob: file,
      contentType: 'image/webp',
      extension: '.webp',
      finalSize: file.size,
    }
  }

  return new Promise((resolve) => {
    let objectUrl = ''
    try {
      objectUrl = URL.createObjectURL(file)
    } catch {
      resolve({
        blob: file,
        contentType: file.type || 'image/jpeg',
        extension: originalExt,
        finalSize: file.size,
      })
      return
    }

    const cleanup = () => {
      try {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
      } catch {}
    }

    const img = new window.Image()

    img.onload = () => {
      try {
        let { width, height } = img
        if (!width || !height) {
          cleanup()
          resolve({ blob: file, contentType: file.type || 'image/jpeg', extension: originalExt, finalSize: file.size })
          return
        }

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          cleanup()
          resolve({ blob: file, contentType: file.type || 'image/jpeg', extension: originalExt, finalSize: file.size })
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        cleanup()

        // Try WebP first
        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob && webpBlob.size > 0) {
              resolve({
                blob: webpBlob,
                contentType: 'image/webp',
                extension: '.webp',
                finalSize: webpBlob.size,
              })
              return
            }

            // WebP not supported or returned null (e.g. some mobile WebViews) -> Fallback to JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob && jpegBlob.size > 0) {
                  resolve({
                    blob: jpegBlob,
                    contentType: 'image/jpeg',
                    extension: '.jpg',
                    finalSize: jpegBlob.size,
                  })
                } else {
                  // Fallback to original file
                  resolve({
                    blob: file,
                    contentType: file.type || 'image/jpeg',
                    extension: originalExt,
                    finalSize: file.size,
                  })
                }
              },
              'image/jpeg',
              0.90,
            )
          },
          'image/webp',
          quality,
        )
      } catch (err) {
        console.warn('Canvas compression error, using original file:', err)
        cleanup()
        resolve({ blob: file, contentType: file.type || 'image/jpeg', extension: originalExt, finalSize: file.size })
      }
    }

    img.onerror = () => {
      console.warn('Could not decode image into Canvas (e.g. HEIC on older browser), uploading original file')
      cleanup()
      resolve({ blob: file, contentType: file.type || 'image/jpeg', extension: originalExt, finalSize: file.size })
    }

    img.src = objectUrl
  })
}

interface ImageUploaderProps {
  productoId: string
  productoNombre: string
  imagenActual: string | null
  onUploadSuccess: (imagenUrl: string, imagenPath: string) => void
  onClose: () => void
}

type UploadState = 'idle' | 'preview' | 'compressing' | 'uploading' | 'error'

export function ImageUploader({
  productoId,
  productoNombre,
  imagenActual,
  onUploadSuccess,
  onClose,
}: ImageUploaderProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [originalSize, setOriginalSize] = useState<number>(0)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setCompressedSize(null)
      try {
        setPreviewUrl(URL.createObjectURL(selectedFile))
      } catch {
        setPreviewUrl(null)
      }
      setState('preview')
      setErrorMessage(null)
      return
    }

    // On mobile devices, camera photos may end up in rejectedFiles due to strict MIME checks (HEIC, uppercase extensions, etc.)
    if (rejectedFiles.length > 0) {
      const candidate = rejectedFiles[0]?.file as File | undefined
      if (candidate && (candidate.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|heic|heif)$/i.test(candidate.name))) {
        setFile(candidate)
        setOriginalSize(candidate.size)
        setCompressedSize(null)
        try {
          setPreviewUrl(URL.createObjectURL(candidate))
        } catch {
          setPreviewUrl(null)
        }
        setState('preview')
        setErrorMessage(null)
        return
      }

      setState('error')
      setErrorMessage('Formato no válido. Seleccioná una imagen PNG, JPG, WebP o GIF.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleCancel = () => {
    setFile(null)
    setPreviewUrl(null)
    setOriginalSize(0)
    setCompressedSize(null)
    setState('idle')
    setErrorMessage(null)
  }

  const handleUpload = async () => {
    if (!file) return

    const supabase = createClient()

    try {
      // --- Phase 1: Compress image (WebP or JPEG fallback) ---
      setState('compressing')
      const { blob, contentType, extension, finalSize } = await compressImageForUpload(file)
      setCompressedSize(finalSize)

      // --- Phase 2: Upload to Supabase Storage ---
      setState('uploading')

      // Remove previous image if exists (to keep storage clean)
      if (imagenActual) {
        const match = imagenActual.match(/productos-imagenes\/(.+)$/)
        if (match && match[1]) {
          const oldPath = match[1]
          await supabase.storage.from('productos-imagenes').remove([oldPath])
        }
      }

      const fileName = `${productoId}-${Date.now()}${extension}`

      const { error: uploadError } = await supabase.storage
        .from('productos-imagenes')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        })

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('productos-imagenes')
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      // Update product record in DB
      await updateProductoImagen({ id: productoId, imagenUrl: publicUrl, imagenPath: fileName })

      // Success feedback
      const saved = originalSize - finalSize
      const pct = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0
      const sizeMsg = saved > 0
        ? ` (${formatBytes(originalSize)} → ${formatBytes(finalSize)}, -${pct}%)`
        : ''
      toast.success(`Imagen actualizada${sizeMsg}`)
      onUploadSuccess(publicUrl, fileName)
      onClose()

    } catch (error: any) {
      console.error('Error uploading image:', error)
      setState('error')
      const msg = error?.message || (typeof error === 'string' ? error : 'Error desconocido al subir la imagen')
      setErrorMessage(msg)
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
            disabled={state === 'uploading' || state === 'compressing'}
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
                O hacé click para seleccionar un archivo desde tu dispositivo.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <AlertCircle className="w-4 h-4" />
                Formatos aceptados: PNG, JPG, WebP, GIF
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4" />
                Se optimiza automáticamente al subir
              </div>
            </div>
          )}

          {state === 'preview' && previewUrl && (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="relative w-48 h-48 mb-4 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 shadow-inner p-4 flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain filter drop-shadow-xl"
                />
              </div>

              {/* File size info */}
              <p className="mb-4 text-xs text-gray-500">
                Tamaño original: <span className="font-semibold text-gray-700">{formatBytes(originalSize)}</span>
                {originalSize > 500_000 && (
                  <span className="ml-1 text-emerald-600">→ se comprimirá a WebP</span>
                )}
              </p>
              
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

          {state === 'compressing' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <p className="font-bold text-gray-900">Optimizando imagen...</p>
              <p className="text-sm text-gray-500">Convirtiendo a WebP para subida rápida.</p>
            </div>
          )}

          {state === 'uploading' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#005A9C] animate-spin" />
              </div>
              <p className="font-bold text-gray-900">Subiendo imagen...</p>
              {compressedSize !== null && originalSize > 0 && compressedSize < originalSize && (
                <p className="text-sm text-emerald-600 font-medium">
                  Comprimida: {formatBytes(originalSize)} → {formatBytes(compressedSize)} (-{Math.round(((originalSize - compressedSize) / originalSize) * 100)}%)
                </p>
              )}
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
