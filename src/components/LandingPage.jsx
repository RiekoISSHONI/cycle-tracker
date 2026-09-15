import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogoMark } from './LogoMark';
import { MARU, PMINCHO, LOGO_WORD, PHASES, CREAM, INK, INK2, INK3 } from '../utils/phases';

/* ── phase ring for hero ──────────────────────────────────── */
function PhaseRing({ size = 200 }) {
  const phases = [
    { key: 'sei', color: PHASES.sei.accent, emoji: '🌙', label: 'Winter' },
    { key: 'me',  color: PHASES.me.accent,  emoji: '🌱', label: 'Spring' },
    { key: 'ki',  color: PHASES.ki.accent,  emoji: '☀️', label: 'Summer' },
    { key: 'mi',  color: PHASES.mi.accent,  emoji: '🍂', label: 'Autumn' },
  ];
  const r = size / 2 - 18;
  const cx = size / 2, cy = size / 2;
  const strokeW = 8;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {phases.map((p, i) => {
        const startAngle = (i * 90 - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * 90 - 90) * Math.PI / 180;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const midAngle = ((i * 90 + 45) - 90) * Math.PI / 180;
        const emojiR = r + 2;
        const ex = cx + emojiR * Math.cos(midAngle);
        const ey = cy + emojiR * Math.sin(midAngle);
        return (
          <g key={p.key}>
            <path
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={p.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.85}
            />
            <text x={ex} y={ey} fontSize={20} textAnchor="middle" dominantBaseline="central">
              {p.emoji}
            </text>
          </g>
        );
      })}
      {/* Center kanji */}
      <text x={cx} y={cy - 6} fontSize={36} textAnchor="middle" dominantBaseline="central"
        fontFamily={PMINCHO} fill={INK} fontWeight={600}>
        巡
      </text>
      <text x={cx} y={cy + 24} fontSize={11} textAnchor="middle"
        fontFamily={MARU} fill={INK3} fontWeight={600}>
        full circle
      </text>
    </svg>
  );
}

/* ── feature card ─────────────────────────────────────────── */
function Feature({ icon, title, desc, color, soft }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 24,
      padding: '20px 20px',
      boxShadow: '0 4px 20px rgba(58,50,38,0.06)',
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: soft, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: MARU, fontSize: 15, fontWeight: 700,
          color: INK, marginBottom: 4,
        }}>{title}</div>
        <div style={{
          fontFamily: MARU, fontSize: 13, fontWeight: 500,
          color: INK2, lineHeight: 1.6,
        }}>{desc}</div>
      </div>
    </div>
  );
}

/* ── privacy seal ─────────────────────────────────────────── */
function PrivacySeal({ isJa }) {
  const items = isJa ? [
    { icon: '🔒', text: 'データは端末内のみ。サーバーに送信しません' },
    { icon: '👤', text: 'アカウント登録不要。匿名で使えます' },
    { icon: '📍', text: '位置情報は取得しません' },
    { icon: '🗑️', text: 'いつでも全データを削除できます' },
  ] : [
    { icon: '🔒', text: 'All data stays on your device. Nothing is sent to a server.' },
    { icon: '👤', text: 'No account needed. Completely anonymous.' },
    { icon: '📍', text: 'No location tracking. Ever.' },
    { icon: '🗑️', text: 'Delete everything anytime from Settings.' },
  ];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 24,
      padding: '24px 20px',
      boxShadow: '0 4px 20px rgba(58,50,38,0.06)',
    }}>
      <div style={{
        fontFamily: PMINCHO, fontSize: 18, fontWeight: 600,
        color: INK, textAlign: 'center', marginBottom: 16,
      }}>
        {isJa ? 'あなたのプライバシーを守ります' : 'Your privacy, protected'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <span style={{
              fontFamily: MARU, fontSize: 13, fontWeight: 600,
              color: INK2, lineHeight: 1.5,
            }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── phase showcase ───────────────────────────────────────── */
function PhaseShowcase({ isJa }) {
  const phases = [
    { ...PHASES.sei, seasonLabel: isJa ? '冬 · 静寂' : 'Winter · Stillness',
      tip: isJa ? 'ゆっくり休んで。温かいジンジャーティーを。' : 'Rest gently. Try a warm ginger tea.' },
    { ...PHASES.me, seasonLabel: isJa ? '春 · 萌芽' : 'Spring · Budding',
      tip: isJa ? 'エネルギーが戻ってくる。新しいことを始めよう。' : 'Energy returns. Start something new.' },
    { ...PHASES.ki, seasonLabel: isJa ? '夏 · 輝き' : 'Summer · Radiance',
      tip: isJa ? '最も輝く時期。自信を持って。' : 'Your most radiant days. Own it.' },
    { ...PHASES.mi, seasonLabel: isJa ? '秋 · 結実' : 'Autumn · Ripening',
      tip: isJa ? '内省の季節。ラベンダーオイルでリラックス。' : 'Time for reflection. Unwind with lavender.' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {phases.map((p) => (
        <div key={p.key} style={{
          background: p.tint,
          borderRadius: 20,
          padding: '16px 14px',
          border: `1.5px solid ${p.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{p.emoji}</span>
            <span style={{
              fontFamily: MARU, fontSize: 12, fontWeight: 700,
              color: p.deep,
            }}>{p.seasonLabel}</span>
          </div>
          <div style={{
            fontFamily: MARU, fontSize: 12, fontWeight: 600,
            color: p.deep, opacity: 0.8, lineHeight: 1.5,
          }}>{p.tip}</div>
        </div>
      ))}
    </div>
  );
}

/* ── main landing page ───────────────────────────────────── */
export function LandingPage({ onGetStarted }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language?.startsWith('ja') ? 'ja' : 'en');
  const isJa = lang === 'ja';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const features = isJa ? [
    { icon: '🌸', title: '四季のフェーズシステム', desc: '生理周期を冬・春・夏・秋の四季になぞらえ、今の自分に合ったケアを提案します。', color: PHASES.sei.accent, soft: PHASES.sei.soft },
    { icon: '🍵', title: '漢方 × 科学のケア提案', desc: '東洋医学と最新研究に基づいた、お茶・食事・スキンケアのレコメンド。iHerbで簡単購入。', color: PHASES.me.accent, soft: PHASES.me.soft },
    { icon: '😊', title: 'ムードトラッキング', desc: '手描きイラストの5段階ムード記録。AIが周期パターンからムード予測も。', color: PHASES.ki.accent, soft: PHASES.ki.soft },
    { icon: '💪', title: 'ワークモード', desc: '周期に合わせた仕事の進め方・会議のコツ・エネルギー管理術。', color: PHASES.mi.accent, soft: PHASES.mi.soft },
  ] : [
    { icon: '🌸', title: 'Four-Season Phase System', desc: 'Your cycle mapped to Winter, Spring, Summer, Autumn — with care tips tailored to each season.', color: PHASES.sei.accent, soft: PHASES.sei.soft },
    { icon: '🍵', title: 'TCM × Science Recommendations', desc: 'Tea, food, and skincare picks backed by both traditional medicine and modern research. Shop on iHerb.', color: PHASES.me.accent, soft: PHASES.me.soft },
    { icon: '😊', title: 'Mood Tracking & Prediction', desc: 'Hand-illustrated mood faces with AI-powered predictions based on your cycle patterns.', color: PHASES.ki.accent, soft: PHASES.ki.soft },
    { icon: '💪', title: 'Work Mode', desc: 'Meeting strategies, energy management, and productivity tips matched to your phase.', color: PHASES.mi.accent, soft: PHASES.mi.soft },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${PHASES.ki.tint} 0%, ${CREAM} 30%, #fff 70%, ${PHASES.sei.tint} 100%)`,
      overflowX: 'hidden',
    }}>
      {/* ── Language toggle (top-right) ── */}
      <div style={{
        position: 'fixed', top: 12, right: 16, zIndex: 50,
        display: 'flex', gap: 4,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12, padding: 3,
        boxShadow: '0 2px 8px rgba(58,50,38,0.08)',
      }}>
        {['en', 'ja'].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: '5px 12px', borderRadius: 9, border: 'none',
            fontFamily: MARU, fontSize: 13, fontWeight: 700,
            background: lang === l ? '#F2E88C' : 'transparent',
            color: lang === l ? INK : INK3,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {l === 'en' ? 'EN' : 'JA'}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      <section style={{
        textAlign: 'center',
        padding: '56px 24px 32px',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 24,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: '#F2E88C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogoMark fontSize={24} color="#fff" bgColor="#F2E88C" />
          </div>
          <span style={{
            fontFamily: LOGO_WORD,
            fontSize: 28, fontWeight: 600,
            color: INK,
            position: 'relative',
          }}>
            megur
            <span style={{ position: 'relative', display: 'inline-block' }}>
              &#305;{/* dotless i */}
              <svg viewBox="0 0 24 24" width="12" height="12" style={{
                position: 'absolute', left: '50%', top: 0,
                transform: 'translateX(-50%)', pointerEvents: 'none',
              }}>
                <circle cx="12" cy="12" r="5" fill={INK} />
                <line x1="12" y1="1" x2="12" y2="5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
                <line x1="12" y1="19" x2="12" y2="23" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
                <line x1="1" y1="12" x2="5" y2="12" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
                <line x1="19" y1="12" x2="23" y2="12" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
                <line x1="4.2" y1="4.2" x2="7" y2="7" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="17" x2="19.8" y2="19.8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1="4.2" y1="19.8" x2="7" y2="17" stroke={INK} strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="7" x2="19.8" y2="4.2" stroke={INK} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </span>
        </div>

        {/* Tagline */}
        <h1 style={{
          fontFamily: PMINCHO,
          fontSize: isJa ? 26 : 28,
          fontWeight: 600,
          color: INK,
          lineHeight: 1.35,
          margin: '0 0 12px',
        }}>
          {isJa ? (
            <>めぐる、わたしの季節</>
          ) : (
            <>Your cycle,<br />naturally</>
          )}
        </h1>
        <p style={{
          fontFamily: MARU,
          fontSize: 15, fontWeight: 600,
          color: INK2,
          lineHeight: 1.6,
          maxWidth: 300, margin: '0 auto',
        }}>
          {isJa
            ? '周期を四季になぞらえ、今の自分にぴったりのケアを見つける。'
            : 'Map your cycle to the four seasons. Discover the care that fits you today.'}
        </p>

        {/* Phase ring */}
        <div style={{ margin: '28px auto 0', maxWidth: 200 }}>
          <PhaseRing size={200} />
        </div>
      </section>

      {/* ── Phase showcase ── */}
      <section style={{ padding: '0 20px 32px', maxWidth: 440, margin: '0 auto' }}>
        <PhaseShowcase isJa={isJa} />
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '0 20px 32px', maxWidth: 440, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: PMINCHO, fontSize: 20, fontWeight: 600,
          color: INK, textAlign: 'center', marginBottom: 16,
        }}>
          {isJa ? 'できること' : 'What Meguri does'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {features.map((f, i) => (
            <Feature key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ── Privacy ── */}
      <section style={{ padding: '0 20px 32px', maxWidth: 440, margin: '0 auto' }}>
        <PrivacySeal isJa={isJa} />
      </section>

      {/* ── Bilingual message ── */}
      <section style={{
        textAlign: 'center',
        padding: '0 24px 32px',
        maxWidth: 440, margin: '0 auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 8,
        }}>
          <span style={{
            fontFamily: MARU, fontSize: 14, fontWeight: 700,
            padding: '3px 10px', borderRadius: 8,
            background: PHASES.me.soft, color: PHASES.me.deep,
          }}>EN</span>
          <span style={{
            fontFamily: MARU, fontSize: 14, fontWeight: 700,
            padding: '3px 10px', borderRadius: 8,
            background: PHASES.sei.soft, color: PHASES.sei.deep,
          }}>日本語</span>
        </div>
        <p style={{
          fontFamily: MARU, fontSize: 13, fontWeight: 600,
          color: INK3, lineHeight: 1.6,
        }}>
          {isJa
            ? '英語・日本語完全対応。いつでも切り替えOK。'
            : 'Fully bilingual in English & Japanese. Switch anytime.'}
        </p>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '0 24px 48px',
        textAlign: 'center',
        maxWidth: 440, margin: '0 auto',
      }}>
        <button
          onClick={onGetStarted}
          style={{
            width: '100%', maxWidth: 320,
            padding: '16px 32px',
            borderRadius: 20, border: 'none',
            background: `linear-gradient(135deg, #F2E88C 0%, #F0B818 100%)`,
            fontFamily: MARU, fontSize: 17, fontWeight: 800,
            color: INK, cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(240,184,24,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = ''}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          {isJa ? 'はじめる' : 'Get Started'}
        </button>
        <p style={{
          fontFamily: MARU, fontSize: 12, fontWeight: 600,
          color: INK3, marginTop: 12, lineHeight: 1.5,
        }}>
          {isJa
            ? '無料・登録不要・広告なし'
            : 'Free · No sign-up · No ads'}
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 24px 32px',
        borderTop: '1px solid rgba(58,50,38,0.06)',
      }}>
        <p style={{
          fontFamily: MARU, fontSize: 11, fontWeight: 600,
          color: INK3,
        }}>
          © 2024 Meguri 巡 · {isJa ? 'プライバシーファースト' : 'Privacy First'}
        </p>
      </footer>
    </div>
  );
}
