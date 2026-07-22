import { useState } from 'react';
import { PHASES, PHASE_ORDER, PHASE_RANGES, CYCLE_LEN, CREAM2, CARD, INK, INK2, INK3, LINE, LINE2, MARU, PMINCHO, phaseForDay, phaseKeyFromLegacy } from '../utils/phases';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '../contexts/SubscriptionContext';

export function Settings({ cycleData, cycleInfo, onUpdate, onReset, theme, onThemeChange }) {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');
  const locale = isJa ? 'ja-JP' : 'en-US';
  const { isPremium, subscription } = useSubscription();

  const [lastPeriodStart, setLastPeriodStart] = useState(cycleData?.lastPeriodStart || '');
  const [cycleLength, setCycleLength] = useState(cycleData?.cycleLength || 28);
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const sliderPercent = ((cycleLength - 21) / (35 - 21)) * 100;

  const ki = PHASES.ki;

  const handleSave = () => {
    onUpdate({
      ...cycleData,
      lastPeriodStart,
      cycleLength: parseInt(cycleLength),
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  // Use the current phase for accent coloring on the save button
  const phaseKey = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : 'ki';
  const currentP = PHASES[phaseKey];

  const miscRows = [
    {
      titleJa: '通知',
      titleEn: 'Notifications',
      subtitleJa: '周期リマインダーとアラート',
      subtitleEn: 'Cycle reminders and alerts',
    },
    {
      titleJa: 'プライバシー',
      titleEn: 'Privacy',
      subtitleJa: 'データはデバイスに保存されます',
      subtitleEn: 'Data stays on your device',
    },
    {
      titleJa: 'ヘルプ',
      titleEn: 'Help',
      subtitleJa: 'よくある質問とサポート',
      subtitleEn: 'FAQ and support',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16, position: 'relative' }}>
      {/* Blobby radial gradient wash at top */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 340,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${ki.soft}, ${ki.tint} 55%, transparent 75%)`,
          filter: 'blur(16px)',
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Title */}
      <div style={{ textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: MARU, fontSize: 26, fontWeight: 900, color: INK, margin: 0 }}>
          {isJa ? '設定' : 'Settings'}
        </h2>
      </div>

      {/* Plan card */}
      <div
        className="card"
        style={{
          padding: '18px 20px',
          background: `linear-gradient(135deg, ${ki.tint}, ${ki.soft})`,
          border: `1px solid ${ki.line}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Star icon tile */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 15,
              background: `linear-gradient(135deg, ${ki.accent}, ${ki.deep})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            {/* Eyebrow */}
            <div style={{ fontFamily: MARU, fontSize: 11, color: ki.accent, fontWeight: 700, marginBottom: 2 }}>
              {isJa ? '現在のプラン' : 'Current Plan'}
            </div>
            {/* Plan name */}
            <div style={{ fontFamily: MARU, fontSize: 21, fontWeight: 900, color: INK }}>
              {isPremium ? (isJa ? 'プレミアム' : 'Premium') : (isJa ? '無料' : 'Free')}
            </div>
            {/* Expiry */}
            {isPremium && subscription?.expiresAt && (
              <div style={{ fontFamily: MARU, fontSize: 11.5, color: INK2, marginTop: 2 }}>
                {isJa ? '有効期限: ' : 'Active until '}
                {new Date(subscription.expiresAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Premium badge pill */}
          {isPremium && (
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                background: `${ki.accent}22`,
                border: `1px solid ${ki.accent}44`,
                fontFamily: MARU,
                fontSize: 10.5,
                fontWeight: 700,
                color: ki.accent,
              }}
            >
              PRO
            </div>
          )}
        </div>
      </div>

      {/* Cycle settings card */}
      <div className="card" style={{ padding: '18px 20px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 700, color: INK, marginBottom: 16 }}>
          {isJa ? '周期設定' : 'Cycle Settings'}
        </h3>

        {/* Last period date input */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: INK2, display: 'block', marginBottom: 6 }}>
            {isJa ? '最終生理開始日' : 'Last period start'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={lastPeriodStart}
              onChange={(e) => setLastPeriodStart(e.target.value)}
              max={today}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                border: `1px solid ${LINE}`,
                background: CARD,
                fontFamily: MARU,
                fontSize: 14,
                color: INK,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Cycle length slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontFamily: MARU, fontSize: 13, fontWeight: 700, color: INK2 }}>
              {isJa ? '周期の長さ' : 'Cycle Length'}
            </label>
            <span style={{ fontFamily: MARU, fontSize: 20, fontWeight: 900, color: currentP.accent }}>
              {cycleLength} {isJa ? '日' : 'days'}
            </span>
          </div>
          <div style={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 6,
                borderRadius: 3,
                background: CREAM2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: `${sliderPercent}%`,
                height: 6,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${currentP.accent}, ${currentP.deep})`,
              }}
            />
            <input
              type="range"
              min="21"
              max="35"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              style={{
                position: 'relative',
                width: '100%',
                height: 28,
                margin: 0,
                opacity: 0,
                cursor: 'pointer',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${sliderPercent}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: currentP.accent,
                border: '3px solid #fff',
                boxShadow: `0 2px 8px ${currentP.accent}44`,
                pointerEvents: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: MARU, fontSize: 10.5, color: INK3 }}>21</span>
            <span style={{ fontFamily: MARU, fontSize: 10.5, color: INK3 }}>28</span>
            <span style={{ fontFamily: MARU, fontSize: 10.5, color: INK3 }}>35</span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            border: 'none',
            background: `linear-gradient(135deg, ${currentP.accent}, ${currentP.deep})`,
            fontFamily: MARU,
            fontSize: 15,
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${currentP.accent}33`,
          }}
        >
          {isJa ? '変更を保存' : 'Save Changes'}
        </button>
      </div>

      {/* Language card */}
      <div className="card" style={{ padding: '18px 20px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontFamily: MARU, fontSize: 17, fontWeight: 700, color: INK, marginBottom: 14 }}>
          {isJa ? '言語' : 'Language'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { code: 'en', label: 'EN', name: 'English' },
            { code: 'ja', label: '日', name: '日本語' },
          ].map((lang) => {
            const selected = currentLang === lang.code;
            const sp = PHASES[phaseKey];
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: selected ? `1px solid ${sp.line}` : `1px solid ${LINE}`,
                  background: selected ? sp.tint : CREAM2,
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {/* Code tile */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: selected ? sp.accent : INK3 + '33',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: MARU,
                    fontSize: 13,
                    fontWeight: 700,
                    color: selected ? '#fff' : INK3,
                  }}
                >
                  {lang.label}
                </div>

                {/* Name */}
                <span style={{ fontFamily: MARU, fontSize: 15, fontWeight: 700, color: selected ? INK : INK2, flex: 1 }}>
                  {lang.name}
                </span>

                {/* Checkmark */}
                {selected && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={sp.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Misc list */}
      <div className="card" style={{ padding: 6, position: 'relative', zIndex: 1 }}>
        {miscRows.map((row, i) => (
          <button
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '14px 14px',
              borderRadius: 12,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: i < miscRows.length - 1 ? `1px solid ${LINE2}` : 'none',
            }}
          >
            <div>
              <div style={{ fontFamily: MARU, fontSize: 15, fontWeight: 700, color: INK, textAlign: 'left' }}>
                {isJa ? row.titleJa : row.titleEn}
              </div>
              <div style={{ fontFamily: MARU, fontSize: 12, color: INK3, textAlign: 'left', marginTop: 2 }}>
                {isJa ? row.subtitleJa : row.subtitleEn}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>

      {/* Delete data button */}
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            border: '1px solid #E8C4C4',
            background: '#FDF2F2',
            fontFamily: MARU,
            fontSize: 14,
            fontWeight: 700,
            color: '#B91C1C',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isJa ? 'すべてのデータを削除' : 'Delete All Data'}
        </button>
      ) : (
        <div
          className="card"
          style={{
            padding: 18,
            background: '#FDF2F2',
            border: '1px solid #E8C4C4',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p style={{ fontFamily: MARU, fontSize: 13, color: '#B91C1C', marginBottom: 14 }}>
            {isJa ? 'すべてのデータが完全に削除されます。この操作は取り消せません。' : 'All data will be permanently deleted. This action cannot be undone.'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                onReset();
                setShowDeleteConfirm(false);
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: '#B91C1C',
                fontFamily: MARU,
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {isJa ? 'はい、削除する' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: `1px solid ${LINE}`,
                background: CARD,
                fontFamily: MARU,
                fontSize: 14,
                fontWeight: 700,
                color: INK2,
                cursor: 'pointer',
              }}
            >
              {isJa ? 'キャンセル' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showSaved && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 24px',
            borderRadius: 20,
            background: INK,
            color: '#fff',
            fontFamily: MARU,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          {isJa ? '保存しました' : 'Saved'}
        </div>
      )}
    </div>
  );
}
