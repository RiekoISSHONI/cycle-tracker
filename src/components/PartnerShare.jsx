import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getGiftItems, getClothingItems } from '../utils/giftItems';

// Rotate items daily based on date seed
function rotateItems(items, seed) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function CollapsibleShopSection({ title, emoji, subtitle, items, lang, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="px-4 pb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <h3 className="font-medium text-bark text-sm">{title}</h3>
        </div>
        <svg
          className={`w-4 h-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <>
          <p className="text-xs text-muted mb-2">{subtitle}</p>
          <div className="space-y-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <div>
                    <p className="text-xs font-medium text-bark">{lang === 'ja' ? item.nameJa : item.name}</p>
                    <p className="text-xs text-muted">{item.description}</p>
                  </div>
                </div>
                <span className="text-xs text-terra font-medium">Shop →</span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const phaseKanji = {
  menstrual: { kanji: '静', meaning: 'stillness' },
  follicular: { kanji: '芽', meaning: 'sprout' },
  ovulatory: { kanji: '輝', meaning: 'radiance' },
  luteal: { kanji: '穏', meaning: 'calm' }
};

const phaseColors = {
  menstrual: { bg: 'bg-rose-50', accent: 'text-rose-600', border: 'border-rose-200' },
  follicular: { bg: 'bg-pink-50', accent: 'text-pink-600', border: 'border-pink-200' },
  ovulatory: { bg: 'bg-amber-50', accent: 'text-amber-600', border: 'border-amber-200' },
  luteal: { bg: 'bg-violet-50', accent: 'text-violet-600', border: 'border-violet-200' }
};

function Toggle({ checked, onChange, label, locked = false }) {
  return (
    <button
      onClick={() => !locked && onChange(!checked)}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
        checked ? 'bg-terra/10' : 'bg-gray-50'
      } ${locked ? 'opacity-75' : 'hover:bg-terra/5'}`}
    >
      <span className="text-sm text-bark">{label}</span>
      <div className="flex items-center gap-2">
        {locked && (
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-terra' : 'bg-gray-300'}`}>
          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${checked ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    </button>
  );
}

function ShareCard({ cycleInfo, options, lang }) {
  const { t } = useTranslation();
  const phase = cycleInfo.phase;
  const phaseData = cycleInfo.phaseData;
  const colors = phaseColors[phase];
  const kanji = phaseKanji[phase];
  const partnerTips = phaseData.forPartner;

  // Rotate items daily
  const daySeed = useMemo(() => {
    const today = new Date();
    return today.getFullYear() * 1000 + today.getMonth() * 32 + today.getDate();
  }, []);

  const rotatedGifts = useMemo(() =>
    rotateItems(getGiftItems(phase), daySeed).slice(0, 3),
    [phase, daySeed]
  );

  const rotatedClothing = useMemo(() =>
    rotateItems(getClothingItems(phase), daySeed + 1).slice(0, 2),
    [phase, daySeed]
  );

  const today = new Date().toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`rounded-2xl overflow-hidden ${colors.bg} border ${colors.border}`} style={{ width: '320px' }}>
      {/* Header */}
      <div className="p-4 text-center border-b border-white/50">
        <div className="text-2xl font-display text-terra mb-1">巡</div>
        <div className="text-xs text-muted">Meguri</div>
      </div>

      {/* Phase Info - Always shown */}
      <div className="p-4 text-center">
        <p className="text-sm text-muted mb-1">{t('partnerShare.sheIsIn')}</p>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl font-display">{kanji.kanji}</span>
          <h2 className="text-xl font-display text-bark">{phaseData.name}</h2>
        </div>
        <p className="text-sm text-muted">
          {t('dashboard.day')} {cycleInfo.cycleDay} {t('checkin.day')} {cycleInfo.cycleLength}
        </p>
      </div>

      {/* How I'm Feeling */}
      {options.feeling && (
        <div className="px-4 pb-4">
          <p className="text-sm text-center text-muted italic">{phaseData.energy}</p>
        </div>
      )}

      {/* Support Tips */}
      {options.support && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💚</span>
            <h3 className="font-medium text-bark text-sm">{t('partnerShare.howToSupport')}</h3>
          </div>
          <ul className="space-y-1">
            {partnerTips.support.slice(0, 4).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-terra mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What to Avoid */}
      {options.avoid && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🚫</span>
            <h3 className="font-medium text-bark text-sm">{t('partnerShare.whatToAvoid')}</h3>
          </div>
          <ul className="space-y-1">
            {partnerTips.avoid.slice(0, 3).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nutrition Ideas */}
      {options.nutrition && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🍳</span>
            <h3 className="font-medium text-bark text-sm">{t('partnerShare.nutritionIdeas')}</h3>
          </div>
          <p className="text-xs text-muted mb-1">{t('partnerShare.cookMealsWith')}</p>
          <ul className="space-y-1">
            {phaseData.forHer.nutrition.slice(0, 3).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exercise Together */}
      {options.exercise && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏃</span>
            <h3 className="font-medium text-bark text-sm">{t('partnerShare.exerciseTogether')}</h3>
          </div>
          <p className="text-xs text-muted mb-1">{t('partnerShare.greatTimeFor')}</p>
          <ul className="space-y-1">
            {phaseData.forHer.exercise.slice(0, 3).map((tip, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Days Until Period */}
      {options.daysUntil && (
        <div className="px-4 pb-4 text-center">
          <p className="text-xs text-muted">
            📅 {t('partnerShare.nextPeriodIn')} ~{cycleInfo.daysUntilPeriod} {t('insights.days')}
          </p>
        </div>
      )}

      {/* Gift Her - Collapsible */}
      {options.gifts && (
        <CollapsibleShopSection
          title={t('partnerShare.giftHer')}
          emoji="🎁"
          subtitle={t('partnerShare.thingsShedLove')}
          items={rotatedGifts}
          lang={lang}
          defaultExpanded={false}
        />
      )}

      {/* Clothing - Collapsible */}
      {options.clothing && (
        <CollapsibleShopSection
          title={t('partnerShare.clothingHer')}
          emoji="👗"
          subtitle={t('partnerShare.comfortWear')}
          items={rotatedClothing}
          lang={lang}
          defaultExpanded={false}
        />
      )}

      {/* Footer */}
      <div className="p-3 bg-white/50 text-center border-t border-white/50">
        <p className="text-xs text-muted">{t('partnerShare.sharedWithLove')} · {today}</p>
        <p className="text-xs text-terra font-display mt-1">巡 meguri</p>
      </div>
    </div>
  );
}

export function PartnerShare({ cycleInfo, onClose }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('ja') ? 'ja' : 'en';
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [shareHistory, setShareHistory] = useLocalStorage('partnerShareHistory', []);

  const [options, setOptions] = useState({
    feeling: true,
    support: true,
    avoid: true,
    nutrition: false,
    exercise: false,
    daysUntil: false,
    gifts: false,
    clothing: false
  });

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Rotate items for share text (same logic as ShareCard)
  const daySeed = useMemo(() => {
    const today = new Date();
    return today.getFullYear() * 1000 + today.getMonth() * 32 + today.getDate();
  }, []);

  const rotatedGiftsForText = useMemo(() =>
    rotateItems(getGiftItems(cycleInfo.phase), daySeed).slice(0, 3),
    [cycleInfo.phase, daySeed]
  );

  const rotatedClothingForText = useMemo(() =>
    rotateItems(getClothingItems(cycleInfo.phase), daySeed + 1).slice(0, 2),
    [cycleInfo.phase, daySeed]
  );

  const generateShareText = () => {
    const phase = cycleInfo.phase;
    const phaseData = cycleInfo.phaseData;
    const kanji = phaseKanji[phase];
    const partnerTips = phaseData.forPartner;

    let text = `巡 Meguri\n\n`;
    text += `${t('partnerShare.sheIsIn')}\n`;
    text += `${kanji.kanji} ${phaseData.name}\n`;
    text += `${t('dashboard.day')} ${cycleInfo.cycleDay} / ${cycleInfo.cycleLength}\n\n`;

    if (options.feeling) {
      text += `${phaseData.energy}\n\n`;
    }

    if (options.support) {
      text += `💚 ${t('partnerShare.howToSupport')}\n`;
      partnerTips.support.slice(0, 4).forEach(tip => {
        text += `• ${tip}\n`;
      });
      text += `\n`;
    }

    if (options.avoid) {
      text += `🚫 ${t('partnerShare.whatToAvoid')}\n`;
      partnerTips.avoid.slice(0, 3).forEach(tip => {
        text += `• ${tip}\n`;
      });
      text += `\n`;
    }

    if (options.nutrition) {
      text += `🍳 ${t('partnerShare.nutritionIdeas')}\n`;
      phaseData.forHer.nutrition.slice(0, 3).forEach(tip => {
        text += `• ${tip}\n`;
      });
      text += `\n`;
    }

    if (options.exercise) {
      text += `🏃 ${t('partnerShare.exerciseTogether')}\n`;
      phaseData.forHer.exercise.slice(0, 3).forEach(tip => {
        text += `• ${tip}\n`;
      });
      text += `\n`;
    }

    if (options.daysUntil) {
      text += `📅 ${t('partnerShare.nextPeriodIn')} ~${cycleInfo.daysUntilPeriod} ${t('insights.days')}\n\n`;
    }

    if (options.gifts) {
      text += `🎁 ${t('partnerShare.giftHer')}\n`;
      text += `${t('partnerShare.thingsShedLove')}\n`;
      rotatedGiftsForText.forEach(item => {
        text += `${item.emoji} ${lang === 'ja' ? item.nameJa : item.name} - ${item.description}\n`;
        text += `   ${item.affiliateUrl}\n`;
      });
      text += `\n`;
    }

    if (options.clothing) {
      text += `👗 ${t('partnerShare.clothingHer')}\n`;
      text += `${t('partnerShare.comfortWear')}\n`;
      rotatedClothingForText.forEach(item => {
        text += `${item.emoji} ${lang === 'ja' ? item.nameJa : item.name} - ${item.description}\n`;
        text += `   ${item.affiliateUrl}\n`;
      });
      text += `\n`;
    }

    text += `─────────────────\n`;
    text += `${t('partnerShare.sharedWithLove')}\n`;
    text += `巡 meguri`;

    return text;
  };

  const saveToHistory = () => {
    const historyEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      phase: cycleInfo.phase,
      phaseName: cycleInfo.phaseData.name,
      cycleDay: cycleInfo.cycleDay,
      options: { ...options }
    };

    setShareHistory(prev => {
      const updated = [historyEntry, ...prev];
      return updated.slice(0, 50); // Keep last 50 shares
    });
  };

  const handleShare = async () => {
    setSharing(true);
    const text = generateShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Meguri - Partner Update',
          text: text
        });
        saveToHistory();
      } else {
        await navigator.clipboard.writeText(text);
        saveToHistory();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(text);
        saveToHistory();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
    setSharing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-washi">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-bark">{t('partnerShare.title')}</h2>
            <button onClick={onClose} className="p-2 hover:bg-washi rounded-xl transition-colors">
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(false)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                !showHistory ? 'bg-terra text-white' : 'bg-washi text-muted hover:bg-washi/80'
              }`}
            >
              {t('partnerShare.newShare')}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                showHistory ? 'bg-terra text-white' : 'bg-washi text-muted hover:bg-washi/80'
              }`}
            >
              {t('partnerShare.history')} {shareHistory.length > 0 && `(${shareHistory.length})`}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showHistory ? (
            /* History View */
            <div className="space-y-3">
              {shareHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">📭</div>
                  <p className="text-muted text-sm">{t('partnerShare.noHistory')}</p>
                </div>
              ) : (
                shareHistory.map((entry) => (
                  <div key={entry.id} className="bg-washi rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{phaseKanji[entry.phase]?.kanji || '巡'}</span>
                        <div>
                          <p className="font-medium text-bark text-sm">{entry.phaseName}</p>
                          <p className="text-xs text-muted">Day {entry.cycleDay}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted">
                        {new Date(entry.date).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entry.options.feeling && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">💭 {t('partnerShare.howImFeeling')}</span>}
                      {entry.options.support && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">💚 {t('partnerShare.supportTips')}</span>}
                      {entry.options.avoid && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">🚫 {t('partnerShare.avoidTips')}</span>}
                      {entry.options.nutrition && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">🍳 {t('partnerShare.nutritionIdeas')}</span>}
                      {entry.options.exercise && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">🏃 {t('partnerShare.exerciseTogether')}</span>}
                      {entry.options.gifts && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">🎁 {t('partnerShare.giftHerToggle')}</span>}
                      {entry.options.clothing && <span className="text-xs bg-cream px-2 py-0.5 rounded-full">👗 {t('partnerShare.clothingToggle')}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
          /* New Share View */
          <>
          {/* Toggle Options */}
          <div className="space-y-2">
            <p className="text-sm text-muted mb-3">{t('partnerShare.chooseWhat')}</p>

            <Toggle
              checked={true}
              onChange={() => {}}
              label={t('partnerShare.phaseAndDay')}
              locked={true}
            />
            <Toggle
              checked={options.feeling}
              onChange={() => toggleOption('feeling')}
              label={t('partnerShare.howImFeeling')}
            />
            <Toggle
              checked={options.support}
              onChange={() => toggleOption('support')}
              label={t('partnerShare.supportTips')}
            />
            <Toggle
              checked={options.avoid}
              onChange={() => toggleOption('avoid')}
              label={t('partnerShare.avoidTips')}
            />
            <Toggle
              checked={options.nutrition}
              onChange={() => toggleOption('nutrition')}
              label={t('partnerShare.nutritionIdeas')}
            />
            <Toggle
              checked={options.exercise}
              onChange={() => toggleOption('exercise')}
              label={t('partnerShare.exerciseTogether')}
            />
            <Toggle
              checked={options.daysUntil}
              onChange={() => toggleOption('daysUntil')}
              label={t('partnerShare.daysUntilPeriod')}
            />
            <Toggle
              checked={options.gifts}
              onChange={() => toggleOption('gifts')}
              label={t('partnerShare.giftHerToggle')}
            />
            <Toggle
              checked={options.clothing}
              onChange={() => toggleOption('clothing')}
              label={t('partnerShare.clothingToggle')}
            />
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-washi">
            <p className="text-sm text-muted mb-3">{t('partnerShare.preview')}</p>
            <div className="flex justify-center overflow-x-auto pb-2">
              <div ref={cardRef}>
                <ShareCard cycleInfo={cycleInfo} options={options} lang={lang} />
              </div>
            </div>
          </div>
          </>
          )}
        </div>

        {/* Footer - only show for new share */}
        {!showHistory && (
          <div className="p-4 border-t border-washi">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {sharing ? (
                <span>{t('partnerShare.sharing')}</span>
              ) : copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('partnerShare.copied')}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{t('partnerShare.shareSummary')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
