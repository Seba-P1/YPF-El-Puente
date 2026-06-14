'use client'

import { useState, useEffect, useMemo } from 'react'
import { Settings, Save, Loader2, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { GlassCard } from '@/components/admin/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ConfigFields {
  whatsapp_number: string
  nombre_tienda: string
  ciudad: string
  msg_header: string
  msg_separator: string
  msg_footer: string
  instagram_url: string
}

const DEFAULT_CONFIG: ConfigFields = {
  whatsapp_number: '',
  nombre_tienda: 'YPF El Puente',
  ciudad: 'Río Colorado',
  msg_header: '🛒 *Nuevo Pedido — YPF El Puente*',
  msg_separator: '---',
  msg_footer: '¡Gracias por tu pedido!',
  instagram_url: 'https://www.instagram.com/ypffull/',
}

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<ConfigFields>(DEFAULT_CONFIG)
  const [originalConfig, setOriginalConfig] = useState<ConfigFields>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const supabase = createClient() as any

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from('configuracion_tienda')
        .select('*')

      if (error) {
        toast.error('Error al cargar la configuración')
        console.error(error)
      } else if (data) {
        const mapped: Record<string, string> = {}
        data.forEach((item: any) => {
          mapped[item.clave] = item.valor ?? ''
        })

        const loaded: ConfigFields = {
          whatsapp_number: mapped['whatsapp_number'] || DEFAULT_CONFIG.whatsapp_number,
          nombre_tienda: mapped['nombre_tienda'] || DEFAULT_CONFIG.nombre_tienda,
          ciudad: mapped['ciudad'] || DEFAULT_CONFIG.ciudad,
          msg_header: mapped['msg_header'] || DEFAULT_CONFIG.msg_header,
          msg_separator: mapped['msg_separator'] || DEFAULT_CONFIG.msg_separator,
          msg_footer: mapped['msg_footer'] || DEFAULT_CONFIG.msg_footer,
          instagram_url: mapped['instagram_url'] || DEFAULT_CONFIG.instagram_url,
        }
        setConfig(loaded)
        setOriginalConfig(loaded)
      }
      setLoading(false)
    }

    fetchConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasChanges = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(originalConfig)
  }, [config, originalConfig])

  const handleSave = async () => {
    setSaving(true)

    try {
      const entries = Object.entries(config) as [keyof ConfigFields, string][]

      for (const [clave, valor] of entries) {
        if (valor !== originalConfig[clave]) {
          const { error } = await supabase
            .from('configuracion_tienda')
            .update({ valor })
            .eq('clave', clave)

          if (error) {
            throw new Error(`Error actualizando "${clave}": ${error.message}`)
          }
        }
      }

      setOriginalConfig({ ...config })
      toast.success('Configuración guardada correctamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar')
    }

    setSaving(false)
  }

  // WhatsApp message preview
  const previewMessage = useMemo(() => {
    const lines = [
      config.msg_header,
      '',
      '2x Hamburguesa Clásica — $4.500',
      '1x Café con leche — $1.200',
      '',
      config.msg_separator,
      '*Total: $10.200*',
      '',
      config.msg_footer,
    ]
    return lines.join('\n')
  }, [config.msg_header, config.msg_separator, config.msg_footer])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Settings className="w-8 h-8 text-primary" />
          Configuración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ajustá los datos generales de la tienda y el mensaje de WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <GlassCard className="lg:col-span-3 p-8 space-y-6">
          <h2 className="text-lg font-bold pb-4 border-b text-foreground">
            Datos Generales
          </h2>

          <FieldGroup
            label="Número de WhatsApp"
            hint="Formato internacional: +5492920XXXXXXX"
            value={config.whatsapp_number}
            onChange={(v) => setConfig({ ...config, whatsapp_number: v })}
            placeholder="+5492920123456"
          />

          <FieldGroup
            label="Nombre de la Tienda"
            value={config.nombre_tienda}
            onChange={(v) => setConfig({ ...config, nombre_tienda: v })}
            placeholder="YPF El Puente"
          />

          <FieldGroup
            label="Ciudad"
            value={config.ciudad}
            onChange={(v) => setConfig({ ...config, ciudad: v })}
            placeholder="Río Colorado"
          />

          <FieldGroup
            label="URL Instagram"
            value={config.instagram_url}
            onChange={(v) => setConfig({ ...config, instagram_url: v })}
            placeholder="https://www.instagram.com/ypffull/"
          />

          <div className="pt-4 border-t">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              Mensaje de WhatsApp
            </h2>

            <FieldGroup
              label="Encabezado del mensaje"
              value={config.msg_header}
              onChange={(v) => setConfig({ ...config, msg_header: v })}
              placeholder="🛒 *Nuevo Pedido — YPF El Puente*"
            />

            <FieldGroup
              label="Separador"
              value={config.msg_separator}
              onChange={(v) => setConfig({ ...config, msg_separator: v })}
              placeholder="---"
            />

            <FieldGroup
              label="Pie del mensaje"
              value={config.msg_footer}
              onChange={(v) => setConfig({ ...config, msg_footer: v })}
              placeholder="¡Gracias por tu pedido!"
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </>
              )}
            </Button>
            {!hasChanges && (
              <p className="text-center text-sm mt-3 font-medium text-muted-foreground">
                No hay cambios pendientes.
              </p>
            )}
          </div>
        </GlassCard>

        {/* WhatsApp Preview */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-foreground">Preview del Mensaje</h3>
            </div>

            <div className="rounded-2xl p-4 relative bg-[#E5DDD5] dark:bg-[#0b141a]">
              {/* Chat bubble */}
              <div className="rounded-xl p-4 shadow-sm max-w-full relative bg-[#DCF8C6] dark:bg-[#005c4b]">
                <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed break-words text-[#1F2937] dark:text-[#e9edef]">
                  {previewMessage}
                </pre>
                <span className="text-[10px] float-right mt-1 text-[#6B7280] dark:text-[#8696a0]">
                  {new Date().toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <p className="text-xs mt-3 text-center text-muted-foreground">
              Los productos y el total son de ejemplo.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

function FieldGroup({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2 mb-4">
      <label className="text-sm font-bold text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 h-12 rounded-xl outline-none transition-all bg-muted/50 border focus-visible:ring-1 text-foreground"
      />
    </div>
  )
}
