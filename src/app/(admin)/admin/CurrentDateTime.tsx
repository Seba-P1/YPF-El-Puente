'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function CurrentDateTime() {
    const [fecha, setFecha] = useState('')

    useEffect(() => {
        const actualizar = () => {
            setFecha(
                format(new Date(), "EEEE d 'de' MMMM, yyyy · HH:mm", { locale: es })
            )
        }
        actualizar()
        const interval = setInterval(actualizar, 60000)
        return () => clearInterval(interval)
    }, [])

    if (!fecha) return null

    return (
        <p className="text-[12px] font-medium capitalize text-muted-foreground">
            {fecha} hs
        </p>
    )
}