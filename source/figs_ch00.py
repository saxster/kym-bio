"""Figures for Chapter 0 (The detective's lens) and the 16-chapter cover art of The Living World."""
import math
from figs_core import Fig, figure


def _cover_emblem(f: Fig, n: int, cx: float, cy: float):
    """Draw a clean engraved biological icon at (cx, cy) for chapter tile n (0..15)."""
    f.add(f'<g transform="translate({cx},{cy})" style="stroke:var(--sheet);fill:none">')
    if n == 0:
        # Leeuwenhoek brass paddle microscope + microbe
        f.rect(-12, -22, 24, 36, 'ln', rx=3, extra='style="stroke:var(--sheet)"')
        f.circle(0, -8, 5, 'ln', extra='style="stroke:var(--sheet)"')
        f.line(0, 14, 0, 25, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 1:
        # Seed sprouting vs flame
        f.path('M-16,8 C-24,8 -24,-8 -12,-10 C-4,-10 -4,8 -16,8 Z', 'ln', extra='style="stroke:var(--sheet)"')
        f.path('M-10,0 Q-2,-16 6,-22 M-2,-10 Q6,-12 10,-6', 'ln', extra='style="stroke:var(--sheet)"')
        f.path('M14,14 C8,4 12,-8 18,-18 C24,-8 28,4 22,14 Z', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 2:
        # Plant/animal cell with nucleus
        f.rect(-22, -16, 44, 32, 'ln', rx=6, extra='style="stroke:var(--sheet)"')
        f.circle(-6, 0, 7, 'ln', extra='style="stroke:var(--sheet)"')
        f.circle(-6, 0, 2.5, 'fill-ink', extra='style="fill:var(--sheet)"')
        f.path('M8,-8 C16,-8 16,8 8,8 Z', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 3:
        # Osmosis semipermeable membrane + water molecules
        f.line(0, -22, 0, 22, 'ln dash', extra='style="stroke:var(--sheet)"')
        for x, y in ((-14, -10), (-10, 6), (-18, 12), (12, -6)):
            f.circle(x, y, 3, 'fill-ink', extra='style="fill:var(--sheet)"')
        f.circle(14, 10, 7, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 4:
        # Enzyme lock and substrate key
        f.path('M-18,-16 A18,18 0 1,0 -18,16 L-6,8 L-12,0 L-6,-8 Z', 'ln', extra='style="stroke:var(--sheet)"')
        f.path('M2,-8 L-4,0 L2,8 L14,8 L14,-8 Z', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 5:
        # Banyan leaf + sun rays
        f.path('M-18,14 C-18,-10 4,-20 18,-16 C14,-2 4,18 -18,14 Z', 'ln', extra='style="stroke:var(--sheet)"')
        f.line(-18, 14, 14, -12, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 6:
        # Mitochondrion cristae
        f.add('<ellipse cx="0" cy="0" rx="22" ry="13" style="stroke:var(--sheet);fill:none;stroke-width:1.6"/>')
        f.path('M-14,-8 L-10,5 L-4,-7 L2,6 L8,-7 L13,5', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 7:
        # Intestinal villi folds
        f.path('M-22,16 L-22,-6 Q-16,-18 -10,-6 L-10,10 Q-5,16 0,10 L0,-10 Q6,-22 12,-10 L12,16', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 8:
        # Four-chambered heart loop
        f.path('M0,18 C-22,4 -24,-14 -10,-16 C-3,-16 0,-10 0,-10 C0,-10 3,-16 10,-16 C24,-14 22,4 0,18 Z', 'ln', extra='style="stroke:var(--sheet)"')
        f.line(0, -10, 0, 16, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 9:
        # Neuron & action potential spike
        f.path('M-24,6 L-10,6 L-4,-18 L2,16 L8,2 L24,2', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 10:
        # Y-shaped Antibody
        f.path('M-16,-18 L0,-2 L16,-18 M0,-2 L0,18 M-12,-18 L-3,-9 M12,-18 L3,-9', 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 11:
        # DNA Double Helix
        f.path('M-20,-12 C-8,-24 8,24 20,12 M-20,12 C-8,24 8,-24 20,-12', 'ln', extra='style="stroke:var(--sheet)"')
        for x in (-12, -4, 4, 12):
            f.line(x, -7, x, 7, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 12:
        # Mitosis chromosome X
        f.path('M-12,-18 C-2,-4 -2,4 -12,18 M12,-18 C2,-4 2,4 12,18', 'ln', extra='style="stroke:var(--sheet)"')
        f.circle(0, 0, 3.5, 'fill-ink', extra='style="fill:var(--sheet)"')
    elif n == 13:
        # Punnett 2x2 grid
        f.rect(-16, -16, 32, 32, 'ln', rx=2, extra='style="stroke:var(--sheet)"')
        f.line(-16, 0, 16, 0, 'ln', extra='style="stroke:var(--sheet)"')
        f.line(0, -16, 0, 16, 'ln', extra='style="stroke:var(--sheet)"')
    elif n == 14:
        # Evolutionary branching tree
        f.path('M0,18 L0,4 M0,4 L-14,-8 M0,4 L14,-8 M-14,-8 L-20,-18 M-14,-8 L-6,-18 M14,-8 L8,-18 M14,-8 L20,-18', 'ln', extra='style="stroke:var(--sheet)"')
    else:
        # Trophic energy pyramid
        f.path('M-22,16 L22,16 L16,4 L-16,4 Z M-14,2 L14,2 L8,-8 L-8,-8 Z M-6,-10 L6,-10 L0,-20 Z', 'ln', extra='style="stroke:var(--sheet)"')
    f.add('</g>')


@figure
def cover_art():
    """Sixteen biology milestone tiles (Chapters 0 to 15) arranged across four volumes."""
    TILES = [
        (0, '270×', 'The lens', 1, 0),
        (1, 'ATP', 'Seed & flame', 1, 1),
        (2, 'SA / V', 'Nanotech cell', 1, 0),
        (3, 'Ψw', 'Salty sea', 1, 0),
        (4, 'Ea', 'Enzyme locks', 2, 0),
        (5, '6 CO₂', 'Green engine', 2, 1),
        (6, '32 ATP', 'Respiration', 2, 0),
        (7, 'pH 2', 'Digestion', 3, 0),
        (8, '2× pump', 'Breath & heart', 3, 0),
        (9, '100 m/s', 'Nerves & sense', 3, 0),
        (10, '37.0 °C', 'Homeostasis', 3, 0),
        (11, 'A=T G≡C', 'Twisted ladder', 4, 1),
        (12, '2n → n', 'Mitosis & meiosis', 4, 0),
        (13, '3 : 1', 'Mendel’s peas', 4, 0),
        (14, 'Δ allele', 'Selection', 4, 0),
        (15, '10%', 'Web of life', 4, 0),
    ]
    W, H = 640, 530
    cw, ch, gap = 146, 118, 10
    f = Fig(W, H, 'Sixteen tiles for the sixteen chapters of The Living World, grouped into four volumes from the dry seed to the thinking brain.')
    for n, sym, label, vol, hi in TILES:
        col = n % 4
        row = n // 4
        x = 12 + col * (cw + gap)
        y = 12 + row * (ch + gap)
        f.add(f'<g class="el on" style="--i:{n + 1}" data-ch="{n}">')
        cls = 'fill-vol' if hi else 'fill-ink'
        f.rect(x, y, cw, ch, cls, 6)
        f.text(x + 9, y + 18, f'Ch {n} · Vol {["I","II","III","IV"][vol - 1]}', 't', 'start', 10.5, extra='style="fill:var(--sheet);opacity:.72"')
        _cover_emblem(f, n, x + 36, y + 61)
        fsz = 13 if len(sym) > 7 else 15 if len(sym) > 4 else 18
        f.text(x + 102, y + 66, sym, 't s', 'middle', fsz, 600, 'style="fill:var(--sheet)"')
        f.text(x + cw / 2, y + ch - 12, label, 't', 'middle', 12.5, 500, 'style="fill:var(--sheet);opacity:.88"')
        f.add('</g>')
    return f.svg()


@figure
def c0_redi_jars():
    f = Fig(640, 320, 'Francesco Redi’s three-jar controlled experiment in Florence (1668): Jar 1 open to air and flies grows maggots; Jar 2 sealed with wax blocks both flies and air; Jar 3 covered with fine gauze admits fresh air while stopping flies at the mesh.')
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
    f.text(320, 308, 'Changing only one factor between Jar 1 and Jar 3 (access by flies, with air kept equal) proves flies are the cause.', 't', 'middle', 12.5)
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
            f.text(x0 + 132, 185, 'trapped here', 't p', 'middle', 11)
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
        f.text(x, ty + (14 if dy > 0 else -14), sz, 't m', 'middle', 11)
    # Bracket ranges at bottom
    f.bracket_label(48, 320, 212, 'Electron microscope (0.1 nm – 1 µm)', 11.5, up=False)
    f.bracket_label(252, 524, 52, 'Light microscope (200 nm – 1 mm)', 11.5, up=True)
    f.bracket_label(456, 592, 212, 'Naked eye (> 0.1 mm)', 11.5, up=False)
    return f.svg()
