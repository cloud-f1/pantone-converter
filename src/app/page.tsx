import Link from 'next/link'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'
import { ShareIcon, CodeIcon, SwatchIcon } from '@/components/icons'
import { ColorTabs } from '@/components/color-tabs'

export default function Home() {
  const entries = Object.entries(PANTONE_MAP)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-violet-500 to-cyan-500 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
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
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Pantone{' '}
                <span className="bg-gradient-to-r from-rose-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  Color Converter
                </span>
              </h1>
              <p className="mt-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                Browse and share Pantone colors with rich previews
                <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {entries.length} colors
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* How to Use Section */}
        <section className="mb-14">
          <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use
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
                  Share on Social
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Copy a color page URL and paste into LINE, Slack, or Facebook. The platform auto-generates a rich preview card with the exact color.
                </p>
                <code className="mt-4 block rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  https://your-domain.com/color/485C
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
                  API Integration
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Call the OG image API to get a 1200x630 PNG of any Pantone color. Use in emails, docs, or embed in your own pages.
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
                  Color Reference
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Browse all colors below. Click any card to see the full detail page with copyable URL and color information.
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
                Live Preview
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                This image is generated on-the-fly by the API. Try changing the URL parameter.
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
                    your-domain.com/api/og?pantone=485C
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
{`<meta property="og:image" content="https://your-domain.com/api/og?pantone=485C" />
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
{`<img src="https://your-domain.com/api/og?pantone=485C" alt="Pantone 485 C" />`}
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
            Powered by{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Next.js</span>
          </p>
          <p>{entries.length} Pantone colors indexed</p>
        </div>
      </footer>
    </div>
  )
}
