'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function InvestorRegisterPage() {
  const router = useRouter()
  const { sendOTP, verifyOTP } = useAuthStore()
  const [step, setStep] = useState<'details'|'otp'>('details')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [form, setForm] = useState({ name:'', phone:'', email:'' })
  const refs = useRef<(HTMLInputElement|null)[]>([])

  const handleSend = async () => {
    if (form.name.length < 2) { toast.error('Enter your full name'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit mobile required'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error('Valid email required'); return }
    setLoading(true)
    try { await sendOTP(form.phone, form.name, form.email); setStep('otp'); toast.success('OTP sent to +91 ' + form.phone) }
    catch { toast.error('Failed. Try again.') }
    finally { setLoading(false) }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) { toast.error('Enter 6-digit OTP'); return }
    setLoading(true)
    try { 
      await verifyOTP(form.phone, code); 
      toast.success('Account created!')
      router.push('/investor')
    }
    catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) refs.current[i+1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (data.length === 6) {
      setOtp(data.split(''))
      refs.current[5]?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(34,197,94,.03),transparent)'}} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-[460px] px-6 py-10 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <Link href="/" className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-navy inline-block mb-4 hover:scale-105 transition-transform duration-500">
            <em className="text-green not-italic">8</em>LINES
          </Link>
          <div className="text-xs font-semibold text-green tracking-wide uppercase">Investor Onboarding Protocol</div>
        </div>

        <div className="bg-white border border-navy/5 overflow-hidden shadow-2xl cut-lg">
          <div className="bg-navy/[0.02] border-b border-navy/5 px-8 py-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-ash tracking-wide uppercase">{step==='details' ? 'Account Creation' : 'Verify Identity'}</span>
            <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green animate-pulse shadow-glow-green"/></div>
          </div>
          
          <div className="p-10">
            {step==='details' && (
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-ash tracking-wider uppercase block mb-3 ml-1">Full Legal Name</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="As per official documents" 
                    className="w-full bg-navy/5 border border-navy/10 px-6 py-4 text-sm text-navy font-mono placeholder:text-navy/20 focus:border-green/20 outline-none transition-all font-medium"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-ash tracking-wider uppercase block mb-3 ml-1">Mobile Number</label>
                  <div className="flex gap-4">
                    <span className="bg-navy/5 border border-navy/10 px-5 py-4 flex items-center text-xs text-navy font-bold shrink-0">+91</span>
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))} placeholder="9XXXXXXXXX" 
                      className="flex-1 bg-navy/5 border border-navy/10 px-6 py-4 text-sm text-navy font-mono placeholder:text-navy/20 focus:border-green/20 outline-none transition-all font-medium"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-ash tracking-wider uppercase block mb-3 ml-1">Email Address</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" type="email" 
                    className="w-full bg-navy/5 border border-navy/10 px-6 py-4 text-sm text-navy font-mono placeholder:text-navy/20 focus:border-green/20 outline-none transition-all font-medium"/>
                </div>
                <button onClick={handleSend} disabled={loading} 
                  className="w-full bg-green text-white text-xs tracking-widest uppercase py-5 font-bold cut-lg hover:shadow-glow-green hover:bg-green/90 transition-all disabled:opacity-50 mt-4">
                  {loading ? 'INITIATING...' : 'CONTINUE →'}
                </button>
              </div>
            )}
            {step==='otp' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-sans text-3xl md:text-4xl text-navy font-bold tracking-tight mb-4 uppercase">VERIFY <span className="text-green">PROTOCOL.</span></h1>
                  <p className="text-xs text-navy/40 font-bold uppercase tracking-widest">// Sent to +91 {form.phone}</p>
                </div>

                <div className="flex justify-center gap-3">
                  {otp.map((v,i)=>(
                    <input key={i} ref={el=>{refs.current[i]=el}} value={v} onChange={e=>handleChange(i,e.target.value)}
                      onKeyDown={e=>handleKeyDown(i,e)} onPaste={handlePaste} maxLength={1}
                      className="w-12 h-16 bg-navy/5 border border-navy/10 text-center font-sans text-3xl text-green outline-none focus:border-green/30 transition-all font-bold"/>
                  ))}
                </div>
                
                <button onClick={handleVerify} disabled={loading||otp.join('').length!==6} 
                  className="w-full bg-green text-white text-xs tracking-widest uppercase py-5 font-bold cut-lg transition-all hover:bg-green/90 hover:shadow-glow-green">
                  {loading ? 'VERIFYING...' : 'SECURE REGISTRY →'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[10px] text-navy/30 font-black uppercase tracking-widest">
            Already have an investor account?{' '}
            <Link href="/investor/login" className="text-green hover:underline underline-offset-4 font-bold">Authenticate →</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
