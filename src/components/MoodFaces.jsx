/**
 * MoodFaces — Hand-crafted SVG mood illustrations
 *
 * Five levels, each a distinct illustrated face with personality.
 * Designed to match Meguri's warm rounded aesthetic.
 */

// Mood palette — each level has its own warm colour world
const MOOD_PALETTE = {
  1: { bg: '#E8D5E0', face: '#F5E6EE', cheek: '#D4A4B8', accent: '#B87D98', label: '#9A6580' },
  2: { bg: '#E8D8CB', face: '#FBF0E6', cheek: '#D4B09A', accent: '#C4906E', label: '#A07050' },
  3: { bg: '#EDE5C8', face: '#FFF8E6', cheek: '#E0CFA0', accent: '#C8B468', label: '#9A8A42' },
  4: { bg: '#D0EBDA', face: '#EAFAF0', cheek: '#A8D4B8', accent: '#6BBF8A', label: '#4A9A66' },
  5: { bg: '#FCE4EC', face: '#FFF0F4', cheek: '#F4A0B8', accent: '#E4849E', label: '#CC6482' },
};

/**
 * Great — beaming smile, sparkle eyes, rosy cheeks
 */
function FaceGreat({ size = 56 }) {
  const c = MOOD_PALETTE[5];
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* head */}
      <circle cx="28" cy="28" r="26" fill={c.face} />
      <circle cx="28" cy="28" r="26" stroke={c.accent} strokeWidth="1.5" fill="none" />

      {/* blush */}
      <ellipse cx="15" cy="32" rx="5" ry="3.5" fill={c.cheek} opacity="0.5" />
      <ellipse cx="41" cy="32" rx="5" ry="3.5" fill={c.cheek} opacity="0.5" />

      {/* eyes — happy arcs */}
      <path d="M17 24 Q20 19 23 24" stroke={c.label} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M33 24 Q36 19 39 24" stroke={c.label} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* sparkles */}
      <g fill={c.accent} opacity="0.7">
        <path d="M12 16 L13 13 L14 16 L17 17 L14 18 L13 21 L12 18 L9 17 Z" />
        <path d="M42 14 L43 11 L44 14 L47 15 L44 16 L43 19 L42 16 L39 15 Z" />
      </g>

      {/* mouth — big open smile */}
      <path d="M19 33 Q28 44 37 33" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill={c.cheek} fillOpacity="0.3" />
    </svg>
  );
}

/**
 * Good — gentle closed smile, soft bright eyes
 */
function FaceGood({ size = 56 }) {
  const c = MOOD_PALETTE[4];
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill={c.face} />
      <circle cx="28" cy="28" r="26" stroke={c.accent} strokeWidth="1.5" fill="none" />

      {/* blush */}
      <ellipse cx="15" cy="32" rx="4.5" ry="3" fill={c.cheek} opacity="0.4" />
      <ellipse cx="41" cy="32" rx="4.5" ry="3" fill={c.cheek} opacity="0.4" />

      {/* eyes — round dots */}
      <circle cx="20" cy="24" r="3" fill={c.label} />
      <circle cx="36" cy="24" r="3" fill={c.label} />
      {/* eye highlights */}
      <circle cx="21.2" cy="22.8" r="1.1" fill="#fff" />
      <circle cx="37.2" cy="22.8" r="1.1" fill="#fff" />

      {/* mouth — gentle curve */}
      <path d="M21 34 Q28 40 35 34" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Okay — flat mouth, neutral calm eyes
 */
function FaceOkay({ size = 56 }) {
  const c = MOOD_PALETTE[3];
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill={c.face} />
      <circle cx="28" cy="28" r="26" stroke={c.accent} strokeWidth="1.5" fill="none" />

      {/* eyes — neutral ovals */}
      <ellipse cx="20" cy="24" rx="2.8" ry="3.2" fill={c.label} />
      <ellipse cx="36" cy="24" rx="2.8" ry="3.2" fill={c.label} />
      <circle cx="21" cy="23" r="1" fill="#fff" />
      <circle cx="37" cy="23" r="1" fill="#fff" />

      {/* mouth — flat line with very slight curve */}
      <path d="M22 35 Q28 36 34 35" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Low — slight frown, droopy eyes
 */
function FaceLow({ size = 56 }) {
  const c = MOOD_PALETTE[2];
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill={c.face} />
      <circle cx="28" cy="28" r="26" stroke={c.accent} strokeWidth="1.5" fill="none" />

      {/* eyebrows — slightly worried */}
      <path d="M16 19 Q19 17 23 19" stroke={c.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M33 19 Q37 17 40 19" stroke={c.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* eyes — droopy oval */}
      <ellipse cx="20" cy="25" rx="2.6" ry="2.8" fill={c.label} />
      <ellipse cx="36" cy="25" rx="2.6" ry="2.8" fill={c.label} />
      <circle cx="20.8" cy="24.2" r="0.9" fill="#fff" />
      <circle cx="36.8" cy="24.2" r="0.9" fill="#fff" />

      {/* mouth — slight frown */}
      <path d="M22 37 Q28 33 34 37" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Bad — deep frown, sad downturned eyes, tear
 */
function FaceBad({ size = 56 }) {
  const c = MOOD_PALETTE[1];
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" fill={c.face} />
      <circle cx="28" cy="28" r="26" stroke={c.accent} strokeWidth="1.5" fill="none" />

      {/* eyebrows — worried */}
      <path d="M15 19 Q18 16 23 20" stroke={c.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M33 20 Q38 16 41 19" stroke={c.label} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* eyes — upward arc (sad) */}
      <path d="M17 26 Q20 22 23 26" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M33 26 Q36 22 39 26" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* tear drop */}
      <ellipse cx="24" cy="30" rx="1.5" ry="2.2" fill={c.accent} opacity="0.4" />

      {/* mouth — deep frown */}
      <path d="M21 38 Q28 32 35 38" stroke={c.label} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const FACE_COMPONENTS = {
  1: FaceBad,
  2: FaceLow,
  3: FaceOkay,
  4: FaceGood,
  5: FaceGreat,
};

/**
 * Render a single mood face
 * @param {number} level - 1–5
 * @param {number} size - pixel size (default 56)
 */
export function MoodFace({ level, size = 56 }) {
  const Face = FACE_COMPONENTS[level];
  return Face ? <Face size={size} /> : null;
}

/**
 * Mood face selector — row of 5 tappable faces
 */
export function MoodFaceSelector({ value, onChange, size = 52, gap = 6 }) {
  return (
    <div style={{ display: 'flex', gap, justifyContent: 'space-between' }}>
      {[1, 2, 3, 4, 5].map((level) => {
        const active = value === level;
        const palette = MOOD_PALETTE[level];
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '10px 4px 8px',
              borderRadius: 16,
              border: active ? `2px solid ${palette.accent}` : '2px solid transparent',
              background: active ? palette.bg : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: active ? 'scale(1.06)' : 'scale(1)',
            }}
          >
            <MoodFace level={level} size={size} />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Compact mood face for calendar/history views
 */
export function MoodFaceMini({ level, size = 28 }) {
  return <MoodFace level={level} size={size} />;
}

export { MOOD_PALETTE };
