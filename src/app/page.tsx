import Link from 'next/link'
import { PANTONE_MAP } from '@/features/color/data/pantone-map'
import { getContrastTextColor } from '@/features/color/lib/color-utils'

export default function Home() {
  const entries = Object.entries(PANTONE_MAP)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pantone Color Converter
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Browse {entries.length} Pantone colors. Click a card to view details and share.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* How to Use Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            How to Use
          </h2>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 text-2xl">1</div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Share on LINE / Social
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Copy a color page URL and paste into LINE, Slack, or Facebook. The platform auto-generates a rich preview card with the exact color.
              </p>
              <code className="mt-3 block rounded bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                https://your-domain.com/color/485C
              </code>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 text-2xl">2</div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Use the API Directly
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Call the OG image API to get a 1200x630 PNG of any Pantone color. Use in emails, docs, or embed in your own pages.
              </p>
              <code className="mt-3 block rounded bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                GET /api/og?pantone=485C
              </code>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 text-2xl">3</div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                Quick Color Reference
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Browse all colors below. Click any card to see the full detail page with copyable URL and color information.
              </p>
              <code className="mt-3 block rounded bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {entries.length} Pantone C colors available
              </code>
            </div>
          </div>

          {/* Live API Preview */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
              Live Preview
            </h3>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              This image is generated on-the-fly by the API. Try changing the URL parameter:
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/og?pantone=485C"
              alt="Pantone 485 C OG preview"
              className="mb-4 w-full max-w-2xl rounded-lg shadow-md"
            />

            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Embed in HTML:
              </p>
              <pre className="overflow-x-auto rounded bg-zinc-100 px-4 py-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
{`<meta property="og:image" content="https://your-domain.com/api/og?pantone=485C" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`}
              </pre>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Or use as an image:
              </p>
              <pre className="overflow-x-auto rounded bg-zinc-100 px-4 py-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
{`<img src="https://your-domain.com/api/og?pantone=485C" alt="Pantone 485 C" />`}
              </pre>
            </div>
          </div>
        </section>

        {/* Color Grid */}
        <section>
          <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            All Colors ({entries.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {entries.map(([key, { hex, name }]) => {
              const textColor = getContrastTextColor(hex)
              return (
                <Link
                  key={key}
                  href={`/color/${key}`}
                  className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl hover:scale-105"
                >
                  <div
                    className="flex aspect-square flex-col items-center justify-center p-4"
                    style={{ backgroundColor: hex }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: textColor }}
                    >
                      {name}
                    </span>
                    <span
                      className="mt-1 text-xs font-light"
                      style={{ color: textColor, opacity: 0.8 }}
                    >
                      {hex.toUpperCase()}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
