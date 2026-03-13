'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

const LINKS = [
  { href: '/',         icon: '🏠', label: 'Home' },
  { href: '/fleet',    icon: '🚙', label: 'Book' },
  { href: '/investor', icon: '📈', label: 'Deploy' },
  { href: '/dashboard',icon: '📊', label: 'Earn' },
]

export default function BottomNav() {
  const path = usePathname()
  const { user } = useAuthStore()

  // Don't show on admin pages
  if (path.startsWith('/admin')) return null

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[60] safe-bottom">
      <div className="bg-void/80 backdrop-blur-2xl border border-navy/10 h-16 rounded-3xl flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(12,29,54,.15)]">
        {LINKS.map(l => {
          const isActive = path === l.href || (l.href!=='/' && path.startsWith(l.href))
          const href = (l.href === '/dashboard' && !user) ? '/login' : l.href
          
          return (
            <Link key={l.href} href={href} className="flex flex-col items-center justify-center gap-1 group">
              <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0'}`}>
                {l.icon}
              </span>
              <span className={`text-[8px] tracking-[2px] uppercase font-bold transition-all ${isActive ? 'text-green' : 'text-ash opacity-40 group-hover:opacity-100'}`}>
                {l.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-green absolute -bottom-1" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
