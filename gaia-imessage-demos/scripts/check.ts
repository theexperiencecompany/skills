#!/usr/bin/env bun
/**
 * Pre-flight check for a GAIA iMessage demo props file.
 *
 *   bun scripts/check.ts /tmp/props.json
 *   bun scripts/check.ts /tmp/props.json --year 2026
 *
 * Static checks only. It does not render. It mirrors the engine's timing
 * constants closely enough to catch duration drift, and it enforces the
 * logic and voice rules that can be checked mechanically.
 */

type Beat = {
  id: string;
  day?: string;
  time?: string;
  chain?: boolean;
  from?: "gaia" | "user";
  text?: string;
  think?: number;
  images?: string[];
  aspect?: number;
  hold?: number;
  link?: { url: string; title: string; domain: string; image?: string };
  react?: string;
  by?: "gaia" | "user";
  emoji?: string;
  pause?: number;
};

const file = process.argv[2];
if (!file) {
  console.error("usage: bun scripts/check.ts <props.json> [--year 2026]");
  process.exit(2);
}

const yearArg = process.argv.indexOf("--year");
const year = yearArg > -1 ? Number(process.argv[yearArg + 1]) : 2026;

const props = JSON.parse(await Bun.file(file).text());
const beats: Beat[] = props.beats;
const errors: string[] = [];
const warnings: string[] = [];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

if (!Array.isArray(beats)) {
  console.error("props.beats must be an array");
  process.exit(2);
}

// ---------- ids and reactions ----------
const seen = new Set<string>();
const indexById = new Map<string, number>();

beats.forEach((b, i) => {
  if (!b.id) errors.push(`beat ${i}: missing id`);
  if (seen.has(b.id)) errors.push(`duplicate id "${b.id}"`);
  seen.add(b.id);
  indexById.set(b.id, i);
});

beats.forEach((b, i) => {
  if (b.react) {
    const target = indexById.get(b.react);
    if (target === undefined) errors.push(`beat ${b.id}: reaction targets unknown "${b.react}"`);
    else if (target >= i) errors.push(`beat ${b.id}: reaction targets a later beat "${b.react}"`);
    if (!b.emoji) errors.push(`beat ${b.id}: reaction has no emoji`);
  }
});

// ---------- days and times ----------
let lastDate = -Infinity;
let currentDay = "";
const firstOfDay = new Set<string>();

beats.forEach((b, i) => {
  if (!b.day) return;
  const match = b.day.match(/^([A-Z][a-z]{2}), ([A-Z][a-z]{2}) (\d{1,2})$/);
  if (!match) {
    errors.push(`beat ${b.id}: day "${b.day}" must look like "Mon, Nov 2"`);
    return;
  }
  const [, weekday, mon, day] = match;
  const month = MONTHS[mon as string];
  const date = Date.UTC(year, month, Number(day));
  if (month === undefined || Number.isNaN(date)) {
    errors.push(`beat ${b.id}: bad date "${b.day}"`);
    return;
  }
  const actual = WEEKDAYS[new Date(date).getUTCDay()];
  if (actual !== weekday) {
    errors.push(`beat ${b.id}: "${b.day}" is a ${actual} in ${year}, not a ${weekday}`);
  }
  if (date <= lastDate) errors.push(`beat ${b.id}: dates must increase, "${b.day}" repeats or goes back`);
  lastDate = date;
  if (!b.time) errors.push(`beat ${b.id}: first beat of ${b.day} needs a time`);
  firstOfDay.add(b.id);
  currentDay = b.day;
});

beats.forEach((b) => {
  if (b.time && !/^\d{1,2}:\d{2} (AM|PM)$/.test(b.time)) {
    errors.push(`beat ${b.id}: time "${b.time}" must look like "9:20 PM"`);
  }
});

// ---------- artifacts ----------
beats.forEach((b) => {
  if (b.images) {
    if (!b.aspect) errors.push(`beat ${b.id}: image needs an aspect (width / height)`);
    if ((b.hold ?? 0) < 1.5) warnings.push(`beat ${b.id}: image hold ${b.hold ?? 0}s is short`);
  }
  if (b.link) {
    if (!b.link.title || words(b.link.title) < 2) {
      errors.push(`beat ${b.id}: link title must say what the document is`);
    }
    if (!b.link.domain) errors.push(`beat ${b.id}: link needs a domain`);
  }
});

// ---------- voice checks ----------
const banned: Array<[RegExp, string]> = [
  [/\bwho is this\b/i, "identity surprise"],
  [/\bnothing on your plate\b/i, "contradiction with a personal item"],
  [/\btwo months back\b/i, "unresolved shorthand"],
  [/\bas an ai\b/i, "AI tell"],
  [/\bhope this helps\b/i, "chatbot filler"],
  [/^i know\.?$/i, "flat acknowledgement"],
  [/^draft(ed)?\.?$/i, "clipped status register"],
  [/^done\.?$/i, "clipped status register"],
  [/\bETA\b/i, "jargon"],
];

beats.forEach((b) => {
  if (!b.text) return;
  for (const [re, reason] of banned) {
    if (re.test(b.text.trim())) errors.push(`beat ${b.id}: ${reason} ("${b.text}")`);
  }
  if (b.text.includes("—")) warnings.push(`beat ${b.id}: em dash in dialogue`);
  if (words(b.text) > 32) warnings.push(`beat ${b.id}: ${words(b.text)} words is long for one bubble`);
});

// ---------- duration estimate ----------
let t = 0.4;
for (const b of beats) {
  if (b.pause) { t += b.pause; continue; }
  if (b.react) { t += 0.6 + 0.45; continue; }
  if (b.images) { t += 1.1 + (b.hold ?? 2); continue; }
  if (b.link) { t += 0.4 + (b.hold ?? 1.5); continue; }
  if (b.text) {
    if (b.chain) t += 0.2;
    else if (b.from === "gaia") t += b.think ?? 0.35;
    else t += 0.15 + clamp(Array.from(b.text).length / 70, 0.4, 1.3) + 0.25;
    t += 0.3 + 0.085 * words(b.text);
  }
}
t += 1.5;

const frames = Math.ceil(t * 60);
const last = beats[beats.length - 1];
if ((last?.pause ?? 0) < 1.5) {
  warnings.push("last beat should be a pause of at least 1.5s so the final bubble reads");
}
const messages = beats.filter((b) => b.text || b.images || b.link).length;
if (messages < 45) warnings.push(`${messages} messages is short for a 2:30 cut`);
if (messages > 65) warnings.push(`${messages} messages is long; check that the duration still fits`);
if (t < 150) warnings.push(`estimated ${t.toFixed(1)}s is under 2:30`);
if (t > 190) warnings.push(`estimated ${t.toFixed(1)}s is over 3:10`);

// ---------- report ----------
console.log(`messages   ${messages}`);
console.log(`beats      ${beats.length}`);
console.log(`duration   ${t.toFixed(1)}s  (${frames} frames @ 60fps)`);
console.log(`days       ${firstOfDay.size}`);

if (warnings.length) {
  console.log("\nwarnings");
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.log("\nfail");
  for (const e of errors) console.log(`  - ${e}`);
  console.log(`\n${errors.length} error${errors.length === 1 ? "" : "s"}`);
  process.exit(1);
}

console.log("\npass");
