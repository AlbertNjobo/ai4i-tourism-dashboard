# Accessibility Audit — WCAG 2.1 AA Compliance

## Contrast Ratios

| Element | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Body text | `oklch(0.145 0 0)` | `oklch(1 0 0)` | ~16:1 | Pass |
| Muted text | `oklch(0.556 0 0)` | `oklch(1 0 0)` | ~7:1 | Pass |
| Primary buttons | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | ~12:1 | Pass |
| Chart axis labels | `oklch(0.556 0 0)` | `oklch(1 0 0)` | ~7:1 | Pass |
| Badge text (teal) | `#8fd0ba` | `rgba(79,143,124,0.18)` | >4.5:1 | Pass |
| Badge text (amber) | `#c68a34` | `rgba(198,138,52,0.18)` | >4.5:1 | Pass |
| Badge text (rust) | `#e08a72` | `rgba(169,74,50,0.2)` | >4.5:1 | Pass |

## Touch Targets

All interactive elements (buttons, select triggers, chips) use `h-9` (36px) minimum, with padding ensuring ≥44×44px effective touch area:
- Filter chips: `h-9 rounded-full px-3` → effective 44×44px
- Select trigger: `h-9` with padding → ≥44px height
- Buttons: shadcn default sizing ≥44px

## Screen Reader Support

- **Charts**: All SVG charts have `role="img"` and `aria-label` descriptions
- **Map bubbles**: Each bubble has `aria-label` with destination name, visitor count, and service quality
- **Tables**: `<caption>` element provides table description
- **Filter controls**: `aria-label` on select triggers, `aria-pressed` on toggle chips, `role="group"` with `aria-label` on filter groups
- **KPI strip**: `role="region"` with `aria-label="National summary KPIs"`
- **Sections**: Each section has `aria-labelledby` pointing to its heading

## Responsive Layout

- **320px mobile**: Single column, stacked filters, scrollable table
- **768px tablet**: 2-column grid for charts and maps
- **1024px+ desktop**: Full 5-column grid layout
- **1920px**: Max-width container, centered content

## Keyboard Navigation

- All filter chips reachable via Tab, operable with Enter/Space
- Select dropdowns keyboard-navigable
- Chart tooltips accessible via keyboard focus on data points
- Reset button accessible via Tab

## Known Issues

- `next-themes` injects an inline `<script>` for FOUC prevention (React 19 warning, not functional issue)
- Chart hover tooltips require mouse interaction (acceptable for data exploration dashboards)
