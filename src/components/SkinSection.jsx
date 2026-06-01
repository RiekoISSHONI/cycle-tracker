import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all ${
        active
          ? 'bg-white text-gray-800 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

export function SkinSection({ phaseData, phase }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('routine');

  const skin = phaseData.forHer?.skin;

  if (!skin) return null;

  const phaseColors = {
    menstrual: { bg: 'from-rose-50 to-red-50', accent: 'text-rose-600', badge: 'bg-rose-100', iconBg: 'bg-rose-100' },
    follicular: { bg: 'from-pink-50 to-purple-50', accent: 'text-pink-600', badge: 'bg-pink-100', iconBg: 'bg-pink-100' },
    ovulatory: { bg: 'from-amber-50 to-orange-50', accent: 'text-amber-600', badge: 'bg-amber-100', iconBg: 'bg-amber-100' },
    luteal: { bg: 'from-violet-50 to-purple-50', accent: 'text-violet-600', badge: 'bg-violet-100', iconBg: 'bg-violet-100' }
  };

  const colors = phaseColors[phase] || phaseColors.follicular;

  return (
    <div className="card overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 bg-gradient-to-r ${colors.bg} text-left`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${colors.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-bark">{t('skin.title')}</h3>
              <p className={`text-sm ${colors.accent}`}>{skin.condition}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`expandable-content ${expanded ? 'expanded' : ''}`}>
        <div>
          {/* Tabs */}
          <div className="p-2 bg-gray-50">
            <div className="flex gap-1">
              <TabButton active={activeTab === 'routine'} onClick={() => setActiveTab('routine')}>
                {t('skin.routine')}
              </TabButton>
              <TabButton active={activeTab === 'tcm'} onClick={() => setActiveTab('tcm')}>
                {t('skin.tcmCare')}
              </TabButton>
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                {t('skin.why')}
              </TabButton>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'routine' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">{t('skin.routineIntro')}</p>
                <ul className="space-y-2">
                  {skin.care.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className={`w-5 h-5 rounded-full ${colors.badge} flex items-center justify-center flex-shrink-0 text-xs font-medium ${colors.accent}`}>
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'tcm' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">{t('skin.tcmIntro')}</p>
                <ul className="space-y-2">
                  {skin.tcmCare.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* TCM tip */}
                <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-amber-700">{t('skin.tcmTip')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Science explanation */}
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">{t('skin.scienceExplains')}</span>
                  </div>
                  <p className="text-sm text-blue-600">{skin.science}</p>
                </div>

                {/* TCM explanation */}
                <div className="p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                    <span className="text-sm font-medium text-amber-700">{t('skin.tcmExplains')}</span>
                  </div>
                  <p className="text-sm text-amber-600">{skin.tcm}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
