import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CYCLE_PHASES } from '../utils/cycleData';
import { downloadCalendarEvents } from '../utils/calendarExport';

export function CycleCalendar({ cycleInfo }) {
  const { t } = useTranslation();
  const { cycleDay, cycleLength, phase } = cycleInfo;
  const [calendarExported, setCalendarExported] = useState(false);

  const handleExportCalendar = () => {
    downloadCalendarEvents(cycleInfo.lastPeriodStart || new Date().toISOString().split('T')[0], cycleLength, 6);
    setCalendarExported(true);
    setTimeout(() => setCalendarExported(false), 3000);
  };

  // Generate array of days for the cycle
  const days = Array.from({ length: cycleLength }, (_, i) => i + 1);

  // Calculate phase for each day
  const getPhaseForDay = (day) => {
    const ratio = cycleLength / 28;
    const menstrualEnd = Math.round(5 * ratio);
    const follicularEnd = Math.round(13 * ratio);
    const ovulatoryEnd = Math.round(17 * ratio);

    if (day <= menstrualEnd) return 'menstrual';
    if (day <= follicularEnd) return 'follicular';
    if (day <= ovulatoryEnd) return 'ovulatory';
    return 'luteal';
  };

  const phaseStyles = {
    menstrual: {
      bg: 'bg-rose-100',
      activeBg: 'bg-rose-500',
      text: 'text-rose-700',
      activeText: 'text-white'
    },
    follicular: {
      bg: 'bg-pink-100',
      activeBg: 'bg-pink-500',
      text: 'text-pink-700',
      activeText: 'text-white'
    },
    ovulatory: {
      bg: 'bg-amber-100',
      activeBg: 'bg-amber-500',
      text: 'text-amber-700',
      activeText: 'text-white'
    },
    luteal: {
      bg: 'bg-violet-100',
      activeBg: 'bg-violet-500',
      text: 'text-violet-700',
      activeText: 'text-white'
    }
  };

  const phaseInfo = [
    { key: 'menstrual', name: t('phases.menstrual.name'), color: 'bg-rose-500', range: `1-${Math.round(5 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'follicular', name: t('phases.follicular.name'), color: 'bg-pink-500', range: `${Math.round(5 * cycleLength / 28) + 1}-${Math.round(13 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'ovulatory', name: t('phases.ovulatory.name'), color: 'bg-amber-500', range: `${Math.round(13 * cycleLength / 28) + 1}-${Math.round(17 * cycleLength / 28)} ${t('insights.days')}` },
    { key: 'luteal', name: t('phases.luteal.name'), color: 'bg-violet-500', range: `${Math.round(17 * cycleLength / 28) + 1}-${cycleLength} ${t('insights.days')}` }
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* Current Status */}
      <div className="card p-5">
        <div className="text-center">
          <div className="text-sm text-muted mb-1">{t('dashboard.day')} {t('dashboard.ofCycle')}</div>
          <div className="text-3xl font-display text-bark">{cycleDay}</div>
          <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full ${phaseStyles[phase].bg} ${phaseStyles[phase].text}`}>
            <div className={`w-2 h-2 rounded-full ${phaseStyles[phase].activeBg}`} />
            <span className="text-sm font-medium">{t(`phases.${phase}.name`)}</span>
          </div>
        </div>
      </div>

      {/* Add to Calendar */}
      <div className="card p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-bark">{t('settings.addToCalendar')}</h3>
            <p className="text-sm text-muted">{t('settings.calendarIncludes')}</p>
          </div>
        </div>

        {calendarExported ? (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('settings.calendarDownloaded')}
            </div>
            <p className="text-sm text-emerald-600/70 mt-1">{t('settings.openIcs')}</p>
          </div>
        ) : (
          <button
            onClick={handleExportCalendar}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('settings.downloadCalendar')}
          </button>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="card p-5">
        <h3 className="font-medium text-bark mb-4">{t('calendar.cycleOverview')}</h3>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayPhase = getPhaseForDay(day);
            const isToday = day === cycleDay;
            const styles = phaseStyles[dayPhase];

            return (
              <div
                key={day}
                className={`
                  calendar-day
                  ${isToday ? `${styles.activeBg} ${styles.activeText} shadow-lg` : `${styles.bg} ${styles.text}`}
                  ${isToday ? 'today' : 'hover:scale-105'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Legend */}
      <div className="card p-5">
        <h3 className="font-medium text-bark mb-4">{t('calendar.phaseGuide')}</h3>

        <div className="space-y-3">
          {phaseInfo.map((p) => {
            const isCurrentPhase = p.key === phase;
            return (
              <div
                key={p.key}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isCurrentPhase ? 'bg-washi ring-1 ring-terra/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${p.color}`} />
                  <div>
                    <div className={`font-medium ${isCurrentPhase ? 'text-bark' : 'text-bark/80'}`}>
                      {p.name}
                      {isCurrentPhase && (
                        <span className="ml-2 text-xs text-terra font-medium">{t('calendar.current')}</span>
                      )}
                    </div>
                    <div className="text-sm text-muted">{p.range}</div>
                  </div>
                </div>
                <div className="text-muted">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cycle Summary */}
      <div className="card p-5 bg-gradient-to-br from-terra/5 to-rose-50 border-terra/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-terra/10 flex items-center justify-center">
            <span className="text-lg font-display text-terra">巡</span>
          </div>
          <div>
            <h4 className="font-medium text-bark">{t('calendar.yourCycle')}</h4>
            <p className="text-sm text-muted">{cycleLength} {t('calendar.daysAverage')}</p>
          </div>
        </div>
        <p className="text-sm text-muted">
          {t('settings.aboutDescription')}
        </p>
      </div>
    </div>
  );
}
