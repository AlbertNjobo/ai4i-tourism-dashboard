'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FilterState } from '@/types/tourism'

interface FilterContextValue {
  filters: FilterState
  months: string[]
  types: string[]
  provinces: string[]
  setMonths: (m: string[]) => void
  setTypes: (t: string[]) => void
  setProvinces: (p: string[]) => void
  setMonth: (month: string) => void
  toggleType: (type: string) => void
  toggleProvince: (province: string) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider')
  return ctx
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    month: 'all',
    types: new Set<string>(),
    provinces: new Set<string>(),
  })

  const [months, setMonths] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [provinces, setProvinces] = useState<string[]>([])

  const setMonth = useCallback((month: string) => {
    setFilters(prev => ({ ...prev, month }))
  }, [])

  const toggleType = useCallback((type: string) => {
    setFilters(prev => {
      const next = new Set(prev.types)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return { ...prev, types: next }
    })
  }, [])

  const toggleProvince = useCallback((province: string) => {
    setFilters(prev => {
      const next = new Set(prev.provinces)
      if (next.has(province)) next.delete(province)
      else next.add(province)
      return { ...prev, provinces: next }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ month: 'all', types: new Set(), provinces: new Set() })
  }, [])

  return (
    <FilterContext.Provider
      value={{
        filters,
        months,
        types,
        provinces,
        setMonths,
        setTypes,
        setProvinces,
        setMonth,
        toggleType,
        toggleProvince,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
