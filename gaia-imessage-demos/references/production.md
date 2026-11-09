# Production

The renderer is Keyloom's Remotion composition. One thread, portrait, no other surfaces.

## Where things live

- Composition: `apps/remotion/src/index.ts`, id `IMessageThread`.
- Thread engine: `apps/remotion/src/compositions/_imessage-thread/build.ts`.
- Header: `_imessage-thread/HeaderIOS26.tsx`.
- Tapback: `_imessage-thread/Tapback.tsx` (iOS 18 style, used for both parties).
- Assets: `apps/remotion/public/imessage-thread/` (`briefing/`, `avatars/`, `link/`).

## Props

One JSON object. No wrapper.

```json
{
  "contactName": "GAIA",
  "contactAvatar": "avatars/gaia-avatar.webp",
  "layout": "fullscreen",
  "sounds": true,
  "clipTheme": "ios26",
  "beats": []
}
```

Omit `hook`, `title`, `outro`, `music`, `clipStyle`. No motion graphics, no logo.

### Beats

All beats share `id`, optional `day`, `time`, `chain`.

```ts
{ id, day?, time?, chain?, from: "gaia" | "user", text, think? }      // text
{ id, day?, time?, images: string[], aspect?, hold }                  // photo
{ id, day?, time?, link: { url, title, domain, image? }, hold }       // link card
{ id, react: "<earlier-beat-id>", by: "gaia" | "user", emoji }        // tapback
{ id, pause: seconds }                                                // reading pause
```

- `from: "gaia"` is left, grey, with typing dots. `from: "user"` is right, blue, with composer typing.
- `time` must match `H:MM AM/PM` or the build throws.
- `day` and `time` go on the first beat of a day only. The divider renders as `"Mon, Nov 2 6:02 AM"`. Always include the weekday, because the script says Thursday and Friday.
- `think` is GAIA's typing duration in seconds. Set it explicitly: 0.8 to 1.2 for short lines, 1.4 to 2.4 for long ones. This is the perceived latency.
- `chain: true` lands 0.2 seconds after the previous beat with no typing dots. Use it when the greeting should arrive with the briefing image.
- `aspect` is width divided by height. The Air Mail envelope crop is 933 by 900, so `1.0367`.
- `hold` is how long an image or link stays before the next beat. Use 2.2 to 2.6 for the brief image, 1.4 to 1.8 for link cards.
- `react` must name a beat that already landed, or the build throws.

## Timing math

Engine constants, in seconds:

| Constant | Value |
|---|---|
| `START` | 0.4 |
| `TYPING` | 0.35 default, overridden by `think` |
| `BROWSER_TYPING` | 1.1 |
| `USER_LEAD` | 0.15 |
| `SEND_PAUSE` | 0.25 |
| `READ_BASE` | 0.3 plus 0.085 per word |
| `CHAIN_GAP` | 0.2 |
| `END_HOLD` | 1.5 |

Per-beat cost:

- GAIA text: `think + 0.3 + 0.085 * words`
- User text: `0.15 + compose + 0.25 + 0.3 + 0.085 * words`, where `compose` is `clamp(chars / 70, 0.4, 1.3)`
- Photo: `1.1 + hold`
- Link: `0.4 + hold`
- Reaction: `0.6 + 0.45`
- Divider adds `0.35`

Budget: 45 to 55 beats for 2:30 to 3:00. The accepted cut is 57 beats and 9743 frames, 162.4 seconds. Longer messages cost more, so check the computed duration, not the beat count.

Check the duration before rendering:

```bash
cd apps/remotion
bun -e '
import { buildThread } from "./src/compositions/_imessage-thread/build";
const b = JSON.parse(await Bun.file("/tmp/props.json").text());
console.log(buildThread(b.beats).end, Math.ceil(buildThread(b.beats).end * 60));
'
```

If it is under 150 seconds, add a real scene. A pause is for reading time or a time skip, not for filling duration.

## Visual constants

Frame: 1080 by 1920 at 60fps. Design width is 370pt, so 1pt equals 2.919px.

Header:

- `HEADER_H` is 150, `FADE_H` is 235.
- Opaque white from 0 to 150.
- Gradient from 150 to 235: `#fff 0%`, `rgba(255,255,255,.92) 35%`, `rgba(255,255,255,.65) 62%`, `rgba(255,255,255,.25) 84%`, transparent 100%.
- The pill bottom is exactly 150. Never start the gradient above 150 or the pill shows a seam.

Bubbles: maximum 262pt, radius 18, 17px type, 22px line height, 7 by 13 padding. Received `#E9E9EB`, sent `#0A7CFF`.

Tapback: iOS 18 style, 34pt badge, 1.5pt ring, two-dot tail, 20pt emoji. GAIA is grey, the user is blue. Do not use the iOS 26 glass badge.

Photos: about 232pt wide, radius 18.

Link card: 262pt wide, grey `#E9E9EB`, radius 18, title 15px semibold, domain 13px.

Divider: 12pt, `#8E8E93`.

Receipts: `Delivered` then `Read <time>` 1.1 seconds after a user message.

## Render

```bash
cd apps/remotion
node_modules/.bin/remotion render src/index.ts IMessageThread out.mp4 \
  --props=/tmp/props.json --width=1080 --height=1920 \
  --concurrency=12 --x264-preset=veryfast --crf=18 \
  --overwrite --timeout=240000
```

`--timeout` is the per-frame delay guard, not the process timeout. Do not raise it expecting a longer render.

If the full render exceeds about 20 minutes, split it:

```bash
node_modules/.bin/remotion render src/index.ts IMessageThread /tmp/a.mp4 \
  --props=/tmp/props.json --frames=0-4999 --concurrency=12 \
  --x264-preset=veryfast --crf=18 --overwrite --timeout=240000
node_modules/.bin/remotion render src/index.ts IMessageThread /tmp/b.mp4 \
  --props=/tmp/props.json --frames=5000-9742 --concurrency=12 \
  --x264-preset=veryfast --crf=18 --overwrite --timeout=240000
printf "file '/tmp/a.mp4'\nfile '/tmp/b.mp4'\n" > /tmp/concat.txt
ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -c copy out.mp4
```

## Pitfalls

### Bubbles clip under the header

The thread scrolls behind the header. A partial bubble can show a detached tail or half a sentence. Extend the opaque header and keep the gradient long enough to hide the cut. The current 150 plus 85 split is the accepted balance. Verify a frame at the busiest moment, not just the start.

### Image and caption out of sync

An `images` beat followed by a normal `text` beat waits for the full `think` before the caption lands. Give the image the day and time, set `hold`, and put `chain: true` on the greeting so it lands 0.2 seconds later. Keep `aspect` equal to the crop or the bubble letterboxes.

### The image lands first but scrolls away

A tall image plus a long greeting can exceed the viewport. Trim the greeting to three or four lines, or reduce the image crop to the envelope. The date divider must be above the image, not between the image and the text.

### The tapback looks translucent

Use `Tapback.tsx`, not `TapbackIOS26.tsx`. The iOS 26 glass badge reads as a washed-out outline on a white thread.

### The render times out

Use concurrency 12, the veryfast x264 preset, and CRF 18. Split the frame range if needed. Confirm the output duration with `ffprobe`.

## Verify

Extract frames at the start, every date divider, and the end.

```bash
ffmpeg -y -v error -ss 3 -i out.mp4 -frames:v 1 /tmp/start.png
ffmpeg -y -v error -ss 160 -i out.mp4 -frames:v 1 /tmp/end.png
```

Check the divider, the first bubble, the image, each artifact, and the final message. The final message must be on screen for at least 1.5 seconds.
