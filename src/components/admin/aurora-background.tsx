'use client'

export function AuroraBackground({ children }: { children?: React.ReactNode }) {
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
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(45 100% 51% / 0.5), transparent 70%)',
            top: '30%',
            right: '-10%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vw] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, hsl(222 89% 27% / 0.8), transparent 70%)',
            bottom: '-20%',
            left: '30%',
            filter: 'blur(80px)',
          }}
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-[hsl(228,36%,6%)]/70" />
      </div>
      {children}
    </>
  )
}
