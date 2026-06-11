import { getAllProductos } from '@/lib/supabase/queries'
import { ProductTable } from '@/components/admin/ProductTable'

export const metadata = {
  title: 'Gestión de Productos — Admin YPF El Puente',
}

export default async function AdminProductosPage() {
  const productos = await getAllProductos()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
          Productos
        </h1>
        <span
          style={{
            backgroundColor: '#EFF6FF',
            color: '#005A9C',
            fontSize: 12,
            borderRadius: 9999,
            padding: '3px 10px',
            fontWeight: 600,
          }}
        >
          {productos.length} productos
        </span>
      </div>

      <ProductTable productos={productos} />
    </div>
  )
}
