import { useState, useEffect } from 'react'
import type { Article } from '@/types'
import { getBookmarks } from '@/lib/api'
import { CATS, CAT_GRADS, timeAgo, normArticle } from '@/lib/constants'

interface Props {
  active: boolean
  auth: { token: string | null; saves: number[]; toggleSave: (id: number) => boolean }
  onArticle: (a: Article) => void
  showToast: (msg: string) => void
}

export default function BookmarksView({ active, auth, onArticle, showToast }: Props) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!active) return
    setLoading(true)
    if (auth.token) {
      getBookmarks()
        .then(d => setArticles((d.articles || []).map(a => normArticle(a as Record<string, unknown>) as unknown as Article)))
        .catch(() => showToast('⚠️ Failed to load bookmarks'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [active])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      paddingTop: 56, paddingBottom: 92,
      overflowY: active ? 'scroll' : 'hidden',
      display: active ? 'block' : 'none',
      background: 'var(--bg,#060e1f)',
    }}>
      <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', padding: '14px 16px 8px', letterSpacing: -0.2 }}>
        Bookmarks
      </div>

      {!auth.token && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6898' }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5, marginBottom: 8 }}>🔖</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#8aaad4', marginBottom: 4 }}>Sign in to sync bookmarks</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Your saved articles appear here.</div>
        </div>
      )}

      {auth.token && loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6898', fontSize: '0.8rem' }}>Loading…</div>
      )}

      {auth.token && !loading && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6898' }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5, marginBottom: 8 }}>🔖</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#8aaad4', marginBottom: 4 }}>No bookmarks yet</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Tap the bookmark icon on any article.</div>
        </div>
      )}

      {articles.map(a => {
        const cat = (a.category || 'tech') as keyof typeof CATS
        const cc = CATS[cat] || CATS.tech
        const grad = CAT_GRADS[cat] || CAT_GRADS.tech

        return (
          <div
            key={a.id}
            onClick={() => onArticle(a)}
            style={{
              margin: '0 14px 10px',
              borderRadius: 20,
              padding: 14,
              background: 'rgba(5,18,52,0.94)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,62,145,0.22)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              cursor: 'pointer',
              transition: 'transform 0.15s',
            }}
          >
            {/* Thumbnail */}
            <div style={{ width: 72, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
              {a.image_url ? (
                <img
                  src={a.image_url}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const ph = el.nextElementSibling as HTMLElement
                    if (ph) ph.style.display = 'flex'
                  }}
                />
              ) : null}
              <div style={{ width: '100%', height: '100%', display: a.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: grad }}>
                {cc.icon}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--t1,#eef2ff)', lineHeight: 1.35, marginBottom: 5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                {a.headline || a.title}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#4a6898', marginBottom: 8 }}>
                {a.source_name || a.source} · {cc.short} · {timeAgo(a.published_at)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    auth.toggleSave(a.id)
                    setArticles(prev => prev.filter(x => x.id !== a.id))
                    showToast('✓ Removed')
                  }}
                  style={{ fontSize: '0.9rem', color: '#1565e8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-bookmark" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (a.url) window.open(a.url, '_blank')
                  }}
                  style={{ fontSize: '0.9rem', color: '#4a6898', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </button>
              </div>
            </div>
          </div>
        )
      })}

      <div style={{ height: 16 }} />
    </div>
  )
}
