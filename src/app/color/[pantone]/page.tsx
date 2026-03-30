import type { Metadata } from 'next'
import Link from 'next/link'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, FALLBACK_COLOR } from '@/features/color/lib/color-utils'
import { CopyIcon, ArrowLeftIcon, LinkIcon } from '@/components/icons'

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

  const shareUrl = `/color/${pantone}`
  const ogImageUrl = `/api/og?pantone=${pantone}`

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Back navigation — floating pill over swatch */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/25"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All Colors
      </Link>

      {/* Color swatch area — ~60vh */}
      <div
        className="relative flex min-h-[60vh] flex-col items-center justify-center px-6"
        style={{ backgroundColor: hex }}
      >
        <h1
          className="text-center text-5xl font-bold tracking-wide sm:text-6xl md:text-7xl"
          style={{ color: textColor, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
        >
          {name}
        </h1>
        <p
          className="mt-4 text-center text-2xl font-light sm:text-3xl"
          style={{ color: textColor, opacity: 0.85, textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
        >
          {hex.toUpperCase()}
        </p>
      </div>

      {/* Info card — overlaps the swatch */}
      <div className="-mt-8 relative z-10 mx-auto w-full max-w-2xl flex-1 rounded-t-3xl bg-white px-6 pb-12 pt-8 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
        {/* Header: color name + dot */}
        <div className="mb-6 flex items-center gap-3">
          <span
            className="inline-block h-5 w-5 shrink-0 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
            style={{ backgroundColor: hex }}
          />
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {hex.toUpperCase()}
            </p>
          </div>
        </div>

        {!color && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
            The Pantone code &quot;{pantone}&quot; was not found in our database.
          </div>
        )}

        {/* Info rows */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {/* Share URL */}
          <div className="flex items-start gap-3 py-4">
            <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Share URL
              </p>
              <p className="mt-1 truncate text-sm text-zinc-700 dark:text-zinc-300">
                {shareUrl}
              </p>
            </div>
          </div>

          {/* OG Image */}
          <div className="flex items-start gap-3 py-4">
            <CopyIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                OG Image
              </p>
              <p className="mt-1 truncate text-sm text-zinc-700 dark:text-zinc-300">
                {ogImageUrl}
              </p>
            </div>
          </div>

          {/* HEX Code */}
          <div className="flex items-start gap-3 py-4">
            <span
              className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded"
              style={{ backgroundColor: hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                HEX Code
              </p>
              <p className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                {hex.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
