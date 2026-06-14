'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function AuroraBackground({ children }: { children?: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR or reduced motion -> static blobs
  const isReduced = !mounted || shouldReduceMotion

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(215 100% 50% / 0.7), transparent 70%)',
            top: '-20%',
            left: '-10%',
            filter: 'blur(80px)',
            willChange: 'transform',
            animation: isReduced ? 'none' : 'float-1 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 51% / 0.5), transparent 70%)',
            top: '30%',
            right: '-10%',
            filter: 'blur(80px)',
            willChange: 'transform',
            animation: isReduced ? 'none' : 'float-2 30s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(222 89% 27% / 0.8), transparent 70%)',
            bottom: '-20%',
            left: '30%',
            filter: 'blur(80px)',
            willChange: 'transform',
            animation: isReduced ? 'none' : 'float-3 28s ease-in-out infinite',
          }}
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-[hsl(228,36%,6%)]/40 backdrop-blur-3xl" />
      </div>
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-1 { 0%,100%{transform:translate(0,0) rotate(0)} 50%{transform:translate(10vw,5vh) rotate(180deg)} }
        @keyframes float-2 { 0%,100%{transform:translate(0,0) rotate(0)} 50%{transform:translate(-15vw,10vh) rotate(-180deg)} }
        @keyframes float-3 { 0%,100%{transform:translate(0,0) rotate(0)} 50%{transform:translate(5vw,-10vh) rotate(180deg)} }
      `}} />
    </>
  )
}
