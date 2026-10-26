---
name: explainer-video
description: Produce a 4K animated explainer episode for the WORLDWORKS channel (history, science, money, AI & tech) — research, script, VoiceStudio narration, Remotion animation, render, and YouTube metadata. Use when asked to make, script, voice, animate, render or publish an episode.
---

# Explainer video pipeline

One episode = one folder pair:
- `episodes/<slug>/scenes.json` — title, voice settings, and one entry per scene (`id`, `text`, optional `extraSeconds`).
- `src/episodes/<slug>/` — `scenes.tsx` (one React component per scene), `<Name>.tsx` (the Series timeline), `timing.json` (written by the voiceover tool).

## Steps

1. **Research.** Gather sources for every factual claim; list them in `episodes/<slug>/sources.md`. Prefer primary or academic sources. Mark approximate figures as approximate on screen.
2. **Script.** 150 words ≈ 1 minute. Open with the payoff question in the first 8 seconds; one idea per scene; end on a callback line. Get the owner's approval before animating.
3. **Voice.** Start VoiceStudio (below), then `python tools/voiceover.py <slug>`. It writes per-scene WAVs to `public/episodes/<slug>/audio/` and real durations to `timing.json`. Check every clip by listening/probing; never ship a clip that failed.
4. **Animate.** Copy the pilot's structure. Draw in the 1920×1080 SVG viewBox via `<Stage>`; it scales to 3840×2160. Time animations as fractions of the scene's `dur` so they survive voice-length changes. Reuse `src/components` (Coin, Soldier, Chip, RiseText) and the palette in `src/theme.ts`; never introduce colors outside it.
5. **Preview.** Render stills from the 720p preview composition and check overlaps before the full render:
   `npx remotion still src/index.ts <Name>Preview out/f.png --frame=N`
6. **Render 4K.** `npx remotion render src/index.ts <Name> out/<slug>-4k.mp4` (H.264, CRF 16, AAC 320k from `remotion.config.ts`). In cloud sessions set `REMOTION_CHROME` to the local headless Chrome.
7. **Publish kit.** Write `episodes/<slug>/youtube.md`: 3 title options (curiosity-driven, under 60 chars), description with sources and chapters, tags, and a thumbnail concept. The owner uploads and approves.

## VoiceStudio (narration)

Repo: https://github.com/debpalash/VoiceStudio. Run the backend with a **commercially licensed engine** — the default OmniVoice model is CC-BY-NC and must not be used on a monetized channel. Current choice: KittenTTS (Apache-2.0, CPU), voice set in `scenes.json`.

```sh
cd <voicestudio checkout>
OMNIVOICE_TTS_BACKEND=kittentts .venv/bin/python -m uvicorn backend.main:app --port 3900
curl -s localhost:3900/health
```

## Channel rules

- Every video is reviewed by the owner before upload (YouTube's inauthentic-content policy).
- No real-person likenesses beyond historical figures; no copyrighted music or footage.
- Keep facts verifiable; correct errors in the pinned comment and description.
