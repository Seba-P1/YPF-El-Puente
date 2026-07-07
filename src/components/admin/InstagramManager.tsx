'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import {
  Instagram,
  Upload,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImageIcon,
  Link as LinkIcon,
  Film,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  createInstagramPost,
  updateInstagramPostThumbnail,
  updateInstagramPostUrl,
  toggleInstagramPostActivo,
  moverInstagramPost,
  deleteInstagramPost,
  ensureInstagramBucketPublic,
  syncInstagramThumbnails,
} from '@/lib/supabase/actions'
import type { InstagramPost } from '@/lib/supabase/types'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

type UploadMode = 'idle' | 'preview' | 'uploading' | 'error'

const ACCEPT = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'video/mp4': [],
  'video/webm': [],
}

function isVideo(file: File): boolean {
  return file.type.startsWith('video/')
}

function FilePreview({ file, src }: { file: File; src: string }) {
  if (isVideo(file)) {
    return (
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
      />
    )
  }
  return <Image src={src} alt="Preview" fill className="object-cover" />
}

export function InstagramManager() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [cargando, setCargando] = useState(true)

  // Form state
  const [formUrl, setFormUrl] = useState('')
  const [formFile, setFormFile] = useState<File | null>(null)
  const [formPreview, setFormPreview] = useState<string | null>(null)
  const [formState, setFormState] = useState<UploadMode>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const [formProgress, setFormProgress] = useState(0)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)
  const [editState, setEditState] = useState<UploadMode>('idle')
  const [editProgress, setEditProgress] = useState(0)

  // URL edit
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null)
  const [editingUrlValue, setEditingUrlValue] = useState('')

  // Misc
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const supabase = createClient() as any

  const recargarPosts = useCallback(async () => {
    const { data } = await supabase
      .from('instagram_posts')
      .select('*')
      .order('orden', { ascending: true })
    setPosts(data ?? [])
  }, [supabase])

  useEffect(() => {
    ensureInstagramBucketPublic()
    recargarPosts().finally(() => setCargando(false))
  }, [recargarPosts])

  // ── Dropzone para formulario de alta ──
  const formDropzone = useDropzone({
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        setFormState('error')
        setFormError('Formato no válido. Usá JPG, PNG, WebP, MP4 o WebM.')
        return
      }
      if (accepted.length > 0) {
        const file = accepted[0]
        setFormFile(file)
        setFormPreview(URL.createObjectURL(file))
        setFormState('preview')
        setFormError(null)
      }
    },
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  // ── Dropzone para edición de miniatura/video ──
  const editDropzone = useDropzone({
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        setEditState('error')
        setFormError('Formato no válido. Usá JPG, PNG, WebP, MP4 o WebM.')
        return
      }
      if (accepted.length > 0) {
        const file = accepted[0]
        setEditFile(file)
        setEditPreview(URL.createObjectURL(file))
        setEditState('preview')
      }
    },
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
    maxSize: 100 * 1024 * 1024,
  })

  // ── Crear publicación ──
  const handleCreate = async () => {
    if (!formUrl.trim() || !formFile) return

    setFormState('uploading')
    setFormProgress(0)
    try {
      const ext = formFile.name.split('.').pop()
      const fileName = `ig-${Date.now()}.${ext}`

      // Upload with simulated progress
      const uploadPromise = supabase.storage
        .from('instagram-thumbnails')
        .upload(fileName, formFile)

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setFormProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const { error: uploadError, data: uploadData } = await uploadPromise
      clearInterval(progressInterval)

      if (uploadError) throw uploadError

      setFormProgress(100)

      const { data: urlData } = supabase.storage
        .from('instagram-thumbnails')
        .getPublicUrl(fileName)

      const res = await createInstagramPost({
        url: formUrl.trim(),
        thumbnailUrl: urlData.publicUrl,
        thumbnailPath: fileName,
      })

      if (!res.ok) throw new Error(res.error)

      toast.success('Publicación agregada')
      setFormUrl('')
      setFormFile(null)
      setFormPreview(null)
      setFormState('idle')
      setFormProgress(0)
      await recargarPosts()
    } catch (err: any) {
      setFormState('error')
      setFormError(err.message || 'Error al crear la publicación')
      toast.error(err.message || 'Error al crear')
    }
  }

  // ── Subir miniatura/video (modo edición) ──
  const handleUploadThumbnail = async (postId: string) => {
    if (!editFile) return

    setEditState('uploading')
    setEditProgress(0)
    try {
      const ext = editFile.name.split('.').pop()
      const fileName = `ig-${Date.now()}.${ext}`

      const uploadPromise = supabase.storage
        .from('instagram-thumbnails')
        .upload(fileName, editFile)

      const progressInterval = setInterval(() => {
        setEditProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const { error: uploadError, data: uploadData } = await uploadPromise
      clearInterval(progressInterval)

      if (uploadError) throw uploadError

      setEditProgress(100)

      const { data: urlData } = supabase.storage
        .from('instagram-thumbnails')
        .getPublicUrl(fileName)

      const res = await updateInstagramPostThumbnail({
        id: postId,
        thumbnailUrl: urlData.publicUrl,
        thumbnailPath: fileName,
      })

      if (!res.ok) throw new Error(res.error)

      toast.success(isVideo(editFile) ? 'Video actualizado' : 'Miniatura actualizada')
      setEditingId(null)
      setEditFile(null)
      setEditPreview(null)
      setEditState('idle')
      setEditProgress(0)
      await recargarPosts()
    } catch (err: any) {
      setEditState('error')
      toast.error(err.message || 'Error al subir')
    }
  }

  // ── Toggle activo ──
  const handleToggle = async (post: InstagramPost) => {
    const nuevoValor = !post.activo
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, activo: nuevoValor } : p))
    )

    const res = await toggleInstagramPostActivo({ id: post.id, activo: nuevoValor })
    if (!res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, activo: !nuevoValor } : p))
      )
      toast.error(res.error || 'Error al cambiar estado')
    } else {
      toast.success(nuevoValor ? 'Publicación activada' : 'Publicación desactivada')
    }
  }

  // ── Mover post ──
  const handleMover = async (id: string, direccion: 'arriba' | 'abajo') => {
    const index = posts.findIndex((p) => p.id === id)
    const vecinoIndex = direccion === 'arriba' ? index - 1 : index + 1
    if (vecinoIndex < 0 || vecinoIndex >= posts.length) return

    const vecino = posts[vecinoIndex]
    const res = await moverInstagramPost({ id, idVecino: vecino.id })
    if (!res.ok) {
      toast.error(res.error || 'Error al reordenar')
    } else {
      await recargarPosts()
    }
  }

  // ── Guardar URL editada ──
  const handleSaveUrl = async (id: string) => {
    if (!editingUrlValue.trim()) return
    const res = await updateInstagramPostUrl({ id, url: editingUrlValue.trim() })
    if (!res.ok) {
      toast.error(res.error || 'Error al actualizar link')
    } else {
      toast.success('Link actualizado')
      setEditingUrlId(null)
      await recargarPosts()
    }
  }

  // ── Copiar link ──
  const handleCopiar = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('Link copiado')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // ── Eliminar ──
  const handleEliminar = async (post: InstagramPost) => {
    setDeletingId(post.id)
    const res = await deleteInstagramPost({ id: post.id, thumbnailPath: post.thumbnail_path })
    if (!res.ok) {
      toast.error(res.error || 'Error al eliminar')
    } else {
      toast.success('Publicación eliminada')
      await recargarPosts()
    }
    setDeletingId(null)
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ── Formulario de alta ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/70 tracking-wide uppercase">
            Agregar publicación
          </h3>
          <button
            onClick={async () => {
              const res = await syncInstagramThumbnails()
              toast.success(`Sincronizados ${res.synced} archivos`)
              await recargarPosts()
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-muted-foreground/20 hover:bg-muted/30"
          >
            Sincronizar miniaturas
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Input URL */}
          <div className="flex-1">
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-muted/50 border focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          {/* Dropzone */}
          <div className="flex-1">
            {formState === 'idle' && (
              <div
                {...formDropzone.getRootProps()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  formDropzone.isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/30 hover:bg-muted/30'
                }`}
              >
                <input {...formDropzone.getInputProps()} />
                <Upload size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Miniatura o video (JPG, PNG, WebP, MP4, WebM)
                </span>
              </div>
            )}

            {formState === 'preview' && formPreview && formFile && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <FilePreview file={formFile} src={formPreview} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground truncate block">{formFile.name}</span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {isVideo(formFile) ? 'Video' : 'Imagen'} — {(formFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <button
                  onClick={() => { setFormFile(null); setFormPreview(null); setFormState('idle') }}
                  className="text-xs text-destructive hover:underline"
                >
                  Quitar
                </button>
              </div>
            )}

            {formState === 'uploading' && (
              <div className="space-y-2 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Subiendo... {formProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
              </div>
            )}

            {formState === 'error' && (
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm text-destructive">{formError}</span>
              </div>
            )}
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleCreate}
            disabled={!formUrl.trim() || !formFile || formState === 'uploading'}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {formState === 'uploading' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Instagram size={16} />
            )}
            Agregar
          </button>
        </div>

        {formError && formState === 'error' && (
          <p className="text-xs text-destructive mt-2">{formError}</p>
        )}
      </GlassCard>

      {/* ── Lista de publicaciones ── */}
      <GlassCard padding="none">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
            <Instagram size={32} className="opacity-30" />
            <p>No hay publicaciones cargadas todavía.</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className={`p-4 border-b last:border-b-0 hover:bg-muted/30 transition-opacity ${
                !post.activo ? 'opacity-50' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Miniatura */}
                <div className="relative w-[60px] h-[107px] sm:w-[72px] sm:h-[128px] rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {post.thumbnail_url ? (
                    post.thumbnail_url.includes('.mp4') || post.thumbnail_url.includes('.webm') ? (
                      <video
                        src={post.thumbnail_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={post.thumbnail_url}
                        alt="Miniatura"
                        fill
                        className="object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <ImageIcon size={16} className="text-muted-foreground/50" />
                      <span className="text-[8px] text-muted-foreground/50">Sin miniatura</span>
                    </div>
                  )}

                  {/* Botón subir imagen/video superpuesto */}
                  <button
                    onClick={() => {
                      setEditingId(editingId === post.id ? null : post.id)
                      setEditFile(null)
                      setEditPreview(null)
                      setEditState('idle')
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {editingId === post.id ? (
                      <span className="text-[10px] text-white font-medium">Cerrar</span>
                    ) : (
                      <ImageIcon size={14} className="text-white" />
                    )}
                  </button>
                </div>

                {/* Datos */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* URL */}
                  {editingUrlId === post.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={editingUrlValue}
                        onChange={(e) => setEditingUrlValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-muted border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveUrl(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary/90"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingUrlId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground truncate max-w-[300px]">
                        {post.url}
                      </span>
                      <button
                        onClick={() => handleCopiar(post.url, post.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedId === post.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                      <button
                        onClick={() => { setEditingUrlId(post.id); setEditingUrlValue(post.url) }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  )}

                  {/* Badge estado */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        post.activo
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}
                    >
                      {post.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Orden: {post.orden}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Toggle */}
                  <Switch
                    checked={post.activo}
                    onCheckedChange={() => handleToggle(post)}
                  />

                  {/* Flechas */}
                  <button
                    onClick={() => handleMover(post.id, 'arriba')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMover(post.id, 'abajo')}
                    disabled={index === posts.length - 1}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>

                  {/* Cambiar imagen/video */}
                  <button
                    onClick={() => {
                      setEditingId(editingId === post.id ? null : post.id)
                      setEditFile(null)
                      setEditPreview(null)
                      setEditState('idle')
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Cambiar miniatura o video"
                  >
                    <ImageIcon size={14} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleEliminar(post)}
                    disabled={deletingId === post.id}
                    className="p-1.5 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                    title="Eliminar"
                  >
                    {deletingId === post.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Inline dropzone de edición */}
              {editingId === post.id && (
                <div className="mt-3 p-3 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20">
                  {editState === 'idle' && (
                    <div
                      {...editDropzone.getRootProps()}
                      className={`flex items-center gap-3 cursor-pointer transition-colors ${
                        editDropzone.isDragActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <input {...editDropzone.getInputProps()} />
                      <Upload size={14} />
                      <span className="text-xs">
                        Arrastrá una imagen o video, o hacé click para seleccionar
                      </span>
                    </div>
                  )}

                  {editState === 'preview' && editPreview && editFile && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <FilePreview file={editFile} src={editPreview} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground truncate block">{editFile.name}</span>
                        <span className="text-[10px] text-muted-foreground/60">
                          {isVideo(editFile) ? 'Video' : 'Imagen'} — {(editFile.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <button
                        onClick={() => handleUploadThumbnail(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary/90"
                      >
                        Subir
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditFile(null); setEditPreview(null); setEditState('idle') }}
                        className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}

                  {editState === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Subiendo... {editProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${editProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {editState === 'error' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-destructive">{formError || 'Error al subir'}</span>
                      <button
                        onClick={() => { setEditState('idle'); setEditFile(null); setEditPreview(null) }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </GlassCard>
    </div>
  )
}
