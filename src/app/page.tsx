import Link from 'next/link'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'
import { ShareIcon, CodeIcon, SwatchIcon } from '@/components/icons'
import { ColorTabs } from '@/components/color-tabs'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { getLocale } from '@/i18n/get-locale'
import { getDictionary } from '@/i18n/get-dictionary'

export default async function Home() {
  const locale = await getLocale()
  const t = await getDictionary(locale)
  const entries = Object.entries(PANTONE_MAP)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 px-6 py-20 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Language switcher - top right */}
        <div className="absolute right-6 top-6 z-10">
          <LocaleSwitcher current={locale} />
        </div>

        {/* Decorative background blur */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-72 w-72 rounded-full bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          {/* Logo */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-violet-500 to-cyan-500 shadow-xl shadow-violet-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="13.5" cy="6.5" r="0.5" fill="white" stroke="none" />
              <circle cx="17.5" cy="10.5" r="0.5" fill="white" stroke="none" />
              <circle cx="8.5" cy="7.5" r="0.5" fill="white" stroke="none" />
              <circle cx="6.5" cy="12.5" r="0.5" fill="white" stroke="none" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
            Pantone{' '}
            <span className="bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Color Converter
            </span>
          </h1>

          {/* Tagline */}
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {t.site.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#colors"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110"
            >
              {t.home.browseColors}
            </a>
            <a
              href="/api/og?pantone=485C"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-7 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            >
              {t.home.tryApi}
            </a>
          </div>

          {/* Color count badge */}
          <div className="mt-6">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {entries.length} colors available
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* How to Use Section */}
        <section className="mb-14">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.home.howToUse}
          </h2>

          <div className="mb-10 grid gap-6 sm:grid-cols-3">
            {/* Card 1: Share on Social */}
            <Link
              href="/color/485C"
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
              <div className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950 dark:text-rose-400">
                  <ShareIcon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.home.shareOnSocial}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.home.shareOnSocialDesc}
                </p>
                <code className="mt-4 block rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  https://pantone-converter.vercel.app/color/485C
                </code>
              </div>
            </Link>

            {/* Card 2: API Integration */}
            <a
              href="/api/og?pantone=485C"
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-1 bg-gradient-to-r from-violet-400 to-indigo-500" />
              <div className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400">
                  <CodeIcon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.home.apiIntegration}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.home.apiIntegrationDesc}
                </p>
                <code className="mt-4 block rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  GET /api/og?pantone=485C
                </code>
              </div>
            </a>

            {/* Card 3: Color Reference */}
            <a
              href="#colors"
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-1 bg-gradient-to-r from-cyan-400 to-teal-500" />
              <div className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500 dark:bg-cyan-950 dark:text-cyan-400">
                  <SwatchIcon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t.home.colorReference}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.home.colorReferenceDesc}
                </p>
                <code className="mt-4 block rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {entries.length} Pantone C colors available
                </code>
              </div>
            </a>
          </div>

          {/* Live API Preview */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t.home.livePreview}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t.home.livePreviewDesc}
              </p>
            </div>
            <div className="p-6">
              {/* Browser-like frame */}
              <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-zinc-200 shadow-lg dark:border-zinc-700">
                <div className="flex items-center gap-2 bg-zinc-100 px-4 py-2.5 dark:bg-zinc-800">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  </div>
                  <div className="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    pantone-converter.vercel.app/api/og?pantone=485C
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/api/og?pantone=485C"
                  alt="Pantone 485 C OG preview"
                  className="block w-full"
                />
              </div>

              {/* Tabbed Code Snippets */}
              <div className="mx-auto mt-6 max-w-2xl">
                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  {/* Tab: OG Meta */}
                  <div className="border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex">
                      <span className="border-b-2 border-violet-500 bg-zinc-50 px-4 py-2 text-xs font-semibold text-violet-600 dark:bg-zinc-800/50 dark:text-violet-400">
                        OG Meta
                      </span>
                      <span className="border-b-2 border-transparent px-4 py-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        Image Tag
                      </span>
                    </div>
                  </div>
                  <pre className="overflow-x-auto bg-zinc-900 px-4 py-3 text-xs leading-relaxed text-zinc-300 dark:bg-zinc-950">
{`<meta property="og:image" content="https://pantone-converter.vercel.app/api/og?pantone=485C" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`}
                  </pre>
                </div>

                <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex">
                      <span className="border-b-2 border-transparent px-4 py-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        OG Meta
                      </span>
                      <span className="border-b-2 border-violet-500 bg-zinc-50 px-4 py-2 text-xs font-semibold text-violet-600 dark:bg-zinc-800/50 dark:text-violet-400">
                        Image Tag
                      </span>
                    </div>
                  </div>
                  <pre className="overflow-x-auto bg-zinc-900 px-4 py-3 text-xs leading-relaxed text-zinc-300 dark:bg-zinc-950">
{`<img src="https://pantone-converter.vercel.app/api/og?pantone=485C" alt="Pantone 485 C" />`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Grid */}
        <ColorTabs entries={entries} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            {t.footer.poweredBy}{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Next.js</span>
          </p>
          <p>{t.home.colorsIndexed.replace('{count}', String(entries.length))}</p>
        </div>
      </footer>
    </div>
  )
}
