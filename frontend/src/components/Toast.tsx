import { useEffect, useState } from 'react'

export default function Toast({ message }: { message: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) { setVisible(true) }
    else { setTimeout(() => setVisible(false), 300) }
  }, [message])

  if (!message && !visible) return null

  return (
    <div style={{
      position: 'absolute', top: 70, left: '50%',
      transform: `translateX(-50%) translateY(${message ? 0 : -10}px) scale(${message ? 1 : 0.95})`,
      background: 'rgba(18, 34, 72, 0.95)', backdropFilter: 'blur(24px)',
      color: '#eef2ff', padding: '9px 20px', borderRadius: 100,
      fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
      zIndex: 8000, opacity: message ? 1 : 0, pointerEvents: 'none',
      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      border: '1px solid rgba(0,62,145,0.22)',
    }}>
      {message}
    </div>
  )
}
