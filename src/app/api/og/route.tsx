import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, FALLBACK_COLOR } from '@/features/color/lib/color-utils'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const pantone = request.nextUrl.searchParams.get('pantone')
  const color = pantone ? getPantoneColor(pantone) : undefined
  const { hex, name } = color ?? FALLBACK_COLOR
  const textColor = getContrastTextColor(hex)

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
          backgroundColor: hex,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '2px',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 400,
              color: textColor,
              opacity: 0.85,
            }}
          >
            {hex.toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
