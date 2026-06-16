import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SYMPTOMS = [
  'cramps', 'headache', 'bloating', 'backPain',
  'breastTenderness', 'acne', 'cravings', 'nausea',
  'fatigue', 'insomnia'
];

const FLOW_LEVELS = ['none', 'spotting', 'light', 'medium', 'heavy'];

function RatingScale({ value, onChange, max = 5 }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`mood-btn flex-1 py-3 rounded-xl font-medium transition-all ${
            value === num
              ? 'active bg-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export function DailyCheckin({ cycleDay, onSave, existingData, checkins = [], onLogPeriod, periodHistory = [] }) {
  const { t, i18n } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  const locale = i18n.language.startsWith('ja') ? 'ja-JP' : 'en-US';

  const [mood, setMood] = useState(existingData?.mood || 3);
  const [energy, setEnergy] = useState(existingData?.energy || 3);
  const [flow, setFlow] = useState(existingData?.flow || 'none');
  const [symptoms, setSymptoms] = useState(existingData?.symptoms || []);
  const [notes, setNotes] = useState(existingData?.notes || '');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [periodLogged, setPeriodLogged] = useState(false);

  const toggleSymptom = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    onSave({
      date: today,
      cycleDay,
      mood,
      energy,
      flow,
      symptoms,
      notes
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogPeriod = () => {
    if (onLogPeriod) {
      onLogPeriod(today);
      setPeriodLogged(true);
      setFlow('medium');
      setTimeout(() => setPeriodLogged(false), 2000);
    }
  };

  const recentCheckins = [...checkins]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 14);

  const getMoodIcon = (m) => {
    const colors = {
      1: 'bg-red-100 text-red-500',
      2: 'bg-orange-100 text-orange-500',
      3: 'bg-gray-100 text-gray-500',
      4: 'bg-emerald-100 text-emerald-500',
      5: 'bg-green-100 text-green-500'
    };
    return (
      <div className={`w-8 h-8 rounded-lg ${colors[m]} flex items-center justify-center font-bold text-sm`}>
        {m}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Period Log Button */}
      <button
        onClick={handleLogPeriod}
        disabled={periodLogged}
        className={`w-full p-5 rounded-2xl text-left transition-all active:scale-[0.99] shadow-lg ${
          periodLogged
            ? 'bg-gradient-to-r from-emerald-500 to-green-500'
            : 'bg-gradient-to-r from-rose-500 to-pink-500'
        }`}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              {periodLogged ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <div>
              <div className="font-semibold text-lg">
                {periodLogged ? t('checkin.periodLogged') : t('checkin.logPeriodStart')}
              </div>
              <div className="text-white/80 text-sm">
                {periodLogged ? t('checkin.cycleRestarted') : t('checkin.tapIfStarted')}
              </div>
            </div>
          </div>
          {!periodLogged && (
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </button>

      {/* Header */}
      <div className="card p-5 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t('checkin.title')}</h2>
            <p className="text-gray-600 mt-1">{t('checkin.howAreYou')}</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-2 rounded-xl bg-white/80 text-pink-600 text-sm font-medium hover:bg-white transition-colors"
          >
            {showHistory ? t('checkin.hideHistory') : t('checkin.viewHistory')}
          </button>
        </div>
      </div>

      {/* History View */}
      {showHistory && (
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-gray-800">{t('checkin.recentEntries')}</h3>
          {recentCheckins.length === 0 ? (
            <p className="text-sm text-gray-500">{t('checkin.noEntries')}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentCheckins.map((entry) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {getMoodIcon(entry.mood)}
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString(locale, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('checkin.day')} {entry.cycleDay} • {t(`checkin.flowLevels.${entry.flow}`)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                    {entry.symptoms?.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full text-xs">
                        {t(`checkin.symptomsList.${s}`)}
                      </span>
                    ))}
                    {entry.symptoms?.length > 3 && (
                      <span className="text-xs text-gray-400">+{entry.symptoms.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Period History */}
          {periodHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{t('checkin.periodHistory')}</h4>
              <div className="flex flex-wrap gap-2">
                {periodHistory.slice(0, 6).map((date) => (
                  <span key={date} className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">
                    {new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mood */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">{t('checkin.mood')}</h3>
          <span className="text-sm text-pink-500 font-medium">
            {t(`checkin.moodLevels.${mood}`)}
          </span>
        </div>
        <RatingScale value={mood} onChange={setMood} />
      </div>

      {/* Energy */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">{t('checkin.energy')}</h3>
          <span className="text-sm text-pink-500 font-medium">
            {t(`checkin.energyLevels.${energy}`)}
          </span>
        </div>
        <RatingScale value={energy} onChange={setEnergy} />
      </div>

      {/* Flow */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">{t('checkin.flow')}</h3>
        <div className="flex flex-wrap gap-2">
          {FLOW_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setFlow(level)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                flow === level
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`checkin.flowLevels.${level}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">{t('checkin.symptoms')}</h3>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                symptoms.includes(symptom)
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`checkin.symptomsList.${symptom}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes / Diary */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">{t('checkin.diary')}</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('checkin.diaryPlaceholder')}
          rows={4}
          className="input resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full btn-primary flex items-center justify-center gap-2 ${
          saved ? 'bg-emerald-500' : ''
        }`}
      >
        {saved ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('checkin.saved')}
          </>
        ) : (
          t('checkin.save')
        )}
      </button>
    </div>
  );
}
