'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XIcon } from 'lucide-react'

interface Props {
  onClose: () => void
}

const shortcuts = [
  { keys: ['?'], label: 'Show keyboard shortcuts' },
  { keys: ['Esc'], label: 'Close shortcuts overlay' },
  { keys: ['M'], label: 'Focus month filter' },
  { keys: ['R'], label: 'Reset all filters' },
  { keys: ['D'], label: 'Toggle dark/light mode' },
  { keys: ['1'], label: 'Jump to KPI overview' },
  { keys: ['2'], label: 'Jump to filters & trend' },
  { keys: ['3'], label: 'Jump to destinations' },
  { keys: ['4'], label: 'Jump to deep dive' },
  { keys: ['Tab'], label: 'Navigate between elements' },
  { keys: ['Enter'], label: 'Activate button/link' },
  { keys: ['Space'], label: 'Toggle filter chip' },
]

export default function KeyboardShortcutHelp({ onClose }: Props) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={onClose}
      role='dialog'
      aria-label='Keyboard shortcuts'
      aria-modal='true'
    >
      <Card
        className='w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>Keyboard Shortcuts</CardTitle>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            aria-label='Close shortcuts'
          >
            <XIcon className='size-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {shortcuts.map((shortcut, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50'
              >
                <span className='text-sm text-muted-foreground'>{shortcut.label}</span>
                <div className='flex gap-1'>
                  {shortcut.keys.map((key, j) => (
                    <kbd
                      key={j}
                      className='inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs font-medium'
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Press <kbd className='inline-flex h-4 min-w-[16px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px]'>?</kbd> to toggle this overlay
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
