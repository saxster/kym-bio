#!/usr/bin/env python3
"""Verify that the built web textbook (index.html) and source modules include:
1. Settings space for ElevenLabs (xi-api-key, en-GB) & Gemini Live Voice Full-Duplex API keys (#settings-voice-coach-keys)
2. Cross-book shared local storage vault (kym:family:voice_keys) + 4 voice modes + 4 British English voice presets
3. 1-on-1 Full-Duplex Voice Coach (#coach-desk, #tb-coach, BidiGenerateContent WebSocket, barge-in, thinking hold, deictic pointing, and notebook takeaway)
4. ElevenLabs British English (en-GB) streaming integration in m_readaloud.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_ROOT = os.path.dirname(ROOT)


def assert_contains(content, needle, label):
    if needle not in content:
        raise AssertionError(f"Missing expected {label}: {needle!r}")


def main():
    index_path = os.path.join(REPO_ROOT, "index.html")
    assert os.path.exists(index_path), f"Missing {index_path}"
    html = open(index_path, encoding="utf-8").read()

    # 1. Settings space for ElevenLabs & Gemini Live Full-Duplex API keys
    for token in [
        "settings-voice-coach-keys",
        "settings-gemini-key",
        "settings-elevenlabs-key",
        "settings-gemini-model",
        "settings-save-keys-btn",
        "settings-open-coach-btn",
        "kym:family:voice_keys",
        "gemini_live_duplex",
        "hybrid_duplex_elevenlabs",
        "elevenlabs_british",
        "local_isabella",
        "charlotte_oxford",
        "george_rp",
        "alice_educator",
        "daniel_story",
    ]:
        assert_contains(html, token, "Settings Voice Coach & API Key token")

    # 2. 1-on-1 Full-Duplex Voice Coach Desk & Deictic Tools
    for token in [
        "coach-desk",
        "coach-live-btn",
        "coach-hold-btn",
        "coach-explain-btn",
        "coach-save-takeaway",
        "coach-keys-btn",
        "BidiGenerateContent",
        "focus_book_section",
        "open_understand_card",
        "save_call_takeaway",
        "coach-deictic-focus",
        "eleven_flash_v2_5",
    ]:
        assert_contains(html, token, "1-on-1 Full-Duplex Coach token")

    print("PASS: Web textbook index.html verified for ElevenLabs & Gemini Live Full-Duplex Settings + 1-on-1 Tutor Coach.")


if __name__ == "__main__":
    main()
