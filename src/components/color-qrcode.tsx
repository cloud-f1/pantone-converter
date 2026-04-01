'use client'

import { QRCodeSVG } from 'qrcode.react'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  url: string
  hex: string
  dictionary: Dictionary
}

export function ColorQRCode({ url, hex, dictionary: t }: Props) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t.qrcode?.title ?? 'Share QR Code'}
      </h2>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700">
          <QRCodeSVG
            value={url}
            size={140}
            bgColor="#ffffff"
            fgColor={hex}
            level="M"
            includeMargin={false}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.qrcode?.scanToView ?? 'Scan to view this color'}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-zinc-400 dark:text-zinc-500">
            {url}
          </p>
          <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
            {t.qrcode?.coloredQr ?? 'QR code is colored to match the Pantone shade'}
          </p>
        </div>
      </div>
    </div>
  )
}
