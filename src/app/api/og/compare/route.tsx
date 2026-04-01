import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, hexToLab, deltaE2000 } from '@/features/color/lib/color-utils'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const colorsParam = request.nextUrl.searchParams.get('colors')
  const codes = colorsParam
    ? colorsParam.split(',').filter((c) => getPantoneColor(c)).slice(0, 3)
    : []

  const colors = codes.map((code) => {
    const entry = getPantoneColor(code)!
    return { code, ...entry }
  })

  // Calculate Delta E for first pair
  let deltaEText = ''
  if (colors.length >= 2) {
    const lab1 = hexToLab(colors[0].hex)
    const lab2 = hexToLab(colors[1].hex)
    const de = deltaE2000(lab1, lab2)
    deltaEText = `ΔE = ${de.toFixed(1)}`
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Logo + title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '28px 40px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f43f5e, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 600, color: '#3f3f46' }}>
            Color Comparison
          </span>
          {deltaEText && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '28px',
                fontWeight: 700,
                color: '#7c3aed',
              }}
            >
              {deltaEText}
            </span>
          )}
        </div>

        {/* Color swatches */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            gap: '0px',
          }}
        >
          {colors.length > 0 ? (
            colors.map((color) => (
              <div
                key={color.code}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: color.hex,
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '42px',
                    fontWeight: 700,
                    color: getContrastTextColor(color.hex),
                    letterSpacing: '1px',
                  }}
                >
                  {color.name}
                </span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 400,
                    color: getContrastTextColor(color.hex),
                    opacity: 0.8,
                  }}
                >
                  {color.hex.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a1a1aa',
                fontSize: '28px',
              }}
            >
              Select colors to compare
            </div>
          )}
        </div>

        {/* Bottom gradient bar */}
        <div
          style={{
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
