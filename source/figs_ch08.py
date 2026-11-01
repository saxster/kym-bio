"""Original Chapter 8 paper plates. See grounding/ch08.md for source/model limits."""
import math
from figs_core import Fig, figure


def heading(f, title, sub):
    f.text(320, 29, title, 't s', 'middle', 21)
    f.text(320, 55, sub, 't m', 'middle', 12.5)


def box(f, x, y, w, h, rows, cls='plate', size=13.5):
    f.rect(x, y, w, h, cls, 9)
    rows = [rows] if isinstance(rows, str) else rows
    gap = size * 1.38
    for i, s in enumerate(rows):
        f.text(x + w / 2, y + h / 2 + (i - (len(rows) - 1) / 2) * gap + size * .34, s, 't', 'middle', size)


@figure
def c8_airway_mucociliary():
    f = Fig(640, 610, 'Conducting airway tree from nasal cavity, pharynx, larynx and cartilage-ringed trachea to left and right bronchi, bronchioles and alveolar sacs surrounded by capillaries, paired with an enlarged schematic of the mucociliary escalator showing goblet cells secreting mucus and ciliated epithelial cells sweeping trapped dust and bacteria upward towards the throat.')
    heading(f, 'A branching airway and a self-cleaning lining', 'Schematic route to the alveoli · enlarged airway lining below is not to the same scale')

    # Upper panel: Conducting route from nose/mouth to alveoli
    f.text(320, 88, '1 · ROUTE FROM OUTSIDE AIR TO THE GAS-EXCHANGE SURFACE', 't b', 'middle', 14.5)
    routes = [
        (106, 'Nose / mouth · warms, moistens and filters air', 'plate'),
        (162, 'Pharynx → larynx (throat and voice box)', 'plate'),
        (218, 'Trachea · C-shaped cartilage rings keep airway open', 'wash-e'),
    ]
    for y, lbl, cls in routes:
        box(f, 36, y, 376, 42, lbl, cls, 13)
    f.arrow(224, 149, 224, 160, 'ink')
    f.arrow(224, 205, 224, 216, 'ink')

    # Branching into left and right bronchi -> bronchioles -> alveoli
    f.arrow(166, 261, 124, 282, 'electron', width=2)
    f.arrow(282, 261, 324, 282, 'electron', width=2)
    box(f, 36, 285, 178, 42, 'Right bronchus → bronchioles', 'wash-e', 12.2)
    box(f, 234, 285, 178, 42, 'Left bronchus → bronchioles', 'wash-e', 12.2)
    f.arrow(125, 328, 125, 346, 'green', width=2)
    f.arrow(323, 328, 323, 346, 'green', width=2)
    box(f, 36, 349, 376, 48, ['Alveoli wrapped in pulmonary capillaries', 'Moist, one-cell-thick gas-exchange sacs'], 'wash-g', 13)

    # Right-side inset: Trachea C-shaped cartilage ring cross-section + thorax framing
    f.rect(430, 106, 178, 164, 'plate', 9)
    f.text(519, 128, 'TRACHEA CROSS-SECTION', 't b', 'middle', 12.5)
    f.path('M487,206 A36,36 0 1 1 551,206', 'ln e', extra='stroke-width="8" fill="none"')
    f.line(487, 206, 551, 206, 'ln p', extra='stroke-dasharray="4 3" stroke-width="2.5"')
    f.text(519, 182, 'air lumen', 't', 'middle', 12.5)
    f.text(519, 232, 'C-ring of cartilage', 't e', 'middle', 12.5)
    f.text(519, 252, 'Soft back next to oesophagus', 't m', 'middle', 11.5)

    f.rect(430, 285, 178, 112, 'wash-n', 9)
    f.lines(519, 311, [
        'Ribs + intercostal muscles',
        'form the chest cage;',
        'the muscular diaphragm',
        'forms the curved floor.',
    ], 't', 'middle', 12.5, lh=1.42)

    f.line(28, 414, 612, 414, 'ln r')

    # Lower panel: Mucociliary escalator (0610 11.1.7)
    f.text(320, 432, '2 · PROTECTING THE AIRWAYS: GOBLET CELLS, MUCUS AND CILIA', 't b', 'middle', 14.5)
    # Sticky mucus blanket with trapped particles moving towards throat
    f.rect(36, 468, 318, 28, 'wash-n', 6)
    f.text(158, 486, 'Sticky mucus traps dust and bacteria', 't b', 'middle', 12)
    for px in [286, 312, 338]:
        f.circle(px, 482, 5, 'wash-p', extra='stroke="var(--proton)" stroke-width="1.2"')
    f.arrow(254, 456, 344, 456, 'green', width=2)
    f.text(192, 460, 'swept to throat', 't g', 'middle', 11.5)

    # Cilia hair-like projections
    for cx in range(46, 346, 12):
        if 162 <= cx <= 214:
            continue
        f.path(f'M{cx},512 Q{cx+4},500 {cx+9},494', 'ln g', extra='stroke-width="2" fill="none"')

    # Epithelial cells row: ciliated cells + goblet cell in centre
    for x0 in [38, 100, 162, 224, 286]:
        if x0 == 162:
            f.rect(x0, 512, 58, 58, 'wash-n', 5, extra='stroke="var(--neutron)" stroke-width="1.4"')
            f.text(x0 + 29, 538, 'Goblet', 't b', 'middle', 12.2)
            f.text(x0 + 29, 555, 'cell', 't', 'middle', 12)
        else:
            f.rect(x0, 512, 58, 58, 'wash-e', 5, extra='stroke="var(--electron)" stroke-width="1"')
            f.text(x0 + 29, 545, 'Ciliated', 't e', 'middle', 12)

    f.lines(368, 478, [
        '• Goblet cells secrete sticky mucus',
        '  that traps dust and pathogens.',
        '• Cilia beat in coordinated waves',
        '  to sweep mucus up to the throat',
        '  to be swallowed (0610 11.1.7).',
    ], 't', 'start', 12.8, lh=1.42)

    f.text(320, 596, 'Ventilation moves air along these tubes; gas exchange happens only at the alveoli.', 't m', 'middle', 12.5)
    return f.svg()


@figure
def c8_thorax_pressure_cycle():
    f = Fig(640, 625, 'Comparison of quiet inhalation and exhalation mechanics with alveolar and pleural gauge pressures and a bell-jar model critique. During inhalation, external intercostals lift ribs up and out and diaphragm contracts and flattens downward, increasing thoracic volume and lowering alveolar pressure slightly below atmospheric (-1 mmHg) so outside air pushes in. During quiet exhalation, muscles relax and elastic lung recoil shrinks volume (+1 mmHg); forced exhalation uses internal intercostals and abdominal muscles. Bell-jar model shows diaphragm sheet lowering pressure but has rigid jar walls and a wide air gap instead of moving ribs and a thin fluid-coupled pleural space.')
    heading(f, 'How muscles change volume so air pressure moves the breath', 'Gauge pressures relative to outside atmospheric pressure (760 mmHg = 0 mmHg reference)')

    # Top: Side-by-side Quiet Inhalation vs Exhalation
    f.text(164, 90, '1 · INHALATION (VOLUME INCREASES)', 't b', 'middle', 14)
    f.text(476, 90, '2 · EXHALATION (VOLUME DECREASES)', 't b', 'middle', 14)

    # Left box: Inhalation
    f.rect(28, 102, 272, 224, 'wash-g', 10)
    f.rect(156, 114, 16, 28, 'plate', 2)
    f.arrow(164, 106, 164, 138, 'green', width=2.5)
    f.path('M76,144 C56,168 56,212 72,240', 'ln', extra='stroke-width="3" fill="none"')
    f.path('M252,144 C272,168 272,212 256,240', 'ln', extra='stroke-width="3" fill="none"')
    f.arrow(66, 184, 44, 168, 'electron', width=2)
    f.arrow(262, 184, 284, 168, 'electron', width=2)
    f.rect(86, 146, 68, 76, 'plate', 16)
    f.rect(174, 146, 68, 76, 'plate', 16)
    f.text(120, 182, 'P_alv', 't b', 'middle', 13)
    f.text(120, 200, '−1 mmHg', 't g', 'middle', 12.5)
    f.text(208, 182, 'P_ip', 't b', 'middle', 13)
    f.text(208, 200, '−6 mmHg', 't e', 'middle', 12.5)
    f.path('M72,242 Q164,230 256,242', 'ln p', extra='stroke-width="4" fill="none"')
    f.arrow(164, 232, 164, 256, 'proton', width=2)
    f.lines(164, 274, [
        'External intercostals lift ribs up and out;',
        'diaphragm contracts and flattens down.',
        'Higher outside P_atm pushes air in.',
    ], 't', 'middle', 12.4, lh=1.35)

    # Right box: Exhalation
    f.rect(340, 102, 272, 224, 'wash-e', 10)
    f.rect(468, 114, 16, 28, 'plate', 2)
    f.arrow(476, 138, 476, 106, 'proton', width=2.5)
    f.path('M400,148 C386,170 386,210 398,236', 'ln', extra='stroke-width="3" fill="none"')
    f.path('M552,148 C566,170 566,210 554,236', 'ln', extra='stroke-width="3" fill="none"')
    f.arrow(372, 168, 392, 184, 'electron', width=2)
    f.arrow(580, 168, 560, 184, 'electron', width=2)
    f.rect(406, 152, 62, 66, 'plate', 14)
    f.rect(484, 152, 62, 66, 'plate', 14)
    f.text(437, 182, 'P_alv', 't b', 'middle', 13)
    f.text(437, 200, '+1 mmHg', 't p', 'middle', 12.5)
    f.text(515, 182, 'P_ip', 't b', 'middle', 13)
    f.text(515, 200, '−4 mmHg', 't e', 'middle', 12.5)
    f.path('M394,242 Q476,198 558,242', 'ln p', extra='stroke-width="4" fill="none"')
    f.arrow(476, 238, 476, 212, 'proton', width=2)
    f.lines(476, 274, [
        'Quiet: diaphragm and external intercostals',
        'relax; elastic lung recoil shrinks volume.',
        'Forced: internal intercostals pull ribs down/in.',
    ], 't', 'middle', 12.4, lh=1.35)

    f.line(28, 342, 612, 342, 'ln r')

    # Middle: Pressure and Dead-Space Accounting
    f.text(320, 368, '3 · THREE PRESSURES AND ANATOMICAL DEAD SPACE IN ONE QUIET BREATH', 't b', 'middle', 14)
    box(f, 28, 382, 280, 88, [
        'Atmospheric P_atm: 760 mmHg (0 gauge)',
        'Alveolar P_alv: −1 mmHg (in) to +1 (out)',
        'Pleural P_ip: stays negative (−4 to −6 mmHg)',
    ], 'plate', 12.4)
    box(f, 332, 382, 280, 88, [
        'Tidal volume V_T = 500 mL per quiet breath',
        '150 mL stays in airway dead space (V_D)',
        '350 mL fresh air reaches alveoli per breath',
    ], 'wash-n', 12.4)

    f.line(28, 486, 612, 486, 'ln r')

    # Bottom: Bell-jar model honesty comparison
    f.text(320, 512, '4 · WHAT A BELL-JAR MODEL SHOWS — AND WHERE IT MISLEADS', 't b', 'middle', 13.8)
    box(f, 28, 524, 280, 68, [
        'Matches: pulling the bottom sheet down',
        'increases jar volume and lowers pressure,',
        'so outside air pushes into the balloons.',
    ], 'wash-g', 12.2)
    box(f, 332, 524, 280, 68, [
        'Misleads: rigid jar cannot swing like ribs;',
        'wide air space ≠ thin fluid pleural cavity;',
        'flat rubber sheet ≠ domed diaphragm.',
    ], 'wash-p', 12.2)

    f.text(320, 614, 'Nothing in the chest "sucks" molecules: volume expansion lowers pressure and outside air pushes in.', 't m', 'middle', 12.2)
    return f.svg()


@figure
def c8_alveolar_exchange():
    f = Fig(640, 610, 'Schematic of a single alveolus and adjacent pulmonary capillary separated by a moist half-micrometre barrier. Oxygen diffuses from alveolar air (PO2 104 mmHg) into deoxygenated blood arriving from the pulmonary artery (PO2 40 mmHg); carbon dioxide diffuses from blood (PCO2 45 mmHg) into alveolar air (PCO2 40 mmHg). Lower table compares inspired and expired air percentages (O2 21% to 16%, CO2 0.04% to 4%, N2 78% to 78%, water vapour variable to saturated) and states adult two-lung stereological bounds.')
    heading(f, 'Gas exchange across a moist, two-cell barrier', 'Independent diffusion down partial-pressure gradients · schematic cross-section, not to scale')

    # Upper panel: Alveolus + wrapping capillary
    f.text(320, 88, '1 · ONE ALVEOLUS AND ITS PULMONARY CAPILLARY', 't b', 'middle', 14.5)

    # Alveolar air sac (top rounded box)
    f.rect(100, 104, 440, 126, 'wash-n', 28, extra='stroke="var(--neutron)" stroke-width="2"')
    f.rect(110, 114, 420, 108, 'ln e', 22, extra='stroke-dasharray="5 3" fill="none"')
    f.text(320, 138, 'ALVEOLAR AIR · kept fresh by ventilation', 't b', 'middle', 14.5)
    f.text(320, 164, 'P_O₂ ≈ 104 mmHg (13.9 kPa)   ·   P_CO₂ ≈ 40 mmHg (5.3 kPa)', 't s', 'middle', 14.5)
    f.text(320, 190, 'Thin film of moisture + surfactant lines the 1-cell-thick alveolar wall', 't e', 'middle', 12.5)

    # Pulmonary capillary running below alveolus
    f.rect(36, 266, 568, 82, 'wash-p', 18, extra='stroke="var(--proton)" stroke-width="1.8"')
    f.text(118, 290, 'From pulmonary artery', 't b', 'middle', 13)
    f.text(118, 310, 'P_O₂ = 40 · P_CO₂ = 45', 't e', 'middle', 12.5)
    f.text(118, 330, '(deoxygenated blood)', 't m', 'middle', 12)

    f.text(522, 290, 'To pulmonary vein', 't b', 'middle', 13)
    f.text(522, 310, 'P_O₂ = 100 · P_CO₂ = 40', 't p', 'middle', 12.5)
    f.text(522, 330, '(oxygenated blood)', 't m', 'middle', 12)

    # Red blood cells moving single-file across capillary centre
    for rx, cls in [(242, 'wash-e'), (320, 'plate'), (398, 'wash-p')]:
        f.rect(rx - 24, 292, 48, 26, cls, 13, extra='stroke="var(--ink)" stroke-width="1.2"')
        f.text(rx, 309, 'RBC', 't b', 'middle', 12)
    f.arrow(198, 305, 212, 305, 'ink')
    f.arrow(426, 305, 442, 305, 'ink')

    # Diffusion arrows across the ~0.5 um barrier between alveolus (y=230) and capillary (y=266)
    f.arrow(256, 214, 256, 282, 'proton', width=3)
    f.text(196, 252, 'O₂ diffuses into blood', 't p b', 'end', 13.5)
    f.arrow(384, 282, 384, 214, 'electron', width=3)
    f.text(444, 252, 'CO₂ diffuses into sac', 't e b', 'start', 13.5)
    f.text(320, 252, '~0.5 µm', 't b', 'middle', 12.5)

    f.text(320, 368, 'Adult estimate across BOTH lungs: ~300–500M alveoli (Ochs et al. 2004 mean 480M, range 274–790M).', 't m', 'middle', 11.8)
    f.line(28, 384, 612, 384, 'ln r')

    # Lower panel: Inspired vs Expired Air Table (0610 11.1.4 and 11.1.9)
    f.text(320, 410, '2 · COMPARING INSPIRED AND EXPIRED AIR (CAMBRIDGE 0610 11.1.4 and 11.1.9)', 't b', 'middle', 14)
    headers = [(84, 'Gas'), (184, 'Inspired'), (264, 'Expired'), (460, 'Why it changes (or stays constant)')]
    for x, htxt in headers:
        f.text(x, 434, htxt, 't b', 'middle', 13)

    table_rows = [
        (446, 'Oxygen (O₂)', '21%', '16%', 'Diffuses into blood for respiration (not all extracted)', 'wash-p'),
        (482, 'Carbon dioxide', '0.04%', '4%', 'Made by respiring cells; diffuses into alveoli', 'wash-e'),
        (518, 'Nitrogen (N₂)', '78%', '78%', 'Neither used nor produced by human cells', 'plate'),
        (554, 'Water vapour', 'Variable', 'Saturated', 'Evaporates from warm moist alveolar lining', 'wash-g'),
    ]
    for y, gas, insp, exp, reason, cls in table_rows:
        f.rect(28, y, 584, 30, cls, 5)
        f.text(84, y + 20, gas, 't b', 'middle', 12.5)
        f.text(184, y + 20, insp, 't s', 'middle', 13)
        f.text(264, y + 20, exp, 't s', 'middle', 13)
        f.text(460, y + 20, reason, 't', 'middle', 11.8)

    f.text(320, 602, 'Exercise: movement and muscle signals + chemical regulation → faster, deeper breathing.', 't b', 'middle', 12)
    return f.svg()


@figure
def c8_harvey_evidence():
    f = Fig(640, 615, 'William Harvey 1628 quantitative throughput argument compared with a modern cardiac output example, above Harvey Chapter XIII forearm vein valve experiment and historical chain of contributors (Ibn al-Nafis, Colombo, Fabricius, Harvey, Malpighi). In De Motu Cordis Chapter IX (Frankfurt, 1628), Harvey assumed 1,000 beats in 30 minutes ejecting 1 to 4 drachms per beat, yielding 10 lb 5 oz to 41 lb 8 oz in half an hour. Modern example: 70 beats/min x 60 mL = 4.2 L/min (or x 70 mL = 4.9 L/min). Forearm vein valves at nodes H and O allow flow only toward the heart.')
    heading(f, 'Harvey’s two lines of proof: throughput and one-way valves', 'Historical 1628 lower bound vs chosen modern example · forearm vein experiment below')

    # Top: Side-by-side Quantitative Cards
    f.text(168, 90, '1 · HARVEY’S 1628 LOWER BOUND (CH. IX)', 't b', 'middle', 14)
    f.text(472, 90, '2 · CHOSEN MODERN METRIC EXAMPLE', 't b', 'middle', 14)

    box(f, 28, 102, 280, 178, [
        'Published in Frankfurt, 1628 (De Motu Cordis)',
        'Suppose 1,000 beats in 30 minutes eject',
        'only a small fraction of chamber capacity:',
        '• 1 drachm/beat → 1,000 drachms = 10 lb 5 oz',
        '• 2 drachms/beat → 2,000 drachms = 20 lb 10 oz',
        '• ½ oz (4 drachms) → 500 oz = 41 lb 8 oz',
        'Repeated replacement exceeds food supply.',
    ], 'wash-n', 12.2)

    box(f, 332, 102, 280, 178, [
        'Cardiac output = Heart rate × Stroke volume',
        'Chosen resting values: HR = 70 beats/min,',
        'SV = 60 mL/beat (or 70 mL/beat reference):',
        '• 70 × 60 mL = 4,200 mL/min = 4.2 L/min',
        '• (At 70 mL/beat: 4.9 L/min = 294 L/hour)',
        'Whole-body blood volume is only ~5 L.',
        'Arithmetic rules out single-pass consumption.',
    ], 'wash-g', 12.2)

    f.line(28, 296, 612, 296, 'ln r')

    # Middle: Forearm vein valve experiment (De Motu Cordis Ch XIII)
    f.text(320, 322, '3 · FOREARM VEIN VALVE EXPERIMENT (DE MOTU CORDIS CHAPTER XIII)', 't b', 'middle', 14)
    steps = [
        (338, 'A · Medium arm bandage swells forearm veins; valves form visible knots (H near hand, O toward shoulder).', 'plate'),
        (388, 'B · Press fingertip on H and stroke blood past valve O: segment H–O stays flat; valve O blocks backflow.', 'wash-p'),
        (438, 'C · Lift finger at H: blood rushes in from the hand-side to refill H–O. Veins carry blood ONLY to the heart.', 'wash-g'),
    ]
    for y, s_txt, cls in steps:
        box(f, 28, y, 584, 40, s_txt, cls, 10.8)

    f.line(28, 494, 612, 494, 'ln r')

    # Bottom: Chain of contributors (avoiding lone-genius myth)
    f.text(320, 518, '4 · A CHAIN OF EVIDENCE ACROSS CENTURIES — NOT A LONE-GENIUS STORY', 't b', 'middle', 13.8)
    box(f, 28, 530, 584, 58, [
        '1242 Ibn al-Nafis and 1559 Realdo Colombo: blood crosses through the lungs (no invisible septal pores).',
        '1603 Fabricius (Padua): drew venous valves ("little doors") · 1628 Harvey: proved full closed recirculation.',
        '1661 Marcello Malpighi: used a microscope to see frog lung capillaries linking arteries to veins.',
    ], 'wash-e', 11.8)

    f.text(320, 606, 'Arithmetic proves recirculation; valves and ligatures prove direction; microscopy later revealed capillaries.', 't m', 'middle', 12)
    return f.svg()


@figure
def c8_double_circulation():
    f = Fig(640, 625, 'Comparison of single circulation in a fish (heart to gill capillaries to body capillaries to heart in one loop, with pressure drop across gills) and double circulation in a mammal (right heart pumps deoxygenated blood through pulmonary artery to lungs at low pressure; pulmonary vein returns oxygenated blood to left heart, which pumps through aorta at high pressure to parallel body organs including hepatic artery, gut and hepatic portal vein to liver, hepatic vein, renal artery and renal vein to vena cava).')
    heading(f, 'Single circulation in a fish; double circulation in a mammal', 'Connection and pressure map (0610 9.1 and 9.3) · schematic organ routes, not anatomical scale')

    # Left column: Fish single circulation (0610 9.1.2)
    f.text(146, 90, '1 · FISH: SINGLE CIRCULATION', 't b', 'middle', 14)
    f.rect(24, 104, 240, 474, 'plate', 10)
    box(f, 52, 124, 196, 56, ['Gill capillaries', 'O₂ loads; narrow vessels', 'cause a big pressure drop'], 'wash-e', 12.5)
    f.arrow(150, 182, 150, 224, 'proton', width=2.5)
    f.text(158, 208, 'O₂-rich, low P', 't p b', 'start', 12)
    box(f, 52, 230, 196, 56, ['Systemic body capillaries', 'Slower O₂ delivery at', 'reduced blood pressure'], 'wash-g', 12.5)
    f.arrow(150, 288, 150, 330, 'electron', width=2.5)
    f.text(158, 314, 'O₂-poor return', 't e b', 'start', 12)
    box(f, 52, 336, 196, 64, ['Two-chambered main pump', '1 Atrium → 1 Ventricle', '(blood passes heart once)'], 'wash-n', 12.5)
    f.path('M52,368 L36,368 L36,152 L50,152', 'ar ar-electron', extra='fill="none" marker-end="url(#ah-electron)" stroke-width="2.2"')
    f.lines(146, 440, [
        'Suits a fish whose body is',
        'supported by water and has',
        'lower O₂ demand than a',
        'warm-blooded mammal.',
        '(Not a "defective" heart.)',
    ], 't m', 'middle', 12.5, lh=1.42)

    # Right column: Mammal double circulation + named organ vessels (0610 9.1.3, 9.1.4, 9.3.3, 9.3.6)
    f.text(448, 90, '2 · MAMMAL: DOUBLE CIRCULATION', 't b', 'middle', 14)
    f.rect(280, 104, 336, 474, 'plate', 10)

    # Pulmonary loop top
    box(f, 344, 118, 208, 48, ['Lungs (pulmonary capillaries)', 'Pressure falls along lung vessels'], 'wash-g', 12.5)
    f.arrow(396, 208, 396, 168, 'electron', width=2.5)
    f.text(390, 192, 'Pulmonary artery', 't e b', 'end', 11.8)
    f.arrow(500, 168, 500, 208, 'proton', width=2.5)
    f.text(506, 192, 'Pulmonary vein', 't p b', 'start', 11.8)

    # Four-chambered heart with septum
    f.rect(334, 212, 228, 76, 'wash-n', 9, extra='stroke="var(--ink)" stroke-width="1.8"')
    f.line(448, 212, 448, 288, 'ln', extra='stroke-width="3.5"')
    f.text(391, 238, 'Right atrium', 't e b', 'middle', 12.8)
    f.text(391, 268, 'Right ventricle', 't e b', 'middle', 12.8)
    f.text(505, 238, 'Left atrium', 't p b', 'middle', 12.8)
    f.text(505, 268, 'Left ventricle', 't p b', 'middle', 12.8)
    f.text(448, 304, 'Septum separates right and left sides', 't b', 'middle', 11.8)

    # Systemic circuit trunks: Aorta on right (x=592), Vena cava on left (x=294)
    f.path('M562,268 L592,268 L592,522', 'ln p', extra='stroke-width="3.5" fill="none"')
    f.text(584, 324, 'Aorta (high P ~120/80)', 't p b', 'end', 12)
    f.path('M294,522 L294,234 L332,234', 'ar ar-electron', extra='fill="none" marker-end="url(#ah-electron)" stroke-width="3.5"')
    f.text(302, 324, 'Vena cava', 't e b', 'start', 12)

    # Named parallel organ routes:
    # Route A: Gut -> Hepatic portal vein -> Liver + Hepatic artery -> Hepatic vein
    box(f, 476, 342, 94, 38, 'Gut wall', 'wash-n', 12.2)
    f.arrow(592, 361, 572, 361, 'proton', width=2)
    box(f, 368, 378, 80, 52, 'Liver', 'wash-n', 12.8)
    f.arrow(476, 368, 450, 390, 'green', width=2)
    f.text(516, 398, 'Hepatic portal vein', 't g b', 'middle', 11.8)
    f.arrow(592, 418, 450, 418, 'proton', width=2)
    f.text(522, 434, 'Hepatic artery', 't p b', 'middle', 11.8)
    f.arrow(368, 404, 296, 404, 'electron', width=2)
    f.text(334, 388, 'Hepatic vein', 't e b', 'middle', 10.5)

    # Route B: Kidneys (Renal artery and Renal vein)
    box(f, 398, 456, 100, 38, 'Kidneys', 'wash-e', 12.8)
    f.arrow(592, 475, 500, 475, 'proton', width=2)
    f.text(546, 466, 'Renal artery', 't p b', 'middle', 11.8)
    f.arrow(398, 475, 296, 475, 'electron', width=2)
    f.text(350, 466, 'Renal vein', 't e b', 'middle', 11.8)

    # Route C: Rest of body and head/limbs
    box(f, 398, 508, 100, 36, 'Body tissues', 'plate', 12.2)
    f.arrow(592, 526, 500, 526, 'proton', width=2)
    f.arrow(398, 526, 296, 526, 'electron', width=2)

    f.text(448, 564, 'Re-pressurises O₂-rich blood while keeping lungs safe.', 't b', 'middle', 12)
    f.text(320, 608, 'Arteries carry blood AWAY from the heart; veins carry blood TOWARDS the heart.', 't m', 'middle', 12.5)
    return f.svg()


@figure
def c8_heart_cutaway():
    f = Fig(640, 635, 'Schematic cutaway of the mammalian four-chambered heart showing anatomical right (viewer left) and anatomical left (viewer right), vena cava, right atrium, tricuspid atrioventricular valve, right ventricle, pulmonary semilunar valve, pulmonary artery, pulmonary veins, left atrium, bicuspid/mitral atrioventricular valve, left ventricle, aortic semilunar valve, aorta, septum, coronary arteries, and relative muscular wall thicknesses (left ventricle much thicker than right ventricle; ventricles thicker than atria), plus heart monitoring (ECG, pulse, valve sounds) and coronary heart disease.')
    heading(f, 'Chambers, one-way valves and muscular walls of the heart', 'Anatomical right is on the viewer’s left · arrows trace one complete double-pump route')

    # Left and Right orientation badges
    box(f, 34, 78, 256, 32, 'ANATOMICAL RIGHT (viewer’s left · O₂-poor)', 'wash-e', 12.2)
    box(f, 350, 78, 256, 32, 'ANATOMICAL LEFT (viewer’s right · O₂-rich)', 'wash-p', 12.2)

    # Great vessels above heart
    box(f, 34, 124, 128, 42, ['Vena cava', '(from head and body)'], 'wash-e', 12)
    box(f, 172, 124, 134, 42, ['Pulmonary artery', '(away to lungs)'], 'wash-e', 12)
    box(f, 334, 124, 134, 42, ['Aorta', '(away to body)'], 'wash-p', 12)
    box(f, 478, 124, 128, 42, ['Pulmonary veins', '(from lungs)'], 'wash-p', 12)

    # Outer muscular wall container of the heart (showing thick LV outer wall on right)
    f.rect(52, 194, 536, 256, 'wash-p', 18, extra='stroke="var(--proton)" stroke-width="2"')
    # Thin-walled Atria row (top)
    f.rect(64, 206, 174, 70, 'wash-e', 10, extra='stroke="var(--electron)" stroke-width="1.6"')
    f.text(151, 232, 'Right atrium', 't e b', 'middle', 14)
    f.text(151, 254, 'Thin wall (into RV)', 't', 'middle', 11.8)

    f.rect(402, 206, 166, 70, 'plate', 10, extra='stroke="var(--proton)" stroke-width="1.6"')
    f.text(485, 232, 'Left atrium', 't p b', 'middle', 14)
    f.text(485, 254, 'Thin wall (into LV)', 't', 'middle', 11.8)

    # Atrioventricular (AV) valves band between atria and ventricles ("lub" sound when closing)
    box(f, 64, 286, 174, 30, 'Tricuspid (AV) valve · "lub"', 'wash-n', 11.5)
    box(f, 402, 286, 166, 30, 'Bicuspid / mitral valve', 'wash-n', 11.5)
    f.arrow(151, 276, 151, 285, 'electron', width=2)
    f.arrow(151, 316, 151, 325, 'electron', width=2)
    f.arrow(485, 276, 485, 285, 'proton', width=2)
    f.arrow(485, 316, 485, 325, 'proton', width=2)

    # Ventricles row (bottom): RV has moderate wall; LV has MUCH thicker muscular wall (shaded margin on right)
    f.rect(68, 326, 220, 106, 'wash-e', 12, extra='stroke="var(--electron)" stroke-width="2.2"')
    f.text(178, 354, 'Right ventricle', 't e b', 'middle', 14.5)
    f.text(178, 376, 'Thinner ventricle wall (~25 mmHg)', 't', 'middle', 12)
    f.text(178, 396, 'Pumps short, low-resistance lung loop', 't m', 'middle', 11.5)

    # Interventricular septum in middle (x=292..348)
    f.rect(292, 206, 56, 226, 'wash-n', 8, extra='stroke="var(--ink)" stroke-width="2"')
    f.text(320, 314, 'SEPTUM', 't b', 'middle', 12.5)
    f.text(320, 334, 'Stops', 't', 'middle', 11.8)
    f.text(320, 350, 'mixing', 't', 'middle', 11.8)

    # Left ventricle cavity (narrower x=352..522 so outer muscular wall x=522..588 is visibly ~3x thicker!)
    f.rect(352, 326, 170, 106, 'plate', 12, extra='stroke="var(--proton)" stroke-width="3"')
    f.text(437, 354, 'Left ventricle', 't p b', 'middle', 14.5)
    f.text(437, 376, 'Thicker wall (~120 mmHg)', 't b', 'middle', 12)
    f.text(437, 396, 'Overcomes body resistance', 't m', 'middle', 11.5)
    f.text(555, 366, 'Thick', 't p b', 'middle', 12)
    f.text(555, 384, 'LV wall', 't p b', 'middle', 12)

    # Semilunar valves and outflow arrows to PA and Aorta ("dub" sound when closing)
    f.arrow(98, 168, 98, 204, 'electron', width=2.5)
    f.arrow(542, 168, 542, 204, 'proton', width=2.5)
    box(f, 242, 228, 46, 44, ['Semi-', 'lunar'], 'wash-g', 10.5)
    box(f, 352, 228, 46, 44, ['Semi-', 'lunar'], 'wash-g', 10.5)
    f.arrow(265, 326, 265, 274, 'electron', width=2.2)
    f.arrow(265, 228, 265, 168, 'electron', width=2.2)
    f.arrow(375, 326, 375, 274, 'proton', width=2.2)
    f.arrow(375, 228, 375, 168, 'proton', width=2.2)

    # Coronary arteries callout bar directly below heart
    box(f, 44, 458, 552, 36, 'Coronary arteries (from base of aorta) supply cardiac muscle with O₂ and glucose', 'wash-g', 12.5)

    f.line(28, 506, 612, 506, 'ln r')

    # Bottom: Monitoring heart activity (0610 9.2.3) and Coronary heart disease (0610 9.2.5-9.2.6)
    box(f, 28, 518, 280, 84, [
        'Monitoring the heart (0610 9.2.3):',
        '• ECG (records electrical pacemaker waves)',
        '• Pulse rate (artery stretch wave per beat)',
        '• Stethoscope (sounds of valves closing)',
    ], 'plate', 12)
    box(f, 332, 518, 280, 84, [
        'Coronary heart disease (0610 9.2.5–9.2.6):',
        'Blocked coronary artery starves heart muscle.',
        'Risks: diet, low exercise, stress, smoking,',
        'genetic predisposition, age and sex.',
    ], 'wash-p', 12)

    f.text(320, 622, 'Both ventricles pump the same volume per minute; the left ventricle pumps it at ~5× higher pressure.', 't m', 'middle', 12)
    return f.svg()


@figure
def c8_vessel_comparison():
    f = Fig(640, 615, 'Structural comparison of arteries (thick muscular and elastic wall, narrower lumen, no valves, high pulsatile pressure), capillaries (one-cell-thick endothelial wall, narrow single-cell lumen, no valves, huge total cross-sectional area, slow velocity for diffusion) and veins (thinner wall, wide lumen, semilunar valves to prevent backflow at low pressure), above continuity profiles of total cross-sectional area, blood pressure and flow velocity v = Q / A_total across the systemic circuit.')
    heading(f, 'Arteries, capillaries and veins: structure matches flow', 'Cross-sections are schematic · lower graph traces total area, pressure and speed in series')

    # Top row: Three structural columns (0610 9.3.1, 9.3.4, 9.3.5)
    cols = [
        (114, 'ARTERY', 'High pressure · away from heart', 'wash-p'),
        (320, 'CAPILLARY', 'Exchange bed · inside tissues', 'wash-g'),
        (526, 'VEIN', 'Low pressure · towards heart', 'wash-e'),
    ]
    for cx, title, sub, _ in cols:
        f.text(cx, 88, title, 't b', 'middle', 15)
        f.text(cx, 106, sub, 't m', 'middle', 12)

    # 1. Artery cross-section (thick outer and elastic/muscle wall, narrower lumen)
    f.circle(114, 168, 46, 'wash-p', extra='stroke="var(--proton)" stroke-width="2.5"')
    f.circle(114, 168, 34, 'wash-n', extra='stroke="var(--neutron)" stroke-width="2"')
    f.circle(114, 168, 16, 'plate', extra='stroke="var(--proton)" stroke-width="2"')
    f.text(114, 173, 'lumen', 't b', 'middle', 11.8)
    box(f, 24, 226, 180, 108, [
        '• Thick wall with smooth',
        '  muscle and elastic fibres',
        '• Stretches and recoils to',
        '  smooth pressure surges',
        '• Narrower lumen; no valves',
    ], 'wash-p', 12)

    # 2. Capillary cross-section (1-cell-thick wall, ~8 um lumen just fitting an RBC)
    f.circle(320, 168, 24, 'wash-g', extra='stroke="var(--green)" stroke-width="2.2" stroke-dasharray="7 3"')
    f.circle(320, 168, 19, 'plate', extra='stroke="var(--green)" stroke-width="1.2"')
    f.rect(306, 161, 28, 14, 'wash-p', 7, extra='stroke="var(--ink)" stroke-width="1"')
    f.text(320, 172, 'RBC', 't b', 'middle', 11)
    box(f, 230, 226, 180, 108, [
        '• One-cell-thick wall',
        '  (endothelium, ~0.5 µm)',
        '• Very narrow (~8 µm) so',
        '  RBCs touch wall closely',
        '• Short diffusion distance',
    ], 'wash-g', 12)

    # 3. Vein cross-section (thinner wall, wide lumen, semilunar valves)
    f.circle(526, 168, 46, 'wash-e', extra='stroke="var(--electron)" stroke-width="2"')
    f.circle(526, 168, 35, 'plate', extra='stroke="var(--electron)" stroke-width="1.5"')
    f.path('M494,158 Q522,168 524,186 M558,158 Q530,168 528,186', 'ln e', extra='stroke-width="2.5" fill="none"')
    f.text(526, 152, 'wide lumen', 't e b', 'middle', 11.8)
    f.text(526, 198, 'valve flaps', 't e', 'middle', 11.5)
    box(f, 436, 226, 180, 108, [
        '• Thinner wall (less muscle',
        '  and elastic tissue)',
        '• Wide lumen lowers',
        '  resistance to low-P flow',
        '• One-way semilunar valves',
    ], 'wash-e', 12)

    f.line(28, 350, 612, 350, 'ln r')

    # Bottom panel: Continuity profiles across the vascular tree (v = Q / A_total)
    f.text(320, 376, 'WHY BLOOD SLOWS DOWN IN CAPILLARIES: TOTAL AREA vs SPEED (v = Q / A_total)', 't b', 'middle', 13.5)
    f.rect(44, 390, 552, 160, 'plate', 8)

    zones = [(96, 'Aorta / arteries'), (210, 'Arterioles'), (324, 'Capillary bed'), (438, 'Venules'), (544, 'Veins / vena cava')]
    for zx, zlbl in zones:
        f.line(zx, 390, zx, 550, 'ln m', extra='stroke-dasharray="3 3"')
        f.text(zx, 570, zlbl, 't b', 'middle', 12)

    # Curve 1: Total cross-sectional area A_total (peaks in capillary bed ~4,500 cm^2 vs 4.5 cm^2 in aorta)
    f.path('M96,534 C160,532 210,516 266,464 C296,422 352,422 382,464 C438,516 488,530 544,532',
           'ln n', extra='stroke-width="3.5" fill="none"')
    f.rect(144, 397, 360, 20, 'plate', 4)
    f.text(324, 411, 'Total area A_total (~4,500 cm² across billions of capillaries)', 't b', 'middle', 11.5)

    # Curve 2: Velocity v = Q / A_total (fast in aorta ~20-40 cm/s -> crawls in capillaries ~0.02 cm/s -> rises in veins)
    f.path('M96,426 C154,448 210,504 274,534 C308,542 340,542 374,534 C438,518 492,494 544,478',
           'ln g', extra='stroke-width="3" fill="none"')
    f.rect(104, 421, 134, 18, 'plate', 4)
    f.text(171, 434, 'Speed v high in aorta', 't g b', 'middle', 11.5)
    f.rect(178, 531, 292, 17, 'plate', 4)
    f.text(324, 544, 'Minimum speed (~0.2 mm/s) gives time for exchange', 't g b', 'middle', 11.2)

    # Curve 3: Mean blood pressure P (high in arteries -> steep drop across arterioles -> low in veins)
    f.path('M96,444 L176,450 C210,456 248,494 294,506 L410,518 L544,536',
           'ln p', extra='stroke-width="2.5" stroke-dasharray="6 4" fill="none"')
    f.rect(98, 461, 136, 18, 'plate', 4)
    f.text(166, 474, 'Blood pressure P drops', 't p b', 'middle', 11.5)

    f.text(320, 600, 'One capillary is tiny, but billions in parallel have ~1,000× the total cross-sectional area of the aorta.', 't m', 'middle', 12.2)
    return f.svg()


@figure
def c8_capillary_bed_blood():
    f = Fig(640, 635, 'Capillary bed filtration, tissue fluid and lymphatic return above four blood component identification cards (0610 9.4). Pressure and barrier properties govern fluid filtration; oxygen diffuses down its own gradient. Red blood cells are retained; escaped proteins return through lymph. Net filtered fluid returns through lymphatics in ordinary steady tissue beds; gases diffuse separately. Below: red blood cells (biconcave, no nucleus, haemoglobin), phagocyte (lobed nucleus, phagocytosis), lymphocyte (large round nucleus, antibodies), and platelets + fibrin mesh clotting.')
    heading(f, 'Tissue fluid, lymphatic return and the jobs of blood', 'Capillary exchange above · photomicrograph and diagram key for blood components below (0610 9.4)')

    # Top panel: Capillary bed -> Tissue fluid -> Venous return + Lymphatic drainage
    f.text(320, 88, '1 · HOW TISSUE FLUID BATHES CELLS AND RETURNS TO THE CIRCULATION', 't b', 'middle', 14)

    # Capillary tube across top
    f.rect(40, 104, 560, 48, 'wash-p', 16, extra='stroke="var(--proton)" stroke-width="1.8" stroke-dasharray="8 3"')
    f.text(154, 123, 'Arterial end (high hydrostatic P)', 't p b', 'middle', 12.5)
    f.text(486, 123, 'Venous end (lower hydrostatic P)', 't e b', 'middle', 12.5)
    f.text(320, 143, 'RBCs retained; barrier and pressures govern fluid exchange', 't b', 'middle', 11.8)

    # Net outward fluid filtration in this ordinary steady tissue bed; gas diffusion is separate.
    f.arrow(140, 154, 140, 194, 'proton', width=2.5)
    f.text(140, 212, 'Pressure filters out:', 't p b', 'middle', 12)
    f.text(140, 228, 'Water and dissolved solutes', 't', 'middle', 11.8)

    box(f, 232, 176, 176, 56, ['Body cells in TISSUE FLUID', 'Take in O₂ and glucose;', 'release CO₂ and wastes'], 'wash-n', 12)

    f.arrow(500, 154, 500, 194, 'electron', width=2.5)
    f.text(500, 212, 'Small net filtration continues', 't e b', 'middle', 12)
    f.text(500, 228, 'Gases diffuse independently', 't', 'middle', 11.8)

    # Blind-ended lymphatic vessel at bottom of top panel (wider box 48..592 so text fits cleanly inside!)
    f.rect(48, 248, 544, 36, 'wash-g', 14, extra='stroke="var(--green)" stroke-width="1.6"')
    f.arrow(320, 234, 320, 250, 'green', width=2)
    f.text(320, 271, 'Lymphatics return net filtered fluid and escaped proteins → nodes → veins', 't g b', 'middle', 11.8)

    f.line(28, 300, 612, 300, 'ln r')

    # Bottom panel: 2x2 grid of blood component identification cards (0610 9.4.1–9.4.7)
    f.text(320, 326, '2 · IDENTIFYING BLOOD COMPONENTS AND CLOTTING (CAMBRIDGE 0610 9.4)', 't b', 'middle', 14)

    # Card 1 (top-left): Red blood cells and Plasma
    f.rect(28, 340, 280, 122, 'plate', 9)
    f.circle(64, 384, 21, 'wash-p', extra='stroke="var(--proton)" stroke-width="2.2"')
    f.circle(64, 384, 8.5, 'plate', extra='stroke="var(--proton)" stroke-width="1" stroke-dasharray="3 2"')
    f.lines(98, 362, [
        'Red blood cell (erythrocyte)',
        '• Biconcave disc; NO nucleus',
        '• Haemoglobin carries O₂',
        'Plasma (liquid): carries cells, ions,',
        'nutrients, urea, hormones and CO₂.',
    ], 't', 'start', 11.8, lh=1.36)

    # Card 2 (top-right): Phagocyte (multi-lobed nucleus, phagocytosis)
    f.rect(332, 340, 280, 122, 'plate', 9)
    f.circle(368, 386, 22, 'wash-e', extra='stroke="var(--electron)" stroke-width="1.8"')
    f.circle(360, 380, 6, 'pt-e')
    f.circle(372, 375, 6, 'pt-e')
    f.circle(374, 392, 6, 'pt-e')
    f.path('M360,380 L372,375 L374,392', 'ln e', extra='stroke-width="3" fill="none"')
    f.lines(402, 364, [
        'Neutrophil (a phagocyte)',
        '• This example has lobed nucleus',
        '• Flexible cell flows around,',
        '  engulfs and digests pathogens',
        '  by phagocytosis (0610 9.4.6).',
    ], 't', 'start', 11.8, lh=1.36)

    # Card 3 (bottom-left): Lymphocyte (large round nucleus, antibody production)
    f.rect(28, 474, 280, 122, 'plate', 9)
    f.circle(64, 522, 22, 'wash-e', extra='stroke="var(--electron)" stroke-width="1.8"')
    f.circle(64, 522, 16, 'pt-e')
    f.lines(98, 498, [
        'Lymphocyte (white blood cell)',
        '• Identified by a large, round',
        '  nucleus filling most of cell',
        '• B cells can become plasma',
        '  cells secreting antibodies.',
    ], 't', 'start', 11.8, lh=1.36)

    # Card 4 (bottom-right): Platelets and Fibrin Clotting (0610 9.4.3, 9.4.4, 9.4.7)
    f.rect(332, 474, 280, 122, 'plate', 9)
    f.circle(368, 524, 14, 'wash-p', extra='stroke="var(--proton)" stroke-width="1.5"')
    for lcoords in [(346, 506, 390, 542), (346, 542, 390, 506), (344, 524, 392, 524), (358, 502, 378, 546)]:
        f.line(*lcoords, 'ln g', extra='stroke-width="2"')
    f.lines(402, 496, [
        'Platelets and blood clotting',
        '• Cell fragments trigger clotting:',
        '  soluble fibrinogen → insoluble',
        '  fibrin threads forming a mesh',
        '• Stops blood loss and pathogens.',
    ], 't', 'start', 11.8, lh=1.36)

    f.text(320, 620, 'Tissue fluid links blood capillaries to cells; lymph returns excess fluid and dietary fats to the veins.', 't m', 'middle', 12.2)
    return f.svg()


@figure
def c8_septal_defect_case():
    f = Fig(640, 595, 'Comparison of an intact post-natal ventricular septum with an uncomplicated post-natal ventricular septal defect (VSD). With an intact septum, left ventricular systolic pressure (~120 mmHg) drives 4.9 L/min into the aorta while right ventricular systolic pressure (~25 mmHg) drives 4.9 L/min into the pulmonary artery (Qp = Qs). With a post-natal hole in the septum, higher left ventricular pressure (~115 mmHg) pushes already-oxygenated blood left-to-right into the lower-pressure right ventricle (~35 mmHg), recirculating extra blood through the lungs (Qp > Qs, e.g. 8.1 vs 4.5 L/min) and causing a systolic murmur and breathlessness rather than immediate blue skin.')
    heading(f, 'Case 8: Which way does blood cross a post-natal septal hole?', 'Pressure determines flow direction · left ventricular systolic pressure is ~4–5× right ventricular pressure')

    f.text(164, 90, '1 · INTACT SEPTUM (SERIES BALANCE)', 't b', 'middle', 13.8)
    f.text(476, 90, '2 · POST-NATAL VSD (LEFT-TO-RIGHT SHUNT)', 't b', 'middle', 13.8)

    # Left column: Intact septum
    f.rect(28, 104, 272, 378, 'plate', 10)
    box(f, 52, 122, 224, 48, ['Lungs (pulmonary circuit)', 'Qp = 4.9 L/min · gentle pressure'], 'wash-g', 12.5)
    f.arrow(108, 214, 108, 172, 'electron', width=2.5)
    f.arrow(220, 172, 220, 214, 'proton', width=2.5)

    # Heart with intact solid septum
    f.rect(44, 216, 240, 132, 'wash-n', 10, extra='stroke="var(--ink)" stroke-width="1.8"')
    f.rect(156, 216, 16, 102, 'ln', 2, extra='fill="var(--ink)"')
    f.text(100, 246, 'Right ventricle', 't e b', 'middle', 13)
    f.text(100, 270, 'Peak ~25 mmHg', 't e', 'middle', 12.2)
    f.text(100, 294, '(O₂-poor)', 't m', 'middle', 12)
    f.text(228, 246, 'Left ventricle', 't p b', 'middle', 13)
    f.text(228, 270, 'Peak ~120 mmHg', 't p', 'middle', 12.2)
    f.text(228, 294, '(O₂-rich)', 't m', 'middle', 12)
    f.text(164, 336, 'Solid septum: zero shunt', 't b', 'middle', 12)

    f.arrow(220, 350, 220, 392, 'proton', width=2.5)
    f.arrow(108, 392, 108, 350, 'electron', width=2.5)
    box(f, 52, 396, 224, 48, ['Systemic body tissues', 'Qs = 4.9 L/min (Qp / Qs = 1.0)'], 'wash-p', 12.5)
    f.text(164, 466, 'Clean "lub–dub" valve sounds', 't g b', 'middle', 12.5)

    # Right column: Post-natal isolated VSD (left-to-right shunt)
    f.rect(340, 104, 272, 378, 'plate', 10)
    box(f, 364, 122, 224, 48, ['Lungs OVER-CIRCULATED', 'Qp = 8.1 L/min (extra recycles)'], 'wash-p', 12.5)
    f.arrow(420, 214, 420, 172, 'proton', width=3.5)
    f.arrow(532, 172, 532, 214, 'proton', width=3.5)

    # Heart with VSD gap in septum
    f.rect(356, 216, 240, 132, 'wash-n', 10, extra='stroke="var(--ink)" stroke-width="1.8"')
    f.rect(468, 216, 16, 34, 'ln', 2, extra='fill="var(--ink)"')
    f.rect(468, 296, 16, 52, 'ln', 2, extra='fill="var(--ink)"')

    f.text(412, 242, 'Right ventricle', 't e b', 'middle', 13)
    f.text(412, 262, 'Peak ~35 mmHg', 't e', 'middle', 12.2)
    f.text(412, 322, 'O₂-rich jet enters', 't p b', 'middle', 11.5)

    f.text(540, 242, 'Left ventricle', 't p b', 'middle', 13)
    f.text(540, 262, 'Peak ~115 mmHg', 't p', 'middle', 12.2)
    f.text(540, 322, 'Higher-P chamber', 't b', 'middle', 11.5)

    # Prominent Left-to-Right shunt arrow (from LV on viewer's right to RV on viewer's left!)
    f.arrow(506, 274, 444, 274, 'proton', width=3.5)
    f.text(476, 290, 'L → R shunt', 't p b', 'middle', 12)

    f.arrow(532, 350, 532, 392, 'proton', width=2.5)
    f.arrow(420, 392, 420, 350, 'electron', width=2.5)
    box(f, 364, 396, 224, 48, ['Systemic body tissues', 'Qs = 4.5 L/min (Qp / Qs = 1.8)'], 'wash-p', 12.5)
    f.text(476, 466, 'Turbulent jet → systolic murmur', 't p b', 'middle', 12.5)

    # Bottom clinical summary box
    box(f, 28, 496, 584, 68, [
        'Why the child is breathless rather than blue (cyanotic):',
        'Because LV systolic pressure (~115 mmHg) >> RV systolic pressure (~35 mmHg), oxygenated',
        'blood shunts LEFT-TO-RIGHT into the RV and loops through the lungs a second time.',
    ], 'wash-g', 12)

    f.text(320, 582, 'High pressure to low pressure: the same physical rule explains breathing, valves and septal shunts.', 't m', 'middle', 12.2)
    return f.svg()
