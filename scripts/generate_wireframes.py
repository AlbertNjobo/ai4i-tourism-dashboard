#!/usr/bin/env python3
"""Generate wireframe diagrams for the proposal."""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
import os

OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "docs", "proposal-pages"
)

W, H = letter

def draw_wireframe(filename, title, zones):
    """Draw a wireframe diagram with labeled zones."""
    c = canvas.Canvas(os.path.join(OUT_DIR, filename), pagesize=letter)
    
    # Title
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(W/2, H - 50, title)
    
    # Page border
    margin = 60
    content_w = W - margin * 2
    content_h = H - 120
    y_start = H - 80
    
    c.setStrokeColor(colors.HexColor("#CCCCCC"))
    c.setLineWidth(1)
    c.rect(margin, y_start - content_h, content_w, content_h)
    
    # Draw zones
    y = y_start - 10
    for zone in zones:
        label = zone["label"]
        height = zone["height"]
        color = zone.get("color", colors.HexColor("#E8F4FD"))
        sublabel = zone.get("sublabel", "")
        
        # Zone box
        c.setFillColor(color)
        c.rect(margin + 5, y - height, content_w - 10, height, fill=1, stroke=0)
        
        # Border
        c.setStrokeColor(colors.HexColor("#999999"))
        c.setLineWidth(0.5)
        c.rect(margin + 5, y - height, content_w - 10, height)
        
        # Label
        c.setFillColor(colors.HexColor("#333333"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(margin + 15, y - height/2 - 3 if not sublabel else y - height/2 + 8, label)
        
        if sublabel:
            c.setFont("Helvetica", 9)
            c.setFillColor(colors.HexColor("#666666"))
            c.drawString(margin + 15, y - height/2 - 8, sublabel)
        
        y -= height + 8
    
    c.save()

# ── Wireframe 1: Full Layout Overview ──────────────────────────────────

draw_wireframe(
    "wireframe-layout.png",
    "Atlas — Dashboard Layout Structure",
    [
        {"label": "ZONE 1: KPI Strip", "height": 50, "color": colors.HexColor("#FFF3E0"),
         "sublabel": "5 summary cards: Visitors | Spend | Service Quality | Digital Booking | Top Complaint"},
        {"label": "ZONE 2: Filters", "height": 40, "color": colors.HexColor("#E8F5E9"),
         "sublabel": "Month dropdown | Destination Type chips | Province chips | Reset button"},
        {"label": "ZONE 2b: Trend Chart + Insight Narrative", "height": 120, "color": colors.HexColor("#E3F2FD"),
         "sublabel": "Dual-axis line chart (visitors + spend) | Auto-generated insight bullets"},
        {"label": "ZONE 3: Destination Map + Scorecard", "height": 140, "color": colors.HexColor("#F3E5F5"),
         "sublabel": "Interactive Leaflet map (circle markers) | Sortable destination table with pills/bars"},
        {"label": "ZONE 3b: Deep Dive Chart + Action Panel", "height": 110, "color": colors.HexColor("#FFEBEE"),
         "sublabel": "Dropdown: Complaints | Revenue | Demographics | Priority action cards"},
    ]
)

# ── Wireframe 2: KPI Strip Detail ──────────────────────────────────────

draw_wireframe(
    "wireframe-kpi.png",
    "Zone 1 — KPI Strip Detail",
    [
        {"label": "[VISITORS] 144,096", "height": 60, "color": colors.HexColor("#FFF8E1"),
         "sublabel": "Icon + Label + Value + Delta badge (▲/▼ % vs previous month)"},
        {"label": "[SPEND] $13,619,677", "height": 60, "color": colors.HexColor("#FFF8E1"),
         "sublabel": "DollarSign icon | Formatted USD | No delta when 'All months' selected"},
        {"label": "[QUALITY] 73.7 /100", "height": 60, "color": colors.HexColor("#FFF8E1"),
         "sublabel": "Star icon | Average across filtered destinations | Color-coded pill"},
        {"label": "[DIGITAL] 45.6%", "height": 60, "color": colors.HexColor("#FFF8E1"),
         "sublabel": "Globe icon | Average digital booking share | Updates with filters"},
        {"label": "[COMPLAINT] Sanitation", "height": 60, "color": colors.HexColor("#FFF8E1"),
         "sublabel": "AlertTriangle icon | Mode of top_complaint_theme across filtered records"},
    ]
)

# ── Wireframe 3: Filter Bar Detail ─────────────────────────────────────

draw_wireframe(
    "wireframe-filters.png",
    "Zone 2 — Filter Bar Detail",
    [
        {"label": "MONTH: [All months ▼]", "height": 50, "color": colors.HexColor("#E8F5E9"),
         "sublabel": "Select dropdown with 7 options: All months, Jan 2026 ... Jun 2026"},
        {"label": "TYPE: [Cultural] [Heritage] [Lake] [Natural] [Wildlife] ...", "height": 50, "color": colors.HexColor("#E8F5E9"),
         "sublabel": "Toggle chips (outline when off, filled when active) | aria-pressed state"},
        {"label": "PROVINCE: [Bulawayo] [Harare] [Manicaland] [Masvingo] ...", "height": 50, "color": colors.HexColor("#E8F5E9"),
         "sublabel": "Toggle chips | Same interaction as Type | Multiple selection allowed"},
        {"label": "Showing 8 destinations · 48 monthly records", "height": 30, "color": colors.HexColor("#F5F5F5"),
         "sublabel": "Result count — updates instantly with any filter change"},
    ]
)

# ── Wireframe 4: Zone 3 — Map + Scorecard ──────────────────────────────

draw_wireframe(
    "wireframe-map-scorecard.png",
    "Zone 3 — Destination Map + Scorecard",
    [
        {"label": "DESTINATION MAP (Left 55%)", "height": 160, "color": colors.HexColor("#E3F2FD"),
         "sublabel": "Leaflet map | Circle markers sized by visitors | Colored by service quality | Click for popup details"},
        {"label": "DESTINATION SCORECARD (Right 45%)", "height": 160, "color": colors.HexColor("#F3E5F5"),
         "sublabel": "Sortable table | Columns: Name, Province, Visitors, Spend, Quality (pill+bar), Digital (pill), Complaint"},
    ]
)

# ── Wireframe 5: Zone 3b — Deep Dive + Actions ────────────────────────

draw_wireframe(
    "wireframe-deepdive.png",
    "Zone 3b — Deep Dive Chart + Action Panel",
    [
        {"label": "ANALYTICS CHART (Left 60%)", "height": 120, "color": colors.HexColor("#FFEBEE"),
         "sublabel": "Dropdown: Complaint themes | Revenue by destination | Visitor demographics"},
        {"label": "ACTION PANEL (Right 40%)", "height": 120, "color": colors.HexColor("#FFF3E0"),
         "sublabel": "3 priority cards: Revenue Leakage (red) | Service Quality (amber) | National Fix (blue)"},
    ]
)

print("Wireframes generated:")
for f in ["wireframe-layout.png", "wireframe-kpi.png", "wireframe-filters.png",
          "wireframe-map-scorecard.png", "wireframe-deepdive.png"]:
    print(f"  {f}")
