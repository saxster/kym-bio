"""Figures for Chapter 1, The seed and the flame (What is life?)."""
import math
from figs_core import Fig, figure


@figure
def c1_monsoon_imbibition():
    f = Fig(640, 320, 'Comparison of a dry dormant moong seed (10% water, glassy cytoplasm, locked enzymes) and a hydrated germinating moong seed after monsoon rain (65% water, fluid cytoplasm, active enzymes, >2,000× oxygen uptake).')
    # Left panel: Dry dormant seed
    f.rect(18, 20, 288, 265, 'plate', rx=8)
    f.text(162, 42, 'Dry cupboard moong bean (May)', 't b', 'middle', 14)
    f.text(162, 60, '10% water · Vitreous sugar-glass state', 't m', 'middle', 12)
    # Seed outline (small)
    f.path('M82,126 C82,92 145,92 145,126 C145,156 82,156 82,126 Z', 'wash-n')
    f.path('M82,126 C82,92 145,92 145,126 C145,156 82,156 82,126 Z', 'ln nn')
    f.circle(114, 142, 2.5, 'fill-ink')
    f.text(114, 168, 'dry bean (4 mm)', 't m', 'middle', 11.5)
    # Magnifying loupe into glassy cytoplasm
    f.rect(168, 82, 122, 108, 'wash', rx=6)
    f.rect(168, 82, 122, 108, 'ln m dash', rx=6)
    f.text(229, 98, 'Glassy cytoplasm', 't b', 'middle', 11.5)
    for ex, ey in ((194, 124), (248, 130), (215, 160)):
        f.circle(ex, ey, 9, 'pt-n')
        f.text(ex, ey + 4, 'E', 'pt-sign', 'middle', 10, 700)
    for gx, gy in ((222, 118), (190, 156), (262, 160)):
        f.circle(gx, gy, 4.5, 'pt-p')
    f.text(229, 182, 'Enzymes locked still', 't m', 'middle', 11)
    # Readout bars at bottom
    f.text(34, 216, 'O₂ uptake: < 0.05 µL / g·h (near zero)', 't m', 'start', 12)
    f.text(34, 236, 'ATP turnover: paused (dormant)', 't m', 'start', 12)
    f.text(34, 256, 'Survives years in a dry jar', 't nn', 'start', 12, 600)

    # Right panel: Hydrated monsoon seed
    f.rect(334, 20, 288, 265, 'plate', rx=8)
    f.text(478, 42, 'Soaked moong bean (48 h after rain)', 't b', 'middle', 14)
    f.text(478, 60, '65% water · Liquid cytoplasm awake', 't e', 'middle', 12)
    # Swollen seed + emerging white radicle root
    f.path('M366,126 C366,80 452,80 452,126 C452,166 366,166 366,126 Z', 'wash-g')
    f.path('M366,126 C366,80 452,80 452,126 C452,166 366,166 366,126 Z', 'ln g')
    f.path('M422,148 C438,162 446,182 438,194 C430,186 424,168 414,152', 'plate')
    f.path('M422,148 C438,162 446,182 438,194 C430,186 424,168 414,152', 'ln b')
    f.text(398, 174, 'swollen 2.1× mass', 't g', 'middle', 11.5)
    f.text(445, 205, 'radicle root', 't b', 'middle', 11.5)
    # Magnifying loupe into liquid cytoplasm
    f.rect(484, 82, 124, 108, 'water', rx=6)
    f.rect(484, 82, 124, 108, 'ln e', rx=6)
    f.text(546, 98, 'Liquid H₂O solvent', 't e', 'middle', 11.5)
    for wx, wy in ((502, 114), (532, 142), (586, 118), (576, 166), (512, 170)):
        f.circle(wx, wy, 2.5, 'pt-e')
    f.circle(524, 128, 9, 'pt-n')
    f.text(524, 132, 'E', 'pt-sign', 'middle', 10, 700)
    f.arrow(556, 128, 536, 128, 'proton')
    f.circle(562, 128, 5, 'pt-p')
    f.text(546, 182, 'Rapid collisions & ATP!', 't e', 'middle', 11)
    # Readout bars
    f.text(350, 222, 'O₂ uptake: > 120 µL / g·h (> 2,000× spike!)', 't p', 'start', 12, 600)
    f.text(350, 240, 'Releases CO₂ + metabolic warmth (+1.5 °C)', 't', 'start', 12)
    f.text(350, 258, 'Builds new root cells in complete darkness', 't g', 'start', 12, 600)
    f.text(320, 304, 'Water is the key that melts the cytoplasmic glass so enzymes and fuel molecules can move and collide.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c1_seed_vs_flame():
    f = Fig(640, 340, 'Three-level comparison of a Candle Flame and a Living Seed: both oxidise carbon fuel using O₂ to release CO₂ and H₂O, but the flame scatters 100% of the energy as random thermal motion whereas the seed couples multi-step enzyme oxidation to ATP and DNA-guided construction.')
    # Left column: The Candle Flame
    f.rect(18, 18, 290, 290, 'plate', rx=8)
    f.text(163, 40, 'The Candle Flame (Non-living)', 't p', 'middle', 14, 700)
    f.text(163, 58, 'Uncontrolled 1-step combustion at ~1,000 °C', 't m', 'middle', 12)
    # Flame graphic + gas arrows
    f.rect(68, 126, 26, 48, 'block', rx=3)
    f.path('M81,126 C65,104 73,82 81,70 C89,82 97,104 81,126 Z', 'wash-p')
    f.path('M81,126 C65,104 73,82 81,70 C89,82 97,104 81,126 Z', 'ln p')
    f.arrow(36, 102, 66, 102, 'electron')
    f.text(32, 95, 'O₂ in', 't e', 'start', 11.5)
    f.arrow(96, 92, 128, 78, 'proton')
    f.text(132, 82, 'CO₂ + H₂O + heat', 't p', 'start', 11.5)
    # Energy cliff diagram
    f.rect(148, 96, 144, 110, 'wash', rx=5)
    f.text(220, 112, 'Energy drop', 't b', 'middle', 11.5)
    f.line(160, 128, 195, 128, 'ln b')
    f.arrow(195, 128, 235, 186, 'proton')
    f.line(235, 186, 278, 186, 'ln b')
    f.text(220, 158, '100% lost as', 't p', 'middle', 11.5, 600)
    f.text(220, 172, 'random heat', 't p', 'middle', 11.5, 600)
    f.text(34, 232, '• Destroys structure into scattered gas', 't', 'start', 12)
    f.text(34, 252, '• Zero cells, zero membranes, zero ATP', 't', 'start', 12)
    f.text(34, 272, '• Zero hereditary code (no DNA/RNA)', 't p', 'start', 12, 600)

    # Right column: The Germinating Seed Cell
    f.rect(332, 18, 290, 290, 'plate', rx=8)
    f.text(477, 40, 'The Living Seed Cell (Alive)', 't g', 'middle', 14, 700)
    f.text(477, 58, 'Coupled multi-step metabolism at 28 °C', 't m', 'middle', 12)
    # Stepwise enzyme staircase charging ATP
    f.rect(348, 82, 258, 124, 'wash-g', rx=5)
    f.text(477, 98, 'Enzyme staircase + ATP coupling', 't g', 'middle', 12, 600)
    steps_x = [362, 398, 434, 470, 506]
    steps_y = [116, 132, 148, 164, 180]
    for i in range(len(steps_x) - 1):
        f.line(steps_x[i], steps_y[i], steps_x[i + 1], steps_y[i], 'ln b')
        f.line(steps_x[i + 1], steps_y[i], steps_x[i + 1], steps_y[i + 1], 'ln g')
        f.circle(steps_x[i + 1], (steps_y[i] + steps_y[i + 1]) / 2, 4.5, 'pt-n')
    f.line(506, 180, 538, 180, 'ln b')
    f.curved_arrow(445, 145, 555, 125, bend=-18, kind='neutron')
    f.rect(544, 108, 52, 26, 'wash-n', rx=4)
    f.rect(544, 108, 52, 26, 'ln nn', rx=4)
    f.text(570, 125, 'ATP', 't nn', 'middle', 12, 700)
    f.arrow(570, 134, 570, 172, 'green')
    f.text(570, 188, 'Builds polymers', 't g', 'middle', 11, 600)
    f.text(348, 232, '• Uses ATP to build ordered cell walls & proteins', 't', 'start', 12)
    f.text(348, 252, '• Repairs damage and holds back entropy', 't', 'start', 12)
    f.text(348, 272, '• Reads & copies a 4-letter DNA blueprint', 't g', 'start', 12, 600)
    f.text(320, 326, 'Life is not a magic substance: it is ordinary chemistry coupled via ATP to self-repair and digital code.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c1_atp_cycle():
    f = Fig(640, 290, 'The structure of ATP (Adenine + Ribose + three negatively charged Phosphate groups) and the ATP/ADP recharge cycle discovered by Fiske and SubbaRow (1929).')
    # Left panel: ATP molecular schematic
    f.rect(18, 20, 300, 235, 'plate', rx=8)
    f.text(168, 42, 'Inside one ATP molecule', 't b', 'middle', 14)
    f.text(168, 59, 'Three repelling negative charges act like a cocked spring', 't m', 'middle', 11.5)
    # Adenine base
    f.rect(34, 96, 58, 44, 'wash-e', rx=6)
    f.rect(34, 96, 58, 44, 'ln e', rx=6)
    f.text(63, 122, 'Adenine', 't e', 'middle', 12, 600)
    # Bond to Ribose pentagon
    f.line(92, 118, 110, 118, 'ln b')
    f.path('M110,118 L128,96 L154,106 L154,132 L128,142 Z', 'wash')
    f.path('M110,118 L128,96 L154,106 L154,132 L128,142 Z', 'ln')
    f.text(135, 123, 'Ribose', 't', 'middle', 11.5)
    # Three phosphate groups with negative charges
    px_list = [184, 232, 280]
    for idx, px in enumerate(px_list):
        f.line(px - 28 if idx == 0 else px - 24, 118, px - 18, 118, 'ln b')
        cls = 'pt-p' if idx == 2 else 'pt-n'
        f.circle(px, 118, 18, cls)
        f.text(px, 123, 'P', 'pt-sign', 'middle', 14, 700)
        # Negative charge badge above
        f.circle(px, 90, 8, 'badge')
        f.text(px, 94, '−', 'badge-t', 'middle', 13, 700)
    # Repulsion arrows between the negative charges
    f.text(232, 74, '↔  ↔  mutual electric repulsion', 't p', 'middle', 11.5, 600)
    f.bracket_label(166, 298, 152, 'Triphosphate tail (3 phosphates)', 11.5, up=False)
    f.text(168, 206, 'When water hydrolyses the 3rd phosphate (P),', 't', 'middle', 12)
    f.text(168, 223, 'charge crowding drops → drives cellular machinery!', 't p', 'middle', 12, 600)

    # Right panel: The Recharge Cycle
    f.rect(336, 20, 286, 235, 'plate', rx=8)
    f.text(479, 42, 'The 800× daily recharge loop', 't b', 'middle', 14)
    f.text(479, 59, '50 g pool in your body turns over ~40 kg/day', 't m', 'middle', 11.5)
    # Top badge: ATP (charged)
    f.rect(424, 74, 110, 34, 'wash-p', rx=6)
    f.rect(424, 74, 110, 34, 'ln p', rx=6)
    f.text(479, 96, 'ATP (charged)', 't p', 'middle', 13, 700)
    # Bottom badge: ADP + Pi (spent)
    f.rect(414, 192, 130, 34, 'wash', rx=6)
    f.rect(414, 192, 130, 34, 'ln m', rx=6)
    f.text(479, 214, 'ADP + Pᵢ (spent)', 't m', 'middle', 13, 600)
    # Left curve: Respiration recharges
    f.curved_arrow(414, 204, 424, 92, bend=-48, kind='green')
    f.text(384, 142, 'Cellular', 't g', 'middle', 11.5, 600)
    f.text(384, 156, 'respiration', 't g', 'middle', 11.5, 600)
    f.text(384, 170, '(glucose + O₂)', 't m', 'middle', 11)
    # Right curve: Cellular work spends
    f.curved_arrow(534, 92, 544, 204, bend=-48, kind='proton')
    f.text(576, 138, 'Cellular work:', 't p', 'middle', 11.5, 600)
    f.text(576, 152, 'proteins, nerves,', 't m', 'middle', 11)
    f.text(576, 166, 'muscle, pumps', 't m', 'middle', 11)
    f.text(320, 274, 'Discovered in 1929 by Yellapragada SubbaRow and Cyrus Fiske (and Karl Lohmann).', 't', 'middle', 12.5)
    return f.svg()


@figure
def c1_mrs_gren_engine():
    f = Fig(640, 280, 'The seven MRS GREN characteristics connected as a single self-maintaining cellular system, distinguishing true metabolic Excretion from gut Egestion.')
    f.rect(16, 16, 608, 232, 'plate', rx=8)
    # Central Living Cell / Organism Hub
    f.rect(225, 72, 190, 116, 'wash-g', rx=10)
    f.rect(225, 72, 190, 116, 'ln g', rx=10)
    f.text(320, 96, 'LIVING ORGANISM', 't g', 'middle', 13.5, 700)
    f.text(320, 116, '2. RESPIRATION', 't p', 'middle', 12.5, 700)
    f.text(320, 132, '(Fuel → ATP in every cell)', 't m', 'middle', 11.5)
    f.text(320, 154, '6. GROWTH (+dry mass)', 't b', 'middle', 12)
    f.text(320, 172, '7. REPRODUCTION (DNA)', 't e', 'middle', 12)

    # Left: Inputs (Nutrition & Sensitivity)
    f.rect(32, 42, 148, 66, 'wash-n', rx=6)
    f.rect(32, 42, 148, 66, 'ln nn', rx=6)
    f.text(106, 64, '1. NUTRITION', 't nn', 'middle', 12.5, 700)
    f.text(106, 81, 'Takes in matter &', 't m', 'middle', 11.5)
    f.text(106, 95, 'energy (food / light)', 't m', 'middle', 11.5)
    f.arrow(180, 78, 222, 102, 'neutron')

    f.rect(32, 138, 148, 86, 'wash-e', rx=6)
    f.rect(32, 138, 148, 86, 'ln e', rx=6)
    f.text(106, 160, '4. SENSITIVITY &', 't e', 'middle', 12.5, 700)
    f.text(106, 176, '5. MOVEMENT', 't e', 'middle', 12.5, 700)
    f.text(106, 194, 'Detects stimuli & moves', 't m', 'middle', 11.5)
    f.text(106, 208, 'towards resources', 't m', 'middle', 11.5)
    f.arrow(180, 176, 222, 152, 'electron')

    # Right: Outputs (Excretion vs Egestion warning)
    f.rect(460, 42, 148, 82, 'wash-p', rx=6)
    f.rect(460, 42, 148, 82, 'ln p', rx=6)
    f.text(534, 62, '3. EXCRETION', 't p', 'middle', 12.5, 700)
    f.text(534, 79, 'Removes metabolic', 't m', 'middle', 11.5)
    f.text(534, 93, 'waste made IN cells:', 't m', 'middle', 11.5)
    f.text(534, 109, 'CO₂ (lungs), urea (urine)', 't p', 'middle', 11.5, 600)
    f.arrow(415, 102, 457, 82, 'proton')

    f.rect(460, 142, 148, 82, 'wash', rx=6)
    f.rect(460, 142, 148, 82, 'ln m dash', rx=6)
    f.text(534, 162, 'NOT Excretion:', 't b', 'middle', 12)
    f.text(534, 178, 'EGESTION (faeces)', 't m', 'middle', 12, 600)
    f.text(534, 195, 'Undigested fibre that', 't m', 'middle', 11)
    f.text(534, 209, 'never entered a cell!', 't m', 'middle', 11)
    f.text(320, 266, 'Every MRS GREN process is a physical requirement to keep a cellular machine far from thermal equilibrium.', 't', 'middle', 12.5)
    return f.svg()


@figure
def c1_virus_border():
    f = Fig(640, 300, 'Side-by-side comparison of a living Bacterial Cell (~2,000 nm) with its own membrane, cytoplasm, ribosomes, ATP generators and DNA chromosome versus two non-living Viruses (~100 nm, enlarged to show structure) consisting only of a protein coat (capsid) and nucleic acid.')
    # Left panel: Bacterium (Alive)
    f.rect(18, 20, 300, 245, 'plate', rx=8)
    f.text(168, 42, 'Living Bacterium (Prokaryote)', 't g', 'middle', 14, 700)
    f.text(168, 59, 'Actual length: ~2,000 nm (2 µm) · Complete factory', 't m', 'middle', 11.5)
    # Capsule & cell wall + membrane
    f.rect(48, 82, 200, 96, 'wash-g', rx=48)
    f.rect(48, 82, 200, 96, 'ln g', rx=48)
    f.rect(55, 89, 186, 82, 'ln', rx=41)
    # Circular DNA nucleoid tangle
    f.path('M95,128 C110,104 145,108 155,128 C165,148 120,156 105,136 C90,116 135,112 142,135', 'ln p')
    f.text(126, 128, 'DNA', 't p', 'middle', 11, 700)
    # Plasmid ring
    f.circle(196, 118, 11, 'ln e')
    f.text(196, 142, 'plasmid', 't e', 'middle', 10.5)
    # Ribosomes (dots)
    for rx, ry in ((78, 112), (84, 144), (168, 108), (172, 148), (214, 130)):
        f.circle(rx, ry, 3, 'fill-ink')
    # Flagellum tail
    f.wave(248, 130, 52, 8, 26, cls='ln b')
    f.text(34, 202, '✓ Cell wall + plasma membrane + cytoplasm', 't g', 'start', 12, 600)
    f.text(34, 222, '✓ Own ribosomes (prints its own proteins)', 't', 'start', 12)
    f.text(34, 242, '✓ Makes its own ATP & divides on its own', 't', 'start', 12)

    # Right panel: Viruses (Borderline / Non-living in IGCSE)
    f.rect(334, 20, 288, 245, 'plate', rx=8)
    f.text(478, 42, 'Viruses (Biological Software)', 't p', 'middle', 14, 700)
    f.text(478, 59, 'Actual width: ~80–120 nm (enlarged 10× here)', 't m', 'middle', 11.5)
    # Bacteriophage on left side of right panel
    px, py = 406, 110
    f.path(f'M{px},{py - 26} L{px + 20},{py - 12} L{px + 20},{py + 10} L{px},{py + 24} L{px - 20},{py + 10} L{px - 20},{py - 12} Z', 'wash-p')
    f.path(f'M{px},{py - 26} L{px + 20},{py - 12} L{px + 20},{py + 10} L{px},{py + 24} L{px - 20},{py + 10} L{px - 20},{py - 12} Z', 'ln p')
    f.path(f'M{px - 8},{py - 6} Q{px},{py - 16} {px + 8},{py - 4} Q{px},{py + 8} {px - 8},{py + 2}', 'ln e')
    f.line(px, py + 24, px, py + 52, 'ln b')
    for lx in (-18, -10, 10, 18):
        f.path(f'M{px},{py + 46} L{px + lx},{py + 64}', 'ln')
    f.text(px, 188, 'Phage (capsid + DNA)', 't m', 'middle', 11)

    # Enveloped virus on right side of right panel
    vx, vy = 542, 128
    f.circle(vx, vy, 28, 'wash-n')
    f.circle(vx, vy, 28, 'ln nn')
    f.circle(vx, vy, 19, 'ln p dash')
    f.wave(vx - 12, vy, 24, 5, 12, cls='ln e')
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        f.line(vx + 28 * math.cos(rad), vy + 28 * math.sin(rad),
               vx + 36 * math.cos(rad), vy + 36 * math.sin(rad), 'ln p')
    f.text(vx, 188, 'RNA virus (capsid + spikes)', 't m', 'middle', 11)

    f.text(348, 208, '✗ No cytoplasm, no cell membrane, no ATP', 't p', 'start', 12, 600)
    f.text(348, 226, '✗ Zero ribosomes (cannot print proteins)', 't', 'start', 12)
    f.text(348, 244, '✓ Protein coat + DNA or RNA (hijacks host)', 't e', 'start', 12, 600)
    f.text(320, 284, 'Because viruses lack cells, ribosomes and metabolism, IGCSE classifies them outside the Five Kingdoms.', 't', 'middle', 12.5)
    return f.svg()
