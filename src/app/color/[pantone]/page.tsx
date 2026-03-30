import type { Metadata } from 'next'
import Link from 'next/link'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, FALLBACK_COLOR } from '@/features/color/lib/color-utils'

type Props = {
  params: Promise<{ pantone: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pantone } = await params
  const color = getPantoneColor(pantone)

  if (!color) {
    return {
      title: 'Unknown Color | Pantone Converter',
      description: 'This Pantone color code was not found.',
    }
  }

  return {
    title: `${color.name} | ${color.hex}`,
    description: `View ${color.name} — HEX ${color.hex}. Share this Pantone color on LINE, Slack, or Facebook.`,
    openGraph: {
      title: color.name,
      description: `${color.name} — ${color.hex}`,
      images: [
        {
          url: `/api/og?pantone=${pantone}`,
          width: 1200,
          height: 630,
          alt: color.name,
        },
      ],
    },
  }
}

export default async function ColorPage({ params }: Props) {
  const { pantone } = await params
  const color = getPantoneColor(pantone)
  const { hex, name } = color ?? FALLBACK_COLOR
  const textColor = getContrastTextColor(hex)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div
        className="flex aspect-video w-full max-w-2xl flex-col items-center justify-center rounded-2xl shadow-2xl"
        style={{ backgroundColor: hex }}
      >
        <h1
          className="text-5xl font-bold tracking-wide"
          style={{ color: textColor }}
        >
          {name}
        </h1>
        <p
          className="mt-4 text-2xl font-light"
          style={{ color: textColor, opacity: 0.85 }}
        >
          {hex.toUpperCase()}
        </p>
      </div>

      {!color && (
        <p className="text-zinc-500">
          The Pantone code &quot;{pantone}&quot; was not found in our database.
        </p>
      )}

      <Link
        href="/"
        className="text-zinc-600 underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to all colors
      </Link>
    </div>
  )
}
