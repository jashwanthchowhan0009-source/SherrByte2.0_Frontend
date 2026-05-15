import { useState, useEffect } from 'react'
import type { Article } from '@/types'
import type { CategorySlug } from '@/types'
import { getExplore, getMarkets } from '@/lib/api'
import { CATS, CAT_GRADS, timeAgo, normArticle } from '@/lib/constants'

interface Props {
  active: boolean
  onArticle: (a: Article) => void
  showToast: (msg: string) => void
}

export default function ExploreView({ active, onArticle, showToast }: Props) {
  const [articles, setArticles] = useState<Article[]>([])
  const [markets, setMarkets] = useState<Record<string, { price: number; change_pct: number }>>({})
  const [heroIdx, setHeroIdx] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!active) return
    setLoading(true)
    Promise.allSettled([
      getExplore('', 1, 30).then(d => setArticles((d.articles || []).map(a => normArticle(a as Record<string, unknown>) as unknown as Article))),
      getMarkets(false).then(d => setMarkets(d.stocks || {})),
    ]).finally(() => setLoading(false))
  }, [active])

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setHeroIdx(i => i + 1), 5000)
    return () => clearInterval(t)
  }, [active])

  const heroArts = articles.filter(a => a.image_url)
  const hero = heroArts[heroIdx % Math.max(1, heroArts.length)]

  const stockTiles = [
    { sym: 'NIFTY', label: 'NIFTY 50' },
    { sym: 'SENSEX', label: 'SENSEX' },
    { sym: 'NASDAQ', label: 'NASDAQ' },
    { sym: 'DOW', label: 'DOW' },
  ]

  const catList = Object.entries(CATS) as [CategorySlug, typeof CATS[CategorySlug]][]

  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 56, paddingBottom: 92, overflowY: active ? 'scroll' : 'hidden', display: active ? 'block' : 'none', background: 'var(--bg,#060e1f)' }}>

      {/* Live ticker */}
      <div style={{ background: 'rgba(3,12,38,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,62,145,0.25)', padding: '6px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 0, animation: 'tickerScroll 32s linear infinite', whiteSpace: 'nowrap' }}>
          {[...stockTiles, ...stockTiles].map((t, i) => {
            const d = markets[t.sym] || {}
            const pct = d.change_pct || 0
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 18px', fontSize: '0.68rem', fontWeight: 600, borderRight: '1px solid rgba(0,62,145,0.22)', color: '#fff', fontFamily: '"Space Grotesk",monospace' }}>
                <span style={{ color: '#43A047' }}>{t.label}</span>
                {d.price ? d.price.toLocaleString('en-IN') : '—'}
                <span style={{ color: pct >= 0 ? '#52C17A' : '#FF5B5B', fontSize: '0.6rem' }}>
                  {pct >= 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                </span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Hero */}
      {hero && (
        <div onClick={() => onArticle(hero)} style={{ margin: 12, borderRadius: 22, overflow: 'hidden', position: 'relative', height: 224, cursor: 'pointer', background: '#091527', boxShadow: '0 12px 48px rgba(0,0,0,0.4)', border: '1px solid rgba(0,62,145,0.22)', transition: 'transform 0.22s' }}>
          <img src={hero.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(14,10,20,0.95) 0%,rgba(14,10,20,0.1) 60%)', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, fontSize: '0.62rem', fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', width: 'fit-content' }}>
              {CATS[hero.category]?.icon} {CATS[hero.category]?.short}
            </div>
            <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, letterSpacing: -0.3 }}>{hero.headline || hero.title}</div>
            <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)' }}>{hero.source_name || hero.source} · {timeAgo(hero.published_at)}</div>
          </div>
        </div>
      )}

      {/* Category icons */}
      <div style={{ display: 'flex', gap: 0, overflowX: 'auto', padding: '4px 10px 10px' }}>
        {catList.map(([key, cat]) => (
          <div key={key} onClick={() => showToast(`${cat.icon} ${cat.short}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '6px 12px', flexShrink: 0, cursor: 'pointer', transition: 'transform 0.15s' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(255,255,255,0.08)', background: `${cat.hex}20`, color: cat.hex }}>
              {cat.icon}
            </div>
            <div style={{ fontSize: '0.6rem', fontWeight: 600, color: '#8aaad4', whiteSpace: 'nowrap' }}>{cat.short}</div>
          </div>
        ))}
      </div>

      {/* Market tiles */}
      {Object.keys(markets).length > 0 && (
        <div style={{ margin: '0 14px 10px' }}>
          <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
            📈 Live Markets
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {stockTiles.map(t => {
              const d = markets[t.sym] || {}
              const pct = d.change_pct || 0
              const up = pct >= 0
              return (
                <div key={t.sym} onClick={() => showToast(`${t.label}: ${d.price?.toLocaleString('en-IN') || '—'}`)} style={{ padding: 12, background: 'rgba(0,62,145,0.06)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 14, cursor: 'pointer' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: 1, color: '#4a6898', marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', lineHeight: 1 }}>
                    {d.price ? d.price.toLocaleString('en-IN') : '—'}
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: 4, color: up ? '#52C17A' : '#FF5B5B' }}>
                    {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trending grid */}
      <div style={{ padding: '10px 16px 6px', fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--t1,#eef2ff)' }}>
        🔥 Trending Stories
      </div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 14px 12px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 16, height: 140, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 14px 12px' }}>
          {articles.slice(0, 14).map((a, i) => {
            const cat = (a.category || 'tech') as keyof typeof CATS
            const cc = CATS[cat] || CATS.tech
            const grad = CAT_GRADS[cat] || CAT_GRADS.tech
            return (
              <div key={a.id} onClick={() => onArticle(a)} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', background: '#091527', position: 'relative', border: '1px solid rgba(0,62,145,0.22)', transition: 'transform 0.2s' }}>
                {a.image_url
                  ? <img src={a.image_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  : <div style={{ height: 120, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', opacity: 0.4 }}>{cc.icon}</div>
                }
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(14,10,20,0.9) 0%,transparent 55%)', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.58rem', fontWeight: 700, marginBottom: 3, color: cc.hex }}>{cc.icon} {cc.short}</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                    {a.headline || a.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ height: 16 }} />
    </div>
  )
}
