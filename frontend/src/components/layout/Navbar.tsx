'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { MainLogo, DynamicLogo } from '@/components/ui/Logos'

const NAV_LINKS = [
  { href: '/',          label: 'Home'       },
  { href: '/about',     label: 'Hub & Team' },
  { href: '/corporate', label: 'B2B Fleet'  },
]

export default function Navbar({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const path     = usePathname()
  const { user, logout, loadUser } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [userType, setUserType] = useState('investor')

  useEffect(() => {
    setMounted(true)
    setUserType(localStorage.getItem('8l_user_type') || 'investor')
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { loadUser() }, [])

  if (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/drive/dashboard')) return null

  const isAdmin   = user?.role === 'admin'
  const isDarkPage = path.startsWith('/admin') || path.startsWith('/dashboard')

  /* ── scrolled glass styles ───────────────────────────── */
  const headerCls = scrolled
    ? 'bg-white/[0.92] border-navy/[0.07] shadow-[0_8px_32px_rgba(12,29,54,0.10)] backdrop-blur-2xl'
    : 'bg-transparent border-transparent'

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          border-b transition-all duration-500
          ${headerCls}
        `}
      >
        {/* top accent line — only when scrolled */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-700
            bg-gradient-to-r from-transparent via-orange to-transparent
            ${scrolled ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center h-[76px] gap-8">

          {/* ── LOGO ─────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center shrink-0 group"
            aria-label="8-Lines Home"
          >
            <DynamicLogo
              className="h-10 md:h-12 w-auto transition-all duration-300 group-hover:opacity-80"
              dark={false}
              scrolled={scrolled}
            />
          </Link>

          {/* ── NAV LINKS desktop ────────────────────────────── */}
          <nav className="hidden md:flex gap-10 lg:gap-14 flex-1 justify-center" aria-label="Main navigation">
            {NAV_LINKS.map(l => {
              const active = path === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`
                    relative text-[13px] tracking-[2.5px] uppercase font-display font-black
                    group flex flex-col items-center gap-0.5 py-1
                    transition-colors duration-300 whitespace-nowrap
                    ${active
                      ? 'text-orange'
                      : 'text-navy/75 hover:text-navy'}
                  `}
                >
                  {l.label}
                  {/* animated underline */}
                  <span
                    className={`
                      absolute -bottom-0.5 left-0 h-[2px] rounded-full
                      bg-orange shadow-[0_0_8px_rgba(248,147,31,0.45)]
                      transition-all duration-400
                      ${active ? 'w-full' : 'w-0 group-hover:w-full'}
                    `}
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── RIGHT SIDE ───────────────────────────────────── */}
          <div className="flex items-center gap-3 ml-auto">

            {/* live pulse badge */}
            <div className="hidden lg:flex items-center gap-2 text-[9px] font-black tracking-[2px] uppercase
              border border-green/25 bg-green/[0.06] text-green px-3 py-1.5 rounded-sm
              shadow-[0_0_16px_rgba(34,197,94,0.08)]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_rgba(34,197,94,0.7)]"
                style={{ animation: 'blink 2s infinite' }}
              />
              11 LIVE ASSETS
            </div>

            {/* ── NOT LOGGED IN ─────────────────────────────── */}
            {!user && (
              <>
                {/* subtle system link */}
                <Link
                  href="/admin-login"
                  className="hidden lg:flex items-center gap-1.5 text-[9px] tracking-[2px] uppercase
                    font-black text-navy/30 hover:text-navy/60 transition-colors duration-300 px-2"
                >
                  <span className="w-1 h-1 rounded-full bg-navy/20 group-hover:bg-orange transition-colors" />
                  SYSTEM
                </Link>

                {/* DRIVE button — outlined */}
                <Link
                  href="/drive/login"
                  className="hidden lg:inline-flex items-center gap-2
                    text-[10px] tracking-[3px] uppercase font-black
                    border-2 border-navy/15 text-navy
                    px-6 py-2.5 cut-md
                    hover:border-navy hover:bg-navy hover:text-white
                    transition-all duration-300
                    hover:shadow-[0_4px_24px_rgba(12,29,54,0.18)]"
                >
                  Drive
                </Link>

                {/* DEPLOY button — filled orange */}
                <Link
                  href="/investor/login"
                  className="hidden lg:inline-flex items-center gap-2
                    text-[10px] tracking-[3px] uppercase font-black
                    bg-orange text-white
                    px-6 py-2.5 cut-md
                    hover:bg-orange-dim
                    hover:shadow-[0_4px_28px_rgba(248,147,31,0.45)]
                    hover:-translate-y-px
                    active:translate-y-0
                    transition-all duration-300"
                >
                  Deploy
                  <span className="text-white/60 font-normal">→</span>
                </Link>
              </>
            )}

            {/* ── INVESTOR / RENTER LOGGED IN ──────────────────────────── */}
            {user && !isAdmin && (
              <>
                <Link
                  href={userType === 'renter' ? "/drive/dashboard" : "/dashboard"}
                  className={`text-[9px] tracking-[3px] uppercase font-black text-white px-5 py-2.5 cut-md hover:-translate-y-px transition-all duration-300 ${userType === 'renter' ? 'bg-navy hover:shadow-[0_4px_24px_rgba(12,29,54,0.4)]' : 'bg-green hover:shadow-[0_4px_24px_rgba(34,197,94,0.4)]'}`}
                >
                  My Dashboard →
                </Link>
                <button
                  onClick={logout}
                  className="text-[8px] tracking-[2px] uppercase font-black px-3 py-2
                    text-navy/40 hover:text-red-500 border border-navy/10
                    hover:border-red-200 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}

            {/* ── ADMIN LOGGED IN ────────────────────────────── */}
            {user && isAdmin && (
              <>
                <Link
                  href="/dashboard"
                  className="text-[8px] tracking-[2px] uppercase font-black px-3 py-2
                    border border-navy/10 text-navy/40 hover:text-navy
                    hover:border-navy/20 transition-all duration-300"
                >
                  Investor View
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-[9px] tracking-[3px] uppercase font-black
                    bg-green text-white px-5 py-2.5 cut-md
                    hover:shadow-[0_4px_24px_rgba(34,197,94,0.4)]
                    hover:-translate-y-px transition-all duration-300"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    style={{ animation: 'blink 1.5s infinite' }}
                  />
                  Admin Panel
                </Link>
                <button
                  onClick={logout}
                  className="text-[8px] tracking-[2px] uppercase font-black px-3 py-2
                    text-navy/40 hover:text-red-500 border border-navy/10
                    hover:border-red-200 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}

            {/* ── HAMBURGER mobile ───────────────────────────── */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="md:hidden flex flex-col gap-[5px] p-2 ml-1 group"
            >
              <span className={`block w-5 h-[1.5px] bg-navy transition-all duration-300 origin-center
                ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-navy transition-all duration-300
                ${open ? 'opacity-0 -translate-x-2' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-navy transition-all duration-300 origin-center
                ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ─────────────────────────────────── */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-500 ease-in-out
            ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
            bg-white/[0.97] backdrop-blur-2xl border-t border-navy/[0.06]
            shadow-[0_20px_60px_rgba(12,29,54,0.12)]
          `}
        >
          <div className="px-6 pt-6 pb-8 flex flex-col gap-1">
            {/* nav links */}
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`
                  py-4 border-b border-navy/[0.06]
                  text-[12px] tracking-[5px] uppercase font-black
                  flex items-center justify-between
                  transition-colors duration-200
                  ${path === l.href
                    ? 'text-orange'
                    : 'text-navy/60 hover:text-navy'}
                `}
              >
                {l.label}
                {path === l.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_6px_rgba(248,147,31,0.6)]" />
                )}
              </Link>
            ))}

            {/* CTA buttons */}
            <div className="pt-5 flex flex-col gap-3">
              {!user && (
                <>
                  <Link
                    href="/drive/login"
                    onClick={() => setOpen(false)}
                    className="text-center text-[10px] tracking-[4px] uppercase font-black
                      text-navy border-2 border-navy/15 py-4 cut-md
                      hover:bg-navy hover:text-white transition-all"
                  >
                    Book a Drive
                  </Link>
                  <Link
                    href="/investor/login"
                    onClick={() => setOpen(false)}
                    className="text-center text-[11px] tracking-[5px] uppercase font-black
                      bg-orange text-white py-4 cut-md
                      shadow-[0_4px_20px_rgba(248,147,31,0.3)]"
                  >
                    Deploy Asset →
                  </Link>
                  <Link
                    href="/admin-login"
                    onClick={() => setOpen(false)}
                    className="text-center text-[9px] tracking-[4px] uppercase font-black
                      text-navy/20 py-3"
                  >
                    ⚫ SYSTEM ROOT ACCESS
                  </Link>
                </>
              )}
              {user && !isAdmin && (
                <Link
                  href={userType === 'renter' ? "/drive/dashboard" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className={`text-center text-[11px] tracking-[4px] uppercase font-black text-white py-4 cut-md ${userType === 'renter' ? 'bg-navy' : 'bg-green'}`}
                >
                  My Dashboard →
                </Link>
              )}
              {user && isAdmin && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-center text-[10px] tracking-[4px] uppercase font-black
                      text-navy/40 border border-navy/10 py-4"
                  >
                    Investor View
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="text-center text-[11px] tracking-[5px] uppercase font-black
                      bg-green text-white py-4 cut-md"
                  >
                    Admin Panel
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Keyframes for blink (inline, safe fallback) ── */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes scroll-down {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </>
  )
}
