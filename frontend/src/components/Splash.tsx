import { useEffect, useState } from 'react'

export default function Splash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setGone(true); setTimeout(onDone, 800) }, 1600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at 40% 35%, #041642 0%, #060e1f 60%, #020b1a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        opacity: gone ? 0 : 1, visibility: gone ? 'hidden' : 'visible',
        transition: 'opacity 0.8s ease, visibility 0.8s',
      }}
    >
      <div style={{
        width: 88, height: 88, borderRadius: 28,
        background: 'linear-gradient(135deg, #041642, #002063 50%, #1565e8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.4rem',
        boxShadow: '0 0 0 1px rgba(79,107,212,0.5), 0 0 40px rgba(44,61,143,0.6)',
      }}>
        ⚡
      </div>
      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '2.2rem', fontWeight: 700, letterSpacing: -1.5, color: '#F4F3FF' }}>
        Sherr<span style={{ color: '#1565e8' }}>Byte</span>
      </div>
      <div style={{ fontSize: '0.65rem', color: '#4a6898', letterSpacing: 4, textTransform: 'uppercase' }}>
        Your world, curated
      </div>
      <div style={{ width: 48, height: 2, background: 'rgba(0,62,145,0.22)', borderRadius: 100, overflow: 'hidden', marginTop: 4 }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, #002063, #1565e8)',
          borderRadius: 100,
          animation: 'spLoad 1.6s ease forwards',
        }} />
      </div>
      <style>{`@keyframes spLoad{0%{width:0}60%{width:70%}100%{width:100%}}`}</style>
    </div>
  )
}
