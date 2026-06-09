'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/public/ProductCard'
import type { Categoria, Producto } from '@/types'

interface CategorySectionProps {
  categoria: Categoria | undefined
  productos: Producto[]
  id: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
} as const

export function CategorySection({ categoria, productos, id }: CategorySectionProps) {
  if (!categoria) return null

  // Determine overlay color based on category slug
  const getOverlayColor = () => {
    switch (categoria.slug) {
      case 'cafeteria':
        return 'bg-[#2A1810]/70' // Warm sepia/dark brown
      case 'marca_full':
        return 'bg-[#001428]/80' // Deep YPF dark blue
      default:
        return 'bg-black/60' // Neutral dark
    }
  }

  // Fallback background if no image is provided
  const fallbackBg = 'bg-gradient-to-b from-[#0D1117] to-[#1A2744]'

  return (
    <section
      id={id}
      className={`relative min-h-screen w-full flex flex-col pt-24 pb-16 px-4 md:px-8 ${!categoria.imagen_fondo_url ? fallbackBg : ''}`}
      style={
        categoria.imagen_fondo_url
          ? {
              backgroundImage: `url(${categoria.imagen_fondo_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      {/* Overlay */}
      {categoria.imagen_fondo_url && (
        <div className={`absolute inset-0 z-0 ${getOverlayColor()} backdrop-blur-[2px]`} />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 md:mb-16 text-center md:text-left"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-black tracking-widest text-white uppercase bg-[#005A9C] rounded-full shadow-md">
            {categoria.nombre}
          </span>
          {categoria.descripcion && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
              {categoria.descripcion}
            </h2>
          )}
          {categoria.subtitulo && (
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl drop-shadow-md">
              {categoria.subtitulo}
            </p>
          )}
        </motion.div>

        {/* Products Grid */}
        {productos.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {productos.map((producto) => (
              <motion.div key={producto.id} variants={itemVariants} className="h-full">
                <ProductCard producto={producto} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white/60 text-lg font-medium italic">
              No hay productos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
