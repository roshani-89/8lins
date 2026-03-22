'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { sendOTP, verifyOTP } = useAuthStore()
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState(['','','','','',''])
  const [step,    setStep]    = useState<'phone'|'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Valid 10-digit number required'); return }
    setLoading(true)
    try {
      await sendOTP(phone)
      setStep('otp')
      toast.success('OTP sent')
    } catch { toast.error('Failed to send OTP') }
    finally { setLoading(false) }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try {
      const user = await verifyOTP(phone, code)
      if (user?.role !== 'admin') {
        toast.error('Access denied — not an admin account')
        useAuthStore.getState().logout()
        return
      }
      toast.success('✓ Admin access granted')
      router.push('/admin')
    } catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  const handleOtpInput = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) document.getElementById(`a${i+1}`)?.focus()
  }

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`a${i-1}`)?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (data.length === 6) {
      const n = data.split('')
      setOtp(n)
    }
  }

  return (
    <main className="min-h-screen bg-[#F9F7F2] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange/5 rounded-full blur-[120px] pointer-events-none"/>

      <div className="relative z-10 w-full max-w-[420px] px-6 py-10">
        {/* logo */}
        <div className="text-center mb-12">
          <Link href="/" className="font-display text-5xl tracking-[8px] text-navy mb-3 inline-block hover:scale-105 transition-transform duration-500">
            <em className="text-orange not-italic">8</em>LINES
          </Link>
          <div className="flex items-center justify-center gap-2 text-[8px] tracking-[4px] text-orange/60 uppercase font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_8px_rgba(248,147,31,0.4)]" style={{animation:'blink 1.5s infinite'}}/>
            SYSTEM ROOT ACCESS // RESTRICTED
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl border border-navy/10 overflow-hidden shadow-2xl cut-lg">
          {/* header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-navy/5 bg-navy/[0.02]">
            <span className="text-[9px] tracking-[3px] text-navy/40 uppercase font-black">Executive Console v1.02</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red/40"/>
              <div className="w-2.5 h-2.5 rounded-full bg-amber/40"/>
              <div className="w-2.5 h-2.5 rounded-full bg-green/40"/>
            </div>
          </div>

          <div className="p-8">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl text-navy mb-1 leading-none uppercase tracking-tight font-black">ADMIN<br/><span className="text-orange">ACCESS.</span></h1>
                  <p className="text-[10px] text-navy/40 mb-8 font-medium uppercase tracking-widest leading-relaxed">// Input authorized executive mobile for OTP.</p>
                  <label className="text-[8px] tracking-[3px] text-navy/30 uppercase block mb-2 font-black ml-1">Admin Mobile</label>
                  <div className="flex gap-3">
                    <span className="bg-navy/5 border border-navy/10 px-4 flex items-center text-[11px] text-navy font-black shrink-0">+91</span>
                    <input value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      onKeyDown={e => e.key==='Enter' && handleSend()}
                      placeholder="9XXXXXXXXX"
                      className="flex-1 bg-navy/5 border border-navy/10 px-4 py-3 text-[14px] text-navy font-mono placeholder:text-navy/10 focus:border-orange/30 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <button onClick={handleSend} disabled={loading || phone.length !== 10}
                  className="w-full bg-orange text-white text-[10px] tracking-[4px] uppercase py-4 font-black cut-md hover:bg-orange/90 transition-all disabled:opacity-40 relative overflow-hidden group">
                  <span className="relative z-10">{loading ? 'Requesting...' : 'AUTHENTICATE →'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl text-navy mb-1 leading-none uppercase tracking-tight font-black">VERIFY<br/><span className="text-orange">OTP.</span></h1>
                  <div className="text-[9px] text-navy/40 mb-8 font-black uppercase tracking-widest">// OTP sent to executive <span className="text-orange font-mono">+91 {phone}</span></div>
                  <label className="text-[8px] tracking-[3px] text-navy/30 uppercase block mb-3 font-black ml-1">Authorize Code</label>
                  <div className="flex justify-center gap-2">
                    {otp.map((v,i) => (
                      <input key={i} id={`a${i}`}
                        value={v}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        onPaste={handlePaste}
                        maxLength={1}
                        className="w-10 h-14 bg-navy/5 border border-navy/10 text-center text-xl text-green font-display focus:border-orange/40 outline-none transition-all font-black shadow-inner" />
                    ))}
                  </div>
                </div>
                <button onClick={handleVerify} disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-orange text-white text-[10px] tracking-[4px] uppercase py-4 font-black cut-md hover:bg-orange/90 transition-all disabled:opacity-40">
                  {loading ? 'Verifying...' : 'VERIFY & ENTER CONSOLE →'}
                </button>
                <button onClick={() => { setStep('phone'); setOtp(['','','','','','']) }}
                  className="w-full text-[9px] tracking-[2px] text-navy/40 hover:text-navy uppercase transition-colors font-bold mt-2">
                  ← Previous Page
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center space-y-3">
          <p className="text-[8px] tracking-[3px] text-navy/10 font-black uppercase">IP ACCESS LOGGED · SYSTEM_SESSION_ACTIVE</p>
          <Link href="/" className="text-[9px] text-navy/30 hover:text-navy transition-colors font-black border-b border-navy/5 hover:border-navy/10 pb-0.5 uppercase tracking-widest">← Return to Root Protocol</Link>
        </div>
      </div>
    </main>
  )
}
