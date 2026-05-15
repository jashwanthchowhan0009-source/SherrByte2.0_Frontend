// SherrByte 2.0 — shared TypeScript types

export type CategorySlug =
  | 'society' | 'economy' | 'tech' | 'arts' | 'nature'
  | 'selfwell' | 'philo' | 'lifestyle' | 'sports'

export interface Article {
  id: number
  url: string
  headline: string
  title?: string                  // alias of headline
  summary_60: string
  preview?: string                // alias
  full_body: string
  body_ai?: string                // alias
  source_summary?: string
  when_info?: string
  where_info?: string
  image_url: string
  source_name: string
  source?: string                 // alias
  pillar_id: number
  pillar_name: string
  pillar_color: string
  pillar_emoji: string
  pillar_slug: CategorySlug
  category: CategorySlug
  micro_tags: string[]
  scope: 'local' | 'national' | 'global'
  isTrending: boolean
  is_trending?: boolean
  sentiment: 'positive' | 'neutral' | 'negative'
  published_at: string | null
  engagement?: number
  refined_title?: string
  cached_summary?: string
  // Continue-reading enrichment
  scroll_pct?: number
  read_sec?: number
  last_read?: string
}

export interface User {
  id: number
  email: string
  name: string
  display_name?: string
  bio: string
  avatar_url: string
  language: string
  created_at: string | null
  preferences?: Array<{
    topic: string
    pillar_id: number
    color: string
    weight: number
  }>
  stats?: {
    articles_read: number
    likes: number
    bookmarks: number
  }
}

export interface AuthResponse {
  token: string
  user_id: number
  name?: string
  display_name?: string
  email?: string
  has_topics?: boolean
  message?: string
}

export interface FeedResponse {
  articles: Article[]
  page?: number
  has_more: boolean
  has_preferences?: boolean
}

export interface AnalyticsResponse {
  time_today_sec: number
  time_today_formatted: string
  time_week_sec: number
  time_week_formatted: string
  current_streak: number
  longest_streak: number
  articles_today: number
  articles_week: number
  articles_total: number
  daily_sec: Array<{ date: string; seconds: number }>
  categories: Array<{
    pillar_id: number
    slug: string
    name: string
    color: string
    count: number
    pct: number
  }>
  top_category: { name: string; count: number } | null
  avg_session_minutes: number
  active_days_week: number
}
