'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp } from './motion-presets'

export function StaggerList({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={fadeUp} className={className}>{children}</motion.div>
}
