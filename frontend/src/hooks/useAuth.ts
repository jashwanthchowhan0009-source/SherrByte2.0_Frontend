import { useState, useEffect, useCallback } from 'react'
import { login as apiLogin, signup as apiSignup } from '@/lib/api'

interface AuthState {
  token: string | null
  userId: number | null
  likes: number[]
  saves: number[]
}

const STORAGE_KEY = 'sb20'

function loadState(): AuthState {
  if (typeof window === 'undefined') return { token: null, userId: null, likes: [], saves: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: null, userId: null, likes: [], saves: [] }
  } catch {
    return { token: null, userId: null, likes: [], saves: [] }
  }
}

function saveState(state: AuthState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => loadState())

  const persist = useCallback((next: AuthState) => {
    setState(next)
    saveState(next)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    persist({ ...state, token: data.token, userId: data.user_id })
    return data
  }, [state, persist])

  const signup = useCallback(async (
    email: string, password: string, name: string, topics: string[]
  ) => {
    const data = await apiSignup(email, password, name, topics)
    persist({ ...state, token: data.token, userId: data.user_id })
    return data
  }, [state, persist])

  const logout = useCallback(() => {
    persist({ token: null, userId: null, likes: [], saves: [] })
  }, [persist])

  const toggleLike = useCallback((id: number) => {
    const likes = state.likes.includes(id)
      ? state.likes.filter(x => x !== id)
      : [...state.likes, id]
    persist({ ...state, likes })
    return likes.includes(id)
  }, [state, persist])

  const toggleSave = useCallback((id: number) => {
    const saves = state.saves.includes(id)
      ? state.saves.filter(x => x !== id)
      : [...state.saves, id]
    persist({ ...state, saves })
    return saves.includes(id)
  }, [state, persist])

  return {
    token:      state.token,
    userId:     state.userId,
    isLoggedIn: Boolean(state.token),
    likes:      state.likes,
    saves:      state.saves,
    login,
    signup,
    logout,
    toggleLike,
    toggleSave,
  }
}
