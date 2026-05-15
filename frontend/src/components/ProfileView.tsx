import { useState, useEffect } from 'react'
import { getMe, getAnalytics, updateMe } from '@/lib/api'
import type { AnalyticsResponse } from '@/types'

interface Props {
  active: boolean
  auth: { token: string | null; logout: () => void }
  showToast: (msg: string) => void
  savedCount: number
}

export default function ProfileView({ active, auth, showToast, savedCount }: Props) {
  const [name, setName] = useState('SherrByte User')
  const [handle, setHandle] = useState('@user ✦')
  const [bio, setBio] = useState('Tap Edit Profile to set your bio')
  const [stats, setStats] = useState({ articles_read: 0, likes: 0, bookmarks: 0 })
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!active || !auth.token) return
    getMe().then(me => {
      if (me.name) setName(me.name)
      if (me.email) setHandle('@' + me.email.split('@')[0] + ' ✦')
      if (me.bio) setBio(me.bio)
      if (me.stats) setStats(me.stats)
    }).catch(() => {})

    getAnalytics().then(setAnalytics).catch(() => {})
  }, [active, auth.token])

  async function saveProfile() {
    setLoading(true)
    try {
      await updateMe({ display_name: editName, bio: editBio })
      if (editName) setName(editName)
      if (editBio) setBio(editBio)
      setEditing(false)
      showToast('✦ Profile updated!')
    } catch { showToast('⚠️ Update failed') }
    finally { setLoading(false) }
  }

  const days = analytics?.daily_sec || []
  const maxSec = Math.max(1, ...days.map(d => d.seconds))
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 56, paddingBottom: 92, overflowY: active ? 'scroll' : 'hidden', display: active ? 'block' : 'none', background: 'var(--bg,#060e1f)' }}>

      {/* Profile hero */}
      <div style={{ padding: 16, background: 'rgba(3,12,38,0.78)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,62,145,0.22)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #1565e8', boxShadow: '0 0 20px rgba(0,62,145,0.4)' }}>
            <img src="https://i.pravatar.cc/200?img=12" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', marginBottom: 2 }}>{name}</div>
            <div style={{ fontSize: '0.72rem', color: '#1565e8', marginBottom: 4, fontWeight: 500 }}>{handle}</div>
            <div style={{ fontSize: '0.76rem', color: '#8aaad4', lineHeight: 1.4 }}>{bio}</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 14, background: 'rgba(9,21,39,1)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,62,145,0.22)' }}>
          {[
            { n: stats.articles_read, l: 'Articles' },
            { n: analytics?.current_streak || 0, l: 'Streak 🔥' },
            { n: stats.likes, l: 'Likes' },
            { n: savedCount, l: 'Saved' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: 10, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(0,62,145,0.11)' : 'none' }}>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--t1,#eef2ff)' }}>{s.n}</div>
              <div style={{ fontSize: '0.6rem', color: '#4a6898', fontWeight: 500, marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setEditName(name); setEditBio(bio); setEditing(true) }}
            style={{ flex: 1, padding: '9px 10px', borderRadius: 12, border: '1px solid rgba(0,62,145,0.22)', background: 'rgba(18,34,72,0.8)', color: 'var(--t1,#eef2ff)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
            Edit Profile
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('🔗 Link copied') }}
            style={{ padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(0,62,145,0.22)', background: 'rgba(18,34,72,0.8)', color: 'var(--t1,#eef2ff)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
            <i className="fa-solid fa-share-nodes" />
          </button>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <>
          {/* Sparkline card */}
          <div style={{ margin: '14px 14px 0', padding: 16, background: 'linear-gradient(135deg,#041642 0%,#002063 60%,#1565e8 140%)', borderRadius: 22, border: '1px solid rgba(21,101,232,0.3)', color: '#fff', boxShadow: '0 12px 40px rgba(0,32,99,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, letterSpacing: 0.5 }}>Screen time today</div>
                <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '2.8rem', fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, color: '#fff' }}>
                  {analytics.time_today_formatted || '0s'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'rgba(255,140,0,0.2)', border: '1px solid rgba(255,140,0,0.4)', borderRadius: 100, fontSize: '0.74rem', fontWeight: 700, color: '#FFB260' }}>
                🔥 {analytics.current_streak}-day streak
              </div>
            </div>
            {/* Bar sparkline */}
            <svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none" style={{ display: 'block', marginBottom: 4 }}>
              {days.map((d, i) => {
                const h = Math.max(2, (d.seconds / maxSec) * 40)
                const bw = (300 - 8) / 7
                const x = 4 + i * bw + bw * 0.15
                const w = bw * 0.7
                return (
                  <rect
                    key={i}
                    x={x.toFixed(1)} y={(44 - h).toFixed(1)}
                    width={w.toFixed(1)} height={h.toFixed(1)}
                    rx="2" fill="rgba(255,255,255,0.9)"
                    opacity={0.35 + (d.seconds / maxSec) * 0.65}
                  />
                )
              })}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.56rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {days.map((d, i) => {
                const dt = new Date(d.date)
                return <span key={i}>{dayLabels[dt.getDay()]}</span>
              })}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '12px 14px' }}>
            {[
              { ico: '📖', color: 'rgba(82,193,122,0.15)', val: analytics.articles_today, lbl: 'Articles today' },
              { ico: '📊', color: 'rgba(21,101,232,0.15)', val: analytics.articles_week, lbl: 'This week' },
              { ico: '⚡', color: 'rgba(255,140,0,0.15)',  val: analytics.time_week_formatted, lbl: 'Time this week' },
              { ico: '🏆', color: 'rgba(168,85,247,0.15)', val: analytics.longest_streak, lbl: 'Longest streak' },
            ].map((t, i) => (
              <div key={i} style={{ padding: 12, background: 'rgba(0,62,145,0.06)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', marginBottom: 8, background: t.color }}>
                  {t.ico}
                </div>
                <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', lineHeight: 1 }}>{t.val}</div>
                <div style={{ fontSize: '0.64rem', color: '#4a6898', fontWeight: 500, marginTop: 3 }}>{t.lbl}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          {analytics.categories.some(c => c.count > 0) && (
            <div style={{ margin: '0 14px 14px', padding: 16, background: 'rgba(0,62,145,0.06)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 18 }}>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', marginBottom: 12 }}>Your reading mix</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {analytics.categories.filter(c => c.count > 0).slice(0, 5).map(c => (
                  <div key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--t1,#eef2ff)', flex: 1 }}>{c.name}</div>
                    <div style={{ flex: 2, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 100 }} />
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#4a6898', fontWeight: 700, minWidth: 28, textAlign: 'right' }}>{c.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Settings */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4a6898', letterSpacing: 1, textTransform: 'uppercase', padding: '0 2px 6px' }}>Settings</div>
        <div style={{ background: 'rgba(9,21,39,1)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,62,145,0.22)', marginBottom: 14 }}>
          {[
            { icon: 'fa-solid fa-star', bg: '#FFD166', label: 'Rate SherrByte', action: () => showToast('⭐ Thank you!') },
            { icon: 'fa-regular fa-circle-question', bg: '#52C17A', label: 'Help & Support', action: () => showToast('📧 support@sherrbyte.in') },
          ].map((row, i) => (
            <div key={i} onClick={row.action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: i === 0 ? '1px solid rgba(0,62,145,0.11)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff', flexShrink: 0, background: row.bg }}>
                <i className={row.icon} />
              </div>
              <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: 'var(--t1,#eef2ff)' }}>{row.label}</span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.62rem', color: '#4a6898' }} />
            </div>
          ))}
        </div>

        {auth.token && (
          <button onClick={() => { auth.logout(); showToast('👋 Signed out') }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.15)', borderRadius: 12, color: '#E53935', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 8 }}>
            <i className="fa-solid fa-right-from-bracket" /> Log Out
          </button>
        )}
        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '0.6rem', color: '#243660', letterSpacing: 0.5 }}>
          SherrByte v2.0 · Build 2026.05
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* Edit Profile Sheet */}
      {editing && (
        <div onClick={() => setEditing(false)} style={{ position: 'absolute', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'rgba(9,21,39,1)', width: '100%', maxWidth: 440, borderRadius: '24px 24px 0 0', border: '1px solid rgba(0,62,145,0.22)', borderBottom: 'none', padding: '20px 16px 36px', maxHeight: '90vh', overflowY: 'auto', animation: 'slideUpAnim 0.35s cubic-bezier(0.32,0.72,0,1) both' }}>
            <div style={{ width: 36, height: 4, borderRadius: 100, background: 'rgba(0,62,145,0.22)', margin: '0 auto 16px' }} />
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1rem', fontWeight: 800, color: 'var(--t1,#eef2ff)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Edit Profile
              <span onClick={() => setEditing(false)} style={{ fontSize: '1.2rem', cursor: 'pointer', color: '#4a6898' }}>✕</span>
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4a6898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>Display Name</div>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', padding: '10px 14px', marginBottom: 10, background: 'rgba(13,30,58,1)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 12, color: 'var(--t1,#eef2ff)', fontSize: '0.84rem', fontFamily: 'Poppins,sans-serif', outline: 'none' }}
            />
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4a6898', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>Bio</div>
            <textarea
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              placeholder="Tell your story…"
              rows={3}
              style={{ width: '100%', padding: '10px 14px', marginBottom: 10, background: 'rgba(13,30,58,1)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 12, color: 'var(--t1,#eef2ff)', fontSize: '0.84rem', fontFamily: 'Poppins,sans-serif', outline: 'none', resize: 'none' }}
            />
            <button
              onClick={saveProfile}
              disabled={loading}
              style={{ width: '100%', padding: 12, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#002063,#1565e8)', color: '#fff', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
