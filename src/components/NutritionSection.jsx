import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PHASE_PRODUCTS, getProductUrl } from '../utils/products';

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

function ProductCard({ product }) {
  const handleClick = () => {
    window.open(getProductUrl(product), '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left w-full"
    >
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 text-sm truncate">{product.name}</div>
        <div className="text-xs text-gray-500 truncate">{product.brand}</div>
        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</div>
      </div>
      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </button>
  );
}

export function NutritionSection({ phaseData, phase }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('western');
  const [productCategory, setProductCategory] = useState('teas');

  const tips = phaseData.forHer;
  const tcm = tips.tcmNutrition;
  const products = PHASE_PRODUCTS[phase] || PHASE_PRODUCTS.follicular;

  return (
    <div className="space-y-4">
      {/* Nutrition Advice Card */}
      <div className="card overflow-hidden">
        {/* Tab Header */}
        <div className="p-2 bg-gray-50">
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
        <div className="p-4">
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

      {/* Product Recommendations */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-800">{t('nutrition.shopPhase')}</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{t('nutrition.affiliate')}</span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['teas', 'foods', 'supplements'].map((cat) => (
            <button
              key={cat}
              onClick={() => setProductCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-all ${
                productCategory === cat
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`nutrition.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-2">
          {products[productCategory]?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          {t('nutrition.affiliateNote')}
        </p>
      </div>
    </div>
  );
}
