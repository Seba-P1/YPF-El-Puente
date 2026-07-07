import { InstagramManager } from '@/components/admin/InstagramManager'

export const metadata = {
  title: 'Instagram — Admin YPF El Puente',
}

export default function InstagramAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Instagram</h1>
        <p className="text-muted-foreground mt-1">
          Publicaciones que se muestran en la sección de Instagram de la portada.
        </p>
      </div>
      <InstagramManager />
    </div>
  )
}
