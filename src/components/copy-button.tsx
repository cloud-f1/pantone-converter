'use client'

import { type ReactNode } from 'react'
import toast from 'react-hot-toast'

type CopyButtonProps = {
  text: string
  label: string
  icon: ReactNode
}

export function CopyButton({ text, label, icon }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied!')
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      title={label}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}
