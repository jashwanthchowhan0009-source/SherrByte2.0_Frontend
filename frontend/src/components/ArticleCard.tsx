import type { Article } from '@/types'
import { CATS, CAT_GRADS, timeAgo, readMin } from '@/lib/constants'

interface Props {
  article: Article
  onClick: () => void
  onLike: () => void
  onSave: () => void
  onShare: () => void
  liked: boolean
  saved: boolean
}

export default function ArticleCard({ article: rawA, onClick, onLike, onSave, onShare, liked, saved }: Props) {
  const a = rawA
  const cat = (a.category || 'tech') as keyof typeof CATS
  const cc = CATS[cat] || CATS.tech
  const grad = CAT_GRADS[cat] || CAT_GRADS.tech

  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(0,62,145,0.11)',
        background: 'transparent', cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 8 }}>
        <span style={{
          fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px',
          borderRadius: 6, letterSpacing: 0.3,
          background: cc.bg, color: cc.hex,
        }}>
          {cc.icon} {cc.short}
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#4a6898', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <i className="fa-regular fa-clock" /> {readMin(a)}m
        </span>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.94rem', fontWeight: 700, lineHeight: 1.35, letterSpacing: -0.2, color: 'var(--t1,#eef2ff)', marginBottom: 5 }}>
            {a.headline || a.title}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#8aaad4', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
            {a.summary_60 || a.preview}
          </div>
          <div style={{ fontSize: '0.62rem', color: '#4a6898', marginTop: 4 }}>
            {a.source_name || a.source} · {timeAgo(a.published_at)}
          </div>
        </div>

        {/* Thumbnail */}
        <div style={{ width: 88, height: 66, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#122248', border: '1px solid rgba(0,62,145,0.22)' }}>
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
          <div style={{ width: '100%', height: '100%', display: a.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', opacity: 0.6, background: grad }}>
            {cc.icon}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingTop: 8, borderTop: '1px solid rgba(0,62,145,0.11)' }}>
        <button
          onClick={e => { e.stopPropagation(); onLike() }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 100, fontSize: '0.74rem', fontWeight: 600, color: liked ? '#E53935' : '#4a6898', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <i className={liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onSave() }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 100, fontSize: '0.74rem', fontWeight: 600, color: saved ? '#1565e8' : '#4a6898', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <i className={saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'} />
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={e => { e.stopPropagation(); onShare() }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 100, fontSize: '0.74rem', fontWeight: 600, color: '#4a6898', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </div>
  )
}
