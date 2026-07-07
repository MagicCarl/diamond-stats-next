"""Generate the free printable baseball/softball scorecard PDF."""
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

PAGE_W, PAGE_H = landscape(letter)  # 792 x 612
M = 30  # margin

INK = HexColor("#1f2937")
LIGHT = HexColor("#9ca3af")
FAINT = HexColor("#e5e7eb")
BLUE = HexColor("#2563eb")

OUT = "public/baseball-scorecard.pdf"

c = canvas.Canvas(OUT, pagesize=(PAGE_W, PAGE_H))
c.setTitle("Baseball & Softball Scorecard — free printable from BaseballStatsTracker.com")
c.setAuthor("Baseball Stats Tracker")


def diamond(cx, cy, r):
    p = c.beginPath()
    p.moveTo(cx, cy - r)
    p.lineTo(cx + r, cy)
    p.lineTo(cx, cy + r)
    p.lineTo(cx - r, cy)
    p.close()
    c.drawPath(p, stroke=1, fill=0)


def field_line(x, y, label, w):
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(INK)
    c.drawString(x, y, label)
    lw = c.stringWidth(label, "Helvetica-Bold", 8)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.75)
    c.line(x + lw + 4, y - 1.5, x + w, y - 1.5)


def draw_page(page_label):
    # ---------- Header ----------
    y_top = PAGE_H - M
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(M, y_top - 14, "BASEBALL / SOFTBALL SCORECARD")
    c.setFont("Helvetica", 8)
    c.setFillColor(LIGHT)
    c.drawRightString(PAGE_W - M, y_top - 12, page_label)

    fy = y_top - 34
    field_line(M, fy, "TEAM", 210)
    field_line(M + 224, fy, "OPPONENT", 210)
    field_line(M + 448, fy, "DATE", 120)
    field_line(M + 588, fy, "FINAL", PAGE_W - 2 * M)
    fy2 = fy - 18
    field_line(M, fy2, "LOCATION", 210)
    field_line(M + 224, fy2, "SCOREKEEPER", 210)
    field_line(M + 448, fy2, "START TIME", 120)
    field_line(M + 588, fy2, "WEATHER", PAGE_W - 2 * M)

    # ---------- Grid geometry ----------
    grid_top = fy2 - 14
    num_w, name_w = 20, 104
    tot_labels = ["AB", "H", "R", "RBI", "BB"]
    tot_w = 22
    innings = 9
    inn_w = (PAGE_W - 2 * M - num_w - name_w - tot_w * len(tot_labels)) / innings
    header_h = 14
    rows = 10
    # reserve space for runs/hits strip + footer
    strip_h = 30
    footer_h = 34
    row_h = (grid_top - M - footer_h - strip_h - header_h) / rows

    x0 = M
    y_hdr = grid_top - header_h

    # column x positions
    xs = [x0, x0 + num_w, x0 + num_w + name_w]
    for i in range(innings):
        xs.append(xs[-1] + inn_w)
    for i in range(len(tot_labels)):
        xs.append(xs[-1] + tot_w)
    x_end = xs[-1]

    # header row
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString((xs[0] + xs[1]) / 2, y_hdr + 4, "#")
    c.drawCentredString((xs[1] + xs[2]) / 2, y_hdr + 4, "PLAYER")
    for i in range(innings):
        c.drawCentredString((xs[2 + i] + xs[3 + i]) / 2, y_hdr + 4, str(i + 1))
    for i, lab in enumerate(tot_labels):
        c.drawCentredString((xs[2 + innings + i] + xs[3 + innings + i]) / 2, y_hdr + 4, lab)

    grid_bottom = y_hdr - rows * row_h

    # row/col lines
    c.setStrokeColor(INK)
    c.setLineWidth(1)
    c.rect(x0, grid_bottom, x_end - x0, grid_top - grid_bottom)
    c.setLineWidth(0.6)
    c.line(x0, y_hdr, x_end, y_hdr)
    for r in range(1, rows):
        y = y_hdr - r * row_h
        c.line(x0, y, x_end, y)
    for x in xs[1:-1]:
        c.line(x, grid_bottom, x, grid_top)

    # diamonds + count ticks in each inning cell
    r_dia = min(inn_w, row_h) * 0.30
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.6)
    for r in range(rows):
        cy = y_hdr - r * row_h - row_h * 0.52
        for i in range(innings):
            cx = xs[2 + i] + inn_w * 0.56
            diamond(cx, cy, r_dia)
            # balls (3) and strikes (2) tick boxes, left edge of the cell
            bx = xs[2 + i] + 2.5
            for b in range(3):
                c.rect(bx, cy + r_dia - b * 6.2, 4.2, 4.2)
            for s in range(2):
                c.rect(bx + 6.2, cy + r_dia - s * 6.2, 4.2, 4.2)

    # ---------- Runs / Hits strip ----------
    strip_top = grid_bottom
    c.setStrokeColor(INK)
    c.setLineWidth(0.6)
    labels = ["RUNS", "HITS"]
    for j, lab in enumerate(labels):
        y1 = strip_top - (j + 1) * (strip_h / 2)
        y2 = strip_top - j * (strip_h / 2)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(INK)
        c.drawRightString(xs[2] - 4, y1 + 4.5, lab)
        c.line(x0, y1, x_end, y1)
        for i in range(innings + len(tot_labels)):
            x = xs[2 + i]
            c.line(x, y1, x, y2)
    c.line(x0, strip_top, x0, strip_top - strip_h)
    c.line(x_end, strip_top, x_end, strip_top - strip_h)

    # ---------- Symbol key + branding footer ----------
    fy3 = strip_top - strip_h - 12
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(INK)
    c.drawString(M, fy3, "KEY:")
    c.setFont("Helvetica", 7)
    c.setFillColor(LIGHT)
    c.drawString(
        M + 24, fy3,
        "1B single · 2B double · 3B triple · HR home run · BB walk · HBP hit by pitch · K strikeout swinging · "
        "backwards K strikeout looking · F8 fly out · 6-3 ground out · FC fielder's choice · E error · SB stolen base · SAC/SF sacrifice",
    )
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(BLUE)
    c.drawString(M, fy3 - 13, "Tired of the clipboard? Score from your phone in 60 seconds — automatic stats & spray charts.")
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(INK)
    c.drawRightString(PAGE_W - M, fy3 - 13, "BaseballStatsTracker.com  ·  $39 once, no subscription")


draw_page("HOME TEAM — page 1 of 2")
c.showPage()
draw_page("VISITING TEAM — page 2 of 2")
c.save()
print("wrote", OUT)
