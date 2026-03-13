'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')
  const { sendOTP, verifyOTP } = useAuthStore()
  const [step, setStep] = useState<'details'|'otp'>('details')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['','','','','',''])
  const [form, setForm] = useState({ name:'', phone:'', email:'' })

  const handleSend = async () => {
    if (form.name.length < 2) { toast.error('Enter your full name'); return }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Valid 10-digit mobile required'); return }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error('Valid email required'); return }
    setLoading(true)
    try { await sendOTP(form.phone); setStep('otp'); toast.success('OTP sent to +91 ' + form.phone) }
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
      if (intent === 'fleet') {
        router.push('/fleet')
      } else if (intent === 'investor') {
        router.push('/investor')
      } else {
        router.push('/dashboard')
      }
    }
    catch { toast.error('Invalid OTP') }
    finally { setLoading(false) }
  }
  const handleOtpInput = (i:number, val:string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[i] = val; setOtp(next)
    if (val && i < 5) document.getElementById(`r${i+1}`)?.focus()
  }
  const handleOtpKey = (i:number, e:React.KeyboardEvent) => {
    if (e.key==='Backspace' && !otp[i] && i>0) document.getElementById(`r${i-1}`)?.focus()
  }
  return (
    <main className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(12,29,54,.02),transparent)'}} />
      <div className="w-full max-w-[420px] px-6 py-10 relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-5xl tracking-[8px] text-navy inline-block mb-3">
            <em className="text-green not-italic">8</em>LINES
          </Link>
          <div className="text-[8px] tracking-[4px] text-green uppercase font-bold">8-Lines Registration</div>
        </div>
        <div className="bg-void border border-navy/10 overflow-hidden shadow-2xl">
          <div className="bg-navy/5 border-b border-navy/10 px-6 py-4 flex items-center justify-between">
            <span className="text-[9px] tracking-[3px] text-navy uppercase font-bold">{step==='details' ? 'Account Creation' : 'Verify Identity'}</span>
            <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-red/50"/><div className="w-2 h-2 rounded-full bg-amber/50"/><div className="w-2 h-2 rounded-full bg-green/70"/></div>
          </div>
          <div className="p-8">
            {step==='details' && (
              <div className="space-y-6">
                <div>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Full Legal Name</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="As per official documents" 
                    className="w-full bg-void border border-navy/10 px-4 py-3 text-[13px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all font-medium"/>
                </div>
                <div>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Mobile Number</label>
                  <div className="flex">
                    <span className="bg-navy/5 border border-navy/10 border-r-0 px-4 flex items-center text-[11px] text-ash font-bold shrink-0">+91</span>
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value.replace(/\D/g,'').slice(0,10)}))} placeholder="9XXXXXXXXX" 
                      className="flex-1 bg-void border border-navy/10 px-4 py-3 text-[13px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all font-medium"/>
                  </div>
                </div>
                <div>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold ml-1">Email Address</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" type="email" 
                    className="w-full bg-void border border-navy/10 px-4 py-3 text-[13px] text-navy font-mono placeholder:text-navy/20 focus:border-green outline-none transition-all font-medium"/>
                </div>
                <button onClick={handleSend} disabled={loading} 
                  className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-bold cut-lg hover:shadow-[0_0_40px_rgba(34,197,94,.3)] transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'SEND OTP →'}
                </button>
              </div>
            )}
            {step==='otp' && (
              <div className="space-y-6">
                <div className="text-center py-2 bg-navy/5 border border-navy/5 text-[11px] text-navy font-bold">{form.phone}</div>
                <div>
                  <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-3 font-bold ml-1">Enter Verification Code</label>
                  <div className="flex justify-center gap-2">
                    {otp.map((v,i)=>(
                      <input key={i} id={`r${i}`} value={v} onChange={e=>handleOtpInput(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)} maxLength={1}
                        className="w-12 h-14 bg-void border border-navy/10 text-center text-2xl text-green font-display focus:border-green outline-none transition-all shadow-sm"/>
                    ))}
                  </div>
                  <p className="text-[8px] text-ash/40 mt-2 font-mono text-center uppercase tracking-[2px]">Dev Bypass: <span className="text-green">123456</span></p>
                </div>
                <button onClick={handleVerify} disabled={loading||otp.join('').length!==6} 
                  className="w-full bg-green text-void text-[10px] tracking-[4px] uppercase py-4 font-bold cut-lg disabled:opacity-40 transition-all hover:bg-green-dim">
                  {loading ? 'Verifying...' : 'CREATE ACCOUNT & ENTER DASHBOARD →'}
                </button>
                <button onClick={()=>{setStep('details');setOtp(['','','','','',''])}} className="w-full text-[9px] text-ash hover:text-navy uppercase font-bold transition-colors">← Edit Profile</button>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-6 space-y-3">
          <p className="text-[9px] text-fog font-bold">
            Already registered?{' '}
            <Link href={`/login${intent ? `?intent=${intent}` : ''}`} className="text-green hover:underline">Login here →</Link>
          </p>
          <div className="flex justify-center gap-4 text-[9px] text-ash font-bold">
            <Link href="/register?intent=fleet" className={`${intent === 'fleet' ? 'text-orange' : 'hover:text-green'} transition-colors`}>Book a Drive</Link>
            <span>·</span>
            <Link href="/register?intent=investor" className={`${intent === 'investor' ? 'text-green' : 'hover:text-green'} transition-colors`}>Deploy Asset</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
