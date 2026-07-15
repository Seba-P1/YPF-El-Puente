import { ImageResponse } from 'next/og'

export const alt = 'YPF El Puente — Río Colorado'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0070C0 0%, #001428 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* YPF brand stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: '#FFD100',
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFD100',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          YPF El Puente
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#FFFFFF',
            marginTop: 24,
            fontWeight: 500,
          }}
        >
          Río Colorado · Patagonia Argentina
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          Combustibles · FULL · Boxes
        </div>
      </div>
    ),
    { ...size }
  )
}
