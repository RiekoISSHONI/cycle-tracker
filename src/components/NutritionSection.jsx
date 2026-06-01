import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RECIPES = {
  menstrual: {
    en: {
      name: "Iron-Rich Lentil Soup",
      description: "Warming soup packed with iron and anti-inflammatory spices",
      ingredients: ["red lentils", "turmeric", "ginger", "spinach", "garlic"]
    },
    ja: {
      name: "鉄分たっぷりレンズ豆スープ",
      description: "鉄分と抗炎症スパイスたっぷりの温かいスープ",
      ingredients: ["赤レンズ豆", "ターメリック", "生姜", "ほうれん草", "にんにく"]
    }
  },
  follicular: {
    en: {
      name: "Fresh Spring Salad",
      description: "Light and energizing with fermented foods for gut health",
      ingredients: ["mixed greens", "avocado", "kimchi", "chickpeas", "lemon"]
    },
    ja: {
      name: "フレッシュ春サラダ",
      description: "腸の健康のための発酵食品を含む軽くて活力のあるサラダ",
      ingredients: ["ミックスグリーン", "アボカド", "キムチ", "ひよこ豆", "レモン"]
    }
  },
  ovulatory: {
    en: {
      name: "Rainbow Buddha Bowl",
      description: "Colorful, fiber-rich bowl to support estrogen metabolism",
      ingredients: ["quinoa", "broccoli", "carrots", "edamame", "tahini"]
    },
    ja: {
      name: "レインボーブッダボウル",
      description: "エストロゲン代謝をサポートするカラフルで食物繊維豊富なボウル",
      ingredients: ["キヌア", "ブロッコリー", "にんじん", "枝豆", "タヒニ"]
    }
  },
  luteal: {
    en: {
      name: "Comforting Sweet Potato Curry",
      description: "Complex carbs and magnesium to support serotonin",
      ingredients: ["sweet potato", "coconut milk", "chickpeas", "spinach", "curry spices"]
    },
    ja: {
      name: "心温まるさつまいもカレー",
      description: "セロトニンをサポートする複合炭水化物とマグネシウム",
      ingredients: ["さつまいも", "ココナッツミルク", "ひよこ豆", "ほうれん草", "カレースパイス"]
    }
  }
};

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

export function NutritionSection({ phaseData, phase }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('western');
  const lang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  const tips = phaseData.forHer;
  const tcm = tips.tcmNutrition;
  const recipe = RECIPES[phase]?.[lang] || RECIPES.follicular[lang];

  return (
    <div className="card overflow-hidden">
      {/* Recipe - Always Visible */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-bark">{t('recipes.title')}</h3>
            <h4 className="text-terra font-medium mt-1">{recipe.name}</h4>
            <p className="text-sm text-muted mt-1">{recipe.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {recipe.ingredients.map((ing, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Nutrition Evidence */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-washi/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-medium text-bark">{t('nutrition.evidence')}</span>
        </div>
        <svg
          className={`w-5 h-5 text-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`expandable-content ${expanded ? 'expanded' : ''}`}>
        <div className="px-4 pb-4">
          {/* Tab Header */}
          <div className="p-2 bg-gray-50 rounded-xl mb-4">
            <div className="flex gap-1">
              <TabButton active={activeTab === 'western'} onClick={() => setActiveTab('western')}>
                {t('nutrition.western')}
              </TabButton>
              <TabButton active={activeTab === 'tcm'} onClick={() => setActiveTab('tcm')}>
                {t('nutrition.tcm')}
              </TabButton>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'western' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">{t('nutrition.modernScience')}</span>
              </div>
              <ul className="space-y-2">
                {tips.nutrition.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              {/* TCM Principle */}
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                  </div>
                  <span className="font-medium text-amber-800">{t('nutrition.tcmPrinciple')}</span>
                </div>
                <p className="text-sm text-amber-700 font-medium">{tcm.principle}</p>
              </div>

              {/* Recommended Foods */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">{t('nutrition.recommendedFoods')}</div>
                <ul className="space-y-2">
                  {tcm.foods.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods to Avoid */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">{t('nutrition.avoidFoods')}</div>
                <ul className="space-y-2">
                  {tcm.avoid.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Tea */}
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-sm text-green-700">
                    <span className="font-medium">{t('nutrition.recommendedTea')}:</span> {tcm.tea}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
