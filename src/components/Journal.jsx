import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, MARU, PMINCHO, INK, INK2, INK3, CREAM2, LINE, phaseKeyFromLegacy, phaseForDay } from '../utils/phases';

/* ── phase-aware journal prompts ──────────────────────────── */
const PROMPTS = {
  sei: {
    ja: [
      '今日の体調はどう？自分に優しくできたことは？',
      '今、心が求めていることは何だろう？',
      'ゆっくり過ごせた瞬間を書いてみよう',
      '今の自分に「大丈夫だよ」と伝えるなら、何を言う？',
      '温かいものを飲みながら、ふと思ったこと',
    ],
    en: [
      'How does your body feel today? What did you do to be kind to yourself?',
      'What is your heart asking for right now?',
      'Write about a moment you felt at peace today',
      'If you could tell yourself "it\'s okay" — what would you say?',
      'What came to mind while sipping something warm?',
    ],
  },
  me: {
    ja: [
      '今日、新しく挑戦したいと思ったことは？',
      'エネルギーが湧いてきた瞬間はあった？',
      '最近ワクワクしていることを書いてみよう',
      '春のように芽吹く気持ち。何が成長している？',
      '今日の小さな発見は？',
    ],
    en: [
      'What new thing did you want to try today?',
      'Was there a moment you felt your energy rising?',
      'Write about something that excites you lately',
      'Like spring buds — what feels like it\'s growing in you?',
      'What small discovery did you make today?',
    ],
  },
  ki: {
    ja: [
      '今日の自分、輝いていたところは？',
      '誰かとの会話で心に残ったことは？',
      '今、自信を持てていることを3つ書いてみよう',
      '満開の自分へ。今日のハイライトは？',
      'ありのままの自分が好きだと思えた瞬間は？',
    ],
    en: [
      'Where did you shine today?',
      'What conversation stayed with you?',
      'Write 3 things you feel confident about right now',
      'To yourself in full bloom — what was today\'s highlight?',
      'When did you feel good about being exactly who you are?',
    ],
  },
  mi: {
    ja: [
      '今日、自分をいたわれたことは？',
      'モヤモヤしていることがあれば、ここに吐き出そう',
      '感謝していることを3つ書いてみよう',
      '来週の自分に伝えたいことは？',
      '秋の実りのように、最近収穫できたものは？',
    ],
    en: [
      'How did you take care of yourself today?',
      'If something is bothering you, let it out here',
      'Write 3 things you\'re grateful for',
      'What would you tell next week\'s you?',
      'Like autumn\'s harvest — what have you gathered recently?',
    ],
  },
};

function getPrompt(phaseKey, isJa) {
  const list = PROMPTS[phaseKey]?.[isJa ? 'ja' : 'en'] || PROMPTS.ki[isJa ? 'ja' : 'en'];
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return list[dayOfYear % list.length];
}

const GLASS = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 18px rgba(58,50,38,0.04)',
  border: '1px solid rgba(255,255,255,0.5)',
};

const MOOD_EMOJI = ['', '😔', '😕', '😐', '😊', '😄'];

/* ── journal entry editor ──────────────────────────────────── */
function EntryEditor({ date, cycleDay, phaseKey, existing, onSave, onCancel, isJa }) {
  const p = PHASES[phaseKey];
  const [text, setText] = useState(existing?.text || '');
  const [mood, setMood] = useState(existing?.mood || 0);
  const textRef = useRef(null);
  const prompt = getPrompt(phaseKey, isJa);

  useEffect(() => {
    if (textRef.current && !existing) {
      textRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (!text.trim() && !mood) return;
    onSave({
      date,
      cycleDay,
      phase: phaseKey,
      text: text.trim(),
      mood,
      updatedAt: new Date().toISOString(),
    });
  };

  const displayDate = (() => {
    const d = new Date(date + 'T00:00:00');
    if (isJa) {
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    }
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  })();

  return (
    <div style={{
      ...GLASS, borderRadius: 24, padding: '20px 20px 16px',
      borderLeft: `4px solid ${p.accent}`,
    }}>
      {/* Date & phase header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{p.emoji}</span>
          <div>
            <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK }}>
              {displayDate}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3 }}>
              {isJa ? `${p.name} · ${cycleDay}日目` : `${p.en} · Day ${cycleDay}`}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div style={{
        padding: '10px 14px', borderRadius: 14,
        background: p.tint, border: `1px solid ${p.line}`,
        marginBottom: 14,
      }}>
        <div style={{ fontFamily: MARU, fontSize: 10, fontWeight: 700, color: p.accent, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          {isJa ? '今日のプロンプト' : "Today's prompt"}
        </div>
        <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: p.deep, margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
          {prompt}
        </p>
      </div>

      {/* Text area */}
      <textarea
        ref={textRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isJa ? '今日の気持ちを書いてみよう…' : 'Write about your day…'}
        style={{
          width: '100%', minHeight: 160, maxHeight: 400,
          padding: '14px 16px',
          borderRadius: 16,
          border: `1.5px solid ${LINE}`,
          background: '#fff',
          fontFamily: MARU, fontSize: 14, fontWeight: 500,
          color: INK, lineHeight: 1.7,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = p.accent; }}
        onBlur={(e) => { e.target.style.borderColor = LINE; }}
      />

      {/* Mood selector */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: MARU, fontSize: 12, fontWeight: 700, color: INK3, marginBottom: 8 }}>
          {isJa ? '今の気分' : 'How are you feeling?'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(m => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? 0 : m)}
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: mood === m ? p.soft : CREAM2,
                border: mood === m ? `2px solid ${p.accent}` : '2px solid transparent',
                cursor: 'pointer', fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                WebkitTapHighlightColor: 'transparent',
                padding: 0,
              }}
            >
              {MOOD_EMOJI[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 14,
              background: CREAM2, border: 'none',
              fontFamily: MARU, fontSize: 14, fontWeight: 700, color: INK3,
              cursor: 'pointer',
            }}
          >
            {isJa ? 'キャンセル' : 'Cancel'}
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!text.trim() && !mood}
          style={{
            flex: 2, padding: '12px 0', borderRadius: 14,
            background: text.trim() || mood
              ? `linear-gradient(135deg, ${p.accent}, ${p.deep})`
              : LINE,
            border: 'none',
            fontFamily: MARU, fontSize: 14, fontWeight: 700,
            color: text.trim() || mood ? '#fff' : INK3,
            cursor: text.trim() || mood ? 'pointer' : 'default',
            boxShadow: text.trim() || mood ? `0 4px 14px ${p.accent}44` : 'none',
          }}
        >
          {existing ? (isJa ? '更新する' : 'Update') : (isJa ? '保存する' : 'Save')}
        </button>
      </div>
    </div>
  );
}

/* ── single entry card in the timeline ────────────────────── */
function EntryCard({ entry, isJa, onEdit, onDelete }) {
  const pk = entry.phase || 'ki';
  const p = PHASES[pk];

  const displayDate = (() => {
    const d = new Date(entry.date + 'T00:00:00');
    if (isJa) {
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      return `${d.getMonth() + 1}/${d.getDate()} (${weekdays[d.getDay()]})`;
    }
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric', weekday: 'short' });
  })();

  const isToday = entry.date === new Date().toISOString().split('T')[0];

  return (
    <div style={{
      ...GLASS, borderRadius: 20, padding: '16px 18px',
      borderLeft: `3px solid ${p.accent}`,
      opacity: 1,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>{p.emoji}</span>
          <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: isToday ? p.accent : INK2 }}>
            {displayDate}
          </span>
          {isToday && (
            <span style={{
              fontFamily: MARU, fontSize: 9, fontWeight: 700,
              color: '#fff', background: p.accent,
              padding: '1px 8px', borderRadius: 6,
            }}>
              {isJa ? '今日' : 'Today'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {entry.mood > 0 && (
            <span style={{ fontSize: 16 }}>{MOOD_EMOJI[entry.mood]}</span>
          )}
          <span style={{
            fontFamily: MARU, fontSize: 10, fontWeight: 600,
            color: p.deep, padding: '2px 8px', borderRadius: 6, background: p.tint,
          }}>
            {isJa ? `${entry.cycleDay}日目` : `Day ${entry.cycleDay}`}
          </span>
        </div>
      </div>

      {/* Entry text */}
      {entry.text && (
        <p style={{
          fontFamily: MARU, fontSize: 13, fontWeight: 500,
          color: INK, margin: 0, lineHeight: 1.65,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {entry.text}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
        <button
          onClick={() => onEdit(entry)}
          style={{
            padding: '4px 12px', borderRadius: 8,
            background: 'none', border: `1px solid ${LINE}`,
            fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3,
            cursor: 'pointer',
          }}
        >
          {isJa ? '編集' : 'Edit'}
        </button>
        <button
          onClick={() => onDelete(entry.date)}
          style={{
            padding: '4px 12px', borderRadius: 8,
            background: 'none', border: `1px solid ${LINE}`,
            fontFamily: MARU, fontSize: 11, fontWeight: 600, color: INK3,
            cursor: 'pointer',
          }}
        >
          {isJa ? '削除' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

/* ── main Journal component ────────────────────────────────── */
export function Journal({ phase = 'ki', cycleDay = 1, entries = [], onSaveEntry, onDeleteEntry }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language?.startsWith('ja');
  const p = PHASES[phase];

  const handleExport = () => {
    if (!entries.length) return;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

    const entryCards = sorted.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      const dateStr = d.toLocaleDateString(isJa ? 'ja-JP' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
      });
      const pk = e.phase || 'ki';
      const ep = PHASES[pk];
      const phaseName = isJa ? ep.name : ep.en;
      const mood = e.mood ? MOOD_EMOJI[e.mood] : '';
      return `
        <div style="page-break-inside: avoid; margin-bottom: 20px; border-left: 4px solid ${ep.accent}; padding: 16px 20px; border-radius: 0 12px 12px 0; background: ${ep.tint};">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
            <span style="font-family: 'Shippori Mincho B1', serif; font-size: 15px; font-weight: 600; color: #3A3226;">${dateStr}</span>
            <span style="font-size: 12px; color: ${ep.deep}; font-weight: 600;">${ep.kanji} ${phaseName} · Day ${e.cycleDay}${mood ? ' ' + mood : ''}</span>
          </div>
          <p style="font-size: 14px; color: #3A3226; line-height: 1.75; margin: 0; white-space: pre-wrap;">${(e.text || (isJa ? '(テキストなし)' : '(no text)')).replace(/</g, '&lt;')}</p>
        </div>`;
    }).join('');

    const title = isJa ? 'ジャーナル' : 'Journal';
    const subtitle = isJa
      ? `${sorted.length}件のエントリー`
      : `${sorted.length} ${sorted.length === 1 ? 'entry' : 'entries'}`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Shippori+Mincho+B1:wght@400;500;600;700;800&display=swap">
      <title>巡 meguri — ${title}</title>
      <style>
        @page { margin: 20mm 16mm; size: A4; }
        body { font-family: 'M PLUS Rounded 1c', sans-serif; color: #3A3226; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        @media screen { body { max-width: 680px; margin: 0 auto; padding: 40px 24px; background: #FFFBF2; } }
      </style></head><body>
      <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid rgba(59,51,53,0.08);">
        <div style="font-family: 'Shippori Mincho B1', serif; font-size: 36px; font-weight: 800; color: #F0B818; margin-bottom: 4px;">巡</div>
        <div style="font-size: 12px; letter-spacing: 3px; color: #8C7E6E; text-transform: uppercase; font-weight: 700;">meguri ${title}</div>
        <div style="font-size: 13px; color: #B5A898; margin-top: 8px;">${subtitle}</div>
      </div>
      ${entryCards}
      <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(59,51,53,0.08);">
        <span style="font-family: 'Shippori Mincho B1', serif; font-size: 11px; color: #F0B818;">巡 meguri</span>
      </div>
      <script>window.onafterprint=()=>window.close();window.onload=()=>setTimeout(()=>window.print(),500);</script>
    </body></html>`;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  const [editing, setEditing] = useState(null); // null = new today, or an entry object
  const [showEditor, setShowEditor] = useState(!todayEntry);

  // Sort entries newest first
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  // Streak counter
  const streak = (() => {
    let count = 0;
    const d = new Date();
    // If no entry today yet, start checking from yesterday
    if (!todayEntry) d.setDate(d.getDate() - 1);
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (entries.find(e => e.date === dateStr)) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    if (todayEntry) count++; // include today
    return count;
  })();

  const handleSave = (entryData) => {
    onSaveEntry(entryData);
    setShowEditor(false);
    setEditing(null);
  };

  const handleEdit = (entry) => {
    setEditing(entry);
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (date) => {
    onDeleteEntry(date);
  };

  const handleNewEntry = () => {
    setEditing(null);
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', paddingBottom: 130 }}>
      {/* background wash */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(ellipse 60% 30% at 10% 12%, rgba(228,132,158,0.25), transparent 70%),
          radial-gradient(ellipse 55% 28% at 40% 6%, rgba(240,184,24,0.22), transparent 70%),
          radial-gradient(ellipse 55% 30% at 75% 18%, rgba(68,196,116,0.25), transparent 70%),
          linear-gradient(180deg, #FFFCF2, #FFF9EE)
        `,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: PMINCHO, fontSize: 26, fontWeight: 600, color: INK }}>
              {isJa ? 'ジャーナル' : 'Journal'}
            </div>
            <div style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: INK2, marginTop: 4 }}>
              {isJa ? '日々の気持ちを記録しよう' : 'Record your daily feelings'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {entries.length > 0 && (
              <button
                onClick={handleExport}
                style={{
                  width: 36, height: 36, borderRadius: 99,
                  border: `1.5px solid ${LINE}`,
                  background: CREAM2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0,
                }}
                title={isJa ? 'エクスポート' : 'Export'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}
            {streak > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 999,
                background: p.soft, border: `1.5px solid ${p.accent}`,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: p.deep }}>
                  {streak}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Editor section */}
        {showEditor ? (
          <div style={{ marginBottom: 20 }}>
            <EntryEditor
              date={editing?.date || today}
              cycleDay={editing?.cycleDay || cycleDay}
              phaseKey={editing?.phase || phase}
              existing={editing}
              onSave={handleSave}
              onCancel={sortedEntries.length > 0 ? () => { setShowEditor(false); setEditing(null); } : undefined}
              isJa={isJa}
            />
          </div>
        ) : (
          /* Write button when editor is closed */
          <button
            onClick={handleNewEntry}
            style={{
              width: '100%', padding: '16px 20px',
              borderRadius: 20, border: `2px dashed ${p.accent}55`,
              background: `${p.tint}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: 'pointer', marginBottom: 20,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 700, color: p.deep }}>
              {todayEntry
                ? (isJa ? '新しいエントリーを書く' : 'Write another entry')
                : (isJa ? '今日のジャーナルを書く' : "Write today's journal")}
            </span>
          </button>
        )}

        {/* Timeline */}
        {sortedEntries.length > 0 && (
          <div>
            <div style={{
              fontFamily: MARU, fontSize: 11, fontWeight: 700, color: INK3,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
            }}>
              {isJa ? '過去のエントリー' : 'Past Entries'}
              <span style={{ marginLeft: 6, fontWeight: 600, color: p.accent }}>
                {sortedEntries.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sortedEntries.map(entry => (
                <EntryCard
                  key={entry.date}
                  entry={entry}
                  isJa={isJa}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {sortedEntries.length === 0 && !showEditor && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            ...GLASS, borderRadius: 24,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <div style={{ fontFamily: PMINCHO, fontSize: 18, fontWeight: 600, color: INK, marginBottom: 6 }}>
              {isJa ? 'まだエントリーがありません' : 'No entries yet'}
            </div>
            <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: INK3, margin: 0, lineHeight: 1.5 }}>
              {isJa
                ? '毎日の気持ちを書くことで、自分のリズムが見えてきます'
                : 'Writing daily helps you understand your own rhythm'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
