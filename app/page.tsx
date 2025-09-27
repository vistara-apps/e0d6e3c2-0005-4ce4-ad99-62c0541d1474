'use client'

import { useState, useEffect } from 'react'
import { default as dynamicImport } from 'next/dynamic'

const SudoPathApp = dynamicImport(() => import('./components/SudoPathApp').then(mod => ({ default: mod.SudoPathApp })), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading SudoPath...</p>
      </div>
    </main>
  )
})

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SudoPathApp />
    </main>
  )
}
