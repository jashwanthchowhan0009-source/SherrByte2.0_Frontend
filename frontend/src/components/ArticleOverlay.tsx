import { useEffect, useRef } from 'react'
import type { Article } from '@/types'
import { CATS, CAT_GRADS, timeAgo, readMin } from '@/lib/constants'
import { interact } from '@/lib/api'

interface Props {
  article: Article | null
  onClose: () => void
  auth: { likes: number[]; saves: number[]; token: string | null; toggleLike: (id: number) => boolean; toggleSave: (id: number) => boolean }
  showToast: (msg: string) => void
}

export default function ArticleOverlay({ article, onClose, auth, showToast }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (article && scrollRef.current) scrollRef.current.scrollTop = 0
    if (article && auth.token) {
      interact(article.id, 'read', article.category, 0).catch(() => {})
    }
  }, [article])

  const isOpen = Boolean(article)
  if (!article && !isOpen) return null

  const a = article!
  const cat = (a.category || 'tech') as keyof typeof CATS
  const cc = CATS[cat] || CATS.tech
  const grad = CAT_GRADS[cat] || CAT_GRADS.tech
  const liked = auth.likes.includes(a.id)
  const saved = auth.saves.includes(a.id)

  function handleLike() {
    auth.toggleLike(a.id)
    if (!auth.likes.includes(a.id)) interact(a.id, 'like', a.category).catch(() => {})
  }

  function handleSave() {
    const nowSaved = auth.toggleSave(a.id)
    showToast(nowSaved ? '🔖 Saved!' : '✓ Removed')
    if (nowSaved) interact(a.id, 'save', a.category).catch(() => {})
  }

  function handleShare() {
    const url = a.url || window.location.href
    if (navigator.share) {
      navigator.share({ title: a.headline || a.title, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
      showToast('📋 Link copied')
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2000,
      background: 'var(--bg,#060e1f)',
      transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.45s cubic-bezier(0.32,0.72,0,1)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', background: 'rgba(3,12,38,0.78)', backdropFilter: 'blur(28px)', borderBottom: '1px solid rgba(0,62,145,0.11)', position: 'relative' }}>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1565e8', fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: '6px 2px' }}>
          <i className="fa-solid fa-chevron-left" /> Back
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '0.82rem', fontWeight: 700, color: '#eef2ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '52%' }}>
          {a.source_name || a.source}
        </div>
        <button onClick={handleShare} style={{ marginLeft: 'auto', color: '#8aaad4', fontSize: '1rem', padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>

      {/* Scroll body */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Hero image */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: a.image_url ? '#122248' : grad, position: 'relative', overflow: 'hidden' }}>
          {a.image_url && (
            <img src={a.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          )}
          {!a.image_url && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.5 }}>
              {cc.icon}
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(14,10,20,0.9) 0%,transparent 55%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 14, padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: cc.hex }}>
            {cc.icon} {cc.label || cc.short}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 16px' }}>
          {/* Source row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0, background: cc.bg, color: cc.hex }}>
              {(a.source_name || a.source || 'S').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8aaad4' }}>{a.source_name || a.source}</span>
            <span style={{ fontSize: '0.7rem', color: '#4a6898', marginLeft: 'auto' }}>{timeAgo(a.published_at)} · {readMin(a)} min read</span>
          </div>

          {/* Title */}
          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', lineHeight: 1.35, letterSpacing: -0.3, marginBottom: 14 }}>
            {a.headline || a.title}
          </div>

          {/* Body text */}
          <div style={{ fontSize: '0.88rem', color: '#8aaad4', lineHeight: 1.75, marginBottom: 18, whiteSpace: 'pre-line' }}>
            {a.full_body || a.body_ai || a.summary_60 || a.preview || ''}
            {(a.full_body || '').length < 200 && '\n\nThis story is still developing. Visit the source for the latest updates.'}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, padding: '12px 0', borderTop: '1px solid rgba(0,62,145,0.11)', borderBottom: '1px solid rgba(0,62,145,0.11)', marginBottom: 20 }}>
            {[
              { id: 'like', icon: liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart', label: 'Like', active: liked, color: '#E53935', onClick: handleLike },
              { id: 'save', icon: saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark', label: 'Save', active: saved, color: '#1565e8', onClick: handleSave },
              { id: 'share', icon: 'fa-solid fa-paper-plane', label: 'Share', active: false, color: '#4a6898', onClick: handleShare },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={btn.onClick}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 8px', borderRadius: 14, fontSize: '0.62rem', fontWeight: 600,
                  color: btn.active ? btn.color : '#4a6898',
                  background: btn.active ? `${btn.color}14` : 'rgba(0,62,145,0.06)',
                  border: `1px solid ${btn.active ? btn.color + '33' : 'rgba(0,62,145,0.11)'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <i className={btn.icon} style={{ fontSize: '1.1rem' }} />
                {btn.label}
              </button>
            ))}
            {a.url && (
              <button
                onClick={() => window.open(a.url, '_blank')}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 8px', borderRadius: 14, fontSize: '0.62rem', fontWeight: 600, color: '#4a6898', background: 'rgba(0,62,145,0.06)', border: '1px solid rgba(0,62,145,0.11)', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '1.1rem' }} />
                Source
              </button>
            )}
          </div>

          {/* Sentiment badge */}
          {a.sentiment && a.sentiment !== 'neutral' && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, marginBottom: 16, fontSize: '0.7rem', fontWeight: 600, background: a.sentiment === 'positive' ? 'rgba(67,160,71,0.12)' : 'rgba(229,57,53,0.12)', color: a.sentiment === 'positive' ? '#43A047' : '#E53935', border: `1px solid ${a.sentiment === 'positive' ? '#43A047' : '#E53935'}33` }}>
              {a.sentiment === 'positive' ? '📈 Positive' : '📉 Negative'} sentiment
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
