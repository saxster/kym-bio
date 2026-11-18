"""Figures for Chapter 0 (The detective's lens) and the 16-chapter cover art of The Living World."""
import math
from figs_core import Fig, figure


def _cover_emblem(f: Fig, n: int, cx: float, cy: float):
    """Draw a rich Herbarium & Copperplate biological emblem at (cx, cy) for chapter tile n (0..15)."""
    f.add(f'<g class="cover-emblem" transform="translate({cx},{cy})" style="stroke:var(--sheet);fill:none">')
    # Subtle copperplate specimen medallion halo
    f.add('<circle cx="0" cy="0" r="22" style="stroke:var(--sheet);stroke-opacity:.22;stroke-width:1;fill:var(--sheet);fill-opacity:.08"/>')
    if n == 0:
        # Leeuwenhoek brass paddle microscope + spherical bead + optical rays
        f.rect(-10, -18, 20, 30, 'ln', rx=3, extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.14"')
        f.circle(0, -6, 4.5, 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.35"')
        f.line(0, 12, 0, 21, 'ln', extra='style="stroke:var(--sheet)"')
        f.line(-5, 17, 5, 17, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 1:
        # Sprouting moong seed cotyledons vs candle flame
        f.path('M-13,9 C-20,9 -20,-6 -10,-8 C-2,-8 -2,9 -13,9 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.18"')
        f.path('M-8,1 Q-2,-13 5,-18 M-1,-8 Q5,-10 8,-5', 'ln', extra='style="stroke:var(--sheet)"')
        f.path('M13,12 C8,3 11,-7 16,-16 C21,-7 24,3 19,12 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.25"')
    elif n == 2:
        # Eukaryotic cell cutaway with nucleolus, ER arc & cristae mitochondrion
        f.rect(-19, -14, 38, 28, 'ln', rx=8, extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.12"')
        f.circle(-6, 0, 6.5, 'ln', extra='style="stroke:var(--sheet)"')
        f.circle(-6, 0, 2.4, 'fill-ink', extra='style="fill:var(--sheet)"')
        f.path('M5,-6 C14,-6 14,6 5,6 Z', 'ln', extra='style="stroke:var(--sheet)"')
        f.path('M7,-3 L9,3 L11,-3', 'ln', extra='style="stroke:var(--sheet);stroke-width:1.1"')
    elif n == 3:
        # Osmosis semipermeable membrane + water flux arrow
        f.line(0, -18, 0, 18, 'ln dash', extra='style="stroke:var(--sheet)"')
        for x, y in ((-12, -9), (-9, 5), (-15, 10), (10, -7)):
            f.circle(x, y, 2.6, 'fill-ink', extra='style="fill:var(--sheet)"')
        f.circle(12, 8, 6, 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.2"')
    elif n == 4:
        # Enzyme active-site lock and substrate key (centered cleanly inside medallion—no left-edge clip!)
        f.path('M-4,-14 A14,14 0 1,0 -4,14 L3,7 L-3,0 L3,-7 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.16"')
        f.path('M7,-6 L2,0 L7,6 L16,6 L16,-6 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.3"')
    elif n == 5:
        # Botanical banyan leaf with midrib and secondary veins
        f.path('M-16,13 C-16,-9 3,-18 16,-14 C12,-1 3,16 -16,13 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.18"')
        f.line(-16, 13, 12, -10, 'ln', extra='style="stroke:var(--sheet)"')
        f.line(-5, 4, -7, -4, 'ln', extra='style="stroke:var(--sheet);stroke-width:1.1"')
        f.line(2, -2, 6, 3, 'ln', extra='style="stroke:var(--sheet);stroke-width:1.1"')
    elif n == 6:
        # Double-membrane mitochondrion with folded cristae
        f.add('<ellipse cx="0" cy="0" rx="19" ry="11" style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.15;stroke-width:1.6"/>')
        f.path('M-12,-6 L-8,5 L-3,-6 L2,5 L7,-6 L11,5', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 7:
        # Intestinal villi brush-border folds with lacteal
        f.path('M-18,14 L-18,-5 Q-13,-16 -8,-5 L-8,9 Q-4,14 0,9 L0,-9 Q5,-19 10,-9 L10,14', 'ln', extra='style="stroke:var(--sheet)"')
        f.circle(15, -4, 2.5, 'fill-ink', extra='style="fill:var(--sheet)"')
    elif n == 8:
        # Four-chambered double-pump heart with septum
        f.path('M0,15 C-18,3 -20,-12 -8,-14 C-2,-14 0,-8 0,-8 C0,-8 2,-14 8,-14 C20,-12 18,3 0,15 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.18"')
        f.line(0, -8, 0, 14, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 9:
        # Action potential depolarization spike + axon myelin
        f.path('M-19,5 L-9,5 L-3,-16 L2,14 L7,2 L19,2', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 10:
        # Y-shaped immunoglobulin antibody with Fab binding clefts
        f.path('M-14,-15 L0,-2 L14,-15 M0,-2 L0,15 M-10,-15 L-3,-8 M10,-15 L3,-8', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 11:
        # B-DNA antiparallel double helix with base-pair rungs
        f.path('M-17,-10 C-7,-20 7,20 17,10 M-17,10 C-7,20 7,-20 17,-10', 'ln', extra='style="stroke:var(--sheet)"')
        for x in (-10, -3, 3, 10):
            f.line(x, -6, x, 6, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 12:
        # Sister chromatids with centromere kinetochore
        f.path('M-10,-15 C-2,-3 -2,3 -10,15 M10,-15 C2,-3 2,3 10,15', 'ln', extra='style="stroke:var(--sheet)"')
        f.circle(0, 0, 3.2, 'fill-ink', extra='style="fill:var(--sheet)"')
    elif n == 13:
        # Mendelian 2x2 Punnett grid with 3:1 phenotype dots
        f.rect(-14, -14, 28, 28, 'ln', rx=3, extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.12"')
        f.line(-14, 0, 14, 0, 'ln', extra='style="stroke:var(--sheet)"')
        f.line(0, -14, 0, 14, 'ln', extra='style="stroke:var(--sheet)"')
        for px, py in ((-7, -7), (7, -7), (-7, 7)):
            f.circle(px, py, 2.5, 'fill-ink', extra='style="fill:var(--sheet)"')
        f.circle(7, 7, 2.5, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 14:
        # Phylogenetic branching coral of life
        f.path('M0,15 L0,3 M0,3 L-11,-7 M0,3 L11,-7 M-11,-7 L-16,-15 M-11,-7 L-5,-15 M11,-7 L5,-15 M11,-7 L16,-15', 'ln', extra='style="stroke:var(--sheet)"')
    else:
        # Lindeman trophic energy pyramid
        f.path('M-18,14 L18,14 L13,4 L-13,4 Z M-11,2 L11,2 L6,-7 L-6,-7 Z M-5,-9 L5,-9 L0,-17 Z', 'ln', extra='style="stroke:var(--sheet);fill:var(--sheet);fill-opacity:.16"')
    f.add('</g>')


@figure
def cover_art():
    """Sixteen biology milestone specimen plates (Chapters 0 to 15) arranged across four volumes."""
    TILES = [
        (0, '270×', 'The lens', 1, 0),
        (1, 'ATP', 'Seed & flame', 1, 1),
        (2, 'SA / V', 'Nanotech cell', 1, 0),
        (3, 'Ψw', 'Salty sea', 1, 0),
        (4, 'Ea', 'Enzyme locks', 2, 0),
        (5, '6 CO₂', 'Green engine', 2, 1),
        (6, 'ADP → ATP', 'Respiration', 2, 0),
        (7, 'pH 2', 'Digestion', 3, 0),
        (8, '2× pump', 'Breath & heart', 3, 0),
        (9, '100 m/s', 'Nerves & sense', 3, 0),
        (10, '37.0 °C', 'Homeostasis', 3, 0),
        (11, 'A·T C·G', 'Twisted ladder', 4, 1),
        (12, '2n → n', 'Mitosis & meiosis', 4, 0),
        (13, '3 : 1', 'Mendel’s peas', 4, 0),
        (14, 'Δ allele', 'Selection', 4, 0),
        (15, 'Energy', 'Web of life', 4, 0),
    ]
    VOL_FILL = {
        1: '#16382C',  # Volume I: Kew Herbarium Forest
        2: '#6E4715',  # Volume II: Warm Amber & Ochre
        3: '#7A271E',  # Volume III: Arterial Copperplate
        4: '#194A38',  # Volume IV: Deep Botanical Emerald
    }
    W, H = 640, 530
    cw, ch, gap = 146, 118, 10
    f = Fig(W, H, 'Sixteen specimen tiles for the sixteen chapters of The Living World, grouped into four volumes from the dry seed to the thinking brain.')
    for n, sym, label, vol, hi in TILES:
        col = n % 4
        row = n // 4
        x = 12 + col * (cw + gap)
        y = 12 + row * (ch + gap)
        f.add(f'<g class="el on" style="--i:{n + 1}" data-ch="{n}">')
        cls = 'fill-vol' if hi else 'fill-ink'
        bg_style = f'style="fill:{VOL_FILL[vol]}"' if not hi else ''
        f.rect(x, y, cw, ch, cls, 8, extra=bg_style)
        # Inner copperplate folio keyline border
        f.rect(x + 4, y + 4, cw - 8, ch - 8, 'ln', 5, extra='style="stroke:var(--sheet);stroke-opacity:.24;stroke-width:1"')
        f.text(x + 10, y + 19, f'Ch {n} · Vol {["I","II","III","IV"][vol - 1]}', 't', 'start', 10.5, extra='style="fill:var(--sheet);opacity:.78"')
        _cover_emblem(f, n, x + 38, y + 61)
        fsz = 13 if len(sym) > 7 else 15 if len(sym) > 4 else 18
        f.text(x + 104, y + 66, sym, 't s', 'middle', fsz, 600, 'style="fill:var(--sheet)"')
        f.text(x + cw / 2, y + ch - 12, label, 't', 'middle', 12.5, 500, 'style="fill:var(--sheet);opacity:.92"')
        f.add('</g>')
    return f.svg()


@figure
def c0_redi_jars():
    f = Fig(640, 338, 'Francesco Redi’s three-jar controlled experiment in Florence (1668): Jar 1 open to air and flies grows maggots; Jar 2 sealed with wax blocks both flies and air; Jar 3 covered with fine gauze admits fresh air while stopping flies at the mesh.')
    jars = [
        (45, '1. Open jar (Control)', 'Air enters · Flies enter', True, 'open'),
        (245, '2. Sealed jar', 'No flies · No fresh air', False, 'sealed'),
        (445, '3. Gauze-covered jar', 'Fresh air enters · Flies blocked', False, 'gauze'),
    ]
    for x0, title, sub, has_maggots, mode in jars:
        f.text(x0 + 75, 24, title, 't b', 'middle', 13.5)
        f.text(x0 + 75, 42, sub, 't m', 'middle', 12)
        # Jar body
        f.rect(x0 + 20, 88, 110, 152, 'plate', rx=10)
        f.path(f'M{x0 + 32},88 L{x0 + 32},70 L{x0 + 118},70 L{x0 + 118},88', 'ln')
        f.rect(x0 + 20, 88, 110, 152, 'ln', rx=10)
        # Meat piece at bottom
        f.path(f'M{x0 + 36},222 C{x0 + 36},198 {x0 + 114},198 {x0 + 114},222 Z', 'wash-p')
        f.path(f'M{x0 + 36},222 C{x0 + 36},198 {x0 + 114},198 {x0 + 114},222 Z', 'ln p')
        f.text(x0 + 75, 217, 'raw meat', 't p', 'middle', 11.5)
        if mode == 'open':
            # Air arrows + flies entering + maggots on meat
            f.arrow(x0 + 55, 52, x0 + 55, 118, 'electron')
            f.arrow(x0 + 95, 52, x0 + 95, 118, 'electron')
            for fx, fy in ((x0 + 75, 145), (x0 + 52, 175)):
                f.circle(fx, fy, 3.5, 'fill-ink')
                f.path(f'M{fx-6},{fy-3} Q{fx},{fy-9} {fx+6},{fy-3}', 'ln m')
            for mx in (x0 + 52, x0 + 68, x0 + 84, x0 + 96):
                f.path(f'M{mx},201 Q{mx+4},195 {mx+8},201', 'ln b')
            f.text(x0 + 75, 262, 'Maggots hatch on meat', 't p', 'middle', 12.5, 600)
            f.text(x0 + 75, 280, '(flies laid eggs directly)', 't m', 'middle', 11.5)
        elif mode == 'sealed':
            # Heavy wax plug on neck
            f.rect(x0 + 26, 62, 98, 12, 'block', rx=3)
            f.text(x0 + 75, 57, 'wax & paper seal', 't m', 'middle', 11.5)
            f.text(x0 + 75, 150, 'No fresh air', 't m', 'middle', 12)
            f.text(x0 + 75, 262, 'Zero maggots', 't g', 'middle', 12.5, 600)
            f.text(x0 + 75, 280, '(but air was changed too!)', 't m', 'middle', 11.5)
        else:
            # Fine gauze mesh across neck + air arrows + eggs on top of gauze
            f.line(x0 + 24, 68, x0 + 126, 68, 'ln b')
            for gx in range(x0 + 30, x0 + 122, 6):
                f.line(gx, 64, gx, 72, 'ln m')
            f.arrow(x0 + 55, 48, x0 + 55, 118, 'electron')
            f.arrow(x0 + 95, 48, x0 + 95, 118, 'electron')
            # Fly and eggs on top of gauze
            f.circle(x0 + 75, 56, 3.5, 'fill-ink')
            for ex in (x0 + 66, x0 + 72, x0 + 82):
                f.circle(ex, 65, 1.8, 'pt-n')
            f.text(x0 + 75, 145, 'Fresh air flows in;', 't e', 'middle', 12)
            f.text(x0 + 75, 162, 'eggs trapped on gauze', 't m', 'middle', 12)
            f.text(x0 + 75, 262, 'Zero maggots on meat', 't g', 'middle', 12.5, 600)
            f.text(x0 + 75, 280, '(decisive control!)', 't g', 'middle', 11.5)
    f.text(320, 307, 'Both the open and gauze jars admit air.', 't', 'middle', 12.5)
    f.text(320, 326, 'Only the open jar lets flies reach the meat.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c0_leeuwenhoek_lens():
    f = Fig(640, 300, 'Left: Robert Hooke’s 1665 cork chambers ("cells"). Center: Antonie van Leeuwenhoek’s single-lens brass microscope with a 1.5 mm spherical glass bead lens. Right: Leeuwenhoek’s 1683 sketches of bacteria from his teeth.')
    # Left panel: Hooke's cork cells
    f.rect(18, 22, 185, 240, 'plate', rx=6)
    f.text(110, 44, 'Hooke’s cork (1665)', 't b', 'middle', 13.5)
    f.text(110, 61, 'Compound tube: ~30×', 't m', 'middle', 12)
    for row in range(5):
        for col in range(4):
            cx = 42 + col * 34 + (row % 2) * 6
            cy = 78 + row * 26
            f.rect(cx, cy, 30, 22, 'ln', rx=3)
    f.text(110, 228, 'Dead empty cell walls', 't m', 'middle', 12)
    f.text(110, 245, 'named "cells" (monks’ rooms)', 't m', 'middle', 11.5)

    # Middle panel: Leeuwenhoek's brass paddle
    f.rect(218, 22, 204, 240, 'plate', rx=6)
    f.text(320, 44, 'Leeuwenhoek’s paddle (1674)', 't b', 'middle', 13.5)
    f.text(320, 61, 'Single 1.5 mm glass bead: 270×', 't e', 'middle', 12)
    # Brass plate
    f.rect(262, 76, 64, 118, 'wash-n', rx=5)
    f.rect(262, 76, 64, 118, 'ln nn', rx=5)
    f.circle(294, 108, 7, 'pt-e')
    f.text(340, 105, '← 1.5 mm glass', 't e', 'start', 11.5)
    f.text(352, 119, 'bead lens', 't e', 'start', 11.5)
    # Specimen pin and focusing screw
    f.line(294, 116, 294, 178, 'ln')
    f.line(294, 178, 294, 218, 'ln b')
    f.rect(284, 206, 20, 10, 'block', rx=2)
    f.text(320, 238, 'Eye held right against the bead;', 't m', 'middle', 12)
    f.text(320, 253, 'screw moves sample within 1 mm', 't m', 'middle', 11.5)

    # Right panel: 1683 tooth bacteria
    f.rect(436, 22, 186, 240, 'plate', rx=6)
    f.text(529, 44, 'Tooth bacteria (1683)', 't b', 'middle', 13.5)
    f.text(529, 61, 'Resolution ~1.4 µm', 't m', 'middle', 12)
    # Rods (bacilli)
    f.rect(462, 86, 28, 10, 'wash-p', rx=5)
    f.rect(462, 86, 28, 10, 'ln p', rx=5)
    f.text(505, 95, 'Rods (bacilli)', 't', 'start', 12)
    # Tumbling path
    f.path('M465,125 C485,105 510,145 535,120', 'ln m dash')
    f.circle(465, 125, 3, 'pt-p')
    f.circle(535, 120, 3, 'pt-p')
    f.text(548, 125, 'swim track', 't m', 'start', 11.5)
    # Cocci
    for cx, cy in ((470, 158), (481, 155), (476, 166), (487, 164)):
        f.circle(cx, cy, 4.5, 'pt-e')
    f.text(505, 164, 'Spheres (cocci)', 't', 'start', 12)
    # Spirillum
    f.wave(458, 198, 42, 6, 14, cls='ln g')
    f.text(508, 202, 'Spirals (spirilla)', 't', 'start', 12)
    f.text(529, 242, 'Living microbes 1–5 µm long', 't g', 'middle', 12)
    f.text(320, 286, 'One tiny spherical bead beat large two-lens tubes because a single lens avoided compound lens blur.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c0_swan_neck():
    f = Fig(640, 290, 'Louis Pasteur’s 1859 swan-neck flask experiment in three steps: (1) boiling broth drives out air and kills microbes; (2) upright cooling traps dust in the lower U-bend while air enters; (3) tilting brings broth into the dust trap, causing microbial growth.')
    steps = [
        (22, '1. Boil the broth', 'Steam sterilises flask & neck'),
        (228, '2. Cool upright (open)', 'Dust settles in low U-bend'),
        (434, '3. Tilt into the bend', 'Broth touches trapped dust'),
    ]
    for idx, (x0, title, sub) in enumerate(steps):
        f.rect(x0, 18, 184, 232, 'plate', rx=6)
        f.text(x0 + 92, 38, title, 't b', 'middle', 13.5)
        f.text(x0 + 92, 55, sub, 't m', 'middle', 11.5)
        # Flask bulb
        cx, cy = x0 + 72, 168
        f.circle(cx, cy, 38, 'wash' if idx < 2 else 'wash-p')
        f.circle(cx, cy, 38, 'ln')
        # Broth level inside bulb
        f.path(f'M{cx - 34},{cy + 8} A38,38 0 0,0 {cx + 34},{cy + 8} Z', 'water' if idx < 2 else 'wash-p')
        # Swan neck S-curve
        f.path(f'M{cx},{cy - 38} L{cx},{cy - 68} C{cx},{cy - 92} {cx + 42},{cy - 92} {cx + 46},{cy - 54} '
               f'C{cx + 50},{cy - 18} {cx + 84},{cy - 18} {cx + 90},{cy - 58}', 'ln b')
        if idx == 0:
            # Flame arrows under bulb
            for fx in (cx - 16, cx, cx + 16):
                f.arrow(fx, 228, fx, 210, 'proton')
            f.text(cx, 240, 'heat (100 °C)', 't p', 'middle', 11.5)
        elif idx == 1:
            # Dust dots trapped in bottom of U-bend
            for dx, dy in ((cx + 58, cy - 28), (cx + 65, cy - 25), (cx + 72, cy - 28)):
                f.circle(dx, dy, 2.5, 'pt-p')
            f.text(x0 + 132, 172, 'dust & spores', 't p', 'middle', 11)
            f.text(x0 + 132, 190, 'trapped here', 't p', 'middle', 11)
            f.text(x0 + 92, 232, 'Broth stays clear for years', 't g', 'middle', 12, 600)
        else:
            # Broth splashed into bend and cloudy bacteria in bulb
            for bx, by in ((cx - 14, cy + 16), (cx, cy + 22), (cx + 14, cy + 15), (cx - 6, cy + 28), (cx + 8, cy + 26)):
                f.circle(bx, by, 2.5, 'pt-p')
            f.text(x0 + 92, 232, 'Cloudy with bacteria in 48 h', 't p', 'middle', 12, 600)
    f.text(320, 274, 'All three flasks stay open to the same room air—proving microbes ride on dust, not out of empty broth.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c0_scale_ladder():
    f = Fig(640, 270, 'The logarithmic ladder of biological sizes from 0.1 nm (atoms and water) to 10 mm (seeds and insects), showing which lens can resolve each scale.')
    f.rect(16, 18, 608, 224, 'plate', rx=6)
    # Logarithmic ruler from 10^-10 m to 10^-2 m
    x_left, x_right, y_bar = 48, 592, 132
    f.line(x_left, y_bar, x_right, y_bar, 'ln b')
    rungs = [
        (-10, '0.1 nm', 'H₂O molecule', '0.28 nm', -52, 'electron'),
        (-9, '1 nm', 'DNA helix', '2 nm wide', 44, 'electron'),
        (-8, '10 nm', 'Ribosome', '25 nm', -52, 'neutron'),
        (-7, '100 nm', 'Virus', '100 nm', 44, 'proton'),
        (-6, '1 µm', 'Bacterium', '2 µm', -52, 'green'),
        (-5, '10 µm', 'Red blood cell', '8 µm', 44, 'proton'),
        (-4, '100 µm', 'Plant cell', '50–100 µm', -52, 'green'),
        (-3, '1 mm', 'Mustard seed', '1.5 mm', 44, 'ink'),
        (-2, '10 mm', 'Moong bean', '4 mm', -52, 'ink'),
    ]
    for i, (exp, unit, name, sz, dy, col) in enumerate(rungs):
        x = x_left + i * (x_right - x_left) / (len(rungs) - 1)
        f.line(x, y_bar - 6, x, y_bar + 6, 'ln b')
        f.text(x, y_bar + (18 if dy < 0 else -10), unit, 't m', 'middle', 11.5)
        f.line(x, y_bar, x, y_bar + dy * 0.65, 'ln m dash')
        f.circle(x, y_bar, 4, {'electron': 'pt-e', 'neutron': 'pt-n', 'proton': 'pt-p', 'green': 'fill-vol', 'ink': 'fill-ink'}[col])
        ty = y_bar + dy
        f.text(x, ty, name, 't b', 'middle', 12)
        f.text(x, ty + (18 if dy > 0 else -18), sz, 't m', 'middle', 11)
    # Bracket ranges at bottom
    f.bracket_label(48, 320, 212, 'Electron microscope (0.1 nm – 1 µm)', 11.5, up=False)
    f.bracket_label(252, 524, 52, 'Light microscope (200 nm – 1 mm)', 11.5, up=True)
    f.bracket_label(456, 592, 212, 'Naked eye (> 0.1 mm)', 11.5, up=False)
    return f.svg()
