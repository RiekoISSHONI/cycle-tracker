import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PHASES, PHASE_ORDER, MARU, PMINCHO,
  INK, INK2, INK3, CARD, CREAM2, LINE,
} from '../utils/phases';

/* ── mock post data ───────────────────────────────────── */

const POSTS = [
  {
    nameJa: 'あや', nameEn: 'Aya', phase: 'sei',
    textJa: '生理痛の日におすすめのお茶ある？🍵',
    textEn: 'Any cozy tea recs for cramp days? 🍵',
    likes: 12, replies: 5, agoJa: '8分', agoEn: '8m',
  },
  {
    nameJa: 'もな', nameEn: 'Mona', phase: 'me',
    textJa: '卵胞期に運動始めたら調子いい！🌱',
    textEn: 'Started a new workout in my follicular phase and I feel amazing 🌱',
    likes: 28, replies: 9, agoJa: '22分', agoEn: '22m',
  },
  {
    nameJa: 'ゆい', nameEn: 'Yui', phase: 'mi',
    textJa: '今週は自分にやさしくね💜',
    textEn: 'Reminder to be kind to yourself this week 💜',
    likes: 41, replies: 14, agoJa: '1時間', agoEn: '1h',
  },
];

/* ── icons (inline SVG) ───────────────────────────────── */

function HeartIcon({ fill, stroke, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function ChatIcon({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

/* ── sub-components ───────────────────────────────────── */

function PhaseChip({ phaseKey, isAll, selected, onClick, isJa }) {
  if (isAll) {
    return (
      <button
        onClick={onClick}
        style={{
          fontFamily: MARU,
          fontSize: 13,
          fontWeight: 700,
          padding: '6px 16px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          background: selected ? '#3B2E2A' : CREAM2,
          color: selected ? '#fff' : INK2,
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {isJa ? 'すべて' : 'All'}
      </button>
    );
  }

  const p = PHASES[phaseKey];
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: MARU,
        fontSize: 13,
        fontWeight: 700,
        padding: '6px 14px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        background: selected ? p.deep : p.soft,
        color: selected ? '#fff' : p.deep,
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <span style={{ fontFamily: PMINCHO }}>{p.kanji}</span>
      {' '}
      {isJa ? p.name : p.en}
    </button>
  );
}

function PostCard({ post, isJa }) {
  const p = PHASES[post.phase];
  const initial = isJa ? post.nameJa[0] : post.nameEn[0];
  const accentAlpha15 = p.accent + '26'; // hex 26 ~ 15% opacity

  return (
    <div
      style={{
        background: CARD,
        borderRadius: 24,
        padding: '18px 20px',
        boxShadow: '0 8px 22px rgba(60,50,55,0.06)',
      }}
    >
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        {/* avatar */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: p.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: MARU,
              fontSize: 17,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {initial}
          </span>
        </div>

        {/* name + badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: MARU,
              fontSize: 15,
              fontWeight: 700,
              color: INK,
            }}
          >
            {isJa ? post.nameJa : post.nameEn}
          </span>
          <span
            style={{
              display: 'inline-block',
              marginLeft: 8,
              padding: '2px 10px',
              borderRadius: 999,
              background: p.soft,
              verticalAlign: 'middle',
            }}
          >
            <span
              style={{
                fontFamily: PMINCHO,
                fontSize: 12,
                color: p.deep,
                fontWeight: 600,
              }}
            >
              {p.kanji}
            </span>
            <span
              style={{
                fontFamily: MARU,
                fontSize: 11,
                color: p.deep,
                fontWeight: 600,
                marginLeft: 3,
              }}
            >
              {isJa ? p.name : p.en}
            </span>
          </span>
        </div>

        {/* time */}
        <span
          style={{
            fontFamily: MARU,
            fontSize: 12,
            color: INK3,
            flexShrink: 0,
          }}
        >
          {isJa ? post.agoJa : post.agoEn}
        </span>
      </div>

      {/* post text */}
      <p
        style={{
          fontFamily: MARU,
          fontSize: 14.5,
          fontWeight: 600,
          color: INK,
          lineHeight: 1.6,
          margin: '0 0 14px 0',
        }}
      >
        {isJa ? post.textJa : post.textEn}
      </p>

      {/* action row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* heart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <HeartIcon fill={accentAlpha15} stroke={p.accent} />
          <span
            style={{
              fontFamily: MARU,
              fontSize: 13,
              fontWeight: 600,
              color: INK2,
            }}
          >
            {post.likes}
          </span>
        </div>

        {/* replies */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <ChatIcon color={INK3} />
          <span
            style={{
              fontFamily: MARU,
              fontSize: 13,
              fontWeight: 600,
              color: INK2,
            }}
          >
            {post.replies}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── main component ───────────────────────────────────── */

export function Peers({ phase = 'ki' }) {
  const { i18n } = useTranslation();
  const isJa = i18n.language.startsWith('ja');

  const [filter, setFilter] = useState('all');

  const p = PHASES[phase];

  return (
    <div style={{ position: 'relative', paddingBottom: 16 }}>
      {/* blobby radial gradient wash */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '120%',
          height: 220,
          background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${p.soft} 0%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── title section ────────────────────────── */}
        <div style={{ textAlign: 'center', paddingTop: 28, marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: MARU,
              fontWeight: 800,
              fontSize: 26,
              color: INK,
              margin: '0 0 6px 0',
            }}
          >
            {isJa ? '巡りの輪' : 'Your Circle'}
          </h2>
          <p
            style={{
              fontFamily: MARU,
              fontSize: 14,
              color: INK2,
              margin: 0,
            }}
          >
            {isJa
              ? '同じ季節をめぐる仲間たち'
              : 'Connect with others on the same journey'}
          </p>
        </div>

        {/* ── phase filter chips ───────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            marginBottom: 20,
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <PhaseChip
            isAll
            selected={filter === 'all'}
            onClick={() => setFilter('all')}
            isJa={isJa}
          />
          {PHASE_ORDER.map((k) => (
            <PhaseChip
              key={k}
              phaseKey={k}
              selected={filter === k}
              onClick={() => setFilter(k)}
              isJa={isJa}
            />
          ))}
        </div>

        {/* ── post cards ───────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {POSTS.map((post, i) => (
            <PostCard key={i} post={post} isJa={isJa} />
          ))}
        </div>

      </div>
    </div>
  );
}
