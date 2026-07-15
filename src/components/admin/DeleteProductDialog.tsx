'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import type { Producto } from '@/types'

interface DeleteProductDialogProps {
  producto: Producto | null
  open: boolean
  deleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteProductDialog({
  producto,
  open,
  deleting,
  onOpenChange,
  onConfirm,
}: DeleteProductDialogProps) {
  if (!producto) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !deleting) onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar producto</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés eliminar{' '}
            <span className="font-semibold text-foreground">
              {producto.nombre}
            </span>
            ? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={deleting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
