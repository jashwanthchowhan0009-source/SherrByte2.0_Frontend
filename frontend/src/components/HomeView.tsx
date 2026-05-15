import { useState, useEffect, useCallback, useRef } from 'react'
import type { Article } from '@/types'
import type { CategorySlug } from '@/types'
import { getFeed, getExplore, getTrending, getContinueReading, interact } from '@/lib/api'
import { CATS, CAT_GRADS, CATEGORY_CHIPS, timeAgo, readMin, normArticle } from '@/lib/constants'
import ArticleCard from './ArticleCard'

interface Props {
  active: boolean
  auth: { likes: number[]; saves: number[]; token: string | null; toggleLike: (id: number) => boolean; toggleSave: (id: number) => boolean }
  onArticle: (a: Article) => void
  showToast: (msg: string) => void
}

type TabKey = 'foryou' | 'latest' | 'trending'

const SKEL_COUNT = 5

function Skeleton() {
  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,62,145,0.11)' }}>
      <div style={{ height: 12, width: 80, borderRadius: 8, marginBottom: 10, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, width: '90%', borderRadius: 8, marginBottom: 8, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
          <div style={{ height: 12, width: '70%', borderRadius: 8, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
        </div>
        <div style={{ width: 88, height: 66, borderRadius: 12, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

export default function HomeView({ active, auth, onArticle, showToast }: Props) {
  const [tab, setTab] = useState<TabKey>('foryou')
  const [chip, setChip] = useState<CategorySlug | 'all'>('all')
  const [articles, setArticles] = useState<Article[]>([])
  const [continueArt, setContinueArt] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchFeed = useCallback(async (reset = false) => {
    if (loading) return
    setLoading(true)
    const p = reset ? 1 : page
    try {
      let data
      if (tab === 'trending') data = await getTrending(30)
      else if (chip !== 'all') data = await getExplore(chip, p, 30)
      else data = await getFeed(p, 20)

      const arts = (data.articles || []).map(a => normArticle(a as unknown as Record<string, unknown>) as unknown as Article)
      setArticles(prev => reset ? arts : [...prev, ...arts])
      setHasMore(Boolean(data.has_more))
      setPage(p + 1)

      if (reset && auth.token) {
        getContinueReading().then(r => setContinueArt(r.article)).catch(() => {})
      }
    } catch (e) {
      showToast('⚠️ ' + (e instanceof Error ? e.message : 'Failed to load feed'))
    } finally {
      setLoading(false)
    }
  }, [tab, chip, page, loading, auth.token])

  useEffect(() => {
    if (active) { setPage(1); setArticles([]); fetchFeed(true) }
  }, [active, tab, chip])

  // Infinite scroll
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 400 && hasMore && !loading) {
      fetchFeed(false)
    }
  }

  const trendingPool = articles.filter(a => a.isTrending).slice(0, 6)
  const heroArticle  = articles[0]
  const shownIds     = new Set([heroArticle?.id, ...trendingPool.map(a => a.id)].filter(Boolean))
  const restArticles = articles.filter(a => !shownIds.has(a.id))

  function openArt(a: Article) {
    onArticle(normArticle(a as unknown as Record<string, unknown>) as unknown as Article)
    interact(a.id, 'read', a.category, 0).catch(() => {})
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        position: 'absolute', inset: 0,
        paddingTop: 56, paddingBottom: 92,
        overflowY: active ? 'scroll' : 'hidden',
        display: active ? 'block' : 'none',
        background: 'var(--bg,#060e1f)',
      }}
    >
      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px', borderBottom: '1px solid rgba(0,62,145,0.11)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(3,12,38,0.78)', backdropFilter: 'blur(12px)' }}>
        {CATEGORY_CHIPS.map(c => {
          const on = chip === c.value
          const cc = c.value !== 'all' ? CATS[c.value as CategorySlug] : null
          return (
            <button
              key={c.value}
              onClick={() => { setChip(c.value as CategorySlug | 'all'); setPage(1); setArticles([]) }}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 100,
                fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap',
                background: on ? (cc?.hex || '#1E88E5') : 'transparent',
                color: on ? '#fff' : '#4a6898',
                border: `1px solid ${on ? 'transparent' : 'rgba(0,62,145,0.22)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: on ? '0 4px 16px rgba(0,62,145,0.4)' : 'none',
              }}
            >
              {c.emoji} {c.label}
            </button>
          )
        })}
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 16px 8px', borderBottom: '1px solid rgba(0,62,145,0.11)', background: 'rgba(3,12,38,0.78)', backdropFilter: 'blur(12px)' }}>
        {(['foryou', 'latest', 'trending'] as TabKey[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); setArticles([]) }}
            style={{
              flexShrink: 0, padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600,
              color: tab === t ? 'var(--t1,#eef2ff)' : '#4a6898',
              cursor: 'pointer', borderRadius: 10, background: 'transparent', border: 'none',
              borderBottom: tab === t ? '2px solid #1565e8' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {t === 'foryou' ? 'For You' : t === 'latest' ? 'Latest' : 'Trending'}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && articles.length === 0 && (
        <>
          <div style={{ margin: '8px 14px 14px', height: 200, borderRadius: 22, background: 'linear-gradient(90deg,#0d1e3a 0%,#122248 50%,#0d1e3a 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
          {Array.from({ length: SKEL_COUNT }).map((_, i) => <Skeleton key={i} />)}
          <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
        </>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6898' }}>
          <div style={{ fontSize: '2.4rem', opacity: 0.5, marginBottom: 8 }}>📰</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 500, marginBottom: 4, color: '#8aaad4' }}>Feed warming up…</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Fresh articles are being collected. Check back shortly.</div>
        </div>
      )}

      {/* Continue reading */}
      {continueArt && articles.length > 0 && (
        <ContinueCard article={continueArt} onClick={() => openArt(continueArt)} />
      )}

      {/* Hero card */}
      {heroArticle && <HeroCard article={heroArticle} onClick={() => openArt(heroArticle)} />}

      {/* Trending strip */}
      {trendingPool.length >= 2 && <TrendingStrip articles={trendingPool} onArticle={openArt} />}

      {/* Latest heading */}
      {restArticles.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px 8px' }}>
          <div style={{ width: 4, height: 16, background: 'linear-gradient(180deg,#1565e8,#002063)', borderRadius: 2 }} />
          <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--t1,#eef2ff)' }}>Latest News</span>
        </div>
      )}

      {/* Standard cards */}
      {restArticles.map(a => (
        <ArticleCard
          key={a.id}
          article={a}
          onClick={() => openArt(a)}
          onLike={() => { auth.toggleLike(a.id); interact(a.id,'like',a.category).catch(()=>{}) }}
          onSave={() => { const s=auth.toggleSave(a.id); showToast(s?'🔖 Saved!':'✓ Removed'); interact(a.id,'save',a.category).catch(()=>{}) }}
          onShare={() => { navigator.clipboard?.writeText(a.url||''); showToast('📋 Copied') }}
          liked={auth.likes.includes(a.id)}
          saved={auth.saves.includes(a.id)}
        />
      ))}

      {/* Load more */}
      {loading && articles.length > 0 && (
        <div style={{ textAlign: 'center', padding: '16px', color: '#4a6898', fontSize: '0.8rem' }}>Loading more…</div>
      )}

      <div style={{ height: 16 }} />
    </div>
  )
}

function HeroCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const cat = (article.category || 'tech') as keyof typeof CATS
  const cc = CATS[cat] || CATS.tech
  const grad = CAT_GRADS[cat] || CAT_GRADS.tech

  return (
    <div
      onClick={onClick}
      style={{
        margin: '8px 14px 14px', borderRadius: 22, overflow: 'hidden',
        position: 'relative', cursor: 'pointer', background: '#091527',
        aspectRatio: '16/10', border: '1px solid rgba(0,62,145,0.22)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)', transition: 'transform 0.22s',
      }}
    >
      {article.image_url
        ? <img src={article.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
        : <div style={{ position: 'absolute', inset: 0, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.5 }}>{cc.icon}</div>
      }
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,10,25,0.95) 0%,rgba(4,10,25,0.4) 45%,transparent 75%)', padding: '18px 16px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 100, fontSize: '0.6rem', fontWeight: 800, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {cc.icon} {cc.short}
          </span>
          {article.isTrending && (
            <span style={{ fontSize: '0.58rem', fontWeight: 900, letterSpacing: 1.5, padding: '4px 10px', borderRadius: 100, background: 'linear-gradient(135deg,#FF5B5B,#FB8C00)', color: '#fff', textTransform: 'uppercase', animation: 'trendPulse 2.2s ease-in-out infinite' }}>
              🔥 Trending
            </span>
          )}
        </div>
        <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.3, color: '#fff' }}>
          {article.headline || article.title}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span>{article.source_name || article.source}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          <span>{timeAgo(article.published_at)}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          <span>📖 {readMin(article)} min</span>
        </div>
      </div>
    </div>
  )
}

function ContinueCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const cat = (article.category || 'tech') as keyof typeof CATS
  const cc = CATS[cat] || CATS.tech
  const grad = CAT_GRADS[cat] || CAT_GRADS.tech
  const progress = Math.max(10, Math.min(95, article.scroll_pct || 15))

  return (
    <div onClick={onClick} style={{ margin: '12px 14px 8px', padding: 14, background: 'linear-gradient(135deg,rgba(21,101,232,0.12),rgba(0,32,99,0.06))', border: '1px solid rgba(21,101,232,0.25)', borderRadius: 18, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(21,101,232,0.08)' }}>
      {article.image_url
        ? <img src={article.image_url} alt="" style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.background = grad }} />
        : <div style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{cc.icon}</div>
      }
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#1565e8', marginBottom: 4 }}>📌 Continue Reading</div>
        <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, marginBottom: 8 }}>
          {article.headline || article.title}
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#002063,#1565e8)', borderRadius: 100 }} />
        </div>
        <div style={{ fontSize: '0.62rem', color: '#4a6898', display: 'flex', gap: 8 }}>
          <span>{progress}% read</span><span>·</span><span>{readMin(article)} min</span>
        </div>
      </div>
    </div>
  )
}

function TrendingStrip({ articles, onArticle }: { articles: Article[]; onArticle: (a: Article) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
        <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--t1,#eef2ff)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 16, background: 'linear-gradient(180deg,#FF5B5B,#FB8C00)', borderRadius: 2 }} />
          Trending Now
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px 4px', scrollSnapType: 'x mandatory' }}>
        {articles.map(a => {
          const cat = (a.category || 'tech') as keyof typeof CATS
          const cc = CATS[cat] || CATS.tech
          const grad = CAT_GRADS[cat] || CAT_GRADS.tech
          return (
            <div key={a.id} onClick={() => onArticle(a)} style={{ flexShrink: 0, width: 260, padding: 10, background: 'rgba(5,18,52,0.94)', backdropFilter: 'blur(14px)', border: '1px solid rgba(0,62,145,0.22)', borderRadius: 14, display: 'flex', gap: 10, cursor: 'pointer', scrollSnapAlign: 'start' }}>
              {a.image_url
                ? <img src={a.image_url} alt="" style={{ width: 68, height: 68, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.background = grad }} />
                : <div style={{ width: 68, height: 68, borderRadius: 10, flexShrink: 0, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{cc.icon}</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4, color: cc.hex }}>{cc.icon} {cc.short}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--t1,#eef2ff)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, marginBottom: 4 }}>
                  {a.headline || a.title}
                </div>
                <div style={{ fontSize: '0.6rem', color: '#4a6898' }}>{a.source_name || a.source} · {timeAgo(a.published_at)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
