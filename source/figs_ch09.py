"""Original Chapter 9 paper plates. See grounding/ch09.md for source/model limits."""
import math
from figs_core import Fig, figure


def heading(f, title, sub):
    f.text(320, 29, title, 't s', 'middle', 20.5)
    f.text(320, 54, sub, 't m', 'middle', 12.2)


def box(f, x, y, w, h, rows, cls='plate', size=13):
    f.rect(x, y, w, h, cls, 9)
    rows = [rows] if isinstance(rows, str) else rows
    gap = size * 1.38
    for i, s in enumerate(rows):
        f.text(x + w / 2, y + h / 2 + (i - (len(rows) - 1) / 2) * gap + size * .34, s, 't', 'middle', size)


@figure
def c9_nerves_vs_hormones():
    f = Fig(640, 650, 'Comparison of the mammalian nervous system and endocrine system (0610 14.1 and 14.3). Top left: nervous system architecture dividing into the central nervous system (CNS: brain and spinal cord) and peripheral nervous system (PNS: cranial and spinal nerves), delivering rapid electrical impulses directly along neurones to an effector. Top right: endocrine glands (pituitary, adrenal glands secreting adrenaline, pancreas secreting insulin and glucagon, ovaries secreting oestrogen, testes secreting testosterone) releasing chemical hormones into blood plasma so only target cells with complementary receptor proteins respond. Bottom: structured five-row comparison of nervous versus hormonal control.')
    heading(f, 'Point-to-point wires and blood-borne broadcasts', 'Nervous system (CNS + PNS) versus endocrine glands and target-receptor matching (0610 14.1, 14.3)')

    # Top row: Two side-by-side panels (x=24..308 and x=332..616)
    f.text(166, 86, '1 · NERVOUS SYSTEM (WIRES)', 't e b', 'middle', 13.8)
    f.text(474, 86, '2 · ENDOCRINE SYSTEM (COURIERS)', 't p b', 'middle', 13.8)

    # Left panel: CNS + PNS and point-to-point neurone pathway
    f.rect(24, 98, 284, 306, 'plate', 10)
    box(f, 40, 112, 252, 58, [
        'Central nervous system (CNS)',
        'Brain + spinal cord (coordinators)',
    ], 'wash-e', 12.2)
    f.arrow(166, 172, 166, 192, 'electron', width=2.2)
    box(f, 40, 194, 252, 58, [
        'Peripheral nervous system (PNS)',
        'Cranial + spinal nerves outside CNS',
    ], 'wash-n', 12.2)
    f.arrow(166, 254, 166, 274, 'electron', width=2.2)
    box(f, 40, 276, 252, 62, [
        'Electrical impulse along neurone',
        '→ crosses synapse (20 nm cleft)',
        '→ contracts specific muscle fibres',
    ], 'wash-g', 12)
    f.text(166, 362, 'Connections route neural signals;', 't b', 'middle', 11.8)
    f.text(166, 380, 'neighbours without a synapse stay quiet.', 't m', 'middle', 11.5)

    # Right panel: Endocrine glands map & receptor specificity
    f.rect(332, 98, 284, 306, 'plate', 10)
    glands = [
        (112, 'Pituitary gland · master coordinator (brain base)', 'wash-n'),
        (150, 'Adrenal glands · adrenaline (fight or flight)', 'wash-p'),
        (188, 'Pancreas · insulin & glucagon (blood glucose)', 'wash-g'),
        (226, 'Ovaries · oestrogen  |  Testes · testosterone', 'wash-e'),
    ]
    for gy, glbl, gcls in glands:
        box(f, 346, gy, 256, 32, glbl, gcls, 11.5)

    f.arrow(474, 260, 474, 278, 'proton', width=2.2)
    box(f, 346, 280, 256, 60, [
        'Hormone enters blood plasma (ductless)',
        '→ bathes every capillary bed in body',
        '→ acts through suitable target receptors',
    ], 'wash-p', 11.8)
    f.text(474, 362, 'Non-target cells lack complementary', 't b', 'middle', 11.8)
    f.text(474, 380, 'receptor proteins and ignore the signal.', 't m', 'middle', 11.5)

    f.line(24, 418, 616, 418, 'ln r')

    # Bottom panel: 0610 14.3.4 Comparison table + Adrenaline metabolic summary
    f.text(320, 442, '3 · COMPARING NERVOUS AND HORMONAL CONTROL (CAMBRIDGE 0610 14.3.4)', 't b', 'middle', 13.8)
    f.rect(24, 454, 592, 162, 'plate', 10)

    # Table headers
    f.rect(32, 462, 136, 26, 'wash-n', 5)
    f.rect(174, 462, 212, 26, 'wash-e', 5)
    f.rect(392, 462, 216, 26, 'wash-p', 5)
    f.text(100, 479, 'Feature', 't b', 'middle', 12)
    f.text(280, 479, 'Nervous system', 't e b', 'middle', 12)
    f.text(500, 479, 'Endocrine (hormonal) system', 't p b', 'middle', 12)

    rows = [
        ('Form of signal', 'Electrical impulse (+ synapse chemical)', 'Chemical hormone dissolved in plasma'),
        ('Transmission path', 'Along neurones (axons / dendrons)', 'Carried everywhere in the bloodstream'),
        ('Speed of action', 'Very fast (milliseconds: ~1–120 m/s)', 'Slower (seconds to minutes via blood)'),
        ('Duration of effect', 'Often brief; circuits can sustain activity', 'Often sustained; response varies'),
        ('Target area', 'Routed by neural connections', 'Widespread (any organ with receptors)'),
    ]
    for idx, (feat, n_txt, h_txt) in enumerate(rows):
        ry = 506 + idx * 22
        if idx > 0:
            f.line(36, ry - 15, 604, ry - 15, 'ln r')
        f.text(100, ry, feat, 't b', 'middle', 11.4)
        f.text(280, ry, n_txt, 't', 'middle', 11.3)
        f.text(500, ry, h_txt, 't', 'middle', 11.3)

    f.text(320, 636, 'Adrenaline bridges both: sympathetic nerves trigger adrenal glands to raise heart rate, breathing and blood glucose.', 't m', 'middle', 10.5)
    return f.svg()


@figure
def c9_neurone_types_reflex():
    f = Fig(640, 645, 'Identification of sensory, relay and motor neurones (0610 14.1.4) above a complete spinal withdrawal reflex arc (0610 14.1.5–14.1.6). Top panel compares sensory neurone (receptor endings, long dendron, cell body on side branch in dorsal root ganglion, axon), relay neurone (entirely within CNS grey matter), and motor neurone (cell body with dendrites in spinal cord grey matter, long myelinated axon wrapped in Schwann cells with nodes of Ranvier, motor end plates on effector muscle). Bottom panel traces stimulus -> receptor -> sensory neurone -> synapse -> relay neurone -> synapse -> motor neurone -> effector muscle -> response.')
    heading(f, 'Three specialist neurones and the spinal reflex arc', 'Identifying sensory, relay and motor neurones (top) · automatic spinal reflex loop (bottom, 0610 14.1)')

    # Top panel: Three neurone cards (0610 14.1.4)
    f.text(320, 84, '1 · HOW TO IDENTIFY THE THREE NEURONE TYPES IN DIAGRAMS (0610 14.1.4)', 't b', 'middle', 13.5)

    # Row 1: Sensory neurone
    f.rect(24, 96, 592, 68, 'plate', 9)
    f.text(38, 118, 'Sensory neurone', 't e b', 'start', 13)
    f.text(38, 138, 'Cell body sits on a side', 't', 'start', 11.5)
    f.text(38, 154, 'branch (dorsal root ganglion)', 't m', 'start', 11.2)
    # Schematic drawing in x=226..596
    f.circle(244, 138, 7, 'wash-g', extra='stroke="var(--green)" stroke-width="1.8"')
    f.text(244, 157, 'Receptor', 't g', 'middle', 10.8)
    f.line(251, 138, 392, 138, 'ln e', extra='stroke-width="2.5"')
    for mx in (272, 308, 344):
        f.rect(mx, 131, 26, 14, 'wash-e', 4, extra='stroke="var(--electron)" stroke-width="1.2"')
    # Side branch cell body at x=406, y=112
    f.line(406, 138, 406, 122, 'ln e', extra='stroke-width="2.2"')
    f.circle(406, 112, 11, 'wash-e', extra='stroke="var(--electron)" stroke-width="2"')
    f.circle(406, 112, 4, 'fill-ink')
    f.text(468, 114, 'Cell body on side branch', 't e b', 'start', 11.2)
    f.line(392, 138, 536, 138, 'ln e', extra='stroke-width="2.5"')
    f.arrow(536, 138, 578, 138, 'electron', width=2)
    f.text(558, 156, 'To CNS', 't m', 'middle', 10.8)

    # Row 2: Relay (connector) neurone
    f.rect(24, 172, 592, 62, 'plate', 9)
    f.text(38, 194, 'Relay neurone', 't b', 'start', 13)
    f.text(38, 214, 'Entirely inside CNS (brain', 't', 'start', 11.5)
    f.text(38, 228, 'or spinal cord grey matter)', 't m', 'start', 11.2)
    # Schematic relay neurone in x=250..580
    f.line(264, 192, 332, 203, 'ln', extra='stroke-width="2"')
    f.line(264, 214, 332, 203, 'ln', extra='stroke-width="2"')
    f.circle(344, 203, 12, 'wash-n', extra='stroke="var(--ink)" stroke-width="2"')
    f.circle(344, 203, 4, 'fill-ink')
    f.line(356, 203, 496, 203, 'ln', extra='stroke-width="2.4"')
    f.arrow(496, 203, 556, 203, 'ink', width=2)
    f.text(468, 190, 'Short unmyelinated axon inside CNS', 't m', 'middle', 11)
    f.text(468, 224, 'Bridges sensory input to motor output', 't b', 'middle', 11)

    # Row 3: Motor neurone
    f.rect(24, 242, 592, 74, 'plate', 9)
    f.text(38, 266, 'Motor neurone', 't p b', 'start', 13)
    f.text(38, 286, 'Cell body at start (in CNS);', 't', 'start', 11.5)
    f.text(38, 302, 'long axon to effector', 't m', 'start', 11.2)
    # Schematic motor neurone in x=240..596
    for dy in (262, 278, 294):
        f.line(238, dy, 260, 278, 'ln p', extra='stroke-width="1.8"')
    f.circle(268, 278, 13, 'wash-p', extra='stroke="var(--proton)" stroke-width="2"')
    f.circle(268, 278, 4.5, 'fill-ink')
    f.line(281, 278, 514, 278, 'ln p', extra='stroke-width="2.6"')
    for mx in (296, 342, 388, 434, 480):
        f.rect(mx, 270, 32, 16, 'wash-p', 4, extra='stroke="var(--proton)" stroke-width="1.2"')
    f.text(404, 261, 'Myelin sheath (Schwann cells) + nodes of Ranvier', 't p b', 'middle', 11)
    f.text(404, 304, 'Insulates axon · impulse jumps node-to-node (up to ~100 m/s)', 't m', 'middle', 10.8)
    f.rect(534, 262, 64, 32, 'wash-g', 6, extra='stroke="var(--green)" stroke-width="1.6"')
    f.arrow(514, 278, 532, 278, 'proton', width=2)
    f.text(566, 282, 'Muscle', 't g b', 'middle', 11.5)

    f.line(24, 330, 616, 330, 'ln r')

    # Bottom panel: Complete Spinal Withdrawal Reflex Arc (0610 14.1.5–14.1.6)
    f.text(320, 354, '2 · THE SPINAL WITHDRAWAL REFLEX ARC (AUTOMATIC & PROTECTIVE)', 't b', 'middle', 13.5)

    # Left: Stimulus & Receptor in skin, plus Effector muscle below
    box(f, 24, 372, 176, 62, [
        '1. Stimulus & Receptor',
        'Hot steel tawa (65 °C) excites',
        'heat/pain receptors in skin',
    ], 'wash-p', 11.6)

    box(f, 24, 512, 176, 68, [
        '5. Effector → Response',
        'Biceps muscle contracts;',
        'activates withdrawal muscles',
    ], 'wash-g', 11.6)

    # Middle: Sensory & Motor pathways (dorsal vs ventral root)
    f.arrow(202, 403, 356, 403, 'electron', width=2.5)
    f.circle(280, 384, 9, 'wash-e', extra='stroke="var(--electron)" stroke-width="1.8"')
    f.line(280, 393, 280, 403, 'ln e', extra='stroke-width="2"')
    f.text(280, 369, '2. Sensory neurone', 't e b', 'middle', 11.2)
    f.text(280, 422, 'Impulse enters spinal cord', 't m', 'middle', 10.6)

    f.arrow(356, 546, 202, 546, 'proton', width=2.5)
    f.text(280, 532, '4. Motor neurone', 't p b', 'middle', 11.2)
    f.text(280, 566, 'Impulse leaves spinal cord', 't m', 'middle', 10.6)

    # Right: Spinal cord cross-section (white matter outside, butterfly grey matter inside)
    f.rect(360, 370, 256, 212, 'plate', 14, extra='stroke="var(--ink)" stroke-width="2"')
    f.text(488, 390, 'SPINAL CORD (CNS)', 't b', 'middle', 13)
    f.text(488, 406, 'Outer white matter · inner grey matter', 't m', 'middle', 11)

    # Grey matter box inside spinal cord
    f.rect(384, 418, 208, 120, 'wash-n', 10, extra='stroke="var(--ink)" stroke-width="1.5"')
    f.circle(404, 436, 5, 'pt-e')
    f.text(500, 440, 'Synapse 1 (one-way gap)', 't e b', 'middle', 11)
    f.arrow(404, 443, 404, 502, 'ink', width=2.2)
    f.text(502, 476, '3. Relay neurone (grey matter)', 't b', 'middle', 10.8)
    f.circle(404, 512, 5, 'pt-p')
    f.text(500, 516, 'Synapse 2 → motor cell body', 't p b', 'middle', 11)

    # Ascending branch note at bottom of spinal cord box
    f.text(488, 560, 'Parallel branch ascends to brain:', 't b', 'middle', 11.2)
    f.text(488, 575, 'you feel "ouch" AFTER withdrawal starts', 't m', 'middle', 11)

    # Summary strip at bottom
    box(f, 24, 594, 592, 34, '0610 Reflex chain: Stimulus → Receptor → Sensory neurone → Relay neurone → Motor neurone → Effector → Response', 'wash-e', 10.5)
    return f.svg()


@figure
def c9_action_potential_wave():
    f = Fig(640, 640, 'How a neurone fires an action potential without being a copper wire, paired with Obaid Siddiqi and Seymour Benzer 1976 Drosophila para temperature-sensitive sodium-channel evidence. Top left: copper wire (free electrons drift along metal) versus axon membrane (Na+/K+-ATPase pump maintains high Na+ outside and high K+ inside at -70 mV resting potential; voltage-gated Na+ and K+ channels open sideways across the membrane). Top right: action potential waveform (-70 mV rest -> -55 mV threshold -> +30 mV depolarisation peak as Na+ rushes in -> repolarisation as Na+ inactivates and K+ rushes out -> -75 mV refractory undershoot). Bottom: Siddiqi TIFR Colaba / Caltech para^ts experiment showing normal axonal spikes at 22 C and reversible Na+-channel conduction block at 32 C.')
    heading(f, 'A sideways domino wave of sodium and potassium ions', 'Wire versus membrane (top left) · action potential trace (top right) · Siddiqi para^ts fly test (bottom)')

    # Top-left panel: Copper wire vs Axon membrane (x=24..296, y=76..374)
    f.rect(24, 76, 272, 298, 'plate', 10)
    f.text(160, 98, '1 · NOT A COPPER WIRE', 't b', 'middle', 13.2)

    box(f, 38, 110, 244, 54, [
        'Copper wire (Book 2 Ch 12):',
        'Free electrons (e⁻) drift along metal;',
        'no ions cross the insulation.',
    ], 'wash-n', 11.4)

    box(f, 38, 174, 244, 88, [
        'Resting axon membrane (−70 mV):',
        '• Na⁺/K⁺ pump (Skou, Ch 3) uses ATP:',
        '  high Na⁺ outside, high K⁺ inside',
        '• Inside stays negative (−70 mV)',
    ], 'wash-e', 11.4)

    box(f, 38, 272, 244, 88, [
        'Firing axon (domino wave):',
        '• Voltage-gated Na⁺ channels open:',
        '  Na⁺ rushes IN → flips to +30 mV',
        '• K⁺ channels open: K⁺ rushes OUT',
    ], 'wash-p', 11.4)

    # Top-right panel: Action potential waveform V_m (mV) vs time (ms) (x=312..616, y=76..374)
    f.rect(312, 76, 304, 298, 'plate', 10)
    f.text(464, 98, '2 · ACTION POTENTIAL TRACE', 't b', 'middle', 13.2)

    # Graph axes: origin at (364, 316), width 230 (to 594), height 190 (up to 126)
    # y mapping: -80 mV -> 310, -70 mV -> 294, -55 mV -> 270, 0 mV -> 188, +30 mV -> 142
    f.line(364, 316, 598, 316, 'ax')
    f.line(364, 316, 364, 122, 'ax')
    for vy, vlbl in [(142, '+30'), (188, '0'), (270, '−55'), (294, '−70')]:
        f.line(359, vy, 364, vy, 'ax')
        f.text(355, vy + 4, vlbl, 't m', 'end', 10.8)
    f.text(348, 116, 'mV', 't b', 'end', 11)

    for tx, tlbl in [(364, '0'), (414, '1'), (464, '2'), (514, '3'), (564, '4 ms')]:
        f.line(tx, 316, tx, 321, 'ax')
        f.text(tx, 335, tlbl, 't m', 'middle', 10.8)

    # Dashed 0 mV and -55 mV threshold lines
    f.line(364, 188, 592, 188, 'ln m', extra='stroke-dasharray="3 3"')
    f.line(364, 270, 592, 270, 'ln e', extra='stroke-dasharray="4 3"')
    f.text(590, 264, 'Threshold (−55 mV)', 't e', 'end', 10.5)

    # Action potential curve
    f.path('M364,294 L394,294 Q406,292 414,270 L432,142 Q440,136 448,148 L474,294 Q488,312 508,306 Q536,294 588,294',
           'ln p', extra='stroke-width="3.2" fill="none"')

    # Non-overlapping callout labels around the spike
    f.text(440, 128, 'Peak +30 mV (Na⁺ in)', 't p b', 'middle', 11.2)
    f.text(534, 224, 'Repolarisation', 't e b', 'middle', 11.2)
    f.text(534, 240, '(K⁺ diffuses out)', 't', 'middle', 10.8)
    f.text(484, 356, 'Refractory undershoot keeps wave one-way', 't m', 'middle', 10.4)

    f.line(24, 388, 616, 388, 'ln r')

    # Bottom panel: Obaid Siddiqi (TIFR Colaba, Mumbai & Caltech, 1976) para^ts Drosophila experiment
    f.text(320, 412, '3 · OBAID SIDDIQI’S TEMPERATURE-SENSITIVE PARA FLY TEST (1971–1976)', 't b', 'middle', 13.5)

    # Left card: Permissive 22 C
    f.rect(24, 424, 284, 182, 'wash-g', 10, extra='stroke="var(--green)" stroke-width="1.8"')
    f.text(166, 448, 'Permissive temperature (22 °C)', 't g b', 'middle', 13)
    box(f, 40, 460, 252, 56, [
        'para^ts voltage-gated Na⁺ channel',
        'folds into working 3D shape → opens',
        'normally when depolarised',
    ], 'plate', 11.5)
    f.arrow(166, 518, 166, 538, 'green', width=2.2)
    box(f, 40, 540, 252, 52, [
        'Action potentials travel down cervical',
        'nerve → flight muscle contracts; fly walks',
    ], 'plate', 11.5)

    # Right card: Restrictive 32 C
    f.rect(332, 424, 284, 182, 'wash-p', 10, extra='stroke="var(--proton)" stroke-width="1.8"')
    f.text(474, 448, 'Restrictive temperature (32 °C)', 't p b', 'middle', 13)
    box(f, 348, 460, 252, 56, [
        'Single amino-acid change makes para^ts',
        'Na⁺ channel thermally unstable → gates',
        'fail to conduct Na⁺ above ~29–32 °C',
    ], 'plate', 11.5)
    f.arrow(474, 518, 474, 538, 'proton', width=2.2)
    box(f, 348, 540, 252, 52, [
        'Axon spike stops in seconds (flat −70 mV);',
        'cooling to 22 °C restores spike & walking',
    ], 'plate', 11.5)

    f.text(320, 626, 'Hodgkin & Huxley (1952) proved Na⁺/K⁺ currents in squid axons; Siddiqi & Benzer (1976) linked the spike to the para gene.', 't m', 'middle', 10.4)
    return f.svg()


@figure
def c9_synapse_relay():
    f = Fig(640, 640, 'Structure and four-step mechanism of a chemical synapse (0610 14.1.7–14.1.10). Top panel shows the presynaptic neurone knob containing mitochondria and synaptic vesicles filled with neurotransmitter molecules, separated by the ~20 nm synaptic gap (cleft) from the postsynaptic membrane carrying complementary receptor proteins. Numbered callouts trace: (1) arriving impulse stimulates vesicles to release neurotransmitter into the gap, (2) neurotransmitter molecules diffuse across the gap, (3) neurotransmitter binds with complementary receptor proteins on the next neurone, and (4) an electrical impulse is stimulated in the next neurone. Bottom panel explains why synapses enforce one-way conduction and how Otto Loewi (1921) proved chemical transmission.')
    heading(f, 'Across the 20-nanometre gap: how a chemical synapse works', 'Supplement ultrastructure and four-step sequence (top) · why conduction is one-way (bottom, 0610 14.1)')

    # Top panel: Large schematic of Presynaptic knob -> 20 nm Synaptic gap -> Postsynaptic membrane
    f.text(320, 84, '1 · ULTRASTRUCTURE AND FOUR-STEP SEQUENCE AT A CHEMICAL SYNAPSE', 't b', 'middle', 13.5)

    # Left: Presynaptic knob (x=24..256, y=98..388)
    f.rect(24, 98, 232, 290, 'wash-e', 18, extra='stroke="var(--electron)" stroke-width="2.2"')
    f.text(140, 122, 'PRESYNAPTIC NEURONE KNOB', 't e b', 'middle', 12.8)
    f.arrow(42, 144, 118, 144, 'electron', width=2.5)
    f.text(130, 148, 'Arriving impulse', 't e b', 'start', 11.5)

    # Mitochondria box inside presynaptic knob
    box(f, 42, 164, 196, 40, 'Mitochondria · supply ATP for vesicle refills', 'wash-n', 11.2)

    # Synaptic vesicles containing neurotransmitter
    for vx, vy in [(84, 244), (144, 238), (200, 248), (112, 286), (178, 288)]:
        f.circle(vx, vy, 16, 'plate', extra='stroke="var(--electron)" stroke-width="1.8"')
        for dx, dy in [(-5, -3), (5, -4), (0, 5), (-4, 4)]:
            f.circle(vx + dx, vy + dy, 2.5, 'pt-p')
    f.text(140, 324, 'Vesicles containing', 't b', 'middle', 11.8)
    f.text(140, 340, 'neurotransmitter molecules', 't', 'middle', 11.5)

    # Step 1 badge at bottom of presynaptic knob
    box(f, 36, 350, 208, 28, 'Step 1: Impulse triggers vesicle release', 'plate', 11.2)

    # Middle: Synaptic gap / cleft (~20 nm wide, x=256..384)
    f.rect(258, 98, 124, 290, 'plate', 6, extra='stroke="var(--muted)" stroke-dasharray="4 3"')
    f.text(320, 122, 'SYNAPTIC GAP', 't b', 'middle', 12.5)
    f.text(320, 140, '(~20 nm cleft)', 't m', 'middle', 11.5)

    # Diffusing neurotransmitter dots + arrows across cleft
    for gy in (196, 248, 300):
        f.arrow(264, gy, 372, gy, 'proton', width=2, dash=True)
    for gx, gy in [(284, 180), (316, 214), (348, 182), (292, 268), (338, 272), (312, 320)]:
        f.circle(gx, gy, 4, 'pt-p')

    box(f, 264, 342, 112, 38, ['Step 2: Diffuses', 'across gap'], 'wash-p', 11.2)

    # Right: Postsynaptic membrane / next neurone (x=384..616, y=98..388)
    f.rect(384, 98, 232, 290, 'wash-g', 18, extra='stroke="var(--green)" stroke-width="2.2"')
    f.text(500, 122, 'POSTSYNAPTIC NEURONE', 't g b', 'middle', 12.8)

    # Receptor proteins along left edge of postsynaptic membrane (x=384..414)
    for ry in (184, 236, 288):
        f.rect(384, ry, 28, 24, 'wash-n', 5, extra='stroke="var(--ink)" stroke-width="1.8"')
        f.circle(384, ry + 12, 4.5, 'pt-p')
    f.text(512, 200, 'Complementary', 't b', 'middle', 12)
    f.text(512, 216, 'receptor proteins', 't b', 'middle', 12)
    f.text(512, 234, 'on postsynaptic membrane', 't m', 'middle', 11.2)

    box(f, 418, 254, 182, 44, [
        'Step 3: Binds receptor proteins',
        '(complementary 3D shape)',
    ], 'plate', 11.2)

    box(f, 418, 308, 182, 68, [
        'Step 4: Opens Na⁺ channels →',
        'stimulates new impulse in',
        'next neurone (then enzyme',
        'clears transmitter to reset)',
    ], 'plate', 11.2)

    f.line(24, 404, 616, 404, 'ln r')

    # Bottom panel: One-way rule (0610 14.1.10) + Otto Loewi's 1921 two-heart proof
    f.text(320, 428, '2 · WHY SYNAPSES ARE STRICTLY ONE-WAY & HOW LOEWI PROVED IT (1921)', 't b', 'middle', 13.5)

    box(f, 24, 440, 284, 168, [
        'Direction of this excitatory relay',
        '(Cambridge 0610 14.1.10):',
        '• Vesicles containing neurotransmitter',
        '  release from the presynaptic knob.',
        '• Complementary receptor proteins are',
        '  receive this postsynaptic signal.',
        '• Diffusion goes high → low concentration',
        '  from presynaptic to postsynaptic side.',
    ], 'wash-e', 11.6)

    box(f, 332, 440, 284, 168, [
        'How we know: Otto Loewi (1921)',
        '(Historical frog-heart lab preparation):',
        '• Stimulating the vagus nerve to Heart 1',
        '  slowed its beat and released a chemical',
        '  ("Vagusstoff" = acetylcholine) into saline.',
        '• Pipetting that liquid onto Heart 2',
        '  (with no nerve attached) slowed Heart 2',
        '  as well — proving a chemical courier.',
    ], 'wash-p', 11.6)

    f.text(320, 628, 'This excitatory relay: electrical arrival → chemical transmission → postsynaptic response.', 't m', 'middle', 11.5)
    return f.svg()


@figure
def c9_eye_anatomy_receptors():
    f = Fig(640, 645, 'Structure and function of the mammalian eye and retinal photoreceptors (0610 14.2.2–14.2.3 and 14.2.7–14.2.9). Top panel: horizontal cross-section of the human eye labelling cornea, iris, pupil, lens, ciliary muscle, suspensory ligaments, retina, fovea, blind spot and optic nerve, showing light rays refracted mostly at the air-cornea interface and fine-focused by the lens to an inverted real image on the retina. Bottom panel: comparison and retinal angular distribution of rods (high sensitivity for dim night vision, distributed across retina outside fovea) and three kinds of cones (red, green and blue wavelength sensitivity for bright colour vision, concentrated at the central fovea, with zero receptors at the blind spot).')
    heading(f, 'A self-focusing camera with two kinds of pixel', 'Cross-section of the human eye (top, 14.2.2–14.2.3) · rods, cones, fovea & blind spot (bottom, 14.2.7–14.2.9)')

    # Top panel: Eye cross-section (y=74..376)
    f.text(320, 84, '1 · CROSS-SECTION OF THE HUMAN EYE (CAMBRIDGE 0610 14.2.2–14.2.3)', 't b', 'middle', 13.5)
    f.rect(24, 96, 592, 278, 'plate', 10)

    # Eyeball schematic centered at (296, 232), radius 102
    # Outer sclera/choroid circle + inner retina arc
    f.circle(300, 232, 102, 'wash-n', extra='stroke="var(--ink)" stroke-width="2.5"')
    f.circle(300, 232, 92, 'plate', extra='stroke="var(--muted)" stroke-width="1.2"')
    # Retina lining along back right semicircle (from angle -70 to +70 deg)
    f.path('M332,146 A92,92 0 0 1 392,232 A92,92 0 0 1 332,318', 'ln p', extra='stroke-width="5" fill="none"')
    # Fovea dip at (392, 232)
    f.circle(392, 232, 5.5, 'pt-p')
    # Optic nerve exiting at lower back right (~376, 286) = Blind spot
    f.rect(382, 272, 68, 24, 'wash-e', 4, extra='stroke="var(--ink)" stroke-width="1.8"')
    f.circle(382, 284, 5.5, 'plate', extra='stroke="var(--ink)" stroke-width="1.8"')

    # Cornea bulge at front left (x=184..212, y=172..292)
    f.path('M214,170 Q170,232 214,294', 'ln e', extra='stroke-width="4" fill="none"')
    # Iris flaps (top and bottom behind cornea at x=218) leaving Pupil gap (y=212..252)
    f.rect(214, 174, 10, 38, 'wash-e', 3, extra='stroke="var(--electron)" stroke-width="1.5"')
    f.rect(214, 252, 10, 38, 'wash-e', 3, extra='stroke="var(--electron)" stroke-width="1.5"')

    # Ciliary muscle (top & bottom at x=236) + Suspensory ligaments + Biconvex Lens (x=232..254, y=198..266)
    f.rect(232, 148, 22, 22, 'wash-p', 4, extra='stroke="var(--proton)" stroke-width="1.5"')
    f.rect(232, 294, 22, 22, 'wash-p', 4, extra='stroke="var(--proton)" stroke-width="1.5"')
    f.line(243, 170, 243, 198, 'ln', extra='stroke-width="1.6"')
    f.line(243, 266, 243, 294, 'ln', extra='stroke="var(--ink)" stroke-width="1.6"')
    f.path('M243,198 Q260,232 243,266 Q226,232 243,198 Z', 'wash-g', extra='stroke="var(--green)" stroke-width="2"')

    # Incoming light rays refracting at Cornea (2/3) and Lens (1/3) to focus on Fovea (392, 232)
    f.line(128, 206, 193, 206, 'ln g', extra='stroke-width="1.8"')
    f.line(193, 206, 243, 214, 'ln g', extra='stroke-width="1.8"')
    f.line(243, 214, 392, 232, 'ln g', extra='stroke-width="1.8"')
    f.line(128, 258, 193, 258, 'ln g', extra='stroke-width="1.8"')
    f.line(193, 258, 243, 250, 'ln g', extra='stroke-width="1.8"')
    f.line(243, 250, 392, 232, 'ln g', extra='stroke-width="1.8"')

    # Clean non-overlapping labels on left (x=36..178) and right (x=414..604)
    f.text(36, 122, 'Ciliary muscle', 't p b', 'start', 11.8)
    f.text(36, 138, 'Suspensory ligaments', 't', 'start', 11.4)
    f.line(166, 134, 232, 158, 'ln m')

    f.text(36, 176, 'Cornea · refracts light', 't e b', 'start', 11.8)
    f.text(36, 192, '(~2/3 of total bend)', 't m', 'start', 11)
    f.line(166, 180, 194, 190, 'ln m')

    f.text(36, 236, 'Pupil · aperture hole', 't b', 'start', 11.8)
    f.line(156, 232, 214, 232, 'ln m')

    f.text(36, 286, 'Iris · adjusts pupil size', 't e b', 'start', 11.8)
    f.line(168, 282, 214, 274, 'ln m')

    f.text(36, 336, 'Lens · fine-focuses light', 't g b', 'start', 11.8)
    f.text(36, 352, 'onto the retina', 't m', 'start', 11)
    f.line(176, 334, 243, 266, 'ln m')

    # Right-side labels
    f.text(422, 148, 'Retina · light receptor layer', 't p b', 'start', 11.8)
    f.text(422, 164, '(rods & cones; inverted image)', 't m', 'start', 11)
    f.line(416, 152, 368, 172, 'ln m')

    f.text(422, 218, 'Fovea · centre of sharp vision', 't p b', 'start', 11.8)
    f.text(422, 234, '(densely packed cones only)', 't m', 'start', 11)
    f.line(418, 224, 398, 232, 'ln m')

    f.text(456, 282, 'Optic nerve → to brain', 't e b', 'start', 11.8)
    f.text(422, 326, 'Blind spot · where optic nerve', 't b', 'start', 11.8)
    f.text(422, 342, 'exits (zero rods or cones)', 't m', 'start', 11)
    f.line(418, 322, 382, 290, 'ln m')

    f.line(24, 388, 616, 388, 'ln r')

    # Bottom panel: Rods vs Cones (0610 14.2.7–14.2.9)
    f.text(320, 412, '2 · RODS vs CONES across the RETINA (CAMBRIDGE 0610 14.2.7–14.2.9)', 't b', 'middle', 13.5)

    box(f, 24, 424, 284, 184, [
        'Rods (~120 million per eye):',
        '• Greater sensitivity to dim light',
        '  → night (monochrome) vision',
        '• Distributed across peripheral retina',
        '  outside the fovea (absent at fovea',
        '  centre and absent at blind spot)',
        '• Many rods share one neurone → high',
        '  sensitivity, lower detail resolution',
    ], 'wash-e', 11.5)

    box(f, 332, 424, 284, 184, [
        'Cones (~6 million per eye):',
        '• Lower sensitivity; need bright light',
        '  → high-detail colour vision',
        '• THREE different kinds of cones',
        '  absorb different wavelengths',
        '  (red / long, green / medium, blue / short)',
        '• Concentrated tightly at the FOVEA',
        '  (absent at the blind spot)',
    ], 'wash-p', 11.5)

    f.text(320, 628, 'Book 2 Ch 10 showed why the cornea bends light most; biology explains how the iris, lens and retina tune and detect it.', 't m', 'middle', 10.5)
    return f.svg()


@figure
def c9_pupil_and_accommodation():
    f = Fig(640, 645, 'Antagonistic muscle control in the pupil reflex (0610 14.2.4–14.2.5) and lens accommodation for near and distant objects (0610 14.2.6). Top panel compares bright light (circular iris muscles contract, radial muscles relax, pupil constricts to protect retina) with dim light (radial iris muscles contract, circular muscles relax, pupil dilates to admit more light). Bottom panel compares viewing a near object (ciliary muscles contract into a smaller ring, suspensory ligaments slacken, elastic lens becomes thicker and more convex, refracting diverging light more strongly) with viewing a distant object (ciliary muscles relax into a wider ring, suspensory ligaments are pulled tight, lens is pulled thinner and less convex, refracting parallel light less).')
    heading(f, 'Two muscular reflexes inside the eye: iris and lens', 'Antagonistic iris muscles in the pupil reflex (top, 14.2.5) · ciliary ring in accommodation (bottom, 14.2.6)')

    # Top panel: Pupil reflex (Bright light vs Dim light)
    f.text(320, 84, '1 · THE PUPIL REFLEX: CIRCULAR vs RADIAL IRIS MUSCLES (0610 14.2.4–14.2.5)', 't b', 'middle', 13.5)

    # Left: Bright light
    f.rect(24, 96, 284, 198, 'plate', 10)
    f.text(166, 118, 'Bright light → Pupil constricts', 't p b', 'middle', 13)
    f.circle(92, 186, 46, 'wash-e', extra='stroke="var(--electron)" stroke-width="2"')
    f.circle(92, 186, 28, 'plate', extra='stroke="var(--proton)" stroke-width="2" stroke-dasharray="5 3"')
    f.circle(92, 186, 11, 'fill-ink')
    f.text(92, 248, 'Small pupil (~2 mm)', 't b', 'middle', 11.2)
    f.lines(152, 148, [
        '• Circular muscles',
        '  CONTRACT (ring tightens)',
        '• Radial muscles RELAX',
        '• Pupil constricts (narrows)',
        '• Protects retina from',
        '  excess light damage',
    ], 't', 'start', 11.4, lh=1.35)

    # Right: Dim light
    f.rect(332, 96, 284, 198, 'plate', 10)
    f.text(474, 118, 'Dim light → Pupil dilates', 't e b', 'middle', 13)
    f.circle(400, 186, 46, 'wash-e', extra='stroke="var(--electron)" stroke-width="2"')
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        f.line(400 + 27 * math.cos(rad), 186 + 27 * math.sin(rad),
               400 + 43 * math.cos(rad), 186 + 43 * math.sin(rad), 'ln p', extra='stroke-width="2"')
    f.circle(400, 186, 25, 'fill-ink')
    f.text(400, 248, 'Wide pupil (~7 mm)', 't b', 'middle', 11.2)
    f.lines(460, 148, [
        '• Radial muscles',
        '  CONTRACT (pull outward)',
        '• Circular muscles RELAX',
        '• Pupil dilates (widens)',
        '• Admits more light to',
        '  stimulate rods in dim light',
    ], 't', 'start', 11.4, lh=1.35)

    f.line(24, 308, 616, 308, 'ln r')

    # Bottom panel: Accommodation (Near object vs Distant object, 0610 14.2.6)
    f.text(320, 332, '2 · ACCOMMODATION: CILIARY RING, LIGAMENTS & LENS SHAPE (0610 14.2.6)', 't b', 'middle', 13.5)

    # Left: Viewing a NEAR object
    f.rect(24, 344, 284, 266, 'wash-p', 10, extra='stroke="var(--proton)" stroke-width="1.8"')
    f.text(166, 368, 'NEAR OBJECT (e.g. book at 25 cm)', 't p b', 'middle', 13)
    f.text(166, 386, 'Diverging rays need MORE refraction', 't m', 'middle', 11.2)

    # Front ring diagram at (92, 448) showing smaller contracted ciliary ring, slack ligaments, thick lens
    f.circle(92, 448, 38, 'plate', extra='stroke="var(--proton)" stroke-width="5"')
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        f.line(92 + 20 * math.cos(rad), 448 + 20 * math.sin(rad),
               92 + 34 * math.cos(rad), 448 + 34 * math.sin(rad), 'ln m', extra='stroke-dasharray="3 2"')
    f.circle(92, 448, 20, 'wash-g', extra='stroke="var(--green)" stroke-width="2.5"')
    f.text(92, 452, 'Thick', 't g b', 'middle', 10.8)
    f.text(92, 502, 'Smaller ring', 't p b', 'middle', 11)

    f.lines(146, 412, [
        '1. Ciliary muscles',
        '   CONTRACT (ring narrows)',
        '2. Suspensory ligaments',
        '   SLACKEN (loosen)',
        '3. Elastic lens springs',
        '   THICKER / MORE CONVEX',
        '4. Light refracted MORE',
        '   strongly onto retina',
    ], 't', 'start', 11.3, lh=1.32)
    box(f, 38, 556, 256, 42, [
        'Key: Contracting a circular ring moves',
        'it INWARD, releasing ligament tension.',
    ], 'plate', 10.6)

    # Right: Viewing a DISTANT object
    f.rect(332, 344, 284, 266, 'wash-e', 10, extra='stroke="var(--electron)" stroke-width="1.8"')
    f.text(474, 368, 'DISTANT OBJECT (e.g. > 6 m away)', 't e b', 'middle', 13)
    f.text(474, 386, 'Parallel rays need LESS refraction', 't m', 'middle', 11.2)

    # Front ring diagram at (400, 448) showing wider relaxed ciliary ring, taut ligaments, thinner lens
    f.circle(400, 448, 46, 'plate', extra='stroke="var(--electron)" stroke-width="2.5"')
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        f.line(400 + 24 * math.cos(rad), 448 + 24 * math.sin(rad),
               400 + 44 * math.cos(rad), 448 + 44 * math.sin(rad), 'ln', extra='stroke-width="2"')
    f.circle(400, 448, 24, 'wash-g', extra='stroke="var(--green)" stroke-width="1.8"')
    f.text(400, 452, 'Thin', 't g b', 'middle', 10.8)
    f.text(400, 506, 'Wider ring', 't e b', 'middle', 11)

    f.lines(456, 412, [
        '1. Ciliary muscles',
        '   RELAX (ring widens)',
        '2. Suspensory ligaments',
        '   PULLED TIGHT (taut)',
        '3. Lens pulled THINNER /',
        '   LESS CONVEX (flatter)',
        '4. Light refracted LESS',
        '   to focus parallel rays',
    ], 't', 'start', 11.3, lh=1.32)
    box(f, 346, 556, 256, 42, [
        'Key: Eyeball pressure pulls the relaxed',
        'ring outward, tightening the ligaments.',
    ], 'plate', 10.6)

    f.text(320, 628, 'Never write that ciliary muscles pull directly on the lens: they work by changing tension in the suspensory ligaments.', 't m', 'middle', 10.5)
    return f.svg()


@figure
def c9_plant_tropisms_auxin():
    f = Fig(640, 645, 'Coleoptile phototropism experiments (Darwin 1880, Boysen-Jensen 1913, Went 1926) and the Cambridge 0610 Supplement auxin mechanism in shoots and roots (14.5.1–14.5.5). Top panel compares five experimental coleoptile treatments under unilateral light from the right (intact bends right; tip removed stays straight; opaque cap on tip stays straight; gelatin block allows chemical diffusion and bending; Went off-centre auxin agar block in darkness bends shoot away from block side). Bottom panel shows the four-step 0610 auxin mechanism in a shoot under unilateral light and in a horizontal seedling responding to gravity.')
    heading(f, 'How a shoot bends without a single muscle or nerve', 'Coleoptile tip evidence (top: Darwin, Boysen-Jensen, Went) · auxin & cell elongation (bottom, 0610 14.5)')

    # Top panel: Classic coleoptile experiments (x=24..616, y=74..304)
    f.text(320, 84, '1 · HOW WE KNOW THE TIP MAKES A DIFFUSIBLE CHEMICAL (1880–1926)', 't b', 'middle', 13.5)
    f.rect(24, 96, 592, 206, 'plate', 10)

    # Light source indicator on right
    f.text(320, 116, 'Unilateral light shines from the RIGHT (←☀️) in trials A–D; trial E is in darkness', 't p b', 'middle', 11.6)

    cols = [
        (82, 'A · Intact tip', 'Darwin 1880', 'Bends to light', 'wash-g'),
        (198, 'B · Tip cut off', 'Darwin 1880', 'No growth/bend', 'wash-n'),
        (314, 'C · Opaque cap', 'Darwin 1880', 'Grows straight', 'wash-n'),
        (430, 'D · Agar block', 'Boysen-Jensen', 'Chemical passes', 'wash-g'),
        (546, 'E · Off-centre agar', 'Went 1926 (dark)', 'Elongates left', 'wash-p'),
    ]
    for cx, title, who, res, cls in cols:
        f.rect(cx - 50, 128, 100, 162, cls, 8)
        f.text(cx, 146, title, 't b', 'middle', 11.5)
        f.text(cx, 162, who, 't m', 'middle', 10.5)
        f.text(cx, 278, res, 't b', 'middle', 11)

    # Shoot drawings inside the 5 cards (y=176..256)
    # A: Intact curving right
    f.path('M76,256 L76,214 Q76,186 98,180', 'ln g', extra='stroke-width="10" fill="none"')
    # B: Tip removed (flat top, straight)
    f.rect(192, 204, 12, 52, 'wash-e', 2, extra='stroke="var(--ink)" stroke-width="1.8"')
    # C: Opaque foil cap on tip (straight)
    f.rect(308, 186, 12, 70, 'wash-e', 4, extra='stroke="var(--ink)" stroke-width="1.8"')
    f.rect(305, 180, 18, 18, 'fill-ink', 3)
    # D: Permeable gelatin/agar block under tip (curves right)
    f.path('M424,256 L424,216 Q424,192 444,182', 'ln g', extra='stroke-width="10" fill="none"')
    f.rect(418, 204, 16, 8, 'wash-p', 2, extra='stroke="var(--proton)" stroke-width="1.5"')
    # E: Went off-centre auxin agar block on left side of stump in dark -> bends right.
    f.path('M540,256 L540,220 Q540,198 562,190', 'ln p', extra='stroke-width="10" fill="none"')
    f.rect(530, 194, 12, 12, 'wash-p', 2, extra='stroke="var(--proton)" stroke-width="1.8"')

    f.line(24, 316, 616, 316, 'ln r')

    # Bottom panel: 0610 14.5.4–14.5.5 Auxin mechanism in shoot phototropism & gravitropism
    f.text(320, 340, '2 · AUXIN MECHANISM IN SHOOTS AND ROOTS (CAMBRIDGE 0610 14.5.4–14.5.5)', 't b', 'middle', 13.5)

    # Left card: Positive phototropism in a shoot (4 syllabus mark-scheme points)
    f.rect(24, 352, 284, 256, 'plate', 10)
    f.text(166, 374, 'Shoot positive phototropism', 't g b', 'middle', 13)
    box(f, 38, 386, 256, 148, [
        '(a) Auxin is made in the shoot tip.',
        '(b) Auxin diffuses downward through the',
        '    plant from the shoot tip.',
        '(c) Unilateral light causes unequal',
        '    distribution: more auxin accumulates',
        '    on the SHADED side (~65–70%).',
        '(d) In shoots, auxin STIMULATES cell',
        '    elongation → shaded cells elongate',
        '    more → shoot bends towards light.',
    ], 'wash-g', 11.2)
    box(f, 38, 544, 256, 52, [
        'Control check: Rotating a plant evenly on a',
        'clinostat cancels one-sided light or gravity',
        'so auxin stays equal and shoot grows straight.',
    ], 'wash-n', 10.8)

    # Right card: Gravitropism in a horizontal seedling (shoot vs root)
    f.rect(332, 352, 284, 256, 'plate', 10)
    f.text(474, 374, 'Horizontal seedling: gravitropism', 't p b', 'middle', 13)
    box(f, 346, 386, 256, 108, [
        'Shoot (NEGATIVE gravitropism):',
        '• Gravity pulls auxin to LOWER side.',
        '• High auxin stimulates shoot cell',
        '  elongation on lower side.',
        '• Lower side grows faster → shoot',
        '  bends UPWARD away from gravity.',
    ], 'wash-e', 11.2)
    box(f, 346, 502, 256, 94, [
        'Root (POSITIVE gravitropism):',
        '• Gravity also concentrates auxin on',
        '  the LOWER side of a horizontal root.',
        '• In roots, high auxin INHIBITS cell',
        '  elongation → upper side grows faster',
        '  → root bends DOWNWARD into soil.',
    ], 'wash-p', 11.2)

    f.text(320, 628, 'Auxin changes growth over tens of minutes; J. C. Bose (1901) showed Mimosa pudica also uses rapid electrical waves.', 't m', 'middle', 10.5)
    return f.svg()


@figure
def c9_pathway_latency_budget():
    f = Fig(640, 585, 'Four coordination routes compared. A spinal circuit can respond without conscious choice; ruler distance supplies a voluntary reaction calculation. Hormonal and growth responses vary with the pathway and conditions. No universal hot-pan latency is assigned.')
    heading(f, 'Different routes, different kinds of delay', 'Trace connections and mechanisms before comparing times')
    f.text(320, 84, 'FOUR COORDINATION PATHWAYS', 't b', 'middle', 13.5)
    cards = [
        (98, '1 · Spinal withdrawal circuit', 'wash-g', [
            'Receptor → sensory → spinal relay → motor → muscle',
            'Two central junctions plus the neuromuscular junction in this example.',
            'Receptor activation, conduction and muscle movement each take time.',
        ]),
        (212, '2 · Voluntary ruler catch', 'wash-e', [
            'Retina → visual and motor processing → spinal cord → finger muscles',
            'Measure catch distance; calculate time using d = ½gt².',
            'Example: 18 cm from rest gives about 192 ms; this is not spinal reflex time.',
        ]),
        (326, '3 · Blood-borne hormonal signal', 'wash-p', [
            'Gland → circulating blood → cells with suitable receptors',
            'Pancreatic blood reaches the liver through the portal route first.',
            'Onset and duration depend on delivery, receptors and cellular responses.',
        ]),
        (440, '4 · Shoot growth response', 'wash-n', [
            'Tip signals → directed auxin transport → unequal cell elongation',
            'Transport proteins and local diffusion contribute to signal distribution.',
            'Visible bending develops with growth; conditions and species matter.',
        ]),
    ]

    for y, title, cls, lines in cards:
        f.rect(24, y, 592, 102, cls, 10)
        f.text(40, y + 24, title, 't b', 'start', 13)
        for idx, ln in enumerate(lines):
            f.text(40, y + 46 + idx * 20, ln, 't', 'start', 11.4)

    f.text(320, 566, 'A timing calculation needs a defined pathway and stated inputs; it does not establish a universal biological latency.', 't m', 'middle', 10.5)
    return f.svg()


@figure
def c9_tetrodotoxin_case():
    f = Fig(640, 580, 'Chapter 9 detective case comparing normal action-potential propagation and synaptic release with tetrodotoxin (TTX) blocking voltage-gated Na+ channels (Narahashi, Moore & Scott 1964). Left column: normal motor axon where voltage-gated Na+ channels open at threshold (-55 mV), allowing Na+ influx (+30 mV spike), triggering neurotransmitter release at the neuromuscular synapse and skeletal muscle contraction. Right column: nanomolar tetrodotoxin (TTX) plugs the outer pore of voltage-gated Na+ channels while leaving resting K+ leak channels untouched; membrane stays at -70 mV, action potentials fail to propagate along the axon, and action-potential-evoked release fails.')
    heading(f, 'Case 9: The molecule that plugs the sodium gate', 'Normal voltage-gated Na⁺ conduction (left) versus tetrodotoxin outer-pore blockade (right, Narahashi 1964)')

    f.text(166, 88, '1 · NORMAL MOTOR AXON', 't g b', 'middle', 13.8)
    f.text(474, 88, '2 · TETRODOTOXIN (TTX) BLOCKADE', 't p b', 'middle', 13.8)

    # Left column: Normal conduction
    f.rect(24, 100, 284, 372, 'plate', 10)
    box(f, 40, 116, 252, 68, [
        'Voltage-gated Na⁺ channel OPEN',
        'Threshold (−55 mV) opens gate;',
        'Na⁺ rushes IN down gradient',
    ], 'wash-g', 12)
    f.arrow(166, 186, 166, 212, 'green', width=2.5)
    box(f, 40, 214, 252, 68, [
        'Action potential wave (+30 mV)',
        'Local Na⁺ current depolarises',
        'next patch → domino wave travels',
    ], 'wash-e', 12)
    f.arrow(166, 284, 166, 310, 'electron', width=2.5)
    box(f, 40, 312, 252, 68, [
        'Presynaptic vesicles release ACh',
        'Neurotransmitter crosses 20 nm',
        'gap → binds muscle receptors',
    ], 'wash-n', 12)
    f.arrow(166, 382, 166, 408, 'ink', width=2.5)
    box(f, 40, 410, 252, 46, 'Diaphragm & limb muscles contract', 'wash-g', 12.2)

    # Right column: TTX blockade
    f.rect(332, 100, 284, 372, 'plate', 10)
    box(f, 348, 116, 252, 68, [
        'TTX plugs outer Na⁺ pore',
        'Guanidinium group binds mouth',
        'of voltage-gated Na⁺ channel',
    ], 'wash-p', 12)
    f.arrow(474, 186, 474, 212, 'proton', width=2.5)
    box(f, 348, 214, 252, 68, [
        'Resting potential stays −70 mV',
        'K⁺ leak & Na⁺/K⁺ pump untouched,',
        'but zero Na⁺ influx → NO spike',
    ], 'wash-n', 12)
    f.arrow(474, 284, 474, 310, 'muted', width=2.5, dash=True)
    box(f, 348, 312, 252, 68, [
        'Synapse receives no impulse',
        'Vesicles & postsynaptic receptors',
        'are intact, but stay silent',
    ], 'wash-n', 12)
    f.arrow(474, 382, 474, 408, 'muted', width=2.5, dash=True)
    box(f, 348, 410, 252, 46, 'Skeletal muscle paralysis (flaccid)', 'wash-p', 12.2)

    # Bottom forensic comparison bar
    box(f, 24, 486, 592, 62, [
        'Forensic signature (Narahashi, Moore & Scott, 1964):',
        'TTX blocks the axonal Na⁺ channel from the outside at nanomolar concentration (just as warming to 32 °C',
        'silences Siddiqi’s para^ts channel from within), leaving resting K⁺ channels and synaptic receptors intact.',
    ], 'wash-e', 11.6)

    f.text(320, 566, 'Reasoning case only: tetrodotoxin is a lethal marine neurotoxin, never a substance for experiment.', 't m', 'middle', 11.5)
    return f.svg()
