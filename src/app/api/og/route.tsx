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
          position: 'relative',
        }}
      >
        {/* Logo - top left */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              <circle cx="13.5" cy="6.5" r="1" fill="white" stroke="none" />
              <circle cx="17.5" cy="10.5" r="1" fill="white" stroke="none" />
              <circle cx="8.5" cy="7.5" r="1" fill="white" stroke="none" />
              <circle cx="6.5" cy="12.5" r="1" fill="white" stroke="none" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: textColor,
              opacity: 0.7,
            }}
          >
            Pantone Converter
          </span>
        </div>

        {/* Center content */}
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

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #f43f5e, #8b5cf6, #06b6d4)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
