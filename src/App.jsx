import { useState } from 'react';
import { THEME } from './styles/theme';
import ChapterTest from './ChapterTest';

// Import chapter data
import chapter1 from '../data/chapter1.json';
import chapter2 from '../data/chapter2.json';

const ALL_CHAPTERS = [chapter1, chapter2];

// Placeholder info for chapters not yet built
const CHAPTER_STUBS = [
  { chapter: 3, title: 'Hjemme', description: 'Home, rooms, furniture & possessives' },
  { chapter: 4, title: 'Hverdagen', description: 'Daily life, time, family & reflexive verbs' },
  { chapter: 5, title: 'I butikken', description: 'Shopping, food, plural nouns & adjectives' },
  { chapter: 6, title: 'Mat og drikke', description: 'Food & drink, café, definite form & modal verbs' },
  { chapter: 7, title: 'Arbeid og skole', description: 'Work, school, separable verbs & clock time' },
  { chapter: 8, title: 'Høst', description: 'Autumn, weather, past tense & comparisons' },
  { chapter: 9, title: 'Kropp og helse', description: 'Body, health, hospital & imperative' },
  { chapter: 10, title: 'Fritid', description: 'Free time, sports, future & conditional' },
  { chapter: 11, title: 'Hyttetur', description: 'Cabin trip, nature, past participle & passive' },
  { chapter: 12, title: 'Jul', description: 'Christmas, traditions, review & synthesis' },
];

function ChapterGrid({ onSelect }) {
  const availableChapters = ALL_CHAPTERS.map((c) => c.chapter);

  const allChapters = [];
  for (let i = 1; i <= 12; i++) {
    const data = ALL_CHAPTERS.find((c) => c.chapter === i);
    const stub = CHAPTER_STUBS.find((c) => c.chapter === i);
    allChapters.push({
      chapter: i,
      title: data?.title || stub?.title || `Chapter ${i}`,
      description: data?.description || stub?.description || '',
      available: availableChapters.includes(i),
      vocabCount: data?.vocabulary?.length || 0,
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
      {allChapters.map((ch) => (
        <button
          key={ch.chapter}
          onClick={() => ch.available && onSelect(ch.chapter)}
          disabled={!ch.available}
          style={{
            textAlign: 'left',
            padding: '20px 18px',
            background: ch.available ? THEME.bgCard : 'rgba(255,255,255,0.01)',
            border: `1px solid ${ch.available ? THEME.bgCardBorder : 'rgba(255,255,255,0.03)'}`,
            borderRadius: 12,
            cursor: ch.available ? 'pointer' : 'default',
            opacity: ch.available ? 1 : 0.4,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (ch.available) {
              e.currentTarget.style.borderColor = THEME.goldBorder;
              e.currentTarget.style.background = THEME.goldLight;
            }
          }}
          onMouseLeave={(e) => {
            if (ch.available) {
              e.currentTarget.style.borderColor = THEME.bgCardBorder;
              e.currentTarget.style.background = THEME.bgCard;
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: THEME.fontDisplay,
                color: ch.available ? THEME.gold : THEME.textDim,
              }}
            >
              {ch.chapter}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                fontFamily: THEME.fontBody,
                color: ch.available ? THEME.text : THEME.textDim,
              }}
            >
              {ch.title}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: THEME.textMuted,
              fontFamily: THEME.fontBody,
              lineHeight: 1.4,
            }}
          >
            {ch.description}
          </div>
          {ch.available && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: THEME.textDim,
                fontFamily: THEME.fontBody,
              }}
            >
              {ch.vocabCount} words · 3 question types
            </div>
          )}
          {!ch.available && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: THEME.textDim,
                fontFamily: THEME.fontBody,
                fontStyle: 'italic',
              }}
            >
              Coming soon
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedChapter, setSelectedChapter] = useState(null);

  if (selectedChapter) {
    const chapterData = ALL_CHAPTERS.find((c) => c.chapter === selectedChapter);
    const reviewData = ALL_CHAPTERS.filter((c) => c.chapter < selectedChapter);
    return (
      <ChapterTest
        chapterData={chapterData}
        reviewData={reviewData}
        onBack={() => setSelectedChapter(null)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(170deg, ${THEME.bg} 0%, #0f0f22 50%, ${THEME.bg} 100%)`,
        color: THEME.text,
        fontFamily: THEME.fontBody,
      }}
    >
      {/* Ambient bg */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(ellipse at 15% 25%, rgba(212,168,67,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(90,172,224,0.025) 0%, transparent 55%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: THEME.gold,
              marginBottom: 8,
            }}
          >
            LearnNoW · NTNU
          </div>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              fontFamily: THEME.fontDisplay,
              margin: '0 0 10px',
              lineHeight: 1.1,
              color: THEME.text,
            }}
          >
            Norsk Test
          </h1>
          <p
            style={{
              color: THEME.textMuted,
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.5,
              maxWidth: 400,
              margin: '0 auto',
            }}
          >
            Interactive tests aligned with the LearnNoW beginner Norwegian curriculum.
            Choose a chapter to begin.
          </p>
        </div>

        <ChapterGrid onSelect={setSelectedChapter} />
      </div>
    </div>
  );
}
