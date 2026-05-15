import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import HomeView from '@/components/HomeView'
import ExploreView from '@/components/ExploreView'
import BookmarksView from '@/components/BookmarksView'
import ProfileView from '@/components/ProfileView'
import Onboarding from '@/components/Onboarding'
import ArticleOverlay from '@/components/ArticleOverlay'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import Toast from '@/components/Toast'
import Splash from '@/components/Splash'
import { useAuth } from '@/hooks/useAuth'
import type { Article } from '@/types'

export type ViewName = 'home' | 'explore' | 'bookmarks' | 'profile'

export default function Home() {
  const auth = useAuth()
  const [mounted, setMounted] = useState(false)
  const [splashDone, setSplashDone] = useState(false)
  const [view, setView] = useState<ViewName>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openArticle, setOpenArticle] = useState<Article | null>(null)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Splash timer
  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setSplashDone(true), auth.isLoggedIn ? 1600 : 0)
    return () => clearTimeout(t)
  }, [mounted, auth.isLoggedIn])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }, [])

  const navigateTo = useCallback((v: ViewName) => {
    setView(v)
    setSidebarOpen(false)
  }, [])

  if (!mounted) return null

  // Show onboarding if not logged in and splash done
  if (!auth.isLoggedIn && splashDone) {
    return (
      <>
        <Head><title>SherrByte — News Intelligence</title></Head>
        <div className="phone-shell">
          <Toast message={toast} />
          <Onboarding auth={auth} onDone={() => setSplashDone(true)} showToast={showToast} />
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>SherrByte — News Intelligence</title>
        <meta name="description" content="AI-powered personalised Indian news" />
      </Head>

      <div
        className="phone-shell"
        style={{
          position: 'fixed', inset: 0,
          background: 'var(--bg, #060e1f)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          maxWidth: 440, margin: '0 auto',
        }}
      >
        {/* Splash */}
        {!splashDone && <Splash onDone={() => setSplashDone(true)} />}

        <Toast message={toast} />

        {/* Overlay for sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute', inset: 0, zIndex: 899,
              background: 'rgba(10,8,20,0.7)', backdropFilter: 'blur(4px)',
            }}
          />
        )}

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNav={navigateTo}
          onLogout={() => { auth.logout(); showToast('👋 Signed out') }}
          isLoggedIn={auth.isLoggedIn}
        />

        <Header
          view={view}
          onMenu={() => setSidebarOpen(true)}
          onTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          theme={theme}
          onProfile={() => navigateTo('profile')}
          isLoggedIn={auth.isLoggedIn}
        />

        {/* Views */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <HomeView
            active={view === 'home'}
            auth={auth}
            onArticle={setOpenArticle}
            showToast={showToast}
          />
          <ExploreView
            active={view === 'explore'}
            onArticle={setOpenArticle}
            showToast={showToast}
          />
          <BookmarksView
            active={view === 'bookmarks'}
            auth={auth}
            onArticle={setOpenArticle}
            showToast={showToast}
          />
          <ProfileView
            active={view === 'profile'}
            auth={auth}
            showToast={showToast}
            savedCount={auth.saves.length}
          />
        </div>

        <ArticleOverlay
          article={openArticle}
          onClose={() => setOpenArticle(null)}
          auth={auth}
          showToast={showToast}
        />

        <BottomNav view={view} onNav={navigateTo} savedCount={auth.saves.length} />
      </div>
    </>
  )
}
