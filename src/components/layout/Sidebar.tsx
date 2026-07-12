'use client'

import Link from 'next/link'
import { CheckIcon } from 'lucide-react'

import LogoSvg from '@/assets/svg/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilterContext } from '@/contexts/filter-context'
import { MONTH_LABELS } from '@/types/tourism'
import themeConfig from '@/configs/themeConfig'

function FilterSection({
  label,
  onClear,
  showClear,
  children,
}: {
  label: string
  onClear?: () => void
  showClear?: boolean
  children: React.ReactNode
}) {
  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-foreground'>{label}</h3>
        {showClear && onClear && (
          <button
            onClick={onClear}
            className='text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
          >
            Clear Filter
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function CheckOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-2.5 w-full text-left py-1 text-sm hover:text-foreground transition-colors cursor-pointer group'
    >
      <span
        className={`flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/40 bg-background group-hover:border-muted-foreground/60'
        }`}
      >
        {selected && <CheckIcon className='size-3' />}
      </span>
      <span className={selected ? 'text-foreground font-medium' : 'text-muted-foreground'}>
        {children}
      </span>
    </button>
  )
}

const SidebarLayout = () => {
  const {
    filters,
    months,
    types,
    provinces,
    setMonth,
    toggleType,
    toggleProvince,
    resetFilters,
  } = useFilterContext()

  const hasActiveFilters =
    filters.month !== 'all' || filters.types.size > 0 || filters.provinces.size > 0

  return (
    <Sidebar collapsible='offcanvas' variant='sidebar'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='gap-2.5 bg-transparent! [&>svg]:size-8'
              render={<Link href={`${themeConfig.homePageUrl}`} />}
            >
              <LogoSvg className='[&_rect]:fill-sidebar [&_rect:first-child]:fill-primary' />
              <div className='flex flex-col items-start'>
                <span className='text-lg font-semibold text-nowrap'>{themeConfig.templateName}</span>
                <span className='text-xs font-light text-nowrap'>Tourism Insights</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='group-data-[collapsible=icon]:overflow-y-auto px-4 py-4 space-y-6'>
        {/* Filter By header */}
        <div className='flex items-center justify-between'>
          <h2 className='text-base font-semibold text-foreground'>Filter By</h2>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className='text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
            >
              Reset All
            </button>
          )}
        </div>

        <div className='h-px bg-border' />

        {/* Month */}
        <FilterSection
          label='Month'
          showClear={filters.month !== 'all'}
          onClear={() => setMonth('all')}
        >
          <Select value={filters.month} onValueChange={(v) => v && setMonth(v)}>
            <SelectTrigger className='w-full h-10' aria-label='Filter by month'>
              <SelectValue placeholder='All months' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All months</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {MONTH_LABELS[m] || m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>

        <div className='h-px bg-border' />

        {/* Destination Type */}
        <FilterSection
          label='Destination Type'
          showClear={filters.types.size > 0}
          onClear={() => {
            filters.types.forEach((t) => toggleType(t))
          }}
        >
          <div className='space-y-0.5' role='group' aria-label='Filter by destination type'>
            {types.map((t) => (
              <CheckOption
                key={t}
                selected={filters.types.has(t)}
                onClick={() => toggleType(t)}
              >
                {t}
              </CheckOption>
            ))}
          </div>
        </FilterSection>

        <div className='h-px bg-border' />

        {/* Province */}
        <FilterSection
          label='Province'
          showClear={filters.provinces.size > 0}
          onClear={() => {
            filters.provinces.forEach((p) => toggleProvince(p))
          }}
        >
          <div className='space-y-0.5' role='group' aria-label='Filter by province'>
            {provinces.map((p) => (
              <CheckOption
                key={p}
                selected={filters.provinces.has(p)}
                onClick={() => toggleProvince(p)}
              >
                {p}
              </CheckOption>
            ))}
          </div>
        </FilterSection>
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarLayout
