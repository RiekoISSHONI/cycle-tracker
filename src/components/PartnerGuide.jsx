import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASES, MARU, PMINCHO, INK, INK2, INK3, CREAM2, CORAL, CORAL_D, LINE, phaseKeyFromLegacy } from '../utils/phases';
import { CycleRing } from './CycleRing';
import { PhaseSticker } from './PhaseSticker';
import { PartnerShare } from './PartnerShare';

const GLASS = {
  background: 'rgba(255,255,255,0.70)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 18px rgba(58,50,38,0.04)',
  border: '1px solid rgba(255,255,255,0.5)',
};

const PLAY_COPY = {
  ki: {
    ja: '気になるあの人を誘うなら今日！',
    en: "Ask out your crush — today's the day!",
  },
  sei: {
    ja: 'あったかいお茶でひと息つこう',
    en: 'Warm tea and a cozy break sound perfect',
  },
  me: {
    ja: '軽いおさんぽで気分もすっきり',
    en: 'A light walk will lift your mood',
  },
  mi: {
    ja: '甘いものは控えめに、睡眠たっぷり',
    en: 'Go easy on sweets, get plenty of sleep',
  },
};

export function PartnerGuide({ cycleInfo }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');
  const lang = isJa ? 'ja' : 'en';

  const [showShareModal, setShowShareModal] = useState(false);

  const phaseKey = phaseKeyFromLegacy(cycleInfo.phase);
  const legacyPhase = cycleInfo.phase;
  const p = PHASES[phaseKey];
  const day = cycleInfo.cycleDay;
  const tipCopy = PLAY_COPY[phaseKey][lang];

  const partnerUnderstand = t(`partnerTips.${legacyPhase}.understand`) || '';
  const partnerSupport = t(`partnerTips.${legacyPhase}.support`, { returnObjects: true }) || [];
  const partnerAvoid = t(`partnerTips.${legacyPhase}.avoid`, { returnObjects: true }) || [];
  const partnerSayThis = t(`partnerTips.${legacyPhase}.sayThis`, { returnObjects: true }) || [];
  const partnerOffer = t(`partnerTips.${legacyPhase}.offer`, { returnObjects: true }) || [];

  return (
    <div style={{ position: 'relative', paddingBottom: 130 }}>
      {/* rainbow wash */}
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
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 36, fontWeight: 600, color: p.accent, lineHeight: 1 }}>
            {p.kanji}
          </div>
          <div style={{ fontFamily: PMINCHO, fontSize: 24, fontWeight: 600, color: INK, marginTop: 8 }}>
            {isJa ? 'パートナーガイド' : 'Partner Guide'}
          </div>
          <div style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, marginTop: 4 }}>
            {isJa ? `${p.season} · ${p.name}` : `${p.seasonEn} · ${p.en}`}
          </div>
        </div>

        {/* Phase status card */}
        <div style={{
          ...GLASS, borderRadius: 24, padding: '20px 20px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <CycleRing size={80} day={day} stroke={6} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}>
                <PhaseSticker phase={phaseKey} size={40} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: PMINCHO, fontSize: 28, fontWeight: 600, color: INK, lineHeight: 1 }}>
                {isJa ? `${day}日目` : `Day ${day}`}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 10px', borderRadius: 99, background: p.soft, marginTop: 6,
              }}>
                <span style={{ fontSize: 13 }}>{p.emoji}</span>
                <span style={{ fontFamily: MARU, fontSize: 12, fontWeight: 600, color: p.deep }}>
                  {isJa ? p.name : p.en}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How she may feel */}
        <div style={{
          ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 14,
        }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: INK, marginBottom: 10 }}>
            {isJa ? '今の気持ち' : 'How she may feel'}
          </div>
          <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: INK2, margin: 0, lineHeight: 1.6 }}>
            {partnerUnderstand}
          </p>
        </div>

        {/* How to support */}
        <div style={{
          ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 14,
        }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: PHASES.me.deep, marginBottom: 10 }}>
            {isJa ? 'サポート方法' : 'How to support'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {partnerSupport.slice(0, 4).map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: PHASES.me.accent, flexShrink: 0, marginTop: 7,
                }} />
                <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, lineHeight: 1.55 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What to avoid */}
        {partnerAvoid.length > 0 && (
          <div style={{
            ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 14,
          }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: PHASES.sei.deep, marginBottom: 10 }}>
              {isJa ? '避けた方がいいこと' : 'What to avoid'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {partnerAvoid.slice(0, 3).map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: PHASES.sei.accent, flexShrink: 0, marginTop: 7,
                  }} />
                  <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, lineHeight: 1.55 }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Words that help */}
        {partnerSayThis.length > 0 && (
          <div style={{
            ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 14,
          }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: PHASES.ki.deep, marginBottom: 12 }}>
              {isJa ? 'こう言ってあげて' : 'Words that help'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {partnerSayThis.slice(0, 3).map((phrase, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 14,
                  background: PHASES.ki.tint,
                  border: `1px solid ${PHASES.ki.line}`,
                }}>
                  <span style={{
                    fontFamily: MARU, fontSize: 14, fontWeight: 500,
                    color: INK, lineHeight: 1.55, fontStyle: 'italic',
                  }}>
                    &ldquo;{phrase}&rdquo;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Things you can do */}
        {partnerOffer.length > 0 && (
          <div style={{
            ...GLASS, borderRadius: 24, padding: '18px 20px', marginBottom: 14,
          }}>
            <div style={{ fontFamily: PMINCHO, fontSize: 17, fontWeight: 600, color: PHASES.mi.deep, marginBottom: 10 }}>
              {isJa ? '今日できること' : 'Things you can do'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {partnerOffer.slice(0, 3).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: PHASES.mi.accent, flexShrink: 0, marginTop: 7,
                  }} />
                  <span style={{ fontFamily: MARU, fontSize: 14, fontWeight: 500, color: INK2, lineHeight: 1.55 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip of the day */}
        <div style={{
          background: `linear-gradient(135deg, ${p.soft}, ${p.tint})`,
          border: `1px solid ${p.line}`,
          borderRadius: 24, padding: '18px 20px',
          marginBottom: 14,
        }}>
          <div style={{ fontFamily: PMINCHO, fontSize: 14, fontWeight: 600, color: p.deep, marginBottom: 6 }}>
            {isJa ? '今日のヒント' : "Today's tip"}
          </div>
          <p style={{ fontFamily: MARU, fontSize: 13, fontWeight: 500, color: p.deep, margin: 0, lineHeight: 1.55 }}>
            {tipCopy}
          </p>
        </div>

        {/* Share with partner */}
        <button
          onClick={() => setShowShareModal(true)}
          style={{
            width: '100%', padding: '15px 20px',
            borderRadius: 18, border: 'none',
            background: `linear-gradient(135deg, ${CORAL}, ${CORAL_D})`,
            boxShadow: `0 6px 18px ${CORAL}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span style={{
            fontFamily: MARU, fontSize: 15, fontWeight: 700, color: '#fff',
          }}>
            {isJa ? 'パートナーに送る' : 'Share with Partner'}
          </span>
        </button>
      </div>

      {showShareModal && (
        <PartnerShare cycleInfo={cycleInfo} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
