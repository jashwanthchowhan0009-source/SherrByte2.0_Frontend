import type { ViewName } from '@/pages/index'

const TABS: Array<{ key: ViewName; icon: string; label: string }> = [
  { key: 'home',      icon: 'fa-solid fa-house',           label: 'Home' },
  { key: 'explore',   icon: 'fa-solid fa-compass',         label: 'Explore' },
  { key: 'bookmarks', icon: 'fa-regular fa-bookmark',      label: 'Saved' },
  { key: 'profile',   icon: 'fa-regular fa-user',          label: 'Profile' },
]

interface BottomNavProps {
  view: ViewName
  onNav: (v: ViewName) => void
  savedCount: number
}

export default function BottomNav({ view, onNav, savedCount }: BottomNavProps) {
  return (
    <nav style={{
      position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 360, height: 74,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      zIndex: 600,
      background: 'rgba(2,10,36,0.88)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(171,176,194,0.12)', borderRadius: 30,
      boxShadow: '0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,62,145,0.2)',
      padding: '0 8px',
    }}>
      {TABS.map(tab => {
        const on = view === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onNav(tab.key)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '8px 20px', borderRadius: 22, flex: 1,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
              background: on ? 'linear-gradient(135deg,#002063,#1565e8)' : 'transparent',
              color: on ? '#fff' : '#4a6898',
              boxShadow: on ? '0 4px 20px rgba(44,61,143,0.55)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}>
              <i className={tab.icon} />
              {tab.key === 'bookmarks' && savedCount > 0 && (
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  background: '#E53935', color: '#fff',
                  fontSize: '0.5rem', fontWeight: 800,
                  width: 14, height: 14, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {savedCount > 9 ? '9+' : savedCount}
                </div>
              )}
            </div>
            <span style={{
              fontSize: '0.6rem', fontWeight: 700,
              color: on ? '#1565e8' : '#4a6898',
              letterSpacing: 0.3, transition: 'color 0.25s',
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
