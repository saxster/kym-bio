#!/usr/bin/env python3
"""
Read-Only Learner Record & Feedback Loop CLI (`source/tests/read_kym_record.py`).

Closes PLAYBOOK §5.10 by reading exported web-book notebook JSON files
(`the-living-world-notebook-*.json`) and/or KymBio `.kymbiobackup` archives
in strict read-only mode (never mutating any learner record) and generating
a structured Markdown revision brief (`REVISION_BRIEF.md` or stdout).

Usage:
  python3 source/tests/read_kym_record.py <file1.json> [file2.kymbiobackup ...] [--out REVISION_BRIEF.md]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any


def analyze_web_notebook(data: dict[str, Any]) -> dict[str, Any]:
    keys = data.get("keys", {})
    committed_misconceptions: list[str] = []
    fragile_guesses: list[str] = []
    honest_gaps: list[str] = []
    solid_mastery: list[str] = []
    reading_thoughts: list[str] = []
    highlights_with_notes: list[str] = []

    for k, v in sorted(keys.items()):
        if k.startswith("chk:") and isinstance(v, dict):
            cid = k[4:]
            rating = v.get("r", "")
            conf = v.get("conf", "")
            ans = v.get("a", "").strip()
            rt = v.get("rt", "").strip()
            if rt:
                reading_thoughts.append(f"- `{cid}`: \"{rt}\"")
            if rating in ("not", "partly") and conf == "sure":
                committed_misconceptions.append(
                    f"- **`{cid}`** (rated `{rating}` after `sure` confidence): wrote *\"{ans or '(in head)'}\"*"
                )
            elif rating == "got" and conf in ("guess", "unsure"):
                fragile_guesses.append(
                    f"- **`{cid}`** (rated `got` after `{conf}` confidence): wrote *\"{ans or '(in head)'}\"*"
                )
            elif rating in ("not", "partly"):
                honest_gaps.append(
                    f"- **`{cid}`** (rated `{rating}`, confidence `{conf or 'unset'}`): wrote *\"{ans or '(in head)'}\"*"
                )
            elif rating == "got":
                solid_mastery.append(f"- `{cid}`")
        elif k.startswith("pred:") and isinstance(v, dict):
            pid = k[5:]
            conf = v.get("conf", "")
            opt = v.get("o", "")
            if conf in ("guess", "unsure"):
                fragile_guesses.append(
                    f"- **Prediction `{pid}`** (`{conf}` confidence): chose *\"{opt}\"*"
                )
        elif k == "hl" and isinstance(v, list):
            for h in v:
                if isinstance(h, dict) and h.get("note"):
                    highlights_with_notes.append(
                        f"- `{h.get('c', '?')}`: \"{h.get('quote', '').strip()}\" -> **Note:** {h.get('note', '').strip()}"
                    )

    return {
        "source_type": "web_notebook",
        "title": data.get("book", "The Living World"),
        "committed_misconceptions": committed_misconceptions,
        "fragile_guesses": fragile_guesses,
        "honest_gaps": honest_gaps,
        "solid_mastery": solid_mastery,
        "reading_thoughts": reading_thoughts,
        "highlights_with_notes": highlights_with_notes,
        "low_bkt_skills": [],
        "error_log": [],
    }


def analyze_kymbio_backup(data: dict[str, Any]) -> dict[str, Any]:
    proofs = data.get("questionProofRecords", {}) or {}
    skills = data.get("bktSkills", {}) or {}
    errors = data.get("errorLogEntries", []) or []

    committed_misconceptions: list[str] = []
    fragile_guesses: list[str] = []
    honest_gaps: list[str] = []
    solid_mastery: list[str] = []
    reading_thoughts: list[str] = []
    low_bkt_skills: list[str] = []
    error_log: list[str] = []

    for qid, rec in sorted(proofs.items()):
        if not isinstance(rec, dict):
            continue
        quad = rec.get("lastQuadrant", "")
        conf = rec.get("lastConfidencePercent")
        ans = str(rec.get("lastAnswerText", "")).strip()
        rt = str(rec.get("lastReadingThinkingText", "")).strip()
        missing = rec.get("missingKeywordsCSV", "")
        if rt:
            reading_thoughts.append(f"- `{qid}` (Topic {rec.get('topicCode', '?')}): \"{rt}\"")
        if quad == "committed_misconception":
            committed_misconceptions.append(
                f"- **`{qid}` (Topic {rec.get('topicCode', '?')})** — {conf}% confidence, missed `[{missing}]`: wrote *\"{ans}\"*"
            )
        elif quad == "fragile_guess":
            fragile_guesses.append(
                f"- **`{qid}` (Topic {rec.get('topicCode', '?')})** — passed with {conf}% confidence"
            )
        elif quad == "honest_gap" or rec.get("lastWasDontKnow"):
            honest_gaps.append(
                f"- **`{qid}` (Topic {rec.get('topicCode', '?')})** — {'skipped guessing (I do not know yet)' if rec.get('lastWasDontKnow') else f'missing [{missing}]'}"
            )
        elif quad == "solid_mastery" or rec.get("proofLevel") in ("proven", "secure"):
            twin_badge = " (via Transfer Twin)" if rec.get("provedViaTransferTwin") else ""
            solid_mastery.append(f"- `{qid}` ({rec.get('proofLevel', 'proven')}{twin_badge})")

    for sid, sk in sorted(skills.items()):
        if isinstance(sk, dict):
            p_learned = float(sk.get("pLearned", 0.0))
            if p_learned < 0.60:
                low_bkt_skills.append(
                    f"- **{sk.get('title', sid)}**: `pLearned = {p_learned:.2f}` (independent={sk.get('independentEvidenceCount', 0)}, assisted={sk.get('assistedEvidenceCount', 0)})"
                )

    for entry in errors:
        if isinstance(entry, dict):
            error_log.append(
                f"- **{entry.get('unitOrChapter', '?')}** ({entry.get('category', '?')}): wrote *\"{entry.get('whatIWWrote', '')}\"* -> Correction: *{entry.get('markSchemeCorrection', '')}*"
            )

    return {
        "source_type": "kymbiobackup",
        "title": f"KymBio Study Archive ({data.get('learnerName', 'Kym')})",
        "committed_misconceptions": committed_misconceptions,
        "fragile_guesses": fragile_guesses,
        "honest_gaps": honest_gaps,
        "solid_mastery": solid_mastery,
        "reading_thoughts": reading_thoughts,
        "highlights_with_notes": [],
        "low_bkt_skills": low_bkt_skills,
        "error_log": error_log,
    }


def build_markdown_report(analyses: list[dict[str, Any]]) -> str:
    committed = [item for a in analyses for item in a["committed_misconceptions"]]
    fragile = [item for a in analyses for item in a["fragile_guesses"]]
    gaps = [item for a in analyses for item in a["honest_gaps"]]
    solid = [item for a in analyses for item in a["solid_mastery"]]
    thoughts = [item for a in analyses for item in a["reading_thoughts"]]
    highlights = [item for a in analyses for item in a["highlights_with_notes"]]
    low_bkt = [item for a in analyses for item in a["low_bkt_skills"]]
    err_log = [item for a in analyses for item in a["error_log"]]

    lines = [
        "# Kym Revision & Textbook Authoring Brief",
        "",
        "Generated in read-only mode by `source/tests/read_kym_record.py` (PLAYBOOK §5.10).",
        "",
        "## 1. High-Priority Committed Misconceptions (Wrong + High Confidence)",
        *(committed if committed else ["- None recorded in this snapshot."]),
        "",
        "## 2. Fragile Guesses Needing Mechanism Reinforcement (Right + Low Confidence)",
        *(fragile if fragile else ["- None recorded in this snapshot."]),
        "",
        "## 3. Honest Gaps & Skipped Guessing ('I don't know yet')",
        *(gaps if gaps else ["- None recorded in this snapshot."]),
        "",
        "## 4. Sub-Topics Below 60% BKT Mastery",
        *(low_bkt if low_bkt else ["- All tracked skills at or above 60% mastery."]),
        "",
        "## 5. Kym's 'Thinking While Reading' Stream & Highlight Notes",
        *(thoughts + highlights if (thoughts or highlights) else ["- No pre-reveal reading thoughts or highlight notes recorded."]),
        "",
        "## 6. Metacognition Error-Attribution Log",
        *(err_log if err_log else ["- No error-attribution entries recorded."]),
        "",
        "## 7. Solid Independent Mastery & Transfer Twin Proofs",
        *(solid if solid else ["- No independent proofs recorded yet."]),
        "",
    ]
    return "\n".join(lines)


def run_self_test() -> int:
    sample_notebook = {
        "kind": "notebook",
        "keys": {
            "chk:ch02-1": {
                "r": "not",
                "conf": "sure",
                "a": "Plants get mass from soil minerals",
                "rt": "I remember van Helmont weighed the soil",
            },
            "pred:ch02-1": {
                "conf": "guess",
                "o": "A",
            },
        },
    }
    sample_backup = {
        "schemaVersion": 2,
        "learnerName": "Kym",
        "questionProofRecords": {
            "q_resp_01": {
                "topicCode": "1.1",
                "lastQuadrant": "committed_misconception",
                "lastConfidencePercent": 95,
                "lastAnswerText": "Breathing creates energy directly",
                "lastReadingThinkingText": "Lungs make ATP",
                "missingKeywordsCSV": "mitochondria, glucose",
            }
        },
        "bktSkills": {
            "ch01_respiration": {
                "title": "Aerobic Respiration",
                "pLearned": 0.42,
                "independentEvidenceCount": 0,
                "assistedEvidenceCount": 2,
            }
        },
        "errorLogEntries": [],
    }
    report = build_markdown_report([
        analyze_web_notebook(sample_notebook),
        analyze_kymbio_backup(sample_backup),
    ])
    assert "ch02-1" in report
    assert "q_resp_01" in report
    assert "Aerobic Respiration" in report
    print("PASS: read_kym_record.py self-test verified on notebook + kymbiobackup v2 fixtures.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Read-only KymBio & Living World learner record analyzer.")
    parser.add_argument("files", nargs="*", help="Paths to notebook .json or .kymbiobackup files")
    parser.add_argument("--out", help="Optional path to write REVISION_BRIEF.md")
    parser.add_argument("--self-test", action="store_true", help="Run built-in verification self-test")
    args = parser.parse_args(argv)

    if args.self_test:
        return run_self_test()
    if not args.files:
        parser.error("the following arguments are required: files (or --self-test)")

    analyses: list[dict[str, Any]] = []
    for path in args.files:
        if not os.path.exists(path):
            print(f"Error: file not found: {path}", file=sys.stderr)
            return 1
        with open(path, "r", encoding="utf-8") as f:
            raw = json.load(f)
        if raw.get("kind") == "notebook" or "keys" in raw:
            analyses.append(analyze_web_notebook(raw))
        else:
            analyses.append(analyze_kymbio_backup(raw))

    report = build_markdown_report(analyses)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as out_f:
            out_f.write(report)
    else:
        print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
