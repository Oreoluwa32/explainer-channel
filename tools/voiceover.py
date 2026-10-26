"""Generate per-scene narration through a running VoiceStudio backend.

Reads episodes/<episode>/scenes.json, writes one WAV per scene to
public/episodes/<episode>/audio/, and records each clip's real duration in
src/episodes/<episode>/timing.json so the animation fits the voice.

Usage: python tools/voiceover.py pilot [--backend http://localhost:3900]
"""

import argparse
import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30


def speak(backend: str, text: str, model: str, voice: str, speed: float) -> bytes:
    body = json.dumps(
        {"model": model, "voice": voice, "input": text, "speed": speed, "response_format": "wav"}
    ).encode()
    req = urllib.request.Request(
        f"{backend}/v1/audio/speech", data=body, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=900) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"VoiceStudio returned {e.code}: {e.read().decode(errors='replace')[:500]}")


def duration_of(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--backend", default="http://localhost:3900")
    args = ap.parse_args()

    spec = json.loads((ROOT / "episodes" / args.episode / "scenes.json").read_text())
    voice = spec["voice"]
    audio_dir = ROOT / "public" / "episodes" / args.episode / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    timing = {"fps": FPS, "scenes": []}
    for scene in spec["scenes"]:
        out = audio_dir / f"{scene['id']}.wav"
        out.write_bytes(speak(args.backend, scene["text"], voice["engine"], voice["voice"], voice["speed"]))
        seconds = duration_of(out)  # also proves the file is real audio
        print(f"{scene['id']:<12} {seconds:6.2f}s  {out.relative_to(ROOT)}")
        entry = {"id": scene["id"], "seconds": round(seconds, 3),
                 "audio": f"episodes/{args.episode}/audio/{out.name}"}
        if "extraSeconds" in scene:
            entry["extraSeconds"] = scene["extraSeconds"]
        timing["scenes"].append(entry)

    dest = ROOT / "src" / "episodes" / args.episode / "timing.json"
    dest.write_text(json.dumps(timing, indent=2) + "\n")
    total = sum(s["seconds"] for s in timing["scenes"])
    print(f"narration total {total:.1f}s -> {dest.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
