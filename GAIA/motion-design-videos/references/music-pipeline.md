# Music pipeline — beat grid + original score

The film is scored to an **original** track rendered from a MIDI arrangement through real sampled instruments, then mastered. This reads dramatically better than additive synthesis or a generic "corporate piano."

## Table of contents
1. The beat grid (lock this first)
2. Why a real soundfont, not synthesis
3. Generating MIDI as raw bytes
4. Rendering with fluidsynth
5. Mastering with ffmpeg
6. SFX layer
7. Royalty / licensing

---

## 1. The beat grid (lock this FIRST — drives the script)
Write `BEATGRID.md` before the script. The music grid is the edit's skeleton.
- **Tempo 120 BPM** → **beat = 0.5s**, **bar (4/4) = 2.0s**.
- List every **downbeat**: 0, 2, 4, … to the end. **Hard transitions cut on downbeats.**
- Divide runtime into **phrases/acts** with energy notes. The worked film's arc:
  1. Intro / hook (intimate)
  2. Build / ask (bass + pads enter)
  3. **REVEAL — soar** (melody + octave, swell) — the detonation lands exactly on a downbeat (16.0s in the example)
  4. Impressive (driving arpeggio + bass)
  5. Proactive / platforms (sustained drive)
  6. Payoff (pullback, tender)
  7. Logo (full warm chord)
  8. CTA / morph (gentle rise → final bright resolve chord)
- **Hero frames hold a full bar (2s); montage hits land on half-beats.**
- The audio file is slightly **longer than the edit** so reverb/instrument tails ring out under the final frame.
- Master fades: ~0.25s in, ~1.6s **fade-out** at the end. Always fade out.

## 2. Why a real soundfont, not synthesis
Render a MIDI arrangement through **fluidsynth + a real General MIDI soundfont (FluidR3_GM.sf2)** → true sampled instruments. Do NOT use additive/oscillator synthesis, and avoid the generic solo-piano "corporate" sound. Cool/modern instrumentation reads far more premium:
- **Rhodes electric piano** (warm, modern) as the melodic bed
- a **warm synth pad** for swell/sustain
- a **synth sub-bass** for weight
- a **tasteful, restrained electronic beat** (soft kick + hat on the grid)

Map these to GM program numbers (e.g. Rhodes EP ≈ program 4, warm pad ≈ 89, synth bass ≈ 38, drums on MIDI channel 10).

## 3. Generating MIDI as raw bytes (no `mido` dependency)
Write the MIDI file **as raw bytes** in a small script — no third-party MIDI library required, so it runs anywhere. Structure:
- **Header chunk** `MThd`: format 1, ntracks, division = ticks-per-quarter (e.g. 480).
- One **track chunk** `MTrk` per instrument, each a sequence of `<delta-varlen><event>`:
  - tempo meta (`FF 51 03 <usec-per-quarter>`; 120 BPM = 500000)
  - program change (`Cn pp`)
  - note on / note off (`9n kk vv` / `8n kk 00`), delta times in ticks from the grid
  - end-of-track (`FF 2F 00`)
- Delta times use **variable-length quantity** encoding (7 bits/byte, high bit = continuation).
- Compute note start/length in ticks from the beat grid: `ticks = beats * division`. Place chord changes and the reveal hit on exact downbeats so the audio aligns to the cut grid.

Keep the arrangement deterministic and grid-aligned — the cuts depend on it.

## 4. Rendering with fluidsynth
```bash
fluidsynth -ni -F score.raw.wav -r 48000 -g 1.0 FluidR3_GM.sf2 arrangement.mid
```
`-ni` no shell/no MIDI-in, `-F` render to file, `-r` sample rate, `-g` gain. Produces a dry WAV.

## 5. Mastering with ffmpeg
Apply, in this order, a warm/glued master and **always a fade-out**:
```bash
ffmpeg -i score.raw.wav -af "\
  equalizer=f=120:t=q:w=1:g=2,\
  equalizer=f=8000:t=q:w=1:g=1.5,\
  acompressor=threshold=-18dB:ratio=2.5:attack=20:release=250,\
  aecho=0.8:0.85:60:0.18,\
  loudnorm=I=-14:TP=-1.5:LRA=11,\
  afade=t=in:st=0:d=0.25,afade=t=out:st=56.7:d=1.6" \
  -ar 48000 score.mp3
```
- **Warm EQ**: low-shelf/bell lift ~120Hz for body, a touch of air ~8kHz.
- **Glue compression**: gentle (ratio ~2.5, slow-ish attack) to bind the mix.
- **Light reverb** (`aecho` or `aresample`+`afir`/`aecho`): a small hall, not a cathedral.
- **loudnorm**: target ~-14 LUFS for web playback.
- **Fade**: short fade-in, ~1.6s fade-out timed to the tail (set `st` to runtime).

## 6. SFX layer
Layer subtle one-shots on **off-beats**, never fighting the downbeat cuts: a soft message/send pop on chat beats, a gentle notification one-shot on a proactive popup, a soft whoosh on a major transition. Keep them quiet — punctuation, not percussion.

## 7. Royalty / licensing
Original composition + a freely-licensed soundfont (FluidR3 GM) = royalty-free. Keep `.bak` copies of superseded score versions for reference; never delete blindly.
