/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — TICKER MARQUEE
   ═══════════════════════════════════════════════════════════════ */

export function TickerMarquee() {
  const text =
    'YPF EL PUENTE  ✦  COMBUSTIBLES DE CALIDAD  ✦  MENÚ FULL  ✦  SERVICIO DE BOXES  ✦  RÍO COLORADO  ✦  PATAGONIA  ✦  '

  return (
    <div
      className="marquee-wrapper"
      style={{
        height: 44,
        overflow: 'hidden',
        position: 'relative',
        background: '#FFD100',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="marquee-track flex items-center"
        style={{
          width: 'fit-content',
          height: '100%',
        }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#06080F',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
