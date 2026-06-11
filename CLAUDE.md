# LearnNoW Project

Norwegian language learning app for NTNU LearnNoW textbook. Built with React + Vite, deployed to GitHub Pages.

## Deploy

npm run deploy

This builds and pushes to the gh-pages branch automatically. No need to manually copy dist files.

## Project structure
- `src/` — React source
- `src/App.jsx` — main file; must be updated when adding a new chapter (import + remove from CHAPTER_STUBS)
- `data/` — one JSON file per chapter (chapter1.json through chapter7.json so far)
- `public/` — static assets

## Adding a new chapter
1. Add the JSON file to `data/`
2. In `App.jsx`: add the import at the top, remove the chapter number from the `CHAPTER_STUBS` array
3. Run `npm run deploy`

## JSON structure
Each chapter file follows the structure in `data/chapter3.json` — vocabulary with article/type/sub fields, dialogues, phrases, and three question types: noToEn, enToNo, fillBlank.

## Chapters
- Chapters 1–6 are complete and deployed
- Chapters 7–12 are pending
- Isabel has completed chapters 1–5

## Chapter page ranges (LearnNoWTextbook.pdf)
PDF page numbers match textbook page numbers exactly.

- Chapter 1 "The Vidal family":            pp. 5–12
- Chapter 2 "Arriving in Norway":          pp. 13–24
- Chapter 3 "A new home":                  pp. 25–34
- Chapter 4 "The Neighbourhood":           pp. 35–43
- Chapter 5 "New friends":                 pp. 44–56
- Chapter 6 "A trip to town":              pp. 57–67
- Chapter 7 "Everyday life":               pp. 68–77
- Chapter 8 "School and leisure":          pp. 78–90
- Chapter 9 "Work":                        pp. 91–101
- Chapter 10 "Illness, health and sports": pp. 102–116
- Chapter 11 "Culture and leisure":        pp. 117–128
- Chapter 12 "Holidays and festivals":     pp. 129–138

## PDF reading
pdfs/LearnNoWTextbook.pdf has a real text layer. 
Always extract text directly using pdfplumber or pymupdf. 
Do not convert to images.

## What to extract per chapter
Subsections A–D only (e.g. 7A, 7B, 7C, 7D). Skip Grammar, Pronunciation, and Extras sections entirely.
Include: vocabulary (with article, type, sub fields), dialogues, phrases.
Generate original example sentences using chapter vocabulary -- do not copy textbook sentences.
Question writing priorities:
- Weight fill-in-the-blank questions toward preposition selection 
  (correct preposition in context, not just vocabulary recall)
- Include questions that test singular/plural noun forms and 
  indefinite/definite conversion (e.g. "et bord" → "bordet")
- Draw vocabulary from current chapter and any prior chapters 
  for more natural sentence construction
- All example sentences must be original -- do not use textbook sentences