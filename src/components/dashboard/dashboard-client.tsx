'use client'

import { useState, useEffect, type ReactNode } from 'react'

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div className='flex items-center justify-center py-24'>
        <p className='text-muted-foreground'>Loading dashboard...</p>
      </div>
    )
  }
  return <>{children}</>
}

import type { TourismRecord } from '@/types/tourism'
import DashboardView from './dashboard-view'

interface Props {
  initialData: TourismRecord[]
  months: string[]
  types: string[]
  provinces: string[]
}

export default function DashboardClient({ initialData, months, types, provinces }: Props) {
  return (
    <ClientOnly>
      <DashboardView
        initialData={initialData}
        months={months}
        types={types}
        provinces={provinces}
      />
    </ClientOnly>
  )
}
