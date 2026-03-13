'use client'
import '@/styles/globals.css'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import BottomNav from '@/components/layout/BottomNav'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', move)

    let raf: number
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (dotRef.current)  { dotRef.current.style.left  = mx + 'px'; dotRef.current.style.top  = my + 'px' }
      if (ringRef.current) { ringRef.current.style.left = rx + 'px'; ringRef.current.style.top = ry + 'px' }
      raf = requestAnimationFrame(loop)
    }
    loop()

    const hoverOn  = () => document.body.classList.add('cursor-hover')
    const hoverOff = () => document.body.classList.remove('cursor-hover')
    const attach = () => {
      document.querySelectorAll('a,button,.clickable').forEach(el => {
        el.addEventListener('mouseenter', hoverOn)
        el.addEventListener('mouseleave', hoverOff)
      })
    }
    attach()
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    const attachReveal = () => document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => obs.observe(el))
    attachReveal()
    const mo2 = new MutationObserver(attachReveal)
    mo2.observe(document.body, { childList: true, subtree: true })

    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(raf); mo.disconnect(); mo2.disconnect() }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>8-Lines Group — Corporate Mobility, Bengaluru</title>
        <meta name="description" content="Bengaluru's premier asset-light corporate mobility platform. Earn 70% passive income or book premium SUVs." />
        <meta name="theme-color" content="#060806" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="8-Lines" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <div className="noise" />
        <div ref={dotRef}  className="cursor-dot"  style={{ top: 0, left: 0 }} />
        <div ref={ringRef} className="cursor-ring" style={{ top: 0, left: 0 }} />
        {children}
        <BottomNav />
        <Toaster position="bottom-right" toastOptions={{
          style: { 
            background: '#ffffff', 
            color: '#0C1D36', 
            border: '1px solid rgba(12,29,54,.1)', 
            borderLeft: '4px solid #F8931F', 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '11px', 
            fontWeight: '600',
            letterSpacing: '0.5px',
            borderRadius: '0px',
            boxShadow: '0 10px 30px rgba(12,29,54,.08)'
          }
        }} />
      </body>
    </html>
  )
}
