import { useRef, useCallback } from 'react';
import { shuffle } from '../utils/helpers';

/**
 * Manages the question queue for the quiz.
 * - Cycles through question types (noToEn, enToNo, fillBlank)
 * - Tracks used questions to avoid immediate repeats
 * - Re-queues wrong answers with 30% chance of appearing
 * - Supports blending review questions from previous chapters
 */
export function useQuestionQueue(chapterData, reviewData = []) {
  const wrongPool = useRef([]);
  const usedIndices = useRef({ noToEn: [], enToNo: [], fillBlank: [] });
  const typeRotation = useRef(0);

  const getNext = useCallback(() => {
    if (!chapterData?.questions) return null;

    // 30% chance to pull from wrong pool if it has items
    if (wrongPool.current.length > 0 && Math.random() < 0.3) {
      const idx = Math.floor(Math.random() * wrongPool.current.length);
      return wrongPool.current.splice(idx, 1)[0];
    }

    // 15% chance to pull a review question from previous chapters
    if (reviewData.length > 0 && Math.random() < 0.15) {
      const reviewChapter = reviewData[Math.floor(Math.random() * reviewData.length)];
      if (reviewChapter?.questions) {
        const types = ['noToEn', 'enToNo', 'fillBlank'];
        const type = types[Math.floor(Math.random() * types.length)];
        const pool = reviewChapter.questions[type];
        if (pool && pool.length > 0) {
          const q = pool[Math.floor(Math.random() * pool.length)];
          return { type, data: q, isReview: true, reviewChapter: reviewChapter.chapter };
        }
      }
    }

    const types = ['noToEn', 'enToNo', 'fillBlank'];
    const type = types[typeRotation.current % 3];
    typeRotation.current++;

    const pool = chapterData.questions[type];
    if (!pool || pool.length === 0) {
      // Skip this type if no questions available
      typeRotation.current++;
      const nextType = types[typeRotation.current % 3];
      const nextPool = chapterData.questions[nextType];
      if (!nextPool || nextPool.length === 0) return null;
      return getNextFromPool(nextType, nextPool);
    }

    return getNextFromPool(type, pool);
  }, [chapterData, reviewData]);

  const getNextFromPool = useCallback((type, pool) => {
    let used = usedIndices.current[type];
    if (used.length >= pool.length) {
      used = [];
      usedIndices.current[type] = used;
    }

    const available = pool.map((_, i) => i).filter((i) => !used.includes(i));
    const pick = available[Math.floor(Math.random() * available.length)];
    used.push(pick);

    return { type, data: pool[pick] };
  }, []);

  const addWrong = useCallback((q) => {
    wrongPool.current.push(q);
  }, []);

  const reset = useCallback(() => {
    wrongPool.current = [];
    usedIndices.current = { noToEn: [], enToNo: [], fillBlank: [] };
    typeRotation.current = 0;
  }, []);

  return { getNext, addWrong, reset };
}
