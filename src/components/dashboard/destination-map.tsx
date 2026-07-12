'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DestinationAgg } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

function qualityColor(score: number): string {
  if (score < 55) return '#ef4444'
  if (score < 70) return '#f59e0b'
  return '#10b981'
}

// Zimbabwe bounds: roughly SW corner to NE corner
const ZIMBABWE_CENTER: [number, number] = [-20.0, 30.0]
const ZIMBABWE_BOUNDS: [[number, number], [number, number]] = [
  [-22.5, 25.0], // SW
  [-15.5, 33.0], // NE
]

interface Props {
  destinations: DestinationAgg[]
}

export default function DestinationMap({ destinations }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (destinations.length === 0) {
    return (
      <Card className='ring-foreground/10 shadow-none ring-1'>
        <CardHeader>
          <CardTitle className='text-base font-semibold'>Destination map</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm'>No destinations match the current filters.</p>
        </CardContent>
      </Card>
    )
  }

  if (!mounted) {
    return (
      <Card className='ring-foreground/10 shadow-none ring-1'>
        <CardHeader>
          <CardTitle className='text-base font-semibold'>Destination map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='bg-muted h-80 animate-pulse rounded-lg' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='ring-foreground/10 shadow-none ring-1'>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>Destination map</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <LeafletMap destinations={destinations} />
        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2.5 rounded-full bg-red-500' />
            Low quality
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2.5 rounded-full bg-amber-500' />
            Medium quality
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2.5 rounded-full bg-emerald-500' />
            High quality
          </span>
          <span className='text-muted-foreground/60 ml-auto italic'>
            Circle size = visitor volume
          </span>
        </div>
        <p className='text-muted-foreground/60 text-[11px] italic'>
          Positions are approximate centroids for prototyping only. Not official geography.
        </p>
      </CardContent>
    </Card>
  )
}

function LeafletMap({ destinations }: { destinations: DestinationAgg[] }) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet)
    })
  }, [])

  useEffect(() => {
    if (!L) return

    const mapId = 'tourism-map'
    const container = document.getElementById(mapId)
    if (!container) return

    // Clean up existing map
    const existingMap = (container as any)._leaflet_map
    if (existingMap) {
      existingMap.remove()
    }

    const map = L.map(mapId, {
      center: ZIMBABWE_CENTER,
      zoom: 5,
      minZoom: 6,
      maxZoom: 12,
      maxBounds: ZIMBABWE_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      attributionControl: true,
    })

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    // Add destination markers
    const maxVisitors = Math.max(...destinations.map(d => d.totalVisitors), 1)

    destinations.forEach(dest => {
      const radius = 8 + Math.sqrt(dest.totalVisitors / maxVisitors) * 24
      const color = qualityColor(dest.avgServiceQuality)

      const circle = L.circleMarker([dest.latitude, dest.longitude], {
        radius,
        fillColor: color,
        fillOpacity: 0.55,
        color,
        weight: 1.5,
      }).addTo(map)

      // Invisible touch target overlay (min 22px radius = 44px diameter)
      const touchTarget = L.circleMarker([dest.latitude, dest.longitude], {
        radius: Math.max(radius, 22),
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'transparent',
        opacity: 0,
      }).addTo(map)

      touchTarget.bindPopup(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; min-width: 180px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${dest.destination}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${dest.province} &middot; ${dest.destinationType}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 12px;">
            <div><strong>${fmt(dest.totalVisitors)}</strong> visitors</div>
            <div><strong>${fmtUsd(dest.totalSpend)}</strong> spend</div>
            <div>Service: <strong>${fmt1(dest.avgServiceQuality)}</strong>/100</div>
            <div>Digital: <strong>${fmt1(dest.avgDigitalBooking)}%</strong></div>
          </div>
        </div>
      `)

      // Add label
      L.marker([dest.latitude, dest.longitude], {
        icon: L.divIcon({
          className: '',
          html: `<div style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 500; color: #1e293b; white-space: nowrap; text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white; pointer-events: none;">${dest.destination}</div>`,
          iconAnchor: [0, -radius - 4],
        }),
      }).addTo(map)
    })

    // Store map reference for cleanup
    ;(container as any)._leaflet_map = map

    return () => {
      map.remove()
    }
  }, [L, destinations])

  return (
    <div
      id='tourism-map'
      className='h-80 w-full rounded-lg'
      style={{ zIndex: 0 }}
      role='img'
      aria-label='Interactive map of Zimbabwe tourism destinations. Circle size shows visitor volume, color shows service quality.'
    />
  )
}
