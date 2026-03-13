'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { MainLogo } from '@/components/ui/Logos'

const NAV_LINKS = [
  { href: '/',         label: 'Home'       },
  { href: '/about',    label: 'Hub & Team' },
  { href: '/corporate',label: 'B2B Fleet'  },
]

export default function Navbar() {
  const path = usePathname()
  const { user, logout, loadUser } = useAuthStore()
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { loadUser() }, [])

  if (path.startsWith('/dashboard') || path.startsWith('/admin')) return null

  const isAdmin = user?.role === 'admin'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-void/90 backdrop-blur-xl border-b border-navy/5 shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center h-[68px] px-6 lg:px-12 gap-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <MainLogo className="h-9 w-auto text-navy" />
        </Link>

        {/* NAV LINKS desktop */}
        <nav className="hidden md:flex gap-7 flex-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-[9px] tracking-[3px] uppercase relative group transition-colors ${path === l.href ? 'text-green' : 'text-navy hover:text-green'}`}>
              {l.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-green transition-all duration-300 ${path === l.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 ml-auto">

          {/* live pulse */}
          <div className="hidden lg:flex items-center gap-1.5 text-[8px] text-fog mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:'blink 2s infinite'}}/>
            11 Live
          </div>

          {/* NOT LOGGED IN */}
          {/* PUBLIC VIEW (NOT LOGGED IN) */}
          {!user && (
            <>
              <Link href="/admin-login"
                className="flex items-center gap-1.5 text-[8px] tracking-[2px] uppercase text-navy/40 hover:text-orange transition-all px-3 font-bold group">
                <span className="w-1 h-1 rounded-full bg-navy/20 group-hover:bg-orange"/>
                Admin
              </Link>
              <Link href="/login"
                className="hidden lg:block text-[9px] tracking-[3px] uppercase border border-orange/40 text-orange px-5 py-2 font-bold transition-all hover:bg-orange hover:text-void hover:shadow-[0_0_24px_rgba(248,147,31,.3)]">
                Book a Drive
              </Link>
              <Link href="/login"
                className="hidden lg:block text-[9px] tracking-[3px] uppercase bg-green text-void px-5 py-2 font-bold transition-all hover:shadow-[0_0_24px_rgba(18,51,43,.4)]">
                Deploy Asset
              </Link>
            </>
          )}

          {/* INVESTOR LOGGED IN */}
          {user && !isAdmin && (
            <>
              <Link href="/dashboard"
                className="text-[9px] tracking-[3px] uppercase bg-green text-void px-5 py-2 font-semibold transition-all hover:shadow-[0_0_24px_rgba(248,147,31,.5)]">
                My Dashboard →
              </Link>
              <button onClick={logout}
                className="text-[8px] tracking-[2px] uppercase text-ash hover:text-red border border-navy/10 px-3 py-2 transition-all">
                Logout
              </button>
            </>
          )}

          {/* ADMIN LOGGED IN */}
          {user && isAdmin && (
            <>
              <Link href="/dashboard"
                className="text-[8px] tracking-[2px] uppercase text-slate border border-navy/10 px-3 py-2 transition-all hover:text-navy hover:border-navy/20">
                Investor View
              </Link>
              <Link href="/admin"
                className="flex items-center gap-2 text-[9px] tracking-[3px] uppercase bg-green text-void px-5 py-2 font-semibold transition-all hover:shadow-[0_0_24px_rgba(248,147,31,.5)]">
                <span className="w-1.5 h-1.5 rounded-full bg-void" style={{animation:'blink 1.5s infinite'}}/>
                Admin Panel
              </Link>
              <button onClick={logout}
                className="text-[8px] tracking-[2px] uppercase text-ash hover:text-red border border-navy/10 px-3 py-2 transition-all">
                Logout
              </button>
            </>
          )}

          {/* HAMBURGER mobile */}
          <button onClick={() => setOpen(o => !o)} className="md:hidden flex flex-col gap-[5px] p-2 ml-1">
            <span className={`w-5 h-px bg-green transition-all duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`}/>
            <span className={`w-5 h-px bg-green transition-all duration-300 ${open ? 'opacity-0' : ''}`}/>
            <span className={`w-5 h-px bg-green transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`}/>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-void border-b border-navy/10 px-6 py-5 flex flex-col gap-3 shadow-xl">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`text-[11px] tracking-[3px] uppercase py-2 border-b border-navy/5 ${path === l.href ? 'text-green' : 'text-ash'}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
          {!user && <>
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-center text-[9px] tracking-[2px] uppercase text-orange border border-orange/40 py-3 font-bold hover:bg-orange hover:text-void transition-all">
                Book a Drive
              </Link>
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-center text-[10px] tracking-[3px] uppercase bg-green text-void py-3 font-bold">
                Deploy Asset →
              </Link>
              <Link href="/admin-login" onClick={() => setOpen(false)}
                className="text-center text-[8px] tracking-[2px] uppercase text-navy/30 border border-navy/10 py-2">
                ⚫ Admin Access
              </Link>
            </>}
            {user && !isAdmin &&
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="text-center text-[10px] tracking-[3px] uppercase bg-green text-void py-3 font-semibold">
                My Dashboard →
              </Link>
            }
            {user && isAdmin && <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="text-center text-[9px] tracking-[2px] uppercase text-green border border-green/30 py-3">
                Investor View
              </Link>
              <Link href="/admin" onClick={() => setOpen(false)}
                className="text-center text-[10px] tracking-[3px] uppercase bg-green text-void py-3 font-semibold">
                Admin Panel
              </Link>
            </>}
          </div>
        </div>
      )}
    </header>
  )
}
