'use client'

import { useEffect, useState, useCallback } from 'react'

interface Shortcut {
  key: string
  label: string
  action: () => void
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const [showHelp, setShowHelp] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    // ? key toggles help
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault()
      setShowHelp(prev => !prev)
      return
    }

    // Escape closes help
    if (e.key === 'Escape' && showHelp) {
      e.preventDefault()
      setShowHelp(false)
      return
    }

    // Find matching shortcut
    for (const shortcut of shortcuts) {
      if (e.key === shortcut.key && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        shortcut.action()
        break
      }
    }
  }, [shortcuts, showHelp])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { showHelp, setShowHelp }
}
