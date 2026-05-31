import { useTranslation } from 'react-i18next';

/**
 * First-tap disclosure modal
 * Shown once before first affiliate link tap
 * "This opens an outside shop. Meguri shares nothing about your cycle."
 */
export function AffiliateDisclosure({ isOpen, onConfirm, onCancel }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-cream rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-washi flex items-center justify-center">
          <svg className="w-7 h-7 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-bark text-center mb-2">
          {t('commerce.disclosureTitle')}
        </h3>
        <p className="text-sm text-muted text-center mb-6">
          {t('commerce.disclosureMessage')}
        </p>

        {/* Privacy badge */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-forest/10 rounded-xl">
          <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-sm text-forest font-medium">
            {t('commerce.privacyBadge')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-muted/30 text-muted font-medium hover:bg-washi transition-colors"
          >
            {t('commerce.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-terra text-cream font-medium hover:bg-terra/90 transition-colors"
          >
            {t('commerce.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Affiliate label badge for product cards
 */
export function AffiliateLabel({ className = '' }) {
  const { t } = useTranslation();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-ochre/10 text-ochre text-[10px] font-medium rounded-full ${className}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      {t('commerce.affiliateLabel')}
    </span>
  );
}
