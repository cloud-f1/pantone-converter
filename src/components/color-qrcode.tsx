'use client'

import { useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { getRelativeLuminance } from '@/features/color/lib/color-utils'
import type { Dictionary } from '@/i18n/get-dictionary'

type Props = {
  url: string
  hex: string
  pantoneCode: string
  dictionary: Dictionary
}

function getQrColor(hex: string): string {
  // If the color is too light (luminance > 0.4), use dark version for scannability
  const lum = getRelativeLuminance(hex)
  if (lum > 0.4) return '#18181b' // zinc-900 fallback for light colors
  return hex
}

export function ColorQRCode({ url, hex, pantoneCode, dictionary: t }: Props) {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrColor = getQrColor(hex)

  const downloadPng = useCallback(() => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const data = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(blobUrl)

      const link = document.createElement('a')
      link.download = `pantone-${pantoneCode}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success(t.qrcode?.downloaded ?? 'QR code downloaded')
    }
    img.src = blobUrl
  }, [pantoneCode, t])

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(url)
    toast.success(t.qrcode?.copied ?? 'URL copied')
  }, [url, t])

  const shareNative = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pantone ${pantoneCode}`,
          text: `Check out Pantone ${pantoneCode} (${hex})`,
          url,
        })
      } catch {
        // User cancelled — ignore
      }
    } else {
      copyUrl()
    }
  }, [url, hex, pantoneCode, copyUrl])

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t.qrcode?.title ?? 'Share QR Code'}
      </h2>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* QR Code */}
        <div ref={qrRef} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700">
          <QRCodeSVG
            value={url}
            size={160}
            bgColor="#ffffff"
            fgColor={qrColor}
            level="H"
            includeMargin
          />
        </div>

        {/* Info + Actions */}
        <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.qrcode?.scanToView ?? 'Scan to view this color on any device'}
          </p>
          <p className="break-all font-mono text-xs text-zinc-400 dark:text-zinc-500">
            {url}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <button
              onClick={downloadPng}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.qrcode?.download ?? 'Download PNG'}
            </button>
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {t.qrcode?.copyUrl ?? 'Copy URL'}
            </button>
            <button
              onClick={shareNative}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 6m4-4v13" />
              </svg>
              {t.qrcode?.share ?? 'Share'}
            </button>
          </div>

          {/* Color indicator */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: hex }} />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {qrColor === hex
                ? (t.qrcode?.coloredQr ?? 'QR colored to match Pantone shade')
                : (t.qrcode?.darkQr ?? 'Dark QR for scannability (light color)')
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
