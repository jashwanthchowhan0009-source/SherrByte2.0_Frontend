import { useState } from 'react'

const OB_PILLARS = [
  { id: 1, c: '#1E88E5', e: '🏛️', s: 'Society',   t: ['Elections','Supreme Court','Geopolitics','NATO','Politics','Parliament','Government','Law','Education','Diplomacy'] },
  { id: 2, c: '#FBC02D', e: '💼', s: 'Business',  t: ['Bitcoin','Stock Market','Cryptocurrency','Startup','FinTech','Ethereum','Nifty 50','Inflation','IPO','Real Estate'] },
  { id: 3, c: '#3949AB', e: '🔬', s: 'Science',   t: ['Artificial Intelligence','ChatGPT','Quantum Computing','SpaceX','ISRO','NASA','Cybersecurity','Robotics','Nvidia','5G'] },
  { id: 4, c: '#E53935', e: '🎭', s: 'Arts',      t: ['Bollywood','Oscar','Grammy','Netflix','Anime','K-Pop','Marvel','Cinema','Music','Literature'] },
  { id: 5, c: '#43A047', e: '🌿', s: 'Nature',    t: ['Climate Change','Renewable Energy','Wildlife','Conservation','Earthquake','Cyclone','Flood','Biodiversity','Environment','Animals'] },
  { id: 6, c: '#FB8C00', e: '🧘', s: 'Wellbeing', t: ['Mental Health','Fitness','Yoga','Nutrition','Meditation','Vaccine','Health','Cancer','Diabetes','Wellness'] },
  { id: 7, c: '#8E24AA', e: '🔮', s: 'Philosophy',t: ['Philosophy','Stoicism','Buddhism','Hinduism','Spirituality','Religion','Ethics','Mythology','Christianity','Islam'] },
  { id: 8, c: '#00ACC1', e: '✨', s: 'Lifestyle',  t: ['Travel','Food','Fashion','Celebrity','Social Media','Lifestyle','Tourism','TikTok','Instagram','Restaurant'] },
  { id: 9, c: '#546E7A', e: '⚽', s: 'Sports',    t: ['Cricket','IPL','Football','F1','Olympics','NBA','Tennis','Esports','Gaming','Sports'] },
]
const ALL_TOPICS = OB_PILLARS.flatMap(p => p.t.map(t => ({ name: t, pid: p.id, c: p.c })))

interface Props {
  auth: { login: (email: string, password: string) => Promise<{ name?: string }>, signup: (email: string, password: string, name: string, topics: string[]) => Promise<{ name?: string }> }
  onDone: () => void
  showToast: (msg: string) => void
}

type Tab = 'login' | 'register'
type Step = 'auth' | 'topics'

export default function Onboarding({ auth, onDone, showToast }: Props) {
  const [tab, setTab] = useState<Tab>('login')
  const [step, setStep] = useState<Step>('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingCreds, setPendingCreds] = useState<{ email: string; password: string; name: string } | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set())
  const [pillarFilter, setPillarFilter] = useState(0)
  const [search, setSearch] = useState('')

  async function handleLogin() {
    if (!email || !password) { setError('Fill all fields'); return }
    setLoading(true); setError('')
    try {
      await auth.login(email, password)
      onDone()
      showToast('✦ Welcome back!')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed')
    } finally { setLoading(false) }
  }

  function handleRegisterNext() {
    if (!email || !password) { setError('Fill all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setPendingCreds({ email, password, name: name || email.split('@')[0] })
    setStep('topics')
  }

  async function handleFinish(skip = false) {
    if (!pendingCreds) return
    setLoading(true)
    try {
      await auth.signup(pendingCreds.email, pendingCreds.password, pendingCreds.name, skip ? [] : Array.from(selectedTopics))
      onDone()
      showToast('✦ Welcome to SherrByte!')
    } catch (e) {
      showToast('Error: ' + (e instanceof Error ? e.message : 'Signup failed'))
      setStep('auth')
    } finally { setLoading(false) }
  }

  const topics = ALL_TOPICS.filter(t => {
    const matchPillar = pillarFilter === 0 || t.pid === pillarFilter
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    return matchPillar && matchSearch
  })

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5000, background: 'radial-gradient(ellipse at 40% 30%,#041642 0%,#060e1f 60%,#020b1a 100%)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overscrollBehavior: 'contain' }}>

      {/* Top logo */}
      <div style={{ padding: '52px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#041642,#002063,#1565e8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
        <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#F4F3FF' }}>
          Sherr<span style={{ color: '#1565e8' }}>Byte</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 0', maxWidth: 440, margin: '0 auto', width: '100%' }}>

        {/* ── AUTH STEP ── */}
        {step === 'auth' && (
          <div>
            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#1565e8', marginBottom: 10, opacity: 0.85 }}>
                News Intelligence
              </div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(2rem,8vw,2.8rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 10, letterSpacing: -1, color: '#F4F3FF' }}>
                Your feed,<br /><span style={{ color: '#1565e8' }}>your rules.</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#8aaad4', marginBottom: 24, lineHeight: 1.65 }}>
                Sign in or create an account to start your personalised news experience.
              </div>
            </div>

            {/* Auth card */}
            <div style={{ background: 'rgba(0,20,60,0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,62,145,0.3)', borderRadius: 22, padding: 22, marginBottom: 16 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: 3, marginBottom: 20 }}>
                {(['login', 'register'] as Tab[]).map(t => (
                  <button key={t} onClick={() => { setTab(t); setError('') }}
                    style={{ flex: 1, padding: 9, border: 'none', borderRadius: 11, color: tab === t ? '#fff' : '#8aaad4', fontSize: '0.8rem', fontFamily: 'Poppins,sans-serif', fontWeight: 700, cursor: 'pointer', background: tab === t ? 'linear-gradient(135deg,#002063,#1565e8)' : 'transparent', boxShadow: tab === t ? '0 2px 14px rgba(0,62,145,0.5)' : 'none', transition: 'all 0.2s' }}>
                    {t === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {/* Name field (register only) */}
              {tab === 'register' && (
                <div style={{ marginBottom: 11 }}>
                  <label style={{ display: 'block', fontSize: '0.6rem', color: '#4a6898', fontFamily: '"Space Grotesk",sans-serif', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name"
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 12, padding: '11px 13px', color: '#eef2ff', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', outline: 'none' }} />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 11 }}>
                <label style={{ display: 'block', fontSize: '0.6rem', color: '#4a6898', fontFamily: '"Space Grotesk",sans-serif', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 12, padding: '11px 13px', color: '#eef2ff', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 11 }}>
                <label style={{ display: 'block', fontSize: '0.6rem', color: '#4a6898', fontFamily: '"Space Grotesk",sans-serif', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>
                  Password {tab === 'register' && '(min 6 chars)'}
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 12, padding: '11px 13px', color: '#eef2ff', fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              {error && <div style={{ color: '#ff6b6b', fontSize: '0.7rem', marginBottom: 8, fontFamily: '"Space Grotesk",sans-serif' }}>{error}</div>}

              <button
                onClick={tab === 'login' ? handleLogin : handleRegisterNext}
                disabled={loading}
                style={{ width: '100%', padding: 12, marginTop: 12, background: 'linear-gradient(135deg,#002063,#1565e8)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,62,145,0.45)', opacity: loading ? 0.45 : 1 }}
              >
                {loading ? '…' : tab === 'login' ? 'Sign In →' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ── TOPICS STEP ── */}
        {step === 'topics' && (
          <div>
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#1565e8', marginBottom: 10, opacity: 0.85 }}>
                Personalise
              </div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(1.8rem,7vw,2.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: 10, letterSpacing: -1, color: '#F4F3FF' }}>
                What <span style={{ color: '#1565e8' }}>matters</span><br />to you?
              </div>
              <div style={{ fontSize: '0.82rem', color: '#8aaad4', marginBottom: 16, lineHeight: 1.65 }}>
                Select at least 3 topics to build your personalised feed.
              </div>
            </div>

            <div style={{ fontSize: '0.68rem', color: '#8aaad4', marginBottom: 9 }}>
              Selected: <span style={{ color: '#1565e8', fontWeight: 700 }}>{selectedTopics.size}</span> topics
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(0,62,145,0.18)', borderRadius: 12, padding: '9px 13px', marginBottom: 10 }}>
              <span style={{ color: '#4a6898', fontSize: '0.82rem' }}>🔍</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics…"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#eef2ff', fontFamily: 'Poppins,sans-serif', fontSize: '0.84rem' }} />
            </div>

            {/* Pillar pills */}
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 3, marginBottom: 12, scrollbarWidth: 'none' }}>
              <button onClick={() => setPillarFilter(0)}
                style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid', borderColor: pillarFilter === 0 ? 'transparent' : 'rgba(0,62,145,0.28)', background: pillarFilter === 0 ? 'linear-gradient(135deg,#002063,#1565e8)' : 'rgba(0,10,30,0.45)', color: pillarFilter === 0 ? '#fff' : '#8aaad4', fontFamily: 'Poppins,sans-serif' }}>
                All
              </button>
              {OB_PILLARS.map(p => (
                <button key={p.id} onClick={() => setPillarFilter(pillarFilter === p.id ? 0 : p.id)}
                  style={{ flexShrink: 0, padding: '6px 13px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid', borderColor: pillarFilter === p.id ? 'transparent' : 'rgba(0,62,145,0.28)', background: pillarFilter === p.id ? `linear-gradient(135deg,${p.c}cc,${p.c}88)` : 'rgba(0,10,30,0.45)', color: pillarFilter === p.id ? '#fff' : '#8aaad4', fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap' }}>
                  {p.e} {p.s}
                </button>
              ))}
            </div>

            {/* Topic chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 260, overflowY: 'auto', padding: 2 }}>
              {topics.map(t => {
                const sel = selectedTopics.has(t.name)
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      const next = new Set(selectedTopics)
                      sel ? next.delete(t.name) : next.add(t.name)
                      setSelectedTopics(next)
                    }}
                    style={{ padding: '5px 12px', borderRadius: 100, border: '1.5px solid', borderColor: sel ? 'transparent' : 'rgba(0,62,145,0.28)', background: sel ? `linear-gradient(135deg,#002063,#1565e8)` : 'rgba(0,10,30,0.45)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', color: sel ? '#fff' : '#8aaad4', whiteSpace: 'nowrap', fontFamily: 'Poppins,sans-serif', transition: 'all 0.12s' }}
                  >
                    @{t.name}
                  </button>
                )
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 9, marginTop: 16, paddingBottom: 24, alignItems: 'center' }}>
              <button onClick={() => handleFinish(true)}
                style={{ padding: '11px 20px', borderRadius: 12, border: '1px solid rgba(0,62,145,0.22)', background: 'rgba(0,62,145,0.06)', color: '#8aaad4', fontFamily: 'Poppins,sans-serif', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                Skip
              </button>
              <button
                onClick={() => handleFinish(false)}
                disabled={selectedTopics.size < 3 || loading}
                style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg,#002063,#1565e8)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', opacity: (selectedTopics.size < 3 || loading) ? 0.45 : 1, boxShadow: '0 4px 20px rgba(0,62,145,0.45)' }}
              >
                {loading ? 'Building…' : 'Build My Feed →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
