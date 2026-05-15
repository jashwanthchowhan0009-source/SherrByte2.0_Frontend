import type { ViewName } from '@/pages/index'

interface SidebarProps {
  open: boolean
  onClose: () => void
  onNav: (v: ViewName) => void
  onLogout: () => void
  isLoggedIn: boolean
}

export default function Sidebar({ open, onClose, onNav, onLogout, isLoggedIn }: SidebarProps) {
  const nav = (v: ViewName) => { onNav(v); onClose() }

  return (
    <div style={{
      position: 'absolute', top: 0, left: open ? 0 : -280, width: 280, height: '100%',
      zIndex: 900, display: 'flex', flexDirection: 'column',
      background: 'rgba(5,18,52,0.97)', backdropFilter: 'blur(32px)',
      borderRight: '1px solid rgba(0,62,145,0.22)',
      transition: 'left 0.35s cubic-bezier(0.32,0.72,0,1)',
      boxShadow: open ? '8px 0 40px rgba(0,0,0,0.3)' : 'none',
    }}>
      {/* Head */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(0,62,145,0.22)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', border: '2px solid #1565e8' }}>
          <img src="https://i.pravatar.cc/100?img=12" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#eef2ff' }} id="sb-name">SherrByte User</div>
          <div style={{ fontSize: '0.7rem', color: '#1565e8', marginTop: 1 }}>@user ✦</div>
        </div>
        <button onClick={onClose} style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,34,72,0.8)', border: '1px solid rgba(0,62,145,0.22)', cursor: 'pointer', color: '#8aaad4', fontSize: '0.8rem' }}>
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        <div style={sectStyle}>Navigate</div>
        {([
          ['home',      'fa-solid fa-house',       'Home Feed'],
          ['explore',   'fa-solid fa-compass',     'Explore'],
          ['bookmarks', 'fa-regular fa-bookmark',  'Bookmarks'],
        ] as [ViewName, string, string][]).map(([v, icon, label]) => (
          <button key={v} onClick={() => nav(v)} style={itemStyle}>
            <i className={icon} style={{ width: 18, textAlign: 'center', color: '#8aaad4' }} />
            {label}
          </button>
        ))}
        <div style={sectStyle}>Account</div>
        <button onClick={() => nav('profile')} style={itemStyle}>
          <i className="fa-regular fa-user" style={{ width: 18, textAlign: 'center', color: '#8aaad4' }} />
          My Profile
        </button>
      </div>

      {/* Foot */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,62,145,0.22)' }}>
        {isLoggedIn && (
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.15)', borderRadius: 12, color: '#E53935', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', marginBottom: 8, width: '100%' }}>
            <i className="fa-solid fa-right-from-bracket" /> Log Out
          </button>
        )}
        <div style={{ fontSize: '0.6rem', color: '#243660', textAlign: 'center', letterSpacing: 0.5 }}>
          SherrByte v2.0 · Build 2026.05
        </div>
      </div>
    </div>
  )
}

const sectStyle: React.CSSProperties = {
  fontSize: '0.6rem', fontWeight: 700, color: '#4a6898', letterSpacing: 1.2,
  textTransform: 'uppercase', padding: '12px 16px 6px',
}
const itemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '11px 16px', color: '#eef2ff', fontSize: '0.84rem', fontWeight: 500,
  cursor: 'pointer', transition: 'background 0.12s', borderRadius: 0,
  background: 'transparent', border: 'none', width: '100%', textAlign: 'left',
}
