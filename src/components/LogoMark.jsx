import { useRef, useEffect, useState } from 'react';
import { MARU } from '../utils/phases';

/**
 * LogoMark — Font-rendered 巡 with the しんにょう dot erased via
 * canvas compositing and a sun sparkle SVG overlaid in its place.
 *
 * This matches the approved "Meguri Logo v4" artifact technique:
 * canvas globalCompositeOperation: 'destination-out' erases the dot
 * physically, then the sun icon is positioned over the cleared area.
 *
 * Props:
 *   fontSize  – kanji font size in px (default 22)
 *   color     – kanji + sun colour (default '#fff')
 *   showSun   – whether to erase the dot and show the sun (default true)
 *   style     – forwarded to the wrapper div
 */

function SunIcon({ size, color }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
      style={{ display: 'block' }}>
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

export function LogoMark({ fontSize = 22, color = '#fff', showSun = true, style = {} }) {
  const canvasRef = useRef(null);
  const [canvasDims, setCanvasDims] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const sz = fontSize;
      const font = `800 ${sz}px ${MARU}`;

      // Measure the text
      const probe = document.createElement('canvas').getContext('2d');
      probe.font = font;
      const metrics = probe.measureText('巡');
      const cw = Math.ceil(metrics.width) + 6;
      const ch = Math.ceil(sz * 1.2) + 6;

      canvas.width = Math.ceil(cw * dpr);
      canvas.height = Math.ceil(ch * dpr);

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // Draw kanji
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.fillText('巡', 3, 3);

      // Erase the しんにょう dot
      if (showSun) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.ellipse(
          sz * 0.14 + 3,
          sz * 0.12 + 3,
          sz * 0.14,
          sz * 0.15,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }

      setCanvasDims({ w: cw, h: ch });
    };

    // Wait for fonts, then draw
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(draw, 50));
    } else {
      setTimeout(draw, 300);
    }
  }, [fontSize, color, showSun]);

  const sunSize = fontSize * 0.30;

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          width: canvasDims ? canvasDims.w : fontSize,
          height: canvasDims ? canvasDims.h : fontSize,
        }}
      />
      {showSun && (
        <div style={{
          position: 'absolute',
          left: fontSize * 0.06,
          top: fontSize * 0.02,
          width: sunSize,
          height: sunSize,
          pointerEvents: 'none',
        }}>
          <SunIcon size={sunSize} color={color} />
        </div>
      )}
      {/* Fallback text for accessibility */}
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        巡
      </span>
    </div>
  );
}
