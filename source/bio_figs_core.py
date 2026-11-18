"""Herbarium & Confocal Biological Vector Primitives (Option A + D Synthesis).

Provides reusable, scale-honest biological organelle, membrane, cellular, and anatomical
drawing primitives on top of `Fig` (`figs_core.py`) so textbook plates render rich
layered biological structures rather than empty rounded-pill wireframes.
"""
from __future__ import annotations
import math
from figs_core import Fig, r_


def draw_mitochondrion(f: Fig, cx: float, cy: float, rx: float = 24, ry: float = 12, rot: float = 0) -> Fig:
    """Draw a double-membrane mitochondrion with folded inner cristae ribbon."""
    tr = f' transform="rotate({r_(rot)} {r_(cx)} {r_(cy)})"' if rot else ''
    f.add(f'<g class="bio-mito"{tr}>')
    f.add(f'<ellipse cx="{r_(cx)}" cy="{r_(cy)}" rx="{r_(rx)}" ry="{r_(ry)}" class="wash-n"/>')
    f.add(f'<ellipse cx="{r_(cx)}" cy="{r_(cy)}" rx="{r_(rx)}" ry="{r_(ry)}" class="ln nn"/>')
    irx, iry = max(4, rx - 3.2), max(3, ry - 2.8)
    f.add(f'<ellipse cx="{r_(cx)}" cy="{r_(cy)}" rx="{r_(irx)}" ry="{r_(iry)}" class="fill-sheet" style="opacity:.55"/>')
    # Cristae zig-zag folds inside inner membrane
    steps = 5
    pts = []
    for i in range(steps + 1):
        px = cx - irx * 0.72 + (irx * 1.44) * (i / steps)
        py = cy + (iry * 0.62 if i % 2 else -iry * 0.62)
        pts.append(f'{r_(px)},{r_(py)}')
    f.add(f'<path d="M{" L".join(pts)}" class="ln nn"/>')
    return f.add('</g>')


def draw_chloroplast(f: Fig, cx: float, cy: float, rx: float = 22, ry: float = 11, rot: float = 0) -> Fig:
    """Draw a double-envelope chloroplast with stacked thylakoid grana & stroma lamellae."""
    tr = f' transform="rotate({r_(rot)} {r_(cx)} {r_(cy)})"' if rot else ''
    f.add(f'<g class="bio-chloro"{tr}>')
    f.add(f'<ellipse cx="{r_(cx)}" cy="{r_(cy)}" rx="{r_(rx)}" ry="{r_(ry)}" class="wash-g"/>')
    f.add(f'<ellipse cx="{r_(cx)}" cy="{r_(cy)}" rx="{r_(rx)}" ry="{r_(ry)}" class="ln g"/>')
    # Three grana stacks linked by stroma lamella
    f.line(cx - rx * 0.55, cy, cx + rx * 0.55, cy, 'ln g')
    for gx in (cx - rx * 0.45, cx, cx + rx * 0.45):
        for dy in (-ry * 0.42, 0, ry * 0.42):
            f.rect(gx - rx * 0.16, cy + dy - 1.6, rx * 0.32, 3.2, 'fill-vol', rx=1.4, extra='style="fill:var(--green);opacity:.78"')
    return f.add('</g>')


def draw_nucleus_and_er(f: Fig, cx: float, cy: float, r: float = 20, with_er: bool = True) -> Fig:
    """Draw a eukaryotic nucleus with nuclear pores, chromatin, nucleolus, and rough ER."""
    f.add('<g class="bio-nucleus">')
    if with_er:
        # Rough ER cisternae arcs hugging the right side of the nucleus
        er1 = f'M{r_(cx + r * 0.85)},{r_(cy - r * 0.65)} C{r_(cx + r * 1.55)},{r_(cy - r * 0.85)} {r_(cx + r * 1.65)},{r_(cy - r * 0.05)} {r_(cx + r * 1.02)},{r_(cy + r * 0.05)}'
        er2 = f'M{r_(cx + r * 0.95)},{r_(cy + r * 0.15)} C{r_(cx + r * 1.65)},{r_(cy + r * 0.25)} {r_(cx + r * 1.52)},{r_(cy + r * 0.92)} {r_(cx + r * 0.82)},{r_(cy + r * 0.72)}'
        f.path(er1, 'ln p')
        f.path(er2, 'ln p')
    f.circle(cx, cy, r, 'wash-p')
    f.circle(cx, cy, r, 'ln p')
    # Inner nucleolus + chromatin threads
    f.circle(cx - r * 0.22, cy - r * 0.14, r * 0.32, 'fill-ink', extra='style="fill:var(--proton);opacity:.55"')
    f.path(f'M{r_(cx - r * 0.45)},{r_(cy + r * 0.25)} Q{r_(cx)},{r_(cy - r * 0.1)} {r_(cx + r * 0.48)},{r_(cy + r * 0.22)}', 'ln p')
    return f.add('</g>')
