import type { Article, AuthResponse, FeedResponse, AnalyticsResponse, User } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sherrbyte-backend-v2.onrender.com'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('sb20') || '{}').token || null }
  catch { return null }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(API_URL + path, { ...opts, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new ApiError(res.status, err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup(
  email: string, password: string, name: string, topics: string[]
): Promise<AuthResponse> {
  return request<AuthResponse>('/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, topics }),
  })
}

// ─── Feed ─────────────────────────────────────────────────────────────────
export async function getFeed(page = 1, limit = 20): Promise<FeedResponse> {
  return request<FeedResponse>(`/feed?page=${page}&limit=${limit}`)
}

export async function getExplore(category = '', page = 1, limit = 30): Promise<FeedResponse> {
  const cat = category ? `&category=${category}` : ''
  return request<FeedResponse>(`/explore?page=${page}&limit=${limit}${cat}`)
}

export async function getTrending(limit = 15): Promise<FeedResponse> {
  return request<FeedResponse>(`/trending?limit=${limit}`)
}

export async function getArticle(id: number): Promise<Article> {
  return request<Article>(`/article/${id}`)
}

export async function searchArticles(q: string): Promise<FeedResponse> {
  return request<FeedResponse>(`/search?q=${encodeURIComponent(q)}`)
}

// ─── User ─────────────────────────────────────────────────────────────────
export async function getMe(): Promise<User> {
  return request<User>('/me')
}

export async function updateMe(data: { name?: string; bio?: string; display_name?: string }): Promise<void> {
  return request('/me', { method: 'PUT', body: JSON.stringify(data) })
}

export async function updateTopics(topics: string[]): Promise<void> {
  return request('/me/topics', { method: 'PUT', body: JSON.stringify({ topics }) })
}

// ─── Bookmarks ────────────────────────────────────────────────────────────
export async function getBookmarks(): Promise<FeedResponse> {
  return request<FeedResponse>('/bookmarks')
}

export async function toggleBookmark(articleId: number): Promise<{ saved: boolean }> {
  return request(`/bookmarks/${articleId}`, { method: 'POST' })
}

// ─── Interactions ─────────────────────────────────────────────────────────
export async function interact(
  articleId: number, action: string, category = '', durationSec = 0
): Promise<void> {
  return request('/interact', {
    method: 'POST',
    body: JSON.stringify({
      article_id: articleId, action, category, duration_sec: durationSec,
    }),
  })
}

// ─── Activity ─────────────────────────────────────────────────────────────
export async function heartbeat(durationSec = 30, articleId?: number, scrollPct?: number): Promise<void> {
  const token = getToken()
  if (!token) return
  return request('/activity/heartbeat', {
    method: 'POST',
    body: JSON.stringify({
      duration_sec: durationSec,
      article_id:   articleId || null,
      scroll_pct:   scrollPct || null,
    }),
  })
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  return request<AnalyticsResponse>('/me/analytics')
}

export async function getContinueReading(): Promise<{ article: Article | null }> {
  return request('/me/continue')
}

export async function getActivity(limit = 20): Promise<{ activity: Article[] }> {
  return request(`/me/activity?limit=${limit}`)
}

// ─── Markets ──────────────────────────────────────────────────────────────
export async function getMarkets(spark = false): Promise<{
  stocks: Record<string, { price: number; change_pct: number; spark?: number[] }>
  crypto: Record<string, { price_usd: number; change_pct: number }>
  metals: Record<string, { price_usd_oz?: number; price_inr_10g?: number; change_pct?: number }>
  forex:  Record<string, { price: number; change_pct: number }>
  timestamp: number
}> {
  return request(`/markets?spark=${spark}`)
}

// ─── Topics ───────────────────────────────────────────────────────────────
export async function getTopics(): Promise<{ pillars: unknown[] }> {
  return request('/topics')
}

export { ApiError, API_URL }
