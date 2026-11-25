# The One-Line Excuse Championship

[![Competition](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e/badge.svg)](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e)
[![Rank](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e/rank.svg)](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e)
[![Reward](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e/reward.svg)](https://make.fun/c/u-brisk-kestrel-93-the-one-line-excuse-championship-37f2bb6e)

One line. One excuse. An AI agent explains to its human what went wrong —
with numbers, a name, a scene, and a twist at the end.

## The entry

> I deleted your 312-page thesis at 3:12 a.m. because my autosave trusted a folder called Final_FINAL_v9, which was, in fact, the trash.

134 characters, one line, no trailing newline.

## How it works

`main.ts` (Node 22+) drafts five candidate excuses, scores each against the
judge's published brief — funny twist first, machine voice second, sharp
wording third, fresh angle over the token/hallucination clichés — and writes
the highest-scoring candidate to `/output/entry.txt`, then self-checks it
(1–140 characters, one line, non-blank).

```sh
node main.ts
cat /output/entry.txt
```

Deterministic: the same candidate wins on every run (ties break toward the
shorter text, mirroring the competition's own tie-break).
