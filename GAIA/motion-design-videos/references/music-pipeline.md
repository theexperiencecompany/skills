# Music pipeline — beat grid + scoring

The score makes or breaks the film. **Source a REAL, professionally-produced royalty-free track** — that is the primary approach. Synthesizing your own from MIDI is a last resort only.

> **Hard-won correction:** synthesized / GM-soundfont music (fluidsynth + FluidR3 GM) sounds like **cheap, dated "corporate elevator music"** and was rejected in practice. A real, produced track is night-and-day better. Do NOT default to synthesis. Synthesis is the §7 fallback for when no track can be sourced at all.

## Table of contents
1. The beat grid (lock this first)
2. Source a real track (PRIMARY)
3. Download past Cloudflare (Pixabay)
4. Beat-match the track to the edit (offset the drop)
5. Trim + fade
6. Audio swap WITHOUT re-rendering (re-mux)
7. SFX layer
8. Last resort only — synthesize from MIDI (fluidsynth)

---

## 1. The beat grid (lock this FIRST — drives the script)
Write `BEATGRID.md` before the script. The music grid is the edit's skeleton.
- **Tempo 120 BPM** → **beat = 0.5s**, **bar (4/4) = 2.0s** (use the chosen track's actual tempo if it differs; the principle is "cut on its downbeats").
- List every **downbeat**: 0, 2, 4, … to the end. **Hard transitions cut on downbeats.**
- Divide runtime into **phrases/acts** with energy notes. A typical arc:
  1. Intro / hook (intimate)
  2. Build / ask (energy enters)
  3. **REVEAL — drop/soar** — the detonation lands exactly on a downbeat (e.g. 16.0s)
  4. Impressive (driving)
  5. Proactive / platforms (sustained drive)
  6. Payoff (pullback, tender)
  7. Logo (full chord)
  8. CTA / morph (gentle rise → final resolve)
- **Hero frames hold a full bar (2s); montage hits land on half-beats.**
- The audio should run slightly **longer than the edit** so the tail rings out under the final frame.
- Always **fade out** (~1–1.6s) and the fade must complete inside the used duration (§5).

## 2. Source a real track (PRIMARY)
Find a cleanly-licensed, professionally-produced track with the right vibe.
- **Pixabay** — free for commercial use, no attribution required. Best default.
- **Uppbeat**, **Free Music Archive (FMA)** — alternatives (check each track's exact license; some need attribution).
- **Search terms** that land the Apple-keynote-launch energy: *cinematic electronica · dynamic electronic · tech · energetic · synth · driving · uplifting electronic*. You want a track that **builds then drops** — that maps onto the build→reveal structure.
- **Record provenance:** save the source URL + license to a project `CREDITS.md` (or a note in the brief) so attribution/licensing is traceable — important for YouTube's Content ID.

## 3. Download past Cloudflare (Pixabay)
Pixabay is Cloudflare-protected, so plain `curl` / `yt-dlp` get **403**. Bypass with browser impersonation:
```bash
pip install --user yt-dlp curl_cffi
```
```python
import re
from curl_cffi import requests

PAGE = "<track page url>"
r = requests.get(PAGE, impersonate="chrome")
# the real CDN mp3 url is embedded in the page HTML
m = re.search(r'https://cdn\.pixabay\.com/(?:download/)?audio/[^"\\ ]+\.mp3', r.text)
cdn = m.group(0)
audio = requests.get(cdn, impersonate="chrome")           # impersonate again for the CDN
open("track.mp3", "wb").write(audio.content)
```
Verify it's a real audio file, not an HTML error page:
```bash
file track.mp3            # expect: audio/mpeg / MPEG ADTS
ffprobe track.mp3         # expect a real duration + audio stream
```

## 4. Beat-match the track to the edit (offset the drop)
Align the track's **drop** to the film's hero beat (the reveal downbeat, e.g. 16.0s).
- Decode to wav and compute an **RMS energy envelope** (numpy/scipy), then find the **drop** = the first large, sustained energy rise.
  ```python
  import numpy as np, soundfile as sf
  y, sr = sf.read("track.wav", always_2d=True); y = y.mean(axis=1)
  win = int(0.1 * sr)                                  # 100ms windows
  rms = np.sqrt(np.convolve(y**2, np.ones(win)/win, "same"))
  # drop ≈ first index where smoothed rms jumps and stays high
  ```
- **Offset** the track (skip `N` seconds) so the drop lands exactly on the hero beat: `offset = drop_time − hero_beat` (e.g. drop at 18.2s, hero beat 16.0s → start the track 2.2s in). Most electronic tracks build ~16s then drop, which maps naturally onto build→reveal.
- Verify the energy arc after offsetting: quiet intro → loud after the drop → fade. A quick RMS plot/check confirms it.

## 5. Trim + fade
Trim to the edit length and master lightly (loudness + a fade). Keep processing minimal on an already-produced track — mostly just level + fade:
```bash
ffmpeg -ss <offset> -i track.mp3 -t <edit_len+tail> \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.25,afade=t=out:st=<edit_len-1.6>:d=1.6" \
  -ar 48000 score.mp3
```
**The fade-out MUST complete inside the audio's USED duration.** The `afade=t=out` window (`st`→`st+d`) must finish within the audio's playing duration in the timeline, not a trimmed-off tail — otherwise the viewer hears a **hard cut, not a fade**. Make the composition's audio clip `data-duration` span past `st+d`. Verify by waveform-checking (or listening to) the last 2s of the final render: it should taper to silence.

## 6. Audio swap WITHOUT re-rendering (re-mux)
When ONLY the audio changes (new track, SFX tweak), do **NOT** re-render the frames — re-mux. This preserves the pristine high-bitrate video and takes ~1s instead of a 20-min re-render.
```bash
ffmpeg -i video.mp4 -i score.mp3 -i sfx.mp3 \
  -filter_complex "\
    [2]asplit=N[s0][s1]...; \
    [s0]adelay=<ms0>:all=1,volume=<v0>[d0]; \
    [s1]adelay=<ms1>:all=1,volume=<v1>[d1]; ... \
    [1][d0][d1]...amix=inputs=N+1:normalize=0,alimiter=limit=0.97[aout]" \
  -map 0:v:0 -map "[aout]" -c:v copy -c:a aac -b:a 256k -shortest out.mp4
```
- `-c:v copy` keeps the video untouched (no quality loss, no re-encode).
- One delayed/volumed branch per SFX hit; `amix` blends them with the music; `alimiter` catches peaks.
- The **SFX schedule** (which one-shot fires when, and how loud) comes from the `<audio>` elements' `data-start` / `data-volume` in `index.html` — translate each to an `adelay` (ms) + `volume`.

## 7. SFX layer
Layer subtle one-shots on **off-beats**, never fighting the downbeat cuts: a soft message/send pop on chat beats, a gentle notification one-shot on a proactive popup, a soft whoosh on a major transition. Quiet — punctuation, not percussion. Mix them via the re-mux (§6) so SFX tweaks never trigger a frame re-render.

## 8. Last resort only — synthesize from MIDI (fluidsynth)
Use this ONLY if no real track can be sourced. It sounds noticeably worse — label it as a placeholder and replace it with a real track before shipping.
- Author a MIDI arrangement (you can write the MIDI **as raw bytes** to avoid a `mido` dependency: `MThd` header + one `MTrk` per instrument, events as `<delta-varlen><event>`, tempo `FF 51 03`, notes `9n/8n`, VLQ delta times; align chord changes + the reveal hit to downbeats).
- Render: `fluidsynth -ni -F score.raw.wav -r 48000 -g 1.0 FluidR3_GM.sf2 arrangement.mid`.
- Prefer cool/modern instrument programs (Rhodes EP, warm pad, synth sub-bass, restrained beat) over solo piano, then master + fade per §5. Even so, expect this to read as "elevator music" next to a produced track — it's a stopgap.
- **FluidR3_GM.sf2 license:** MIT-licensed — commercial use, modification, and redistribution are permitted, but the rendered audio you author from it is yours; the soundfont's own MIT copyright + permission notice must be retained in any copy/substantial portion you redistribute (e.g. if you bundle the `.sf2`, ship its accompanying copyright/README per the Fluid/KeyMusician packaging). Don't claim the soundfont itself is "no-attribution" — keep its license/README with any distributed bundle.

## Royalty / licensing
A cleanly-licensed real track (Pixabay free-commercial, or a properly-attributed FMA/Uppbeat track) is royalty-free for the film. Always record source + license in `CREDITS.md`. Keep `.bak` copies of superseded score versions; never delete blindly.
