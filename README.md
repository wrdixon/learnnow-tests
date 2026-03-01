# LearnNoW Tests

Interactive Norwegian language tests aligned with the [NTNU LearnNoW](https://www.ntnu.edu/learnnow) beginner curriculum.

## Features

- **Three question types**: Norwegian → English translation, English → Norwegian translation, fill-in-the-blank multiple choice
- **Two-attempt system**: Get a hint and second chance before seeing the answer
- **Norwegian character buttons**: æ, ø, å buttons for keyboards without these letters
- **Unlimited practice**: Keep going as long as you want, with wrong answers recycled
- **Progressive review**: Later chapters blend in vocabulary from earlier chapters
- **Printable tests**: Generate a 20-question PDF-ready test for any chapter
- **Results tracking**: See first-try, second-try, and missed breakdowns

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to GitHub Pages

1. Update `base` in `vite.config.js` to match your repo name
2. Run:
```bash
npm run deploy
```

## Adding chapters

Chapter data lives in `data/chapterN.json`. Each file contains:
- `vocabulary` — word list with Norwegian, English, type, sub-chapter
- `grammar` — grammar topics with rules and examples
- `questions` — hand-crafted questions for each type (noToEn, enToNo, fillBlank)
- `phrases` — key phrases from the chapter
- `dialogues` — the chapter dialogue texts

To add a new chapter, create the JSON file and import it in `src/App.jsx`.

## Current chapters

- ✅ Chapter 1 — Introductions
- ✅ Chapter 2 — Fra Paris til Oslo
- ⬜ Chapters 3-12 — Coming soon

## Based on

[LearnNoW](https://www.ntnu.edu/learnnow) by NTNU Department of Language and Literature.
