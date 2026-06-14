import { getUploadsHistorial } from '@/lib/supabase/queries'
import { HistorialClient } from './HistorialClient'

export const metadata = {
  title: 'Historial de Importaciones — Admin YPF El Puente',
}

export default async function AdminHistorialPage() {
  const uploads = await getUploadsHistorial(50) // Obtener las últimas 50 importaciones

  return <HistorialClient initialUploads={uploads} />
}
