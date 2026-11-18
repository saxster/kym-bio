"""Expressive Ligne-Claire 6-character repertory cast & 16-chapter biological workbench props.

Implements the Option C (Malabar Hill Riso & Tactile Field Sketchbook) + Option A (Herbarium)
sequential-art synthesis for The Living World:
  * Every character (kym, barnaby, dash, pip, bento, clara) has an unmistakable silhouette,
    costume, facial expression, and signature instrument.
  * Every chapter (0..15) renders a domain-specific biological apparatus on the Atelier
    workbench (Redi's gauze jar, moong vs flame, 1 cm vs 10 cm agar diffusion cubes,
    mangrove osmosis, enzyme lock-and-key, Van Helmont banyan pot, cristae ATP, villi,
    double heart pump, neuron spike, homeostasis dial, Photo 51 helix, mitotic spindle,
    Mendel Punnett peas, sickle-cell RBC, and Lindeman trophic pyramid).
  * Includes a Caveat-styled handwritten margin note in each panel.
"""
from __future__ import annotations
from html import escape

CAST_META = {
    'kym': {
        'stroke': '#1E5E45',
        'tint': '#E6F4ED',
        'badge': 'Kym · 10× Lens',
        'note': 'Check the scale bar & control!',
    },
    'barnaby': {
        'stroke': '#B8332A',
        'tint': '#FCECE9',
        'badge': 'Barnaby · Rival Claim',
        'note': 'One coin in the Jargon Jar!',
    },
    'dash': {
        'stroke': '#C85A17',
        'tint': '#FEF1E6',
        'badge': 'Dash · First Hunch',
        'note': 'Wait—test the mechanism first!',
    },
    'pip': {
        'stroke': '#0E7490',
        'tint': '#E0F2FE',
        'badge': 'Pip · 1 µm View',
        'note': 'Live from inside the cell (1 µm)!',
    },
    'bento': {
        'stroke': '#9A6710',
        'tint': '#FBF2DC',
        'badge': 'Bento · Workbench',
        'note': 'Count the conserved atoms!',
    },
    'clara': {
        'stroke': '#2D6A4F',
        'tint': '#E8F5EE',
        'badge': 'Clara · Field Log',
        'note': 'Recorded in the field herbarium.',
    },
}


def _character_svg(char_id: str, cx: int, cy: int, flip: bool = False) -> str:
    """Return an expressive Ligne-Claire character bust + gesture centered at (cx, cy)."""
    scale_x = '-1' if flip else '1'
    parts = [f'<g transform="translate({cx},{cy}) scale({scale_x},1)">']

    if char_id == 'barnaby':
        # Pompous double-breasted burgundy coat, wing collar, pince-nez spectacles, walrus moustache & pointer
        parts.append(
            '<path d="M-32,52 L-24,10 C-22,-2 22,-2 24,10 L32,52 Z" fill="#991B1B" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-9,4 L0,24 L9,4 Z" fill="#FFFBEB" stroke="#18261F" stroke-width="1.5"/>'
            '<circle cx="-7" cy="22" r="2" fill="#FBBF24"/><circle cx="7" cy="22" r="2" fill="#FBBF24"/>'
            '<circle cx="-7" cy="34" r="2" fill="#FBBF24"/><circle cx="7" cy="34" r="2" fill="#FBBF24"/>'
            '<circle cx="0" cy="-16" r="20" fill="#FDE6C4" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-19,-24 C-14,-34 14,-34 19,-24" fill="none" stroke="#6B7280" stroke-width="3" stroke-linecap="round"/>'
            '<circle cx="-7" cy="-19" r="5.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.6"/>'
            '<circle cx="8" cy="-19" r="5.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.6"/>'
            '<line x1="-1.5" y1="-19" x2="2.5" y2="-19" stroke="#18261F" stroke-width="1.5"/>'
            '<circle cx="-6" cy="-19" r="1.8" fill="#18261F"/><circle cx="9" cy="-19" r="1.8" fill="#18261F"/>'
            '<path d="M-14,-8 C-7,-14 0,-9 0,-9 C0,-9 7,-14 14,-8 C10,-3 4,-5 0,-7 C-4,-5 -10,-3 -14,-8 Z" fill="#4B5563" stroke="#18261F" stroke-width="1.3"/>'
            '<line x1="20" y1="14" x2="54" y2="-18" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>'
        )
    elif char_id == 'dash':
        # Wind-swept spiky hair, energetic orange track jacket with lightning stripe & stopwatch
        parts.append(
            '<path d="M-28,52 L-20,12 C-18,0 18,0 20,12 L28,52 Z" fill="#EA580C" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-6,6 L4,22 L-2,22 L6,42" fill="none" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
            '<circle cx="0" cy="-15" r="18.5" fill="#F3C69F" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-19,-22 L-12,-38 L-3,-31 L6,-40 L12,-30 L21,-34 L17,-19 Z" fill="#1F2937" stroke="#18261F" stroke-width="1.6" stroke-linejoin="round"/>'
            '<circle cx="-6" cy="-16" r="2.2" fill="#18261F"/><circle cx="7" cy="-16" r="2.2" fill="#18261F"/>'
            '<path d="M-8,-23 L-2,-21 M3,-21 L10,-24" stroke="#18261F" stroke-width="1.8" stroke-linecap="round"/>'
            '<ellipse cx="1" cy="-7" rx="4.5" ry="3" fill="#991B1B" stroke="#18261F" stroke-width="1.4"/>'
            '<circle cx="24" cy="12" r="8" fill="#FEF08A" stroke="#18261F" stroke-width="1.8"/>'
            '<path d="M24,12 L24,7 M24,12 L28,12" stroke="#18261F" stroke-width="1.5" stroke-linecap="round"/>'
        )
    elif char_id == 'pip':
        # Microscopic 1 µm bubble explorer with diving/pith helmet & reticle ticks
        parts.append(
            '<circle cx="0" cy="4" r="38" fill="#E0F2FE" fill-opacity="0.7" stroke="#0284C7" stroke-width="2" stroke-dasharray="5 3"/>'
            '<line x1="-38" y1="4" x2="-30" y2="4" stroke="#0284C7" stroke-width="1.8"/>'
            '<line x1="30" y1="4" x2="38" y2="4" stroke="#0284C7" stroke-width="1.8"/>'
            '<path d="M-20,38 L-14,14 C-12,4 12,4 14,14 L20,38 Z" fill="#0284C7" stroke="#18261F" stroke-width="1.8"/>'
            '<circle cx="0" cy="-8" r="15" fill="#FDE6C4" stroke="#18261F" stroke-width="1.8"/>'
            '<path d="M-18,-10 C-18,-26 18,-26 18,-10 Z" fill="#FBBF24" stroke="#18261F" stroke-width="1.8"/>'
            '<line x1="-21" y1="-10" x2="21" y2="-10" stroke="#18261F" stroke-width="2" stroke-linecap="round"/>'
            '<circle cx="-5" cy="-5" r="4.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.5"/>'
            '<circle cx="5" cy="-5" r="4.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.5"/>'
            '<circle cx="-5" cy="-5" r="1.6" fill="#18261F"/><circle cx="5" cy="-5" r="1.6" fill="#18261F"/>'
        )
    elif char_id == 'bento':
        # Master Bento in craftsman apron with square glasses & callipers
        parts.append(
            '<path d="M-30,52 L-22,10 C-20,-2 20,-2 22,10 L30,52 Z" fill="#B45309" stroke="#18261F" stroke-width="2"/>'
            '<rect x="-15" y="12" width="30" height="38" rx="3" fill="#FEF3C7" stroke="#18261F" stroke-width="1.6"/>'
            '<circle cx="0" cy="-16" r="19" fill="#E8B892" stroke="#18261F" stroke-width="2"/>'
            '<rect x="-12" y="-22" width="10" height="7" rx="1.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.6"/>'
            '<rect x="2" y="-22" width="10" height="7" rx="1.5" fill="#FFFFFF" stroke="#18261F" stroke-width="1.6"/>'
            '<circle cx="-7" cy="-18.5" r="1.6" fill="#18261F"/><circle cx="7" cy="-18.5" r="1.6" fill="#18261F"/>'
            '<path d="M-6,-9 Q0,-4 6,-9" fill="none" stroke="#18261F" stroke-width="1.7" stroke-linecap="round"/>'
        )
    elif char_id == 'clara':
        # Clara with botanical field hat, green expedition collar & herbarium notebook
        parts.append(
            '<path d="M-28,52 L-20,12 C-18,0 18,0 20,12 L28,52 Z" fill="#2D6A4F" stroke="#18261F" stroke-width="2"/>'
            '<circle cx="0" cy="-15" r="18" fill="#F3C69F" stroke="#18261F" stroke-width="2"/>'
            '<ellipse cx="0" cy="-27" rx="25" ry="5" fill="#D97706" stroke="#18261F" stroke-width="1.8"/>'
            '<path d="M-15,-27 C-14,-40 14,-40 15,-27 Z" fill="#F59E0B" stroke="#18261F" stroke-width="1.8"/>'
            '<circle cx="-6" cy="-16" r="2" fill="#18261F"/><circle cx="6" cy="-16" r="2" fill="#18261F"/>'
            '<path d="M-5,-8 Q0,-4 5,-8" fill="none" stroke="#18261F" stroke-width="1.6" stroke-linecap="round"/>'
            '<rect x="16" y="8" width="20" height="26" rx="2" fill="#FEF9C3" stroke="#18261F" stroke-width="1.6" transform="rotate(-10 26 21)"/>'
        )
    else:
        # Default: Kym — braided ponytail with botanical leaf clip, round glasses, forest field vest & 10× brass loupe
        parts.append(
            '<path d="M-28,52 L-20,12 C-16,0 16,0 20,12 L28,52 Z" fill="#1E5E45" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-7,6 L0,20 L7,6" fill="none" stroke="#A7F3D0" stroke-width="1.8"/>'
            '<circle cx="-22" cy="-10" r="7" fill="#18261F"/>'
            '<circle cx="-27" cy="-3" r="5" fill="#18261F"/>'
            '<path d="M-18,-16 C-24,-22 -16,-28 -12,-20 Z" fill="#34D399" stroke="#18261F" stroke-width="1.2"/>'
            '<circle cx="0" cy="-15" r="18.5" fill="#E8B892" stroke="#18261F" stroke-width="2"/>'
            '<path d="M-18,-19 C-16,-38 16,-38 18,-18 C10,-26 -10,-26 -18,-19 Z" fill="#18261F"/>'
            '<circle cx="-6.5" cy="-15" r="6" fill="#FFFFFF" fill-opacity="0.65" stroke="#18261F" stroke-width="1.8"/>'
            '<circle cx="6.5" cy="-15" r="6" fill="#FFFFFF" fill-opacity="0.65" stroke="#18261F" stroke-width="1.8"/>'
            '<line x1="-0.5" y1="-15" x2="0.5" y2="-15" stroke="#18261F" stroke-width="1.8"/>'
            '<circle cx="-6" cy="-15" r="2" fill="#18261F"/><circle cx="7" cy="-15" r="2" fill="#18261F"/>'
            '<path d="M-5,-6 Q0,-1 5,-6" fill="none" stroke="#18261F" stroke-width="1.6" stroke-linecap="round"/>'
            # 10× Brass Magnifying Loupe held up
            '<circle cx="27" cy="-6" r="9.5" fill="#BAE6FD" fill-opacity="0.55" stroke="#B45309" stroke-width="2.4"/>'
            '<line x1="20" y1="1" x2="13" y2="11" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>'
        )

    parts.append('</g>')
    return ''.join(parts)


def _chapter_workbench_prop(ch_n: int, gx: int, gy: int) -> str:
    """Return a chapter-specific biological workbench illustration centered at (gx, gy)."""
    p = [f'<g transform="translate({gx},{gy})">']
    # Specimen card frame on the workbench
    p.append('<rect x="-68" y="-38" width="136" height="72" rx="8" fill="#FFFDF8" stroke="#18261F" stroke-width="1.6"/>')

    if ch_n == 0:
        # Redi's Open vs Gauze Jar + Leeuwenhoek 270x bead
        p.append(
            '<rect x="-50" y="-16" width="32" height="40" rx="4" fill="#FEF2F2" stroke="#18261F" stroke-width="1.5"/>'
            '<path d="M-44,16 C-44,8 -24,8 -24,16 Z" fill="#DC2626"/>'
            '<circle cx="-34" cy="-4" r="2.2" fill="#18261F"/><circle cx="-28" cy="-10" r="2" fill="#18261F"/>'
            '<rect x="14" y="-16" width="32" height="40" rx="4" fill="#ECFDF5" stroke="#18261F" stroke-width="1.5"/>'
            '<line x1="12" y1="-16" x2="48" y2="-16" stroke="#047857" stroke-width="2.5" stroke-dasharray="3 2"/>'
            '<path d="M20,16 C20,8 40,8 40,16 Z" fill="#F87171"/>'
            '<circle cx="30" cy="-23" r="2.2" fill="#18261F"/>'
            '<text x="0" y="-24" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8" font-weight="bold" fill="#1E5E45">GAUZE CONTROL · 270×</text>'
        )
    elif ch_n == 1:
        # Sprouting Moong Seed (ATP steps) vs Candle Flame
        p.append(
            '<ellipse cx="-30" cy="8" rx="14" ry="10" fill="#15803D" stroke="#18261F" stroke-width="1.6"/>'
            '<path d="M-24,2 C-18,-12 -6,-18 2,-12" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>'
            '<circle cx="-32" cy="-14" r="6" fill="#FDE047" stroke="#B45309" stroke-width="1.3"/>'
            '<text x="-32" y="-11.5" text-anchor="middle" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#78350F">ATP</text>'
            '<rect x="26" y="4" width="12" height="20" rx="2" fill="#FDE68A" stroke="#18261F" stroke-width="1.4"/>'
            '<path d="M32,2 C24,-8 28,-22 32,-26 C36,-22 40,-8 32,2 Z" fill="#F97316" stroke="#DC2626" stroke-width="1.4"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#4B5563">32 ATP STEPS vs FLAME</text>'
        )
    elif ch_n == 2:
        # 1 cm diffused agar cube vs 10 cm cube with starved pink core (SA/V = 6/L)
        p.append(
            '<rect x="-52" y="2" width="20" height="20" rx="2" fill="#A7F3D0" stroke="#18261F" stroke-width="1.6"/>'
            '<text x="-42" y="31" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" font-weight="bold" fill="#065F46">SA/V=6</text>'
            '<rect x="-8" y="-22" width="44" height="44" rx="4" fill="#A7F3D0" stroke="#18261F" stroke-width="1.8"/>'
            '<rect x="1" y="-13" width="26" height="26" rx="3" fill="#F43F5E" stroke="#9F1239" stroke-width="1.4"/>'
            '<text x="14" y="3" text-anchor="middle" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#FFFFFF">NO O₂</text>'
            '<text x="14" y="31" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" font-weight="bold" fill="#9F1239">SA/V=0.6</text>'
        )
    elif ch_n == 3:
        # Osmosis semipermeable membrane + water potential gradient
        p.append(
            '<line x1="0" y1="-26" x2="0" y2="22" stroke="#1E5E45" stroke-width="2" stroke-dasharray="4 3"/>'
            '<circle cx="-38" cy="-8" r="4" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2"/>'
            '<circle cx="-22" cy="6" r="4" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2"/>'
            '<circle cx="-42" cy="12" r="4" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2"/>'
            '<circle cx="24" cy="-6" r="8" fill="#FDE047" stroke="#B45309" stroke-width="1.5"/>'
            '<circle cx="42" cy="8" r="8" fill="#FDE047" stroke="#B45309" stroke-width="1.5"/>'
            '<path d="M-14,0 L10,0" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#0369A1">HIGH Ψw → LOW Ψw</text>'
        )
    elif ch_n == 4:
        # Enzyme active site lock + substrate key
        p.append(
            '<path d="M-42,-16 A20,20 0 1,0 -42,16 L-24,8 L-32,0 L-24,-8 Z" fill="#A7F3D0" stroke="#047857" stroke-width="1.8"/>'
            '<path d="M-12,-8 L-20,0 L-12,8 L4,8 L4,-8 Z" fill="#FDE047" stroke="#B45309" stroke-width="1.8"/>'
            '<path d="M22,-14 C30,-24 44,4 52,-12" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="3 2"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#065F46">37 °C FIT vs DENATURED</text>'
        )
    elif ch_n == 5:
        # Van Helmont Banyan Leaf + Chloroplast Grana + CO2
        p.append(
            '<path d="M-44,14 C-44,-14 -8,-24 16,-16 C10,6 -12,22 -44,14 Z" fill="#4ADE80" fill-opacity="0.4" stroke="#15803D" stroke-width="2"/>'
            '<line x1="-44" y1="14" x2="8" y2="-12" stroke="#15803D" stroke-width="1.8"/>'
            '<circle cx="38" cy="-12" r="10" fill="#FDE047" stroke="#D97706" stroke-width="1.6"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#15803D">6 CO₂ + 6 H₂O → GLUCOSE</text>'
        )
    elif ch_n == 6:
        # Mitochondrion cristae folds minting ATP
        p.append(
            '<ellipse cx="0" cy="-2" rx="46" ry="22" fill="#FED7AA" stroke="#9A3412" stroke-width="2"/>'
            '<path d="M-32,-10 L-22,10 L-10,-10 L0,10 L10,-10 L22,10 L32,-10" fill="none" stroke="#C2410C" stroke-width="2" stroke-linejoin="round"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#9A3412">CRISTAE · AEROBIC ATP</text>'
        )
    elif ch_n == 7:
        # Intestinal villi folds + bile micelles
        p.append(
            '<path d="M-48,16 L-48,-6 Q-38,-24 -28,-6 L-28,12 Q-18,20 -10,12 L-10,-10 Q0,-28 10,-10 L10,16" fill="#FCE7F3" stroke="#9D174D" stroke-width="2"/>'
            '<circle cx="34" cy="-6" r="6" fill="#FDE047" stroke="#B45309" stroke-width="1.4"/>'
            '<circle cx="48" cy="4" r="4" fill="#FDE047" stroke="#B45309" stroke-width="1.4"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#9D174D">VILLI + BILE EMULSION</text>'
        )
    elif ch_n == 8:
        # Four-chambered double heart pump
        p.append(
            '<path d="M0,18 C-30,4 -32,-16 -14,-20 C-4,-20 0,-12 0,-12 C0,-12 4,-20 14,-20 C32,-16 30,4 0,18 Z" fill="#FEE2E2" stroke="#B91C1C" stroke-width="2"/>'
            '<line x1="0" y1="-12" x2="0" y2="16" stroke="#18261F" stroke-width="2"/>'
            '<circle cx="-11" cy="-4" r="4" fill="#38BDF8"/><circle cx="11" cy="-4" r="4" fill="#EF4444"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#991B1B">RIGHT (LUNGS) · LEFT (BODY)</text>'
        )
    elif ch_n == 9:
        # Action potential spike + synaptic cleft
        p.append(
            '<path d="M-52,8 L-28,8 L-16,-24 L-4,18 L8,2 L48,2" fill="none" stroke="#0284C7" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
            '<circle cx="28" cy="-12" r="3" fill="#F43F5E"/><circle cx="38" cy="-8" r="3" fill="#F43F5E"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#0369A1">100 m/s SPIKE + SYNAPSE</text>'
        )
    elif ch_n == 10:
        # Homeostasis 37.0 C dial + Y-antibody
        p.append(
            '<circle cx="-22" cy="-2" r="18" fill="#E0F2FE" stroke="#0369A1" stroke-width="1.8"/>'
            '<text x="-22" y="2" text-anchor="middle" font-family="ui-monospace,monospace" font-size="8.5" font-weight="bold" fill="#0C4A6E">37°C</text>'
            '<path d="M18,-18 L28,-4 L38,-18 M28,-4 L28,14" fill="none" stroke="#15803D" stroke-width="2.4" stroke-linecap="round"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#15803D">FEEDBACK &amp; ANTIBODY</text>'
        )
    elif ch_n == 11:
        # Photo 51 X-cross + B-DNA Double Helix
        p.append(
            '<circle cx="-30" cy="-2" r="17" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="1.6"/>'
            '<path d="M-40,-12 L-20,8 M-40,8 L-20,-12" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/>'
            '<path d="M4,-14 C16,-26 28,22 44,10 M4,10 C16,22 28,-26 44,-14" fill="none" stroke="#B91C1C" stroke-width="2"/>'
            '<line x1="14" y1="-6" x2="14" y2="4" stroke="#15803D" stroke-width="1.8"/>'
            '<line x1="24" y1="-7" x2="24" y2="5" stroke="#D97706" stroke-width="1.8"/>'
            '<line x1="34" y1="-6" x2="34" y2="4" stroke="#0284C7" stroke-width="1.8"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#1E3A8A">PHOTO 51 · A=T C≡G</text>'
        )
    elif ch_n == 12:
        # Mitosis metaphase spindle + chromosomes
        p.append(
            '<ellipse cx="0" cy="-2" rx="44" ry="20" fill="#F0FDF4" stroke="#15803D" stroke-width="1.6" stroke-dasharray="4 2"/>'
            '<path d="M-36,-2 L0,-12 L36,-2 M-36,-2 L0,8 L36,-2" fill="none" stroke="#94A3B8" stroke-width="1.4"/>'
            '<path d="M-4,-16 L4,-8 M4,-16 L-4,-8 M-4,4 L4,12 M4,4 L-4,12" stroke="#B91C1C" stroke-width="2.2" stroke-linecap="round"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#15803D">2n MITOSIS vs n MEIOSIS</text>'
        )
    elif ch_n == 13:
        # Mendel 2x2 Punnett square (3 : 1 ratio)
        p.append(
            '<rect x="-24" y="-22" width="48" height="38" rx="3" fill="#FEF9C3" stroke="#18261F" stroke-width="1.6"/>'
            '<line x1="-24" y1="-3" x2="24" y2="-3" stroke="#18261F" stroke-width="1.3"/>'
            '<line x1="0" y1="-22" x2="0" y2="16" stroke="#18261F" stroke-width="1.3"/>'
            '<circle cx="-12" cy="-12" r="5" fill="#22C55E"/><circle cx="12" cy="-12" r="5" fill="#22C55E"/>'
            '<circle cx="-12" cy="6" r="5" fill="#22C55E"/><circle cx="12" cy="6" r="5" fill="#FACC15"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#18261F">PUNNETT 3 : 1 RATIO</text>'
        )
    elif ch_n == 14:
        # Normal biconcave RBC vs Sickle HbS crescent
        p.append(
            '<circle cx="-24" cy="-2" r="14" fill="#FCA5A5" stroke="#B91C1C" stroke-width="2"/>'
            '<circle cx="-24" cy="-2" r="5" fill="#FEE2E2" stroke="#B91C1C" stroke-width="1.2"/>'
            '<path d="M16,-16 C34,-12 34,12 16,16 C24,6 24,-6 16,-16 Z" fill="#F87171" stroke="#991B1B" stroke-width="2"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#991B1B">HbA vs HbS SELECTION</text>'
        )
    else:
        # Ch 15: Lindeman 10% trophic pyramid + plasmid ring
        p.append(
            '<path d="M-48,14 L-4,14 L-12,2 L-40,2 Z" fill="#4ADE80" stroke="#15803D" stroke-width="1.5"/>'
            '<path d="M-38,0 L-14,0 L-20,-10 L-32,-10 Z" fill="#FACC15" stroke="#B45309" stroke-width="1.5"/>'
            '<path d="M-30,-12 L-22,-12 L-26,-20 Z" fill="#F87171" stroke="#B91C1C" stroke-width="1.5"/>'
            '<circle cx="28" cy="-2" r="14" fill="none" stroke="#0284C7" stroke-width="2.2"/>'
            '<path d="M36,-13 A14,14 0 0,1 42,-2" fill="none" stroke="#F43F5E" stroke-width="3.2"/>'
            '<text x="0" y="30" text-anchor="middle" font-family="ui-monospace,monospace" font-size="7.5" fill="#15803D">10% TROPHIC + PLASMID</text>'
        )

    p.append('</g>')
    return ''.join(p)


def comic_defs_svg() -> str:
    """Return a single hidden SVG <defs> block with all 6 characters and 16 chapter props."""
    defs = [
        '<svg aria-hidden="true" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden"><defs>'
        '<g id="cc-bg"><rect x="6" y="98" width="308" height="32" fill="#E6DEC8" fill-opacity="0.65"/>'
        '<line x1="12" y1="98" x2="308" y2="98" stroke="#18261F" stroke-width="1.6"/></g>'
    ]
    for cid in CAST_META:
        body = _character_svg(cid, 0, 0, flip=False)
        inner = body[len('<g transform="translate(0,0) scale(1,1)">'):-len('</g>')]
        defs.append(f'<g id="cc-char-{cid}">{inner}</g>')
    for ch_n in range(16):
        body = _chapter_workbench_prop(ch_n, 0, 0)
        inner = body[len('<g transform="translate(0,0)">'):-len('</g>')]
        defs.append(f'<g id="cc-prop-{ch_n}">{inner}</g>')
    defs.append('</defs></svg>')
    return ''.join(defs)


def comic_panel_svg(char_id: str, idx: int, ch_n: int) -> str:
    """Render an expressive Ligne-Claire sequential art panel with character silhouette & chapter workbench prop."""
    cid = char_id if char_id in CAST_META else 'kym'
    meta = CAST_META[cid]
    stroke = meta['stroke']
    tint = meta['tint']
    badge = f"{meta['badge']} · Ch.{ch_n}"
    note = meta['note']

    char_left = (idx % 2 == 1)
    cx = 68 if char_left else 252
    gx = 216 if char_left else 104
    scale_x = '1' if char_left else '-1'
    prop_n = ch_n if 0 <= ch_n <= 15 else 0

    return (
        f'<div class="atlas-comic-art" aria-hidden="true">'
        f'<svg viewBox="0 0 320 136">'
        f'<rect x="5" y="5" width="310" height="126" rx="8" fill="{tint}" fill-opacity=".58" stroke="#18261F" stroke-width="1.6"/>'
        f'<use href="#cc-bg"/>'
        f'<rect x="12" y="11" width="146" height="16" rx="8" fill="#FFFDF8" stroke="{stroke}" stroke-width="1.2"/>'
        f'<text x="85" y="22" class="cc-b" fill="{stroke}">{escape(badge)}</text>'
        f'<text x="304" y="22" class="cc-n" fill="{stroke}">{escape(note)}</text>'
        f'<use href="#cc-prop-{prop_n}" transform="translate({gx},64)"/>'
        f'<use href="#cc-char-{cid}" transform="translate({cx},72) scale({scale_x},1)"/>'
        f'</svg></div>'
    )
