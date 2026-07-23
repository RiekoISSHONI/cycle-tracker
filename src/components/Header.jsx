import { PHASES, CORAL, CORAL_D, PMINCHO, MARU, INK, INK2, CARD, LINE, phaseKeyFromLegacy } from '../utils/phases';

export function Header({ cycleInfo }) {
  const phaseKey = cycleInfo?.phase ? phaseKeyFromLegacy(cycleInfo.phase) : 'ki';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'transparent',
      padding: '14px 22px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: `linear-gradient(150deg, ${CORAL}, ${CORAL_D})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: PMINCHO, fontSize: 22, fontWeight: 700, color: '#fff',
          boxShadow: `0 6px 14px ${CORAL}55`,
        }}>巡</div>
        <span style={{
          fontFamily: MARU, fontSize: 24, fontWeight: 800,
          letterSpacing: -0.5, color: INK,
        }}>meguri</span>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: CARD, border: `2px solid ${LINE}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INK2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 10-12 0c0 7-2 8-2 8h16s-2-1-2-8M10.5 20a1.5 1.5 0 003 0"/>
        </svg>
      </div>
    </header>
  );
}
