export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          codigo_plu: string
          nombre: string
          descripcion: string | null
          categoria_slug: string
          precio: number
          imagen_url: string | null
          imagen_path: string | null
          disponible: boolean
          destacado: boolean
          badge: string | null
          orden: number
          es_sin_tacc: boolean
          codigo_ypf: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['productos']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['productos']['Insert']>
      }
      categorias: {
        Row: {
          id: string
          slug: string
          nombre: string
          descripcion: string | null
          subtitulo: string | null
          imagen_fondo_url: string | null
          orden: number
          activa: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categorias']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categorias']['Insert']>
      }
      combustibles: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          descripcion_extendida: string | null
          precio: number | null
          octanaje: string | null
          color_hex: string
          disponible: boolean
          orden: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['combustibles']['Row'], 'id' | 'updated_at'> & {
          id?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['combustibles']['Insert']>
      }
      configuracion_tienda: {
        Row: {
          id: string
          clave: string
          valor: string | null
          descripcion: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['configuracion_tienda']['Row'], 'id' | 'updated_at'> & {
          id?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['configuracion_tienda']['Insert']>
      }
      boxes_services: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          icono_slug: string
          disponible: boolean
          orden: number
        }
        Insert: Omit<Database['public']['Tables']['boxes_services']['Row'], 'id'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['boxes_services']['Insert']>
      }
      uploads_historial: {
        Row: {
          id: string
          nombre_archivo: string
          total_filas: number
          productos_actualizados: number
          productos_nuevos: number
          productos_error: number
          detalle_errores: Record<string, unknown> | null
          modo: string | null
          subido_por: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['uploads_historial']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['uploads_historial']['Insert']>
      }
      instagram_posts: {
        Row: {
          id: string
          url: string
          thumbnail_url: string | null
          thumbnail_path: string | null
          orden: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['instagram_posts']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['instagram_posts']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Derived types for convenience
export type Producto = Database['public']['Tables']['productos']['Row']
export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Combustible = Database['public']['Tables']['combustibles']['Row']
export type BoxService = Database['public']['Tables']['boxes_services']['Row']
export type ConfiguracionItem = Database['public']['Tables']['configuracion_tienda']['Row']
export type UploadHistorial = Database['public']['Tables']['uploads_historial']['Row']
export type InstagramPost = Database['public']['Tables']['instagram_posts']['Row']
