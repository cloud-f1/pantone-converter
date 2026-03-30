'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#18181b',
          color: '#fafafa',
          borderRadius: '12px',
          fontSize: '14px',
        },
      }}
    />
  )
}
