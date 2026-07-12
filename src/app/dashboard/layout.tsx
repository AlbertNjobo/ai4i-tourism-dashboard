'use client'

import type { ReactNode } from 'react'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { FilterProvider } from '@/contexts/filter-context'

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <FilterProvider>
      <div className='flex h-full w-full min-w-0'>
        <Sidebar />
        <SidebarInset className='flex flex-1 flex-col'>
          <Header />
          <main className='mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6'>
            {children}
          </main>
          <Toaster />
          <Footer />
        </SidebarInset>
      </div>
    </FilterProvider>
  )
}

export default DashboardLayout
