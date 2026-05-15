import type { CategorySlug } from '@/types'

export const CATS: Record<CategorySlug, {
  hex: string; bg: string; icon: string; short: string; label: string
}> = {
  arts:     { hex: '#E53935', bg: 'rgba(229,57,53,0.12)',   icon: '🎭', short: 'Arts',      label: 'Arts & Culture' },
  selfwell: { hex: '#FB8C00', bg: 'rgba(251,140,0,0.12)',   icon: '🧘', short: 'Well-being', label: 'Self & Well-being' },
  economy:  { hex: '#FBC02D', bg: 'rgba(251,192,45,0.12)',  icon: '💼', short: 'Business',   label: 'Business & Economy' },
  nature:   { hex: '#43A047', bg: 'rgba(67,160,71,0.12)',   icon: '🌿', short: 'Nature',     label: 'Natural World' },
  society:  { hex: '#1E88E5', bg: 'rgba(30,136,229,0.12)',  icon: '🏛', short: 'Society',    label: 'Society & Governance' },
  tech:     { hex: '#3949AB', bg: 'rgba(57,73,171,0.12)',   icon: '🔬', short: 'Sci & Tech', label: 'Science & Technology' },
  philo:    { hex: '#8E24AA', bg: 'rgba(142,36,170,0.12)',  icon: '🔮', short: 'Philosophy', label: 'Philosophy & Belief' },
  lifestyle:{ hex: '#00ACC1', bg: 'rgba(0,172,193,0.12)',   icon: '✨', short: 'Lifestyle',  label: 'Society & Lifestyle' },
  sports:   { hex: '#546E7A', bg: 'rgba(84,110,122,0.12)', icon: '⚽', short: 'Sports',     label: 'Sports & Gaming' },
}

export const CAT_GRADS: Record<CategorySlug, string> = {
  arts:     'linear-gradient(135deg,#2A0A0A,#E53935 80%)',
  selfwell: 'linear-gradient(135deg,#1A0D00,#FB8C00 80%)',
  economy:  'linear-gradient(135deg,#1A1400,#FBC02D 80%)',
  nature:   'linear-gradient(135deg,#0A1A0A,#43A047 80%)',
  society:  'linear-gradient(135deg,#0D2137,#1E88E5 80%)',
  tech:     'linear-gradient(135deg,#0A0D2A,#3949AB 80%)',
  philo:    'linear-gradient(135deg,#150A1A,#8E24AA 80%)',
  lifestyle:'linear-gradient(135deg,#001A1A,#00ACC1 80%)',
  sports:   'linear-gradient(135deg,#0A0F1A,#546E7A 80%)',
}

export const CATEGORY_CHIPS: Array<{ label: string; value: CategorySlug | 'all'; emoji: string }> = [
  { label: 'All',        value: 'all',      emoji: '⚡' },
  { label: 'Society',    value: 'society',  emoji: '🏛' },
  { label: 'Tech',       value: 'tech',     emoji: '🔬' },
  { label: 'Business',   value: 'economy',  emoji: '💼' },
  { label: 'Sports',     value: 'sports',   emoji: '⚽' },
  { label: 'Arts',       value: 'arts',     emoji: '🎭' },
  { label: 'Nature',     value: 'nature',   emoji: '🌿' },
  { label: 'Well-being', value: 'selfwell', emoji: '🧘' },
  { label: 'Philosophy', value: 'philo',    emoji: '🔮' },
  { label: 'Lifestyle',  value: 'lifestyle',emoji: '✨' },
]

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  } catch { return '' }
}

export function readMin(article: { full_body?: string; body_ai?: string; preview?: string }): number {
  const text = article.full_body || article.body_ai || article.preview || ''
  return Math.max(1, Math.round(text.split(/\s+/).length / 200))
}

export function normArticle(a: Record<string, unknown>) {
  return {
    ...a,
    title:    (a.headline  || a.title    || '') as string,
    source:   (a.source_name || a.source || '') as string,
    preview:  (a.summary_60 || a.preview  || '') as string,
    body_ai:  (a.full_body  || a.body_ai  || '') as string,
    category: (a.category   || a.pillar_slug || 'tech') as CategorySlug,
    isTrending: Boolean(a.isTrending || a.is_trending),
  }
}
