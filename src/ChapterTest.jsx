import { useState, useEffect, useCallback, useRef } from "react";
import { shuffle, normalise } from "./utils/helpers";
import { generatePrintableTest } from "./utils/questionGenerator";

/* ═══════════════════════════════════════════
   STYLES (CSS Variables approach)
   ═══════════════════════════════════════════ */

const THEME = {
  bg: "#0b0b14",
  bgCard: "rgba(255,255,255,0.025)",
  bgCardBorder: "rgba(255,255,255,0.06)",
  text: "#e8e8f0",
  textMuted: "#7a7a98",
  textDim: "#4a4a68",
  gold: "#d4a843",
  goldLight: "rgba(212,168,67,0.12)",
  goldBorder: "rgba(212,168,67,0.25)",
  blue: "#5aace0",
  blueLight: "rgba(90,172,224,0.10)",
  blueBorder: "rgba(90,172,224,0.20)",
  orange: "#d47a43",
  orangeLight: "rgba(212,122,67,0.10)",
  orangeBorder: "rgba(212,122,67,0.20)",
  green: "#48b87a",
  greenLight: "rgba(72,184,122,0.12)",
  greenBorder: "rgba(72,184,122,0.30)",
  red: "#d45050",
  redLight: "rgba(212,80,80,0.10)",
  redBorder: "rgba(212,80,80,0.30)",
  amber: "#d4a843",
  amberLight: "rgba(212,168,67,0.12)",
  amberBorder: "rgba(212,168,67,0.30)",
  fontDisplay: "'Cormorant Garamond', serif",
  fontBody: "'Outfit', sans-serif",
};

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function NorwegianCharButtons({ inputRef, onInsert }) {
  const chars = ["æ", "ø", "å"];
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
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
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 6,
            color: THEME.gold,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.10)";
            e.target.style.borderColor = THEME.goldBorder;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.06)";
            e.target.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          {ch}
        </button>
      ))}
      <span style={{ fontSize: 11, color: THEME.textDim, alignSelf: "center", marginLeft: 6, fontFamily: THEME.fontBody }}>
        Norwegian characters
      </span>
    </div>
  );
}

function RunningTally({ answered, correct }) {
  const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, padding: "12px 18px", background: THEME.bgCard, border: `1px solid ${THEME.bgCardBorder}`, borderRadius: 10 }}>
      <div style={{ fontSize: 14, fontFamily: THEME.fontBody, color: THEME.textMuted }}>
        <span style={{ color: THEME.text, fontWeight: 600 }}>{answered}</span> answered
        <span style={{ margin: "0 10px", color: THEME.textDim }}>·</span>
        <span style={{ color: THEME.green, fontWeight: 600 }}>{correct}</span> correct
        {answered > 0 && (
          <>
            <span style={{ margin: "0 10px", color: THEME.textDim }}>·</span>
            <span style={{ color: pct >= 75 ? THEME.green : pct >= 50 ? THEME.amber : THEME.red, fontWeight: 600 }}>{pct}%</span>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ children, type, typeLabel }) {
  const colors = {
    noToEn: { accent: THEME.gold, bg: THEME.goldLight, border: THEME.goldBorder },
    enToNo: { accent: THEME.blue, bg: THEME.blueLight, border: THEME.blueBorder },
    fillBlank: { accent: THEME.orange, bg: THEME.orangeLight, border: THEME.orangeBorder },
  };
  const c = colors[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "28px 24px", marginBottom: 20, position: "relative", animation: "fadeSlideIn 0.3s ease" }}>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ position: "absolute", top: 10, right: 14, fontSize: 10, fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: THEME.fontBody }}>
        {typeLabel}
      </div>
      {children}
    </div>
  );
}

function FeedbackBadge({ state, userAnswer, correctAnswer, hint }) {
  if (state === "correct1") {
    return (
      <div style={{ padding: "12px 16px", borderRadius: 10, background: THEME.greenLight, border: `1px solid ${THEME.greenBorder}`, marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.green, fontFamily: THEME.fontBody }}>✓ Correct!</div>
      </div>
    );
  }
  if (state === "hint") {
    return (
      <div style={{ padding: "12px 16px", borderRadius: 10, background: THEME.amberLight, border: `1px solid ${THEME.amberBorder}`, marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.amber, fontFamily: THEME.fontBody }}>Not quite — try again!</div>
        <div style={{ fontSize: 13, color: THEME.textMuted, marginTop: 6, fontFamily: THEME.fontBody }}>💡 {hint}</div>
      </div>
    );
  }
  if (state === "correct2") {
    return (
      <div style={{ padding: "12px 16px", borderRadius: 10, background: THEME.amberLight, border: `1px solid ${THEME.amberBorder}`, marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.amber, fontFamily: THEME.fontBody }}>~ Got it on the second try</div>
      </div>
    );
  }
  if (state === "wrong") {
    return (
      <div style={{ padding: "12px 16px", borderRadius: 10, background: THEME.redLight, border: `1px solid ${THEME.redBorder}`, marginTop: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: THEME.red, fontFamily: THEME.fontBody }}>✗ Incorrect</div>
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

/* ═══════════════════════════════════════════
   QUESTION COMPONENTS
   ═══════════════════════════════════════════ */

function TranslationQuestion({ q, direction, onAnswer, feedbackState, userFirstAnswer }) {
  const [input, setInput] = useState("");
  const [attempt, setAttempt] = useState(1);
  const [localHint, setLocalHint] = useState(false);
  const inputRef = useRef(null);
  const isNoToEn = direction === "noToEn";
  const prompt = isNoToEn ? q.no : q.en;
  const answer = isNoToEn ? q.en : q.no;
  const showNorwegianChars = !isNoToEn;
  const finished = feedbackState === "correct1" || feedbackState === "correct2" || feedbackState === "wrong";

  const handleSubmit = () => {
    if (!input.trim()) return;
    const isCorrect = normalise(input) === normalise(answer);

    if (attempt === 1) {
      if (isCorrect) {
        onAnswer("correct1", input);
      } else {
        setLocalHint(true);
        onAnswer("hint", input);
        setAttempt(2);
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } else {
      if (isCorrect) {
        onAnswer("correct2", input);
      } else {
        onAnswer("wrong", input);
      }
    }
  };

  return (
    <QuestionCard type={direction} typeLabel={isNoToEn ? "🇳🇴 → 🇬🇧 Translate" : "🇬🇧 → 🇳🇴 Translate"}>
      <p style={{ fontSize: 24, fontWeight: 700, color: THEME.text, marginBottom: 4, fontFamily: THEME.fontDisplay, lineHeight: 1.35, marginTop: 8 }}>
        {prompt}
      </p>
      <p style={{ fontSize: 12, color: THEME.textDim, marginBottom: 18, fontFamily: THEME.fontBody }}>
        Translate to {isNoToEn ? "English" : "Norwegian"}
        {attempt === 2 && !finished && <span style={{ color: THEME.amber }}> — second attempt</span>}
      </p>

      {!finished ? (
        <div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={isNoToEn ? "Type your translation..." : "Skriv oversettelsen din..."}
            autoFocus
            style={{
              width: "100%",
              padding: "13px 16px",
              fontSize: 16,
              fontFamily: THEME.fontBody,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(255,255,255,0.10)`,
              borderRadius: 8,
              color: THEME.text,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
          />
          {showNorwegianChars && (
            <NorwegianCharButtons inputRef={inputRef} onInsert={(val) => setInput(val)} />
          )}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: 14,
              padding: "11px 30px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: THEME.fontBody,
              background: isNoToEn ? `linear-gradient(135deg, ${THEME.gold}, #c49530)` : `linear-gradient(135deg, ${THEME.blue}, #3a8cc0)`,
              color: "#0b0b14",
              border: "none",
              borderRadius: 7,
              cursor: "pointer",
            }}
          >
            Check
          </button>
          {localHint && !finished && (
            <FeedbackBadge state="hint" hint={q.hint} />
          )}
        </div>
      ) : (
        <FeedbackBadge state={feedbackState} userAnswer={userFirstAnswer} correctAnswer={answer} hint={q.hint} />
      )}
    </QuestionCard>
  );
}

function FillBlankQuestion({ q, onAnswer, feedbackState, userFirstAnswer }) {
  const [selected, setSelected] = useState(null);
  const [attempt, setAttempt] = useState(1);
  const [localHint, setLocalHint] = useState(false);
  const [disabledOpt, setDisabledOpt] = useState(null);
  const [shuffledOptions] = useState(() => shuffle(q.options));
  const finished = feedbackState === "correct1" || feedbackState === "correct2" || feedbackState === "wrong";

  const handleSelect = (opt) => {
    if (finished || opt === disabledOpt) return;

    const isCorrect = opt === q.answer;
    setSelected(opt);

    if (attempt === 1) {
      if (isCorrect) {
        onAnswer("correct1", opt);
      } else {
        setLocalHint(true);
        setDisabledOpt(opt);
        onAnswer("hint", opt);
        setAttempt(2);
        setTimeout(() => setSelected(null), 500);
      }
    } else {
      if (isCorrect) {
        onAnswer("correct2", opt);
      } else {
        onAnswer("wrong", opt);
      }
    }
  };

  const parts = q.sentence.split("___");

  return (
    <QuestionCard type="fillBlank" typeLabel="Fill in the blank">
      <p style={{ fontSize: 24, fontWeight: 700, color: THEME.text, marginBottom: 18, fontFamily: THEME.fontDisplay, lineHeight: 1.35, marginTop: 8 }}>
        {parts[0]}
        <span style={{
          display: "inline-block",
          minWidth: 70,
          borderBottom: finished ? "none" : `2px dashed ${THEME.orangeBorder}`,
          padding: "2px 6px",
          margin: "0 3px",
          textAlign: "center",
          color: finished
            ? feedbackState === "correct1" ? THEME.green : feedbackState === "correct2" ? THEME.amber : THEME.red
            : selected ? THEME.orange : THEME.textDim,
          fontWeight: 700,
        }}>
          {finished
            ? (feedbackState === "wrong" ? `${userFirstAnswer} → ${q.answer}` : q.answer)
            : (selected || "___")}
        </span>
        {parts[1]}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {shuffledOptions.map((opt) => {
          let bg = "rgba(255,255,255,0.04)";
          let border = "1px solid rgba(255,255,255,0.10)";
          let color = THEME.text;
          let cursor = "pointer";
          let opacity = 1;

          if (finished) {
            cursor = "default";
            if (opt === q.answer) {
              bg = THEME.greenLight; border = `1px solid ${THEME.greenBorder}`; color = THEME.green;
            } else if (opt === selected && opt !== q.answer) {
              bg = THEME.redLight; border = `1px solid ${THEME.redBorder}`; color = THEME.red;
            } else {
              bg = "rgba(255,255,255,0.02)"; color = THEME.textDim;
            }
          } else if (opt === disabledOpt) {
            bg = "rgba(255,255,255,0.02)"; color = THEME.textDim; cursor = "default"; opacity = 0.4;
          } else if (opt === selected) {
            bg = THEME.orangeLight; border = `1px solid ${THEME.orangeBorder}`; color = THEME.orange;
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={finished || opt === disabledOpt}
              style={{ padding: "9px 20px", fontSize: 14, fontWeight: 600, fontFamily: THEME.fontBody, background: bg, border, borderRadius: 7, color, cursor, transition: "all 0.15s ease", opacity }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {localHint && !finished && (
        <FeedbackBadge state="hint" hint={q.hint} />
      )}
      {finished && (
        <FeedbackBadge state={feedbackState} userAnswer={userFirstAnswer} correctAnswer={q.answer} hint={q.hint} />
      )}
    </QuestionCard>
  );
}

/* ═══════════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════════ */

function ResultsScreen({ answers, onRestart, onMenu }) {
  const total = answers.length;
  const first = answers.filter((a) => a.result === "correct1").length;
  const second = answers.filter((a) => a.result === "correct2").length;
  const wrong = answers.filter((a) => a.result === "wrong").length;
  const score = first + second * 0.5;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const emoji = pct >= 90 ? "🎉" : pct >= 70 ? "🇳🇴" : pct >= 50 ? "📚" : "💪";
  const msg = pct >= 90 ? "Utmerket!" : pct >= 70 ? "Veldig bra!" : pct >= 50 ? "Bra jobbet!" : "Øv litt mer!";

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{emoji}</div>
        <h2 style={{ fontSize: 38, fontWeight: 700, fontFamily: THEME.fontDisplay, color: THEME.text, margin: "0 0 6px" }}>{msg}</h2>
        <p style={{ fontSize: 16, color: THEME.textMuted, fontFamily: THEME.fontBody, marginBottom: 24 }}>
          {total} questions completed
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: THEME.green, fontFamily: THEME.fontBody }}>{first}</div>
            <div style={{ fontSize: 11, color: THEME.textDim, fontFamily: THEME.fontBody, textTransform: "uppercase", letterSpacing: "0.06em" }}>1st try</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: THEME.amber, fontFamily: THEME.fontBody }}>{second}</div>
            <div style={{ fontSize: 11, color: THEME.textDim, fontFamily: THEME.fontBody, textTransform: "uppercase", letterSpacing: "0.06em" }}>2nd try</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: THEME.red, fontFamily: THEME.fontBody }}>{wrong}</div>
            <div style={{ fontSize: 11, color: THEME.textDim, fontFamily: THEME.fontBody, textTransform: "uppercase", letterSpacing: "0.06em" }}>Missed</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: THEME.textDim, fontFamily: THEME.fontBody, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Review</h3>
        {answers.map((a, i) => {
          const icon = a.result === "correct1" ? "✓" : a.result === "correct2" ? "~" : "✗";
          const iconColor = a.result === "correct1" ? THEME.green : a.result === "correct2" ? THEME.amber : THEME.red;
          const bgColor = a.result === "correct1" ? THEME.greenLight : a.result === "correct2" ? THEME.amberLight : THEME.redLight;
          const borderColor = a.result === "correct1" ? THEME.greenBorder : a.result === "correct2" ? THEME.amberBorder : THEME.redBorder;

          let label = "";
          const q = a.question;
          if (q.type === "fillBlank") label = q.data.sentence.replace("___", `[${q.data.answer}]`);
          else if (q.type === "noToEn") label = `${q.data.no} → ${q.data.en}`;
          else label = `${q.data.en} → ${q.data.no}`;

          return (
            <div key={i} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 8, background: bgColor, border: `1px solid ${borderColor}`, fontSize: 13, fontFamily: THEME.fontBody, color: "#b0b0c8" }}>
              <span style={{ color: iconColor, fontWeight: 700, marginRight: 8 }}>{icon}</span>
              {label}
              {a.result === "wrong" && a.userAnswer && (
                <span style={{ color: THEME.textDim, marginLeft: 8 }}>(you said: {a.userAnswer})</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onRestart} style={{ flex: 1, padding: "14px", fontSize: 15, fontWeight: 700, fontFamily: THEME.fontBody, background: `linear-gradient(135deg, ${THEME.gold}, #c49530)`, color: "#0b0b14", border: "none", borderRadius: 9, cursor: "pointer" }}>
          Try Again
        </button>
        <button onClick={onMenu} style={{ flex: 1, padding: "14px", fontSize: 15, fontWeight: 600, fontFamily: THEME.fontBody, background: "rgba(255,255,255,0.05)", color: THEME.text, border: `1px solid rgba(255,255,255,0.10)`, borderRadius: 9, cursor: "pointer" }}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PDF / PRINT VIEW
   ═══════════════════════════════════════════ */

function PrintableTest({ questions, onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: "#fff", color: "#111", overflow: "auto", fontFamily: "'Georgia', serif" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { page-break-after: always; }
          body { margin: 0; }
        }
      `}</style>

      {/* Controls bar */}
      <div className="no-print" style={{ position: "sticky", top: 0, background: "#f5f5f0", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", zIndex: 10 }}>
        <span style={{ fontSize: 14, color: "#666", fontFamily: "sans-serif" }}>Print preview — use Ctrl+P / Cmd+P to print</span>
        <button onClick={onClose} style={{ padding: "8px 20px", fontSize: 13, fontFamily: "sans-serif", fontWeight: 600, background: "#333", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          Close Preview
        </button>
      </div>

      {/* Test content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", marginBottom: 6, fontFamily: "sans-serif" }}>LearnNoW</div>
          <h1 style={{ fontSize: 28, margin: "0 0 6px", fontWeight: 700 }}>Chapter {chapterData.chapter} — Test</h1>
          <p style={{ fontSize: 13, color: "#888", fontFamily: "sans-serif" }}>{chapterData.description}</p>
          <div style={{ marginTop: 16, padding: "8px 16px", background: "#f8f8f5", border: "1px solid #e0e0d8", borderRadius: 6, display: "inline-block", fontSize: 13, fontFamily: "sans-serif", color: "#666" }}>
            Name: ________________________________&nbsp;&nbsp;&nbsp;&nbsp;Date: ______________
          </div>
        </div>

        <div style={{ borderTop: "2px solid #222", paddingTop: 24 }}>
          {questions.map((q, i) => {
            const num = i + 1;
            if (q.type === "noToEn") {
              return (
                <div key={i} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", fontFamily: "sans-serif", marginBottom: 4 }}>Translate to English</div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>
                    <strong>{num}.</strong>&nbsp; {q.data.no}
                  </div>
                  <div style={{ borderBottom: "1px solid #ccc", height: 28 }} />
                </div>
              );
            }
            if (q.type === "enToNo") {
              return (
                <div key={i} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", fontFamily: "sans-serif", marginBottom: 4 }}>Translate to Norwegian</div>
                  <div style={{ fontSize: 15, marginBottom: 8 }}>
                    <strong>{num}.</strong>&nbsp; {q.data.en}
                  </div>
                  <div style={{ borderBottom: "1px solid #ccc", height: 28 }} />
                </div>
              );
            }
            if (q.type === "fillBlank") {
              return (
                <div key={i} style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", fontFamily: "sans-serif", marginBottom: 4 }}>Fill in the blank</div>
                  <div style={{ fontSize: 15, marginBottom: 10 }}>
                    <strong>{num}.</strong>&nbsp; {q.data.sentence}
                  </div>
                  <div style={{ display: "flex", gap: 12, paddingLeft: 20, fontFamily: "sans-serif", fontSize: 13 }}>
                    {q.data.options.map((opt, j) => (
                      <span key={j} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ display: "inline-block", width: 14, height: 14, border: "1.5px solid #999", borderRadius: 3 }} />
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Answer Key */}
        <div className="print-page" />
        <div style={{ borderTop: "2px solid #222", paddingTop: 24, marginTop: 40 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Answer Key</h2>
          {questions.map((q, i) => {
            const num = i + 1;
            let answer = "";
            if (q.type === "noToEn") answer = q.data.en;
            else if (q.type === "enToNo") answer = q.data.no;
            else answer = q.data.answer;
            return (
              <div key={i} style={{ fontSize: 13, fontFamily: "sans-serif", marginBottom: 4, color: "#444" }}>
                <strong>{num}.</strong> {answer}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUESTION QUEUE MANAGER
   ═══════════════════════════════════════════ */

function useQuestionQueue(chapterData, reviewData = []) {
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
      const rc = reviewData[Math.floor(Math.random() * reviewData.length)];
      if (rc?.questions) {
        const types = ["noToEn", "enToNo", "fillBlank"];
        const type = types[Math.floor(Math.random() * types.length)];
        const pool = rc.questions[type];
        if (pool && pool.length > 0) {
          return { type, data: pool[Math.floor(Math.random() * pool.length)], isReview: true };
        }
      }
    }

    const types = ["noToEn", "enToNo", "fillBlank"];
    const type = types[typeRotation.current % 3];
    typeRotation.current++;

    const pool = chapterData.questions[type];
    if (!pool || pool.length === 0) return null;

    let used = usedIndices.current[type];
    if (used.length >= pool.length) {
      used = [];
      usedIndices.current[type] = used;
    }

    const available = pool.map((_, i) => i).filter((i) => !used.includes(i));
    const pick = available[Math.floor(Math.random() * available.length)];
    used.push(pick);

    return { type, data: pool[pick] };
  }, [chapterData, reviewData]);

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

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function ChapterTest({ chapterData, reviewData = [], onBack }) {
  const [screen, setScreen] = useState("menu");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null); // null, "hint", "correct1", "correct2", "wrong"
  const [userFirstAnswer, setUserFirstAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [showPrint, setShowPrint] = useState(false);
  const { getNext, addWrong, reset } = useQuestionQueue(chapterData, reviewData);

  const startQuiz = () => {
    reset();
    setAllAnswers([]);
    setFeedbackState(null);
    setUserFirstAnswer("");
    setCurrentQuestion(getNext());
    setScreen("quiz");
  };

  const handleAnswer = (state, userAnswer) => {
    if (!userFirstAnswer) setUserFirstAnswer(userAnswer);
    setFeedbackState(state);
    if (state === "wrong") addWrong(currentQuestion);
  };

  const handleNext = () => {
    setAllAnswers([...allAnswers, { question: currentQuestion, result: feedbackState, userAnswer: userFirstAnswer }]);
    setFeedbackState(null);
    setUserFirstAnswer("");
    setCurrentQuestion(getNext());
  };

  const handleFinish = () => {
    const finalAnswers = [...allAnswers];
    if (feedbackState === "correct1" || feedbackState === "correct2" || feedbackState === "wrong") {
      finalAnswers.push({ question: currentQuestion, result: feedbackState, userAnswer: userFirstAnswer });
    }
    setAllAnswers(finalAnswers);
    setScreen("results");
  };

  const generatePrintQuestions = () => {
    return generatePrintableTest(chapterData, 20);
  };

  const finished = feedbackState === "correct1" || feedbackState === "correct2" || feedbackState === "wrong";
  const answeredCount = allAnswers.length + (finished ? 1 : 0);
  const correctCount = allAnswers.filter((a) => a.result === "correct1" || a.result === "correct2").length + (finished && (feedbackState === "correct1" || feedbackState === "correct2") ? 1 : 0);

  if (showPrint) {
    return <PrintableTest questions={generatePrintQuestions()} onClose={() => setShowPrint(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(170deg, ${THEME.bg} 0%, #0f0f22 50%, ${THEME.bg} 100%)`, color: THEME.text, fontFamily: THEME.fontBody, position: "relative", overflow: "hidden" }}>
      {/* Ambient bg */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `radial-gradient(ellipse at 15% 25%, rgba(212,168,67,0.03) 0%, transparent 55%), radial-gradient(ellipse at 85% 75%, rgba(90,172,224,0.025) 0%, transparent 55%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "36px 22px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: screen === "menu" ? 40 : 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: THEME.gold, marginBottom: 6 }}>LearnNoW</div>
          <h1 style={{
            fontSize: screen === "menu" ? 44 : 26,
            fontWeight: 700,
            fontFamily: THEME.fontDisplay,
            margin: 0,
            lineHeight: 1.15,
            color: THEME.text,
            transition: "font-size 0.3s ease",
          }}>
            Kapittel {chapterData.chapter}
          </h1>
          {screen === "menu" && (
            <p style={{ color: THEME.textMuted, fontSize: 15, marginTop: 10, lineHeight: 1.5, fontWeight: 300 }}>
              {chapterData.description}
            </p>
          )}
        </div>

        {/* ─── MENU ─── */}
        {screen === "menu" && (
          <div>
            {/* Vocab */}
            <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.bgCardBorder}`, borderRadius: 14, padding: "22px 22px 16px", marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: THEME.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, marginTop: 0 }}>Vocabulary</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {chapterData.vocabulary.map((v) => (
                  <span key={v.no} style={{ padding: "5px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, fontSize: 12 }}>
                    <span style={{ fontWeight: 600, color: THEME.gold }}>{v.no}</span>
                    <span style={{ color: THEME.textDim, margin: "0 5px" }}>·</span>
                    <span style={{ color: "#9a9ab8" }}>{v.en}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Grammar */}
            <div style={{ background: THEME.bgCard, border: `1px solid ${THEME.bgCardBorder}`, borderRadius: 14, padding: "22px", marginBottom: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: THEME.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, marginTop: 0 }}>Grammar Topics</h3>
              <div style={{ fontSize: 13, color: "#9a9ab8", lineHeight: 1.9 }}>
                {chapterData.grammar.map((g, i) => (
                  <div key={i}>▸ {g.topic}: <span style={{ color: "#b8b8d0" }}>{g.rule}</span></div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <button onClick={startQuiz} style={{ width: "100%", padding: "16px", fontSize: 16, fontWeight: 700, fontFamily: THEME.fontBody, background: `linear-gradient(135deg, ${THEME.gold}, #c49530)`, color: "#0b0b14", border: "none", borderRadius: 10, cursor: "pointer", marginBottom: 10, letterSpacing: "0.01em" }}>
              Start Interactive Test
            </button>
            <button onClick={() => setShowPrint(true)} style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, fontFamily: THEME.fontBody, background: "rgba(255,255,255,0.04)", color: THEME.textMuted, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, cursor: "pointer", marginBottom: 10 }}>
              Generate Printable Test (20 questions)
            </button>
            {onBack && (
              <button onClick={onBack} style={{ width: "100%", padding: "12px", fontSize: 13, fontWeight: 500, fontFamily: THEME.fontBody, background: "transparent", color: THEME.textDim, border: "none", cursor: "pointer" }}>
                ← Back to chapters
              </button>
            )}
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {screen === "quiz" && currentQuestion && (
          <div>
            <RunningTally answered={answeredCount} correct={correctCount} />

            {/* Finish button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={handleFinish} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 600, fontFamily: THEME.fontBody, background: "rgba(255,255,255,0.04)", color: THEME.textMuted, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 6, cursor: "pointer" }}>
                Finish Now
              </button>
            </div>

            {currentQuestion.type === "noToEn" && (
              <TranslationQuestion
                key={`${currentQuestion.type}-${currentQuestion.data.no}-${allAnswers.length}`}
                q={currentQuestion.data}
                direction="noToEn"
                onAnswer={handleAnswer}
                feedbackState={feedbackState}
                userFirstAnswer={userFirstAnswer}
              />
            )}
            {currentQuestion.type === "enToNo" && (
              <TranslationQuestion
                key={`${currentQuestion.type}-${currentQuestion.data.en}-${allAnswers.length}`}
                q={currentQuestion.data}
                direction="enToNo"
                onAnswer={handleAnswer}
                feedbackState={feedbackState}
                userFirstAnswer={userFirstAnswer}
              />
            )}
            {currentQuestion.type === "fillBlank" && (
              <FillBlankQuestion
                key={`${currentQuestion.type}-${currentQuestion.data.sentence}-${allAnswers.length}`}
                q={currentQuestion.data}
                onAnswer={handleAnswer}
                feedbackState={feedbackState}
                userFirstAnswer={userFirstAnswer}
              />
            )}

            {finished && (
              <button onClick={handleNext} style={{ width: "100%", padding: "14px", fontSize: 15, fontWeight: 600, fontFamily: THEME.fontBody, background: "rgba(255,255,255,0.05)", color: THEME.text, border: `1px solid rgba(255,255,255,0.10)`, borderRadius: 9, cursor: "pointer", marginTop: 4 }}>
                Next Question →
              </button>
            )}
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {screen === "results" && (
          <ResultsScreen
            answers={allAnswers}
            onRestart={startQuiz}
            onMenu={() => setScreen("menu")}
          />
        )}
      </div>
    </div>
  );
}
