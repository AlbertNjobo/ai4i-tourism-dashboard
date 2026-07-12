# Architecture

## System Overview

```
┌─────────────────────────────────────────────────┐
│                    User (Browser)                │
│  Tourism authority / Destination manager         │
└──────────────────────┬──────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────┐
│              Next.js App Router                  │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Server:     │  │ Client:                  │  │
│  │ CSV Loader  │→ │ DashboardView            │  │
│  │ (build time)│  │  ├─ KPIStrip             │  │
│  └─────────────┘  │  ├─ VisitorTrendChart     │  │
│  ┌─────────────┐  │  ├─ DestinationMap       │  │
│  │ public/data/│  │  ├─ ScorecardTable       │  │
│  │ CSV file    │  │  ├─ InsightNarrative     │  │
│  └─────────────┘  │  ├─ ActionPanel          │  │
│  ┌─────────────┐  │  └─ ComplaintAnalysis    │  │
│  │ Sidebar:    │  └──────────────────────────┘  │
│  │ FilterPanel │                                │
│  │ (left side) │                                │
│  └─────────────┘                                │
└─────────────────────────────────────────────────┘
```

## Components

| Component | Role | Data flow |
|-----------|------|-----------|
| `csv-loader.ts` | Server-side CSV parser | Reads `public/data/*.csv` → `TourismRecord[]` |
| `dashboard/page.tsx` | Server component | Calls `loadTourismData()`, passes to client |
| `dashboard-view.tsx` | Client orchestrator | Consumes FilterContext, computes derived data |
| `filter-context.tsx` | Shared filter state | FilterProvider wraps layout, shared between Sidebar and DashboardView |
| `use-tourism-data.ts` | Client hook | Accepts external filters, computes KPI aggregation, insights |
| `kpi-strip.tsx` | KPI cards | Receives computed KPI data |
| `sidebar.tsx` (layout) | Filter panel | Month dropdown, type/province checkmark options, reset |
| `visitor-trend-chart.tsx` | Line chart | Recharts dual-axis (visitors + spend) |
| `destination-map.tsx` | Leaflet map | Destination circle markers with auto-fit bounds |
| `scorecard-table.tsx` | Data table | Destination comparison with pills/bars |
| `insight-narrative.tsx` | Auto-generated text | Computed from filtered data |
| `action-panel.tsx` | Recommendation cards | Derived from insights |
| `complaint-analysis.tsx` | Bar chart | Complaint theme frequency (single color) |

## Data Flow

1. **Build time**: `csv-loader.ts` reads CSV, parses to `TourismRecord[]`
2. **Server render**: Page component passes data as props to `DashboardView`
3. **Shared state**: `FilterProvider` in layout wraps both Sidebar and DashboardView
4. **Sidebar reads/writes**: Filter controls read filter state and toggle callbacks from context
5. **DashboardView**: Registers months/types/provinces with context, passes context filters to `useTourismData`
6. **Derived data**: Hook computes KPIs, trend data, destination aggregations, insights
7. **Re-render**: Filter changes in Sidebar trigger context update → DashboardView recomputes → UI updates

## Key Decisions

- **CSV parsed at build time** (not runtime) for fast page loads and static export compatibility
- **FilterContext** shares filter state between Sidebar (controls) and DashboardView (data) without prop drilling
- **Filters in left sidebar** instead of horizontal band — always visible while scrolling, familiar pattern for dashboards
- **shadcn/ui components** for WCAG-compliant, accessible UI primitives
- **Recharts** for accessible chart rendering with built-in ARIA support
- **Leaflet** for interactive map with auto-fit bounds to Zimbabwe destinations
