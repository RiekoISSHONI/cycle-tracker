import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isCalmModeEnabled, hasSeenAffiliateDisclosure, markAffiliateDisclosureSeen, openAffiliateLink } from '../utils/commerce';
import { AffiliateDisclosure, AffiliateLabel } from './AffiliateDisclosure';
import { getPhaseProducts } from '../utils/products';

function ProductCard({ product, onTap }) {
  return (
    <button
      onClick={() => onTap(product)}
      className="card p-4 text-left w-full hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-washi flex items-center justify-center flex-shrink-0 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">{product.emoji || '🌿'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-bark line-clamp-2">{product.name}</h4>
            <AffiliateLabel />
          </div>
          <p className="text-sm text-muted mt-1 line-clamp-2">{product.description}</p>
          {product.price && (
            <p className="text-sm font-medium text-terra mt-2">{product.price}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function CategorySection({ title, products, onProductTap }) {
  const [expanded, setExpanded] = useState(true);

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-1"
      >
        <h3 className="font-display font-medium text-bark">{title}</h3>
        <svg
          className={`w-5 h-5 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} onTap={onProductTap} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Shop({ phase }) {
  const { t } = useTranslation();
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const calmMode = isCalmModeEnabled();

  const products = getPhaseProducts(phase);

  const handleProductTap = (product) => {
    if (!hasSeenAffiliateDisclosure()) {
      setPendingProduct(product);
      setShowDisclosure(true);
    } else {
      openAffiliateLink(product);
    }
  };

  const handleConfirmDisclosure = () => {
    markAffiliateDisclosureSeen();
    setShowDisclosure(false);
    if (pendingProduct) {
      openAffiliateLink(pendingProduct);
      setPendingProduct(null);
    }
  };

  const handleCancelDisclosure = () => {
    setShowDisclosure(false);
    setPendingProduct(null);
  };

  if (calmMode) {
    return (
      <div className="space-y-6 pb-4">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-forest/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-bark mb-2">{t('commerce.calmMode')}</h3>
          <p className="text-sm text-muted">{t('commerce.calmModeDesc')}</p>
          <p className="text-xs text-muted mt-4">
            {t('settings.settings')} → {t('commerce.calmMode')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-xl text-bark">{t('commerce.thisWeeksCare')}</h2>
        <p className="text-sm text-muted mt-1">{t('commerce.curatedFor')}</p>
      </div>

      {/* Privacy Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-forest/10 rounded-xl">
        <svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="text-sm text-forest font-medium">{t('commerce.privacyBadge')}</span>
      </div>

      {/* Product Categories */}
      <CategorySection
        title={t('nutrition.categories.teas')}
        products={products.teas}
        onProductTap={handleProductTap}
      />

      <CategorySection
        title={t('nutrition.categories.skincare')}
        products={products.skincare}
        onProductTap={handleProductTap}
      />

      <CategorySection
        title={t('nutrition.categories.foods')}
        products={products.foods}
        onProductTap={handleProductTap}
      />

      {/* Disclosure Modal */}
      <AffiliateDisclosure
        isOpen={showDisclosure}
        onConfirm={handleConfirmDisclosure}
        onCancel={handleCancelDisclosure}
      />
    </div>
  );
}
