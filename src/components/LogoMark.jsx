/**
 * LogoMark — Font-rendered 巡 with the しんにょう dot hidden
 * and a sun sparkle SVG in its place.
 *
 * Uses a background-colored circle to cover the dot (no canvas timing
 * issues), then positions the sun icon on top.
 *
 * Props:
 *   fontSize  – kanji font size in px (default 22)
 *   color     – kanji + sun colour (default '#A09430')
 *   bgColor   – background behind the kanji, used to mask the dot (default '#FAF6E0')
 *   showSun   – show the sun sparkle (default true)
 */

function SunIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill={color} />
      <line x1="12" y1="1" x2="12" y2="4.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="19.5" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="4.5" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="19.5" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="4.2" y1="4.2" x2="6.7" y2="6.7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17.3" y1="17.3" x2="19.8" y2="19.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="4.2" y1="19.8" x2="6.7" y2="17.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17.3" y1="6.7" x2="19.8" y2="4.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LogoMark({ fontSize = 22, color = '#A09430', bgColor = '#FAF6E0', showSun = true }) {
  // All sizes relative to fontSize
  const dotCoverSize = fontSize * 0.28;
  const dotCoverLeft = fontSize * 0.02;
  const dotCoverTop = fontSize * 0.02;
  const sunSize = fontSize * 0.32;
  const sunLeft = fontSize * -0.02;
  const sunTop = fontSize * -0.04;

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      lineHeight: 1,
      fontSize: fontSize,
    }}>
      <span style={{
        fontFamily: '"Zen Maru Gothic", sans-serif',
        fontSize, fontWeight: 900, color,
        lineHeight: 1,
      }}>巡</span>

      {showSun && (
        <>
          {/* Circle that covers the しんにょう dot */}
          <div style={{
            position: 'absolute',
            left: dotCoverLeft,
            top: dotCoverTop,
            width: dotCoverSize,
            height: dotCoverSize,
            borderRadius: '50%',
            background: bgColor,
          }} />

          {/* Sun sparkle */}
          <div style={{
            position: 'absolute',
            left: sunLeft,
            top: sunTop,
            width: sunSize,
            height: sunSize,
            pointerEvents: 'none',
          }}>
            <SunIcon color={color} />
          </div>
        </>
      )}
    </div>
  );
}
