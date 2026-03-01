import { shuffle } from './helpers';

/**
 * Generate additional fill-in-the-blank questions from vocabulary data.
 * These supplement the hand-crafted questions in the chapter data files.
 */

/**
 * Generate "what does X mean?" style vocab questions
 * @param {Array} vocab - vocabulary array from chapter data
 * @param {number} count - how many to generate
 * @returns {Array} fill-in-the-blank style questions
 */
export function generateVocabQuestions(vocab, count = 5) {
  // Filter to words that have a clear single English meaning (not phrases)
  const usable = vocab.filter(
    (v) =>
      v.no &&
      v.en &&
      !v.no.includes(' ') && // skip phrases
      v.no.length > 1 && // skip single letters
      !v.no.match(/^[A-Z]/) // skip proper nouns
  );

  if (usable.length < 4) return [];

  const questions = [];
  const shuffled = shuffle(usable);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const correct = shuffled[i];
    // Pick 3 distractors from the same vocab list
    const distractors = shuffle(usable.filter((v) => v.no !== correct.no))
      .slice(0, 3)
      .map((v) => v.en.split(',')[0].trim());

    const options = shuffle([correct.en.split(',')[0].trim(), ...distractors]);

    questions.push({
      type: 'vocabMatch',
      no: correct.no,
      correctEn: correct.en.split(',')[0].trim(),
      options,
      hint: correct.type ? `This is a ${correct.type}` : 'Think about the vocabulary list',
    });
  }

  return questions;
}

/**
 * Build a printable test with a fixed number of questions.
 * Pulls from all question types and shuffles.
 * @param {Object} chapterData - chapter data object
 * @param {number} questionCount - total questions to generate (default 20)
 * @returns {Array} array of question objects
 */
export function generatePrintableTest(chapterData, questionCount = 20) {
  if (!chapterData?.questions) return [];

  const qs = [];
  const pools = {
    noToEn: shuffle([...(chapterData.questions.noToEn || [])]),
    enToNo: shuffle([...(chapterData.questions.enToNo || [])]),
    fillBlank: shuffle([...(chapterData.questions.fillBlank || [])]),
  };
  const types = ['noToEn', 'enToNo', 'fillBlank'];
  let ti = 0;
  const indices = { noToEn: 0, enToNo: 0, fillBlank: 0 };

  while (qs.length < questionCount) {
    const type = types[ti % 3];
    ti++;
    if (indices[type] < pools[type].length) {
      qs.push({ type, data: pools[type][indices[type]] });
      indices[type]++;
    } else {
      // If we've exhausted this type, check if we've exhausted all types
      const allExhausted = types.every((t) => indices[t] >= pools[t].length);
      if (allExhausted) break; // Can't generate more questions
    }
  }

  return qs;
}
