import { getAuditLogs } from '@/lib/supabase/queries'
import { AuditLogsClient } from './AuditLogsClient'

export const metadata = {
  title: 'Audit Logs — Admin YPF El Puente',
}

export default async function AdminLogsPage() {
  const logs = await getAuditLogs(100) // Obtener los últimos 100 logs

  return <AuditLogsClient initialLogs={logs} />
}
