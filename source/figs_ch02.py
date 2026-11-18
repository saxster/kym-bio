"""Original, theme-aware Herbarium & Copperplate teaching plates for Chapter 2."""
from figs_core import Fig, figure
from bio_figs_core import draw_mitochondrion, draw_chloroplast, draw_nucleus_and_er


def _mito(f, x, y, w=42, h=23):
    draw_mitochondrion(f, x + w / 2, y + h / 2, w / 2, h / 2)


def _cell(f, x, kind):
    plant = (kind == 'plant')
    bacteria = (kind == 'bacteria')
    if plant:
        # Outer cellulose cell wall + inner plasma membrane + cytoplasmic wash
        f.rect(x, 62, 170, 128, 'wash-g', 12)
        f.rect(x, 62, 170, 128, 'ln g', 12)
        f.rect(x + 6, 68, 158, 116, 'plate', 9)
        # Turgid central sap vacuole with tonoplast membrane
        f.rect(x + 56, 88, 86, 74, 'wash-e', 14)
        f.rect(x + 56, 88, 86, 74, 'ln e', 14, extra='stroke-opacity=".55"')
        f.text(x + 99, 130, 'sap', 't e', 'middle', 14)
        # Stacked-grana chloroplasts around periphery
        for cx, cy, rot in [(x + 31, 82, -12), (x + 138, 78, 10), (x + 134, 171, -8)]:
            draw_chloroplast(f, cx, cy, 14, 7.5, rot)
        # Nucleus + ER + Mitochondrion in plant cell
        draw_nucleus_and_er(f, x + 30, 138, 16, with_er=True)
        draw_mitochondrion(f, x + 76, 76, 17, 8.5)
        f.text(x + 85, 211, 'Nucleus + mitochondria', 't', 'middle', 13)
    elif bacteria:
        # Peptidoglycan capsule wall + inner plasma membrane + flagellum
        f.rect(x + 5, 78, 154, 96, 'wash-e', 42)
        f.rect(x + 5, 78, 154, 96, 'plate', 42)
        f.rect(x + 11, 84, 142, 84, 'ln e', 36)
        # Coiled circular bacterial chromosome (nucleoid) + plasmids
        f.path(f'M{x + 44},122 c-16,-24 54,-24 64,2 s-60,34 -64,-2 Z', 'ln p')
        f.path(f'M{x + 54},120 c12,-14 38,14 44,-2', 'ln p')
        f.circle(x + 124, 112, 8, 'ln p')
        f.circle(x + 128, 142, 6.5, 'ln p')
        f.path(f'M{x + 159},126 q10,-12 18,0', 'ln e')
        f.text(x + 84, 204, 'DNA ring + plasmid', 't p', 'middle', 14)
    else:
        # Animal cell: curved organic plasma membrane + nucleus/ER + 2 cristae mitochondria + Golgi
        f.rect(x + 5, 65, 160, 126, 'plate', 46)
        f.rect(x + 9, 69, 152, 118, 'wash', 42)
        draw_nucleus_and_er(f, x + 46, 134, 20, with_er=True)
        draw_mitochondrion(f, x + 92, 86, 20, 10, -10)
        draw_mitochondrion(f, x + 128, 146, 18, 9, 14)
        f.text(x + 84, 211, 'Nucleus + mitochondria', 't', 'middle', 13)

    # Ribosomes (70S/80S protein printers)
    for dx, dy in [(26, 96), (52, 168), (144, 150), (138, 108), (74, 152), (108, 174), (96, 116)]:
        if bacteria and dy > 164:
            continue
        if plant and 54 < dx < 144 and 86 < dy < 164:
            continue
        f.circle(x + dx, dy, 2.2, 'fill-ink')


@figure
def c2_cell_inventory():
    f = Fig(640, 340, 'Three schematic cell cutaways: animal and green leaf cells have nuclei and mitochondria; a bacterium has exposed DNA and a plasmid. All have membranes, cytoplasm and ribosomes. Sizes are not to scale.')
    for x, title, kind in [(25, 'Animal cell', 'animal'), (235, 'Green leaf cell', 'plant'), (445, 'Bacterial cell', 'bacteria')]:
        f.text(x + 85, 35, title, 't s', 'middle', 17)
        _cell(f, x, kind)
    f.text(320, 239, 'Shared: cell membrane · cytoplasm · ribosomes (dots)', 't b', 'middle', 15)
    f.line(25, 253, 615, 253, 'ln m')
    f.lines(30, 277, ['Plant wall: cellulose outside membrane', 'Green leaf: chloroplasts + large vacuole'], 't', size=14, lh=1.6)
    f.lines(355, 277, ['Bacterial wall: different material', 'White onion bulb: no chloroplasts'], 't', size=14, lh=1.6)
    f.text(320, 328, 'Cutaways; ribosomes and membranes enlarged; molecular crowding omitted for clarity.', 't m', 'middle', 12)
    return f.svg()


@figure
def c2_stowaway_clues():
    f = Fig(640, 340, 'Mitochondrion and chloroplast cutaways beside four independent ancestry clues: surrounding membranes, DNA, bacterial-related ribosomes and division. Gene comparisons provide stronger ancestry evidence than shape alone.')
    f.text(125, 29, 'Mitochondrion', 't s', 'middle', 17)
    draw_mitochondrion(f, 125, 91, 80, 38)
    f.circle(82, 91, 10, 'ln p')
    f.circle(156, 86, 2.2, 'fill-ink')
    f.circle(164, 95, 2.2, 'fill-ink')
    f.text(125, 156, 'Folded inner membrane', 't', 'middle', 14)

    f.text(125, 193, 'Chloroplast', 't s', 'middle', 17)
    draw_chloroplast(f, 125, 249, 80, 38)
    f.circle(68, 262, 8, 'ln p')
    f.line(245, 36, 245, 297, 'ln m')
    rows = [
        ('1 · Two outer boundaries', 'Membranes around the compartment'),
        ('2 · DNA inside', 'Part of its own inherited recipe'),
        ('3 · Bacterial relatives', 'Ribosomes and gene sequences'),
        ('4 · Division', 'New organelles from existing ones'),
    ]
    for i, (a, b) in enumerate(rows):
        y = 55 + i * 62
        f.text(273, y, a, 't b', size=15)
        f.text(273, y + 23, b, 't m', size=14)
    f.text(320, 323, 'Evidence combined → bacterial ancestry; drawings are enlarged reconstructions.', 't', 'middle', 14)
    return f.svg()


def _cube(f, x, y, s):
    d = s * .32
    # Isometric 3-face shaded agar cube + inner diffusion core indicator on the large 10 cm block
    f.rect(x, y, s, s, 'wash-e', 0)
    f.path(f'M{x},{y} l{d},{-d} h{s} l{-d},{d} Z', 'wash-g')
    f.path(f'M{x},{y} l{d},{-d} h{s} l{-d},{d} Z', 'ln e')
    f.path(f'M{x + s},{y} l{d},{-d} v{s} l{-d},{d} Z', 'wash-e')
    f.path(f'M{x + s},{y} l{d},{-d} v{s} l{-d},{d} Z', 'ln e')
    f.rect(x, y, s, s, 'ln e', 0)
    if s > 80:
        # Show the unreached interior core inside the 10 cm cube
        inset = s * 0.22
        f.rect(x + inset, y + inset, s - 2 * inset, s - 2 * inset, 'wash-p', 3)
        f.rect(x + inset, y + inset, s - 2 * inset, s - 2 * inset, 'ln p dash', 3)
    for i in range(1, 5):
        z = i * s / 5
        f.line(x + z, y, x + z, y + s, 'ln m', extra='opacity=".35"')
        f.line(x, y + z, x + s, y + z, 'ln m', extra='opacity=".25"')
    return f


@figure
def c2_geometry():
    f = Fig(640, 340, 'Cubes with sides 1, 2 and 10 centimetres drawn at the same scale. Surface areas are 6, 24 and 600 square centimetres; volumes 1, 8 and 1000 cubic centimetres; ratios 6, 3 and 0.6 inverse centimetres.')
    f.text(320, 26, 'Same shape · tenfold side · thousandfold interior', 't s', 'middle', 17)
    for x, a in [(70, 1), (245, 2), (440, 10)]:
        _cube(f, x, 209 - 13 * a, 13 * a)
        f.text(x + 13 * a / 2, 230, f'{a} cm side', 't b', 'middle', 15)
    f.line(28, 239, 612, 239, 'ln m')
    for x, area, vol, ratio in [(77, 6, 1, '6'), (258, 24, 8, '3'), (505, 600, 1000, '0.6')]:
        f.lines(x, 263, [f'Area {area} cm²', f'Volume {vol} cm³', f'SA/V = {ratio} cm⁻¹'], 't', 'middle', 14, 1.5)
    f.text(320, 333, 'Geometry model in centimetres; these cubes are not actual cells.', 't m', 'middle', 12)
    return f.svg()


@figure
def c2_specialists():
    f = Fig(640, 340, 'Five specialised cells: biconcave red blood cell, root hair extension, cilia moving mucus, chloroplast-rich palisade cell and branching neurone. Below: cell to tissue to organ to system to organism.')
    # 1. Biconcave Red Blood Cell (no nucleus, haemoglobin-packed disc)
    f.path('M30,99 C35,67 101,67 106,99 C101,129 35,129 30,99 Z', 'wash-p')
    f.path('M30,99 C35,67 101,67 106,99 C101,129 35,129 30,99 Z', 'ln p')
    f.path('M44,98 Q68,82 92,98 Q68,114 44,98', 'ln p')
    f.lines(68, 155, ['Red blood cell', 'Thin, flexible disc', 'Oxygen transport'], 't', 'middle', 13, 1.6)

    # 2. Root Hair Cell with vacuole extension & soil mineral arrows
    f.path('M147,75 h48 v15 h27 q25,0 25,10 q0,10 -25,10 h-27 v21 h-48 Z', 'wash-g')
    f.path('M147,75 h48 v15 h27 q25,0 25,10 q0,10 -25,10 h-27 v21 h-48 Z', 'ln g')
    f.path('M157,84 h32 v10 h26 q14,0 14,6 q0,6 -14,6 h-26 v14 h-32 Z', 'wash-e')
    f.circle(163, 99, 7.5, 'ln p')
    f.lines(192, 155, ['Root hair cell', 'Long extension', 'More contact area'], 't', 'middle', 13, 1.6)

    # 3. Ciliated Epithelial Cell with basal bodies & mucus blanket
    f.rect(279, 83, 45, 46, 'plate', 4)
    f.circle(301, 110, 8, 'wash-p')
    f.circle(301, 110, 8, 'ln p')
    for xx in range(282, 324, 6):
        f.path(f'M{xx},83 q-7,-14 2,-26', 'ln')
    f.arrow(278, 43, 333, 43, 'e')
    f.text(303, 28, 'mucus', 't e', 'middle', 13)
    f.lines(309, 155, ['Ciliated cell', 'Beating hairs', 'Move mucus'], 't', 'middle', 13, 1.6)

    # 4. Palisade Mesophyll Cell with stacked grana & central vacuole
    f.rect(382, 59, 48, 72, 'wash-g', 5)
    f.rect(382, 59, 48, 72, 'ln g', 5)
    f.rect(396, 70, 20, 44, 'wash-e', 5)
    for yy in [68, 87, 107]:
        f.rect(386, yy, 8, 6, 'fill-vol', 2, extra='style="fill:var(--green)"')
        f.rect(418, yy, 8, 6, 'fill-vol', 2, extra='style="fill:var(--green)"')
    f.circle(406, 121, 5.5, 'ln p')
    f.lines(408, 155, ['Palisade cell', 'Chloroplasts', 'Capture light'], 't', 'middle', 13, 1.6)

    # 5. Myelinated Neurone with dendrites, soma, myelin sheaths & axon terminals
    f.circle(510, 95, 15, 'wash-n')
    f.circle(510, 95, 15, 'ln nn')
    f.circle(510, 95, 5, 'fill-ink')
    for dx, dy in [(-26, -25), (-28, 2), (-20, 30)]:
        f.path(f'M510,95 l{dx},{dy} l-12,-6 m12,6 l-8,10', 'ln nn')
    f.path('M525,95 h64 l15,-16 m-15,16 l15,16', 'ln nn')
    for mx in (532, 552, 572):
        f.rect(mx, 90, 14, 10, 'wash-e', 3)
        f.rect(mx, 90, 14, 10, 'ln e', 3)
    f.lines(552, 155, ['Neurone', 'Long, narrow axon', 'Conduct impulses'], 't', 'middle', 13, 1.6)

    f.line(25, 222, 615, 222, 'ln m')
    f.text(320, 248, 'Palisade cell → palisade tissue → leaf → shoot system → bean plant', 't', 'middle', 14)
    f.text(320, 277, 'cell → tissue → organ → organ system → organism', 't b', 'middle', 15)
    f.text(320, 318, 'Schematic profiles at different enlargements; no shared scale.', 't m', 'middle', 13)
    return f.svg()
