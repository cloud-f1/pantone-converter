import type { Metadata } from 'next'
import Link from 'next/link'
import { getPantoneColor } from '@/features/color/data/pantone-map'
import { getContrastTextColor, FALLBACK_COLOR } from '@/features/color/lib/color-utils'
import { CopyIcon, ArrowLeftIcon, LinkIcon, CodeIcon, CompareIcon } from '@/components/icons'
import { CopyButton } from '@/components/copy-button'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'

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
  const locale = await getLocale()
  const t = await getDictionary(locale)

  const shareUrl = `/color/${pantone}`
  const ogImageUrl = `/api/og?pantone=${pantone}`

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Back navigation — floating pill over swatch */}
      <Link
        href="/"
        className="absolute left-3 top-3 sm:left-6 sm:top-6 z-10 flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/25"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All Colors
      </Link>

      {/* Color swatch area — ~60vh */}
      <div
        className="relative flex min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex-col items-center justify-center px-4 sm:px-6"
        style={{ backgroundColor: hex }}
      >
        <h1
          className="text-center text-4xl sm:text-5xl md:text-7xl font-bold tracking-wide"
          style={{ color: textColor, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
        >
          {name}
        </h1>
        <p
          className="mt-4 text-center text-lg sm:text-xl md:text-2xl font-light"
          style={{ color: textColor, opacity: 0.85, textShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
        >
          {hex.toUpperCase()}
        </p>
      </div>

      {/* Info card — overlaps the swatch */}
      <div className="-mt-8 relative z-10 mx-auto w-full max-w-2xl flex-1 rounded-t-3xl bg-white p-4 sm:p-6 md:p-8 pb-12 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:bg-zinc-900 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
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
              <div className="mt-1 flex items-center gap-2">
                <p className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {shareUrl}
                </p>
                <CopyButton text={`https://pantone-converter.vercel.app/color/${pantone}`} label="Copy Link" icon={<LinkIcon className="h-3.5 w-3.5" />} />
              </div>
            </div>
          </div>

          {/* OG Image */}
          <div className="flex items-start gap-3 py-4">
            <CopyIcon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                OG Image
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {ogImageUrl}
                </p>
                <CopyButton text={`/api/og?pantone=${pantone}`} label="Copy" icon={<CodeIcon className="h-3.5 w-3.5" />} />
              </div>
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
              <div className="mt-1 flex items-center gap-2">
                <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {hex.toUpperCase()}
                </p>
                <CopyButton text={hex} label="Copy" icon={<CopyIcon className="h-3.5 w-3.5" />} />
              </div>
            </div>
          </div>
        </div>

        {/* Compare link */}
        <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <a
            href={`/compare?colors=${pantone}`}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-950/50"
          >
            <CompareIcon className="h-4 w-4" />
            {t.compare.compareFromDetail}
          </a>
        </div>
      </div>
    </div>
  )
}
