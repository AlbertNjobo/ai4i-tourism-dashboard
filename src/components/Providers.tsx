'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { SidebarProvider } from './ui/sidebar'
import { TooltipProvider } from './ui/tooltip'

type Props = {
  children: ReactNode
  sidebarDefaultOpen?: boolean
}

const Providers = ({ children, sidebarDefaultOpen }: Props) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>{children}</SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
