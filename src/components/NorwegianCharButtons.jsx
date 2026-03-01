import { THEME } from '../styles/theme';

export default function NorwegianCharButtons({ inputRef, onInsert }) {
  const chars = ['æ', 'ø', 'å'];
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
      {chars.map((ch) => (
        <button
          key={ch}
          onClick={() => {
            if (inputRef.current) {
              const el = inputRef.current;
              const start = el.selectionStart;
              const end = el.selectionEnd;
              const val = el.value;
              const newVal = val.substring(0, start) + ch + val.substring(end);
              onInsert(newVal);
              setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + 1;
                el.focus();
              }, 0);
            }
          }}
          style={{
            width: 40,
            height: 36,
            fontSize: 16,
            fontWeight: 600,
            fontFamily: THEME.fontBody,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            color: THEME.gold,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.10)';
            e.target.style.borderColor = THEME.goldBorder;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.06)';
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          {ch}
        </button>
      ))}
      <span
        style={{
          fontSize: 11,
          color: THEME.textDim,
          alignSelf: 'center',
          marginLeft: 6,
          fontFamily: THEME.fontBody,
        }}
      >
        Norwegian characters
      </span>
    </div>
  );
}
