import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SYMPTOMS = [
  'cramps', 'headache', 'bloating', 'backPain',
  'breastTenderness', 'acne', 'cravings', 'nausea',
  'fatigue', 'insomnia'
];

const FLOW_LEVELS = ['none', 'spotting', 'light', 'medium', 'heavy'];

function RatingScale({ value, onChange, labels, max = 5 }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            value === num
              ? 'bg-pink-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export function DailyCheckin({ cycleDay, onSave, existingData }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];

  const [mood, setMood] = useState(existingData?.mood || 3);
  const [energy, setEnergy] = useState(existingData?.energy || 3);
  const [flow, setFlow] = useState(existingData?.flow || 'none');
  const [symptoms, setSymptoms] = useState(existingData?.symptoms || []);
  const [notes, setNotes] = useState(existingData?.notes || '');
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
        <h2 className="text-xl font-bold text-gray-800">{t('checkin.title')}</h2>
        <p className="text-gray-600 mt-1">{t('checkin.howAreYou')}</p>
      </div>

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

      {/* Notes */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-3">{t('checkin.notes')}</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="..."
          rows={3}
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
