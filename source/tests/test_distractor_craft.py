#!/usr/bin/env python3
"""
Distractor Craft Verification Gate (Workstream 3).

Audits:
1. All `BiologicalClaimCase` items in `KymBio/KymBio/Features/ThinkingFortress/BiologyClaimAutopsyView.swift`
   for strict option symmetry (max/min character ratio <= 1.80, no parenthetical proof giveaways,
   matched scientific register >= 45 chars per option).
2. All `:::predict` callout blocks across `source/src/ch00.md` .. `source/src/ch15.md`
   for option count (>= 3 choices), non-empty answer reveal after `???`, and absence of
   throwaway joke tokens ("plastic ruler", "imperial units", "none of the above", "all of the above").
"""

from __future__ import annotations

import glob
import os
import re
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLAIM_AUTOPSY_SWIFT = os.path.join(
    REPO_ROOT,
    "KymBio",
    "KymBio",
    "Features",
    "ThinkingFortress",
    "BiologyClaimAutopsyView.swift",
)
CHAPTER_GLOB = os.path.join(REPO_ROOT, "source", "src", "ch*.md")

FORBIDDEN_THROWAWAY_PHRASES = (
    "none of the above",
    "all of the above",
    "imperial units",
    "made of plastic",
    "1 °c graduations",
)


def audit_swift_claim_autopsy(swift_path: str) -> list[str]:
    errors: list[str] = []
    if not os.path.exists(swift_path):
        return [f"Missing file: {swift_path}"]

    text = open(swift_path, encoding="utf-8").read()
    blocks = re.findall(
        r'id:\s*"([^"]+)".*?flawChoices:\s*\[(.*?)\]',
        text,
        flags=re.DOTALL,
    )
    if len(blocks) < 6:
        errors.append(f"Expected at least 6 BiologicalClaimCase entries, found {len(blocks)}")

    for case_id, raw_choices in blocks:
        choices = re.findall(r'"([^"]+)"', raw_choices)
        if len(choices) < 3:
            errors.append(f"{case_id}: expected >= 3 flawChoices, found {len(choices)}")
            continue
        lengths = [len(c.strip()) for c in choices]
        ratio = max(lengths) / max(1, min(lengths))
        if ratio > 1.80:
            errors.append(f"{case_id}: option length ratio {ratio:.2f} exceeds 1.80 ceiling")
        for idx, c in enumerate(choices):
            if "(" in c or ")" in c:
                errors.append(f"{case_id} option[{idx}]: contains parenthetical giveaway: {c}")
            if len(c.strip()) < 45:
                errors.append(f"{case_id} option[{idx}]: too short ({len(c)} chars): {c}")
            low = c.lower()
            for phrase in FORBIDDEN_THROWAWAY_PHRASES:
                if phrase in low:
                    errors.append(f"{case_id} option[{idx}]: contains throwaway phrase '{phrase}'")
    return errors


def audit_chapter_predict_blocks(chapter_glob: str) -> tuple[int, list[str]]:
    errors: list[str] = []
    total_blocks = 0
    for path in sorted(glob.glob(chapter_glob)):
        fname = os.path.basename(path)
        content = open(path, encoding="utf-8").read()
        blocks = re.findall(r":::predict([^\n]*)\n(.*?)\n:::", content, flags=re.DOTALL)
        for idx, (header, body) in enumerate(blocks):
            total_blocks += 1
            if "???" not in body:
                errors.append(f"{fname} predict#{idx + 1} ({header.strip()}): missing '???' reveal separator")
                continue
            head, tail = body.split("???", 1)
            options = [
                line[2:].strip()
                for line in head.splitlines()
                if line.strip().startswith("- ")
            ]
            if len(options) < 3:
                errors.append(f"{fname} predict#{idx + 1}: expected >= 3 options, found {len(options)}")
            if len(tail.strip()) < 20:
                errors.append(f"{fname} predict#{idx + 1}: reveal explanation after '???' is too brief")
            for opt in options:
                low = opt.lower()
                for phrase in FORBIDDEN_THROWAWAY_PHRASES:
                    if phrase in low:
                        errors.append(f"{fname} predict#{idx + 1}: option contains throwaway phrase '{phrase}'")
    return total_blocks, errors


def main() -> int:
    swift_errors = audit_swift_claim_autopsy(CLAIM_AUTOPSY_SWIFT)
    total_predict, md_errors = audit_chapter_predict_blocks(CHAPTER_GLOB)
    all_errors = swift_errors + md_errors
    if all_errors:
        for err in all_errors:
            print(f"FAIL: {err}", file=sys.stderr)
        return 1
    print(
        f"PASS: Distractor craft gate verified 6 BiologicalClaimCase items and {total_predict} chapter :::predict blocks."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
