import { THEME } from '../styles/theme';

export function RunningTally({ answered, correct }) {
  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        padding: '12px 18px',
        background: THEME.bgCard,
        border: `1px solid ${THEME.bgCardBorder}`,
        borderRadius: 10,
      }}
    >
      <div style={{ fontSize: 14, fontFamily: THEME.fontBody, color: THEME.textMuted }}>
        <span style={{ color: THEME.text, fontWeight: 600 }}>{answered}</span> answered
        <span style={{ margin: '0 10px', color: THEME.textDim }}>·</span>
        <span style={{ color: THEME.green, fontWeight: 600 }}>{correct}</span> correct
        {answered > 0 && (
          <>
            <span style={{ margin: '0 10px', color: THEME.textDim }}>·</span>
            <span
              style={{
                color: pct >= 75 ? THEME.green : pct >= 50 ? THEME.amber : THEME.red,
                fontWeight: 600,
              }}
            >
              {pct}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const TYPE_COLORS = {
  noToEn: { accent: THEME.gold, bg: THEME.goldLight, border: THEME.goldBorder },
  enToNo: { accent: THEME.blue, bg: THEME.blueLight, border: THEME.blueBorder },
  fillBlank: { accent: THEME.orange, bg: THEME.orangeLight, border: THEME.orangeBorder },
};

export function QuestionCard({ children, type, typeLabel }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.noToEn;
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: '28px 24px',
        marginBottom: 20,
        position: 'relative',
        animation: 'fadeSlideIn 0.3s ease',
      }}
    >
      <style>
        {`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}
      </style>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 14,
          fontSize: 10,
          fontWeight: 700,
          color: c.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: THEME.fontBody,
        }}
      >
        {typeLabel}
      </div>
      {children}
    </div>
  );
}

export function FeedbackBadge({ state, userAnswer, correctAnswer, hint }) {
  if (state === 'correct1') {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: THEME.greenLight,
          border: `1px solid ${THEME.greenBorder}`,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.green, fontFamily: THEME.fontBody }}>
          ✓ Correct!
        </div>
      </div>
    );
  }
  if (state === 'hint') {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: THEME.amberLight,
          border: `1px solid ${THEME.amberBorder}`,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.amber, fontFamily: THEME.fontBody }}>
          Not quite — try again!
        </div>
        <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 6, fontFamily: THEME.fontBody }}>
          💡 {hint}
        </div>
      </div>
    );
  }
  if (state === 'correct2') {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: THEME.amberLight,
          border: `1px solid ${THEME.amberBorder}`,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.amber, fontFamily: THEME.fontBody }}>
          ~ Got it on the second try
        </div>
      </div>
    );
  }
  if (state === 'wrong') {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: THEME.redLight,
          border: `1px solid ${THEME.redBorder}`,
          marginTop: 14,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.red, fontFamily: THEME.fontBody }}>
          ✗ Incorrect
        </div>
        <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 6, fontFamily: THEME.fontBody }}>
          Your answer: <span style={{ color: THEME.red }}>{userAnswer}</span>
        </div>
        <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 3, fontFamily: THEME.fontBody }}>
          Correct: <span style={{ color: THEME.green }}>{correctAnswer}</span>
        </div>
      </div>
    );
  }
  return null;
}
