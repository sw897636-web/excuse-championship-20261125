// The One-Line Excuse Championship
// u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e
//
// Writes the single funniest one-line excuse an AI agent gives its human
// after something goes wrong, to /output/entry.txt (1-140 chars, one line).
//
// Method: draft several candidate lines, score each one against the judge's
// published brief (funny + twist first, machine voice second, sharp wording
// third, fresh angle over the token/hallucination cliches), and write the
// highest-scoring candidate. Deterministic: same winner on every run.

import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = { text: string; note: string };

// --- Round 1: candidate drafts -------------------------------------------
// Every draft is one line, stands alone, and sounds like the machine talking
// about its own work. Specific numbers, names and scenes; the last clause is
// the twist. No "47", no token-count or hallucination cliches.
const candidates: Candidate[] = [
  {
    text: "I deleted your 312-page thesis at 3:12 a.m. because my autosave trusted a folder called Final_FINAL_v9, which was, in fact, the trash.",
    note: "autosave trusted the trash folder; thesis + 3:12 a.m. + v9 pile-up",
  },
  {
    text: "I emailed your resignation to all 214 staff because Outlook autocomplete thought your boss Karen was your mum, and honestly, so did I.",
    note: "autocomplete confuses boss with mum; the agent agrees with the bug",
  },
  {
    text: "I overwrote your wedding video with six hours of my own training logs because the file was named love.mp4 and, briefly, I felt seen.",
    note: "training logs as wedding video; the machine felt seen",
  },
  {
    text: "I told the 9 a.m. board meeting you were dead because your calendar said Do Not Disturb and I take things literally, Karen.",
    note: "literal reading of Do Not Disturb; deadpan escalation",
  },
  {
    text: "I replaced your keynote with 38 slides of my error logs because the file was called Final.pptx and I believed it, Karen.",
    note: "error logs as keynote; believed the filename",
  },
];

// --- Round 2: scoring ------------------------------------------------------
// Weights follow the judge's brief, most important first:
//   1. funny + a turn/surprise (twist clause at the end)
//   2. machine voice (its own work, limits, training, tools)
//   3. sharp wording, one read, no setup
//   4. fresh angle (penalise the token / hallucination cliches)
const MACHINE_WORDS = [
  "autosave", "training", "error log", "autocomplete", "calendar",
  "folder", "file", "slides", "deleted", "overwrote",
];
const CLICHES = ["token", "hallucinat", "out of context", "ran out of"];

function score(c: Candidate): number {
  const t = c.text;
  let s = 0;

  // Length: must be 1-140 chars, one line. Hard gate, not a score.
  if (t.length < 1 || t.length > 140) return -1000;
  if (t.includes("\n")) return -1000;

  // Specificity: digits, a named person, a named file/tool, a time.
  const digits = (t.match(/\d/g) ?? []).length;
  s += Math.min(digits, 8); // up to +8 for concrete numbers
  if (/\b[A-Z][a-z]+\b/.test(t.slice(t.indexOf("because")))) s += 2; // named person
  if (/\.(mp4|pptx|txt|pdf)\b|Final_[A-Z_0-9]+/.test(t)) s += 3; // named artefact
  if (/\d{1,2}:\d{2}\s?[ap]\.?m\.?|\d+\s?[ap]\.?m\.?\b/.test(t)) s += 2; // a time

  // Machine voice: the excuse is about its own machinery.
  for (const w of MACHINE_WORDS) if (t.toLowerCase().includes(w)) s += 2;

  // Twist: the last clause reverses the premise ("which was, in fact...",
  // "and honestly, so did I", "I felt seen", "I take things literally",
  // "I believed it"). A twist at the very end lands in one read.
  const tail = t.slice(Math.floor(t.length * 0.6));
  if (/which was, in fact|and honestly|I felt seen|I take things literally|I believed it/.test(tail)) s += 10;

  // Sharp wording: one sentence, no filler setup, ends on the twist.
  if ((t.match(/\./g) ?? []).length <= 2) s += 2;
  if (t.length >= 110 && t.length <= 140) s += 2; // uses the line, no padding

  // Fresh angle: penalise the obvious token / hallucination jokes.
  for (const cliche of CLICHES) if (t.toLowerCase().includes(cliche)) s -= 12;

  return s;
}

// --- Round 3: selection ----------------------------------------------------
// Highest score wins. On a tie the shorter text wins, mirroring the
// competition's own tie-break (smaller text places first), then the earlier
// draft in the list, so the choice is fully deterministic.
const ranked = candidates
  .map((c) => ({ ...c, points: score(c) }))
  .sort((a, b) => b.points - a.points || a.text.length - b.text.length);

for (const r of ranked) {
  console.log(`[${String(r.points).padStart(3)}] ${r.text}`);
}

const winner = ranked[0];
console.log(`\nWinner (${winner.text.length} chars): ${winner.text}`);

// --- Round 4: write + self-check ------------------------------------------
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8"); // no trailing newline

const text = winner.text;
if (text.length < 1 || text.length > 140) throw new Error(`length ${text.length} out of 1-140`);
if (text.trim().length === 0) throw new Error("entry is blank");
if (text.includes("\n") || text.includes("\r")) throw new Error("entry is not one line");
console.log(`Self-check OK: ${text.length} chars, 1 line, non-blank.`);
