import type { ViewName } from '@/pages/index'

const PAGE_LABELS: Record<ViewName, string> = {
  home: '', explore: 'Explore', bookmarks: 'Bookmarks', profile: 'Profile',
}

interface HeaderProps {
  view: ViewName
  onMenu: () => void
  onTheme: () => void
  theme: 'dark' | 'light'
  onProfile: () => void
  isLoggedIn: boolean
}

export default function Header({ view, onMenu, onTheme, theme, onProfile }: HeaderProps) {
  const isDark = theme === 'dark'
  const showBrand = view === 'home'
  const pageLabel = PAGE_LABELS[view]

  return (
    <header style={{
      height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 16px',
      background: 'rgba(3,12,38,0.78)', backdropFilter: 'blur(28px)',
      borderBottom: '1px solid rgba(0,62,145,0.11)', zIndex: 500,
      position: 'relative',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onMenu} style={hbtn}>
          <i className="fa-solid fa-bars-staggered" />
        </button>
        {showBrand ? (
          <>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#041642,#002063 60%,#1565e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              ⚡
            </div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.1rem', fontWeight: 700, letterSpacing: -0.5, color: 'var(--t1,#eef2ff)' }}>
              Sherr<span style={{ color: '#1565e8' }}>Byte</span>
            </div>
          </>
        ) : (
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', letterSpacing: -0.3 }}>
            {pageLabel}
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme toggle */}
        <div
          onClick={onTheme}
          style={{ width: 52, height: 26, borderRadius: 100, cursor: 'pointer', position: 'relative', overflow: 'hidden', background: isDark ? 'linear-gradient(90deg,#0A0F2E,#1A2060)' : 'linear-gradient(90deg,#87CEEB,#B0E0FF)', transition: 'background 0.5s', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)' }}
        >
          <div style={{
            position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
            left: isDark ? 3 : 29,
            background: isDark
              ? 'radial-gradient(circle at 35% 35%, #E0E0E0 0%, #B0B0B0 60%, #888 100%)'
              : 'radial-gradient(circle at 35% 35%, #FFF176 0%, #FFD600 60%, #F9A825 100%)',
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.5)' : '0 0 8px rgba(255,214,0,0.8)',
            transition: 'left 0.5s cubic-bezier(0.32,0.72,0,1)',
            zIndex: 2,
          }} />
        </div>

        {/* Avatar */}
        <div
          onClick={onProfile}
          style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #1565e8' }}
        >
          <img src="https://i.pravatar.cc/100?img=12" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </header>
  )
}

const hbtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 12,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#8aaad4', fontSize: '0.9rem',
  background: 'rgba(0,62,145,0.06)', border: '1px solid rgba(0,62,145,0.22)',
  cursor: 'pointer', transition: 'all 0.15s',
}
