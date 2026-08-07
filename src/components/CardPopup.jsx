import { useState, useEffect } from 'react';
import { MARU, PMINCHO, INK, INK3 } from '../utils/phases';

/**
 * CardPopup — wraps a card's preview content and shows expanded detail
 * as a full-screen mobile popup when tapped.
 *
 * Props:
 *   preview  — the card content shown on the homepage (required)
 *   detail   — the expanded content shown in the popup (required)
 *   title    — popup header title (optional)
 *   accentBg — background for the popup header (optional, defaults to white)
 *   style    — extra styles on the outer wrapper (optional)
 *   disabled — if true, tapping does nothing (optional)
 */
export function CardPopup({ preview, detail, title, accentBg, style = {}, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 280);
  };

  return (
    <>
      <div
        onClick={() => !disabled && setOpen(true)}
        style={{ cursor: disabled ? 'default' : 'pointer', ...style }}
      >
        {preview}
      </div>

      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 70,
            background: visible ? 'rgba(59,51,53,0.35)' : 'transparent',
            transition: 'background 0.25s',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480,
              maxHeight: '88vh',
              borderRadius: '28px 28px 0 0',
              background: '#fff',
              boxShadow: '0 -8px 40px rgba(59,51,53,0.12)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              transform: visible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            {/* Handle bar */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              padding: '12px 0 0',
              background: accentBg || '#fff',
            }}>
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: 'rgba(59,51,53,0.12)',
              }} />
            </div>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 22px 14px',
              background: accentBg || '#fff',
              borderBottom: '1px solid rgba(59,51,53,0.06)',
            }}>
              <span style={{
                fontFamily: PMINCHO, fontSize: 18, fontWeight: 600, color: INK,
              }}>
                {title || ''}
              </span>
              <button
                onClick={handleClose}
                style={{
                  width: 32, height: 32, borderRadius: 99,
                  background: 'rgba(59,51,53,0.06)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={INK3} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '20px 22px 32px',
              WebkitOverflowScrolling: 'touch',
            }}>
              {detail}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
