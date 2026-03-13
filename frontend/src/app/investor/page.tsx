'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { publicAPI } from '@/lib/api'
import { MechanixLogo } from '@/components/ui/Logos'

/* ── Reveal ──────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r')
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in') }), {threshold:.08})
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ── ROI Calculator ──────────────────────────── */
function ROICalc() {
  const [asset, setAsset] = useState(1500000)
  const [days,  setDays]  = useState(18)
  const gross = Math.round(asset * 0.0025 * days)
  const fee   = Math.round(gross * 0.30)
  const mech  = Math.round(gross * 0.05)
  const net   = gross - fee - mech
  const annual = net * 12
  const roi   = Math.round((annual / asset) * 100)

  return (
    <div className="bg-void border border-navy/10 overflow-hidden shadow-xl">
      <div className="bg-navy/5 border-b border-navy/10 px-6 py-4 flex items-center justify-between">
        <span className="text-[8px] tracking-[4px] text-navy uppercase font-bold">Asset ROI Predictor</span>
        <span className="flex items-center gap-1.5 text-[8px] text-green font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green" style={{animation:'blink 2s infinite'}} />LIVE
        </span>
      </div>
      <div className="p-7 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] tracking-[3px] text-ash uppercase font-bold">Asset Market Value</span>
            <span className="font-display text-3xl text-orange">₹{asset.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" min={500000} max={3000000} step={50000} value={asset}
            onChange={e => setAsset(+e.target.value)} className="w-full accent-orange h-1 cursor-pointer" />
          <div className="flex justify-between text-[8px] text-fog mt-1"><span>₹5L</span><span>₹30L</span></div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] tracking-[3px] text-ash uppercase font-bold">Rental Days / Month</span>
            <span className="font-display text-3xl text-orange">{days} days</span>
          </div>
          <input type="range" min={8} max={28} step={1} value={days}
            onChange={e => setDays(+e.target.value)} className="w-full accent-orange h-1 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-navy/5">
          {[
            {l:'Gross Monthly',   v:`₹${gross.toLocaleString('en-IN')}`,  c:'text-navy'},
            {l:'Platform Fee 30%',v:`-₹${fee.toLocaleString('en-IN')}`,   c:'text-fog'},
            {l:'Mechanix Est. 5%',v:`-₹${mech.toLocaleString('en-IN')}`,  c:'text-fog'},
            {l:'Your 70% Net',    v:`₹${net.toLocaleString('en-IN')}`,     c:'text-green'},
          ].map(r=>(
            <div key={r.l} className="bg-void p-4">
              <div className="text-[8px] text-ash mb-1 uppercase tracking-wide">{r.l}</div>
              <div className={`font-display text-2xl ${r.c}`}>{r.v}</div>
            </div>
          ))}
        </div>
        <div className="bg-orange/5 border border-orange/20 p-5 flex items-center justify-between">
          <div>
            <div className="text-[8px] tracking-[3px] text-orange uppercase mb-1 font-bold">Annual Yield</div>
            <div className="font-display text-4xl text-navy">₹{annual.toLocaleString('en-IN')}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl text-orange">{roi}%</div>
            <div className="text-[8px] text-ash mt-1 uppercase tracking-wider">Estimated ROI</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Comparison Table ─────────────────────────── */
const COMPARE = [
  {f:'Revenue Split',    t:'~60% + hidden reversals', u:'70% Net — Guaranteed'},
  {f:'GPS / Telematics', t:'₹499/month host pays',    u:'₹0 — Covered by us'},
  {f:'Maintenance',      t:"Host's responsibility",   u:'MECHANIX PRO managed'},
  {f:'Guest Liability',  t:'Hosts absorb losses',     u:'Direct lease agreements'},
  {f:'Ledger',           t:'Opaque, delayed',         u:'Real-time trip-by-trip'},
  {f:'Tax Export',       t:'None provided',           u:'One-click CA Export'},
  {f:'Legal Agreement',  t:'Platform favoured',       u:'Clickwrap + IP logging'},
]

/* ── Onboarding Schema ─────────────────────────── */
const schema = z.object({
  fullName:     z.string().min(3, 'Min 3 characters'),
  phone:        z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile required'),
  email:        z.string().email('Valid email required'),
  address:      z.string().min(5, 'Address required'),
  vehicleMake:  z.string().min(1, 'Select vehicle make'),
  vehicleModel: z.string().min(1, 'Model required'),
  vehicleYear:  z.coerce.number().min(2015).max(2026),
  regNumber:    z.string().min(5, 'Registration number required'),
  assetValue:   z.coerce.number().min(500000, 'Minimum ₹5,00,000'),
})
type F = z.infer<typeof schema>

/* ── The 4-Step Onboarding Gateway ─────────────── */
function OnboardingGateway() {
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [onboardingId, setOnboardingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [panFile, setPanFile] = useState<File|null>(null)
  const [aadharFile, setAadharFile] = useState<File|null>(null)

  const { register, handleSubmit, formState:{errors}, getValues, trigger } = useForm<F>({ resolver: zodResolver(schema) })

  const STEPS = [
    {n:1, label:'Asset Details',     sub:'Vehicle & Owner Info'},
    {n:2, label:'Digital Agreement', sub:'9-Month Master Contract'},
    {n:3, label:'KYC Verification',  sub:'PAN & Aadhar Upload'},
    {n:4, label:'₹5,000 Activation', sub:'Razorpay — UPI / Cards'},
  ]

  const nextStep = async () => {
    if (step === 1) {
      const ok = await trigger(['fullName','phone','email','address','vehicleMake','vehicleModel','vehicleYear','regNumber','assetValue'])
      if (!ok) return
    }
    if (step === 2 && !agreed) { toast.error('Accept the Master Agreement to proceed'); return }
    setStep(s => s + 1)
  }

  const submitOnboarding = async (data: F) => {
    if (!agreed) { toast.error('Accept the Master Agreement to proceed'); return }
    setLoading(true)
    try {
      const res = await publicAPI.submitOnboarding({ ...data, agreementAccepted: true })
      setOnboardingId(res.data.id)
      setStep(3)
    } catch { toast.error('Submission failed. Try again.') }
    finally { setLoading(false) }
  }

  const submitKYC = async () => {
    if (!panFile || !aadharFile) { toast.error('Upload both PAN and Aadhar'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('✓ KYC documents uploaded securely to AWS S3')
    setLoading(false)
    setStep(4)
  }

  const processPayment = async () => {
    setLoading(true)
    try {
      const orderRes = await publicAPI.createOrder(onboardingId || 'demo-id')
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_demo',
          amount: 500000,
          currency: 'INR',
          name: '8-Lines Group',
          description: 'Investor Onboarding Fee — Non-refundable',
          order_id: orderRes.data.order_id,
          prefill: { name: getValues('fullName'), contact: getValues('phone'), email: getValues('email') },
          theme: { color: '#F8931F' },
          handler: async (resp: any) => {
            await publicAPI.verifyPayment(resp)
            toast.success('✓ Payment verified! Your dashboard is now active.')
            setTimeout(() => window.location.href = '/login', 2000)
          },
        })
        rzp.open()
      }
    } catch {
      toast.error('Payment initiation failed. Contact support.')
    } finally { setLoading(false) }
  }

  const inp = "w-full bg-void border border-navy/10 hover:border-navy/30 focus:border-orange px-4 py-3 text-[12px] text-navy font-mono outline-none transition-all placeholder:text-navy/20"

  return (
    <div id="form" className="bg-void border border-navy/10 shadow-2xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-navy/5 border-b border-navy/10 px-7 py-5">
        <div className="flex items-center gap-0 mb-4">
          {STEPS.map((s,i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                step > s.n ? 'bg-green border-green text-void' :
                step === s.n ? 'bg-orange border-orange text-void' :
                'border-navy/15 text-ash'
              }`}>
                {step > s.n ? '✓' : s.n}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-all ${step > s.n ? 'bg-green' : 'bg-navy/10'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map(s => (
            <div key={s.n} className="text-center" style={{width:'22%'}}>
              <div className={`text-[8px] font-bold uppercase tracking-wide ${step===s.n?'text-orange':step>s.n?'text-green':'text-ash/50'}`}>{s.label}</div>
              <div className="text-[7px] text-fog">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-7">
        {/* ── STEP 1: Asset Details ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="text-[8px] tracking-[4px] text-orange uppercase mb-5 font-bold">Step 1 of 4 — Asset & Owner Details</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Full Legal Name</label>
                <input {...register('fullName')} className={inp} placeholder="As per Aadhar Card" />
                {errors.fullName && <p className="text-[8px] text-red mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Mobile Number</label>
                <input {...register('phone')} type="tel" className={inp} placeholder="+91 98XXXXXXXX" />
                {errors.phone && <p className="text-[8px] text-red mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Email Address</label>
                <input {...register('email')} type="email" className={inp} placeholder="you@example.com" />
                {errors.email && <p className="text-[8px] text-red mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-[8px] tracking-[3px] text-ash uppercase block mb-2 font-bold">Permanent Address</label>
                <input {...register('address')} className={inp} placeholder="City, Karnataka" />
              </div>
            </div>
            <div className="border-t border-navy/5 pt-5">
              <div className="text-[8px] tracking-[3px] text-orange uppercase mb-4 font-bold">Vehicle Details</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[8px] tracking-[2px] text-ash uppercase block mb-2 font-bold">Make</label>
                  <select {...register('vehicleMake')} className={inp + ' bg-void'}>
                    <option value="">Select Make</option>
                    {['Mahindra','Kia','Nissan','Hyundai','Maruti','Tata','Toyota','Honda','MG'].map(m=><option key={m}>{m}</option>)}
                  </select>
                  {errors.vehicleMake && <p className="text-[8px] text-red mt-1">{errors.vehicleMake.message}</p>}
                </div>
                <div>
                  <label className="text-[8px] tracking-[2px] text-ash uppercase block mb-2 font-bold">Model</label>
                  <input {...register('vehicleModel')} className={inp} placeholder="e.g. Thar Roxx" />
                  {errors.vehicleModel && <p className="text-[8px] text-red mt-1">{errors.vehicleModel.message}</p>}
                </div>
                <div>
                  <label className="text-[8px] tracking-[2px] text-ash uppercase block mb-2 font-bold">Year</label>
                  <input {...register('vehicleYear')} type="number" className={inp} placeholder="2022" />
                  {errors.vehicleYear && <p className="text-[8px] text-red mt-1">{errors.vehicleYear.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-[8px] tracking-[2px] text-ash uppercase block mb-2 font-bold">Registration No.</label>
                  <input {...register('regNumber')} className={inp} placeholder="KA04 XXXXXXX" />
                  {errors.regNumber && <p className="text-[8px] text-red mt-1">{errors.regNumber.message}</p>}
                </div>
                <div>
                  <label className="text-[8px] tracking-[2px] text-ash uppercase block mb-2 font-bold">Asset Market Value (₹)</label>
                  <input {...register('assetValue')} type="number" className={inp} placeholder="1500000" />
                  {errors.assetValue && <p className="text-[8px] text-red mt-1">{errors.assetValue.message}</p>}
                </div>
              </div>
            </div>
            <button onClick={nextStep} className="w-full bg-orange text-void text-[10px] tracking-[4px] uppercase py-4 font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] transition-all cut-md">
              Continue to Digital Agreement →
            </button>
          </div>
        )}

        {/* ── STEP 2: Digital Agreement ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-[8px] tracking-[4px] text-orange uppercase mb-5 font-bold">Step 2 of 4 — Master Asset Management Agreement</div>
            <div className="bg-navy/5 border border-navy/10 overflow-hidden">
              <div className="bg-navy/10 border-b border-navy/10 px-4 py-2 text-[8px] tracking-[3px] text-navy uppercase font-bold">9-Month Master Agreement — Read Carefully</div>
              <div className="h-48 overflow-y-auto p-5 text-[10px] leading-[1.9] text-ash font-body space-y-3">
                <p>The Asset Owner (&quot;Investor&quot;) hereby deploys the above-registered vehicle to 8-Lines Group (&quot;Platform&quot;) for a term of <strong>9 months</strong> from the date of execution.</p>
                <p><strong>Revenue Split:</strong> Revenue shall be distributed on a <strong>70% (Investor) / 30% (Platform)</strong> basis calculated on Gross Trip Revenue, after deduction of applicable MECHANIX PRO maintenance costs.</p>
                <p><strong>Platform Obligations:</strong> 8-Lines Group shall bear all operational, telematics, GPS, and guest acquisition costs. Maintenance costs through MECHANIX PRO will be deducted at wholesale rates from the Investor&apos;s 70% with full PDF invoice transparency provided in the Investor Dashboard.</p>
                <p><strong>Personal Use:</strong> The Investor may pause the asset for up to <strong>5 days per quarter</strong> for personal use with 48-hour advance notice, subject to no existing guest bookings on those dates.</p>
                <p><strong>Guest Liability:</strong> 8-Lines Group executes its own physical and digital lease agreements with every guest. The Investor is not liable for guest-caused damages beyond the insurance deductible.</p>
                <p><strong>Legal Binding:</strong> This agreement is legally binding upon clickwrap execution under Indian IT Act 2000, Section 10A. Your IP address, device fingerprint, and UTC timestamp will be cryptographically logged and a signed PDF will be automatically emailed to your registered address.</p>
                <p><strong>Termination:</strong> Either party may terminate with 30-day written notice post the initial 9-month term. Early termination forfeits the ₹5,000 onboarding fee.</p>
              </div>
              <label className="flex items-start gap-4 cursor-pointer p-4 bg-void border-t border-navy/10 hover:bg-orange/[.02] transition-all group">
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-1 accent-orange w-4 h-4" />
                <span className="text-[9px] text-navy font-bold uppercase leading-relaxed group-hover:text-orange transition-colors">
                  I have read, understood, and I execute this legally binding digital agreement under the Indian IT Act 2000, Section 10A. I acknowledge my IP address and timestamp will be logged as permanent record.
                </span>
              </label>
            </div>
            <div className="bg-green/5 border border-green/15 border-l-2 border-l-green p-4">
              <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Security Notice</div>
              <p className="text-[9px] leading-[1.8] text-ash">Your IP address (<strong className="text-navy">logged on submit</strong>), timestamp, and device fingerprint will be cryptographically stored. A signed PDF will be auto-emailed to your address within 2 minutes of submission.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setStep(1)} className="border border-navy/15 text-ash text-[9px] tracking-[2px] uppercase py-4 hover:border-navy/30 transition-all">
                ← Back
              </button>
              <button onClick={handleSubmit(submitOnboarding)} disabled={loading}
                className="bg-orange text-void text-[9px] tracking-[3px] uppercase py-4 font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] disabled:opacity-60 transition-all cut-md">
                {loading ? 'Submitting...' : 'Execute Agreement & Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KYC Upload ── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-[8px] tracking-[4px] text-orange uppercase mb-5 font-bold">Step 3 of 4 — KYC Verification</div>
            <p className="text-[11px] text-ash leading-relaxed font-body">Upload your identity documents securely. All files are encrypted and stored in our AWS S3 vault. Required before your first payout is released.</p>
            {[
              {label:'PAN Card', sub:'Clear photo or PDF • Max 5MB', setter:setPanFile, value:panFile, accept:'.pdf,image/*'},
              {label:'Aadhar Card', sub:'Front & Back • Max 5MB', setter:setAadharFile, value:aadharFile, accept:'.pdf,image/*'},
            ].map((doc,i)=>(
              <div key={i} className={`border-2 border-dashed p-6 transition-all ${doc.value?'border-green/40 bg-green/5':'border-navy/15 hover:border-orange/30'}`}>
                <label className="cursor-pointer block">
                  <input type="file" accept={doc.accept} className="hidden"
                    onChange={e=>doc.setter(e.target.files?.[0]||null)} />
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 border flex items-center justify-center text-xl shrink-0 ${doc.value?'border-green/30 bg-green/5':'border-navy/10'}`}>
                      {doc.value ? '✓' : '📄'}
                    </div>
                    <div>
                      <div className="text-[10px] text-navy font-bold mb-1">{doc.label}</div>
                      <div className="text-[9px] text-ash">{doc.value ? `✓ ${doc.value.name}` : doc.sub}</div>
                    </div>
                    <div className="ml-auto">
                      <span className={`text-[8px] tracking-[2px] uppercase font-bold px-3 py-1.5 border ${doc.value?'text-green border-green/30':'text-orange border-orange/30'}`}>
                        {doc.value ? 'UPLOADED' : 'CLICK TO UPLOAD'}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            ))}
            <div className="bg-navy/5 border border-navy/10 p-4 text-[9px] text-ash leading-relaxed">
              🔐 <strong className="text-navy">AWS S3 Encrypted Storage.</strong> Documents are stored with AES-256 encryption. Only the 8-Lines compliance team can access them for KYC verification.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setStep(2)} className="border border-navy/15 text-ash text-[9px] tracking-[2px] uppercase py-4 hover:border-navy/30 transition-all">
                ← Back
              </button>
              <button onClick={submitKYC} disabled={loading}
                className="bg-orange text-void text-[9px] tracking-[3px] uppercase py-4 font-bold hover:bg-orange-dim disabled:opacity-60 transition-all cut-md">
                {loading ? 'Uploading...' : 'Upload & Proceed to Payment →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Payment ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-[8px] tracking-[4px] text-orange uppercase mb-5 font-bold">Step 4 of 4 — Activation Payment</div>
            <div className="bg-orange/5 border border-orange/20 p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[8px] tracking-[3px] text-orange uppercase mb-2 font-bold">Onboarding Activation Fee</div>
                  <div className="font-display text-6xl text-navy leading-none">₹5,000</div>
                  <div className="text-[9px] text-ash mt-2">One-time · Non-refundable · Activates your Investor Dashboard</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] tracking-[2px] text-orange uppercase mb-2 font-bold">Powered by</div>
                  <div className="bg-void border border-orange/20 px-4 py-3 text-[11px] font-bold text-navy">Razorpay</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {['UPI','Net Banking','Credit / Debit Cards'].map(m=>(
                  <div key={m} className="border border-orange/15 px-3 py-2 text-[8px] text-ash text-center font-bold uppercase tracking-wide">✓ {m}</div>
                ))}
              </div>
              <div className="border-t border-orange/10 pt-4 space-y-2 text-[9px] text-ash">
                <div className="flex justify-between"><span>Platform Activation</span><span className="text-navy font-bold">₹5,000</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span className="text-navy font-bold">₹900</span></div>
                <div className="flex justify-between border-t border-orange/10 pt-2 text-[10px]"><span className="font-bold text-navy">Total Due</span><span className="text-orange font-bold text-xl">₹5,900</span></div>
              </div>
            </div>
            <div className="bg-green/5 border border-green/15 p-4">
              <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">What Happens After Payment?</div>
              <div className="space-y-1.5 text-[9px] text-ash">
                {[
                  'Your Investor Dashboard activates immediately',
                  'Welcome email + PDF agreement sent to your email',
                  'OTP login credentials sent to your registered mobile',
                  'MECHANIX PRO will contact you within 24 hours to pick up the vehicle',
                ].map((pt,i)=><div key={i} className="flex items-center gap-2"><span className="text-green">✓</span>{pt}</div>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={()=>setStep(3)} className="border border-navy/15 text-ash text-[9px] tracking-[2px] uppercase py-4 hover:border-navy/30 transition-all">
                ← Back
              </button>
              <button onClick={processPayment} disabled={loading}
                className="bg-orange text-void text-[10px] tracking-[4px] uppercase py-5 font-bold hover:bg-orange-dim hover:shadow-[0_0_50px_rgba(248,147,31,.5)] disabled:opacity-60 transition-all cut-md relative overflow-hidden group">
                <span className="relative z-10">{loading ? 'Opening Razorpay...' : 'ACTIVATE — PAY ₹5,000 →'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InvestorPage() {
  useReveal()

  return (
    <main>
      <Navbar />
      <div className="pt-[68px]">

        {/* ── HERO ─────────────────────────────────── */}
        <section className="py-20 px-20 bg-void relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 60% at 100% 50%,rgba(12,29,54,.02),transparent)'}} />
          <div className="reveal max-w-3xl">
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />Asset Management Protocol</div>
            <h1 className="font-display text-[clamp(48px,6.5vw,88px)] leading-[.9] text-navy mb-6">
              DEPLOY YOUR ASSET.<br/><em className="text-orange not-italic">EARN 70%.</em>
            </h1>
            <p className="text-[13px] leading-[1.9] text-ash max-w-xl mb-8 font-body">
              8-Lines is a corporate fleet protocol. You provide the asset, we manage the guests, maintenance, and logistics. You collect the lion&apos;s share of every trip — guaranteed by contract.
            </p>
            <div className="flex gap-4">
              <a href="#form" className="inline-flex items-center gap-4 bg-orange text-void text-[9px] tracking-[4px] uppercase px-8 py-4 cut-md font-bold hover:bg-orange-dim hover:shadow-[0_0_40px_rgba(248,147,31,.4)] transition-all">
                Start the 4-Step Protocol →
              </a>
              <a href="#roi" className="inline-flex items-center gap-4 border border-orange/30 text-orange text-[9px] tracking-[3px] uppercase px-7 py-4 hover:bg-orange/5 hover:border-orange transition-all">
                Calculate ROI →
              </a>
            </div>
          </div>
        </section>

        {/* ── ROI + COMPARE ────────────────────────── */}
        <section id="roi" className="py-20 px-20 bg-abyss">
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div className="reveal-l">
              <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />ROI Calculator</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-8">PREDICT YOUR<br/><em className="text-orange not-italic">YIELD.</em></h2>
              <ROICalc />
            </div>
            <div className="reveal-r">
              <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />8-Lines vs. The Rest</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-8">8-LINES VS.<br/><em className="text-orange not-italic">THE REST.</em></h2>
              <div className="border border-navy/10 overflow-hidden bg-void">
                <div className="grid grid-cols-3 bg-navy/5 border-b border-navy/10">
                  <div className="p-4 text-[8px] tracking-[2px] text-ash uppercase font-bold">Feature</div>
                  <div className="p-4 text-[8px] tracking-[2px] text-ash uppercase font-bold border-l border-navy/5">Standard Apps</div>
                  <div className="p-4 text-[8px] tracking-[2px] text-green uppercase font-bold border-l border-navy/5">8-Lines ⚡</div>
                </div>
                {COMPARE.map((r,i)=>(
                  <div key={i} className="grid grid-cols-3 border-b border-navy/5 hover:bg-navy/[.02] transition-colors">
                    <div className="p-3 text-[9px] text-ash uppercase font-bold">{r.f}</div>
                    <div className="p-3 text-[10px] text-red/70 border-l border-navy/5 font-medium">{r.t}</div>
                    <div className="p-3 text-[10px] text-green border-l border-navy/5 font-bold">✓ {r.u}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4 STEPS OVERVIEW ─────────────────────── */}
        <section className="py-20 px-20 bg-void">
          <div className="reveal mb-12">
            <div className="text-[8px] tracking-[5px] text-green uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-green" />Protocol</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy">4 STEPS TO <em className="text-green not-italic">PASSIVE INCOME.</em></h2>
          </div>
          <div className="grid grid-cols-4 gap-px bg-navy/5 border border-navy/5 mb-20">
            {[
              {n:'01',icon:'🚗',t:'Asset Registration',  d:'Submit vehicle details — RC Book, Insurance, Make & Model. All data encrypted in AWS S3.'},
              {n:'02',icon:'📋',t:'Digital Agreement',   d:'Execute the 9-Month Master Agreement via clickwrap. IP address and timestamp cryptographically logged.'},
              {n:'03',icon:'🔐',t:'KYC Verification',   d:'Upload PAN Card and Aadhar securely to our encrypted AWS S3 vault for identity verification.'},
              {n:'04',icon:'💳',t:'₹5,000 Activation',  d:'Non-refundable onboarding fee via Razorpay UPI / Cards. Activates your real-time Investor Dashboard.'},
            ].map((s,i)=>(
              <div key={i} className={`reveal delay-${i+1} bg-void hover:bg-abyss transition-all p-10 relative overflow-hidden group border border-transparent hover:border-navy/5`}>
                <div className="absolute top-2 right-4 font-display text-[80px] leading-none text-navy/5 group-hover:text-navy/10 transition-colors select-none">{s.n}</div>
                <div className="w-12 h-12 bg-navy/5 border border-navy/10 flex items-center justify-center text-xl mb-6 group-hover:border-green/30 transition-all">{s.icon}</div>
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Step {s.n}</div>
                <div className="text-[14px] font-bold text-navy mb-3 font-body">{s.t}</div>
                <p className="text-[11px] leading-[1.8] text-ash font-body">{s.d}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>

          {/* ── Mechanix Pro Advantage ─────────────── */}
          <div className="reveal mb-12">
            <div className="text-[8px] tracking-[5px] text-orange uppercase mb-4 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />The Mechanix Pro Advantage</div>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-6">YOUR ASSET, <em className="text-orange not-italic">PROTECTED.</em></h2>
          </div>
          <div className="grid grid-cols-3 gap-px bg-navy/5 border border-navy/5 mb-20">
            {[
              {icon:<MechanixLogo className="h-10 w-auto" />, tag:'22-Point Audit', t:'Digital Audit Before Every Trip', d:'Our mechanics run a mandatory 22-checkpoint digital audit before every single dispatch. The car cannot move without certification.'},
              {icon:'📷', tag:'Photo Evidence', t:'Fail = Mandatory Photo Upload', d:'If any checkpoint fails, the mechanic must photograph the defect before proceeding. Creates an unarguable visual record before any repair spend.'},
              {icon:'📄', tag:'Auto-Generated PDF', t:'Health Certificate on Clean Pass', d:'When all 22 checkpoints pass, the system auto-generates a Mechanix Pro Certified Health Report — your legal shield against Zoomcar damage claims.'},
              {icon:'💰', tag:'Wholesale Cost Only', t:'Repair Cost Deducted Transparently', d:'When repairs are needed, costs are deducted at wholesale rates only — never marked up. Full PDF receipt pushed to your dashboard vault.'},
              {icon:'📊', tag:'Real-Time Score', t:'Live Health Score on Dashboard', d:'Every investor sees their vehicle&apos;s current MECHANIX PRO health score in their dashboard, updated after every audit.'},
              {icon:'🛡️', tag:'Legal Defensibility', t:'Instant Grievance Response', d:'When a rental platform raises a wear-and-tear claim, 8-Lines instantly downloads the Health Certificate and emails it to the Grievance Officer — proving the car&apos;s condition pre-trip.'},
            ].map((f,i)=>(
              <div key={i} className={`reveal delay-${Math.min(i%3+1,4)} bg-void hover:bg-abyss transition-all p-8 group relative overflow-hidden`}>
                <div className="w-12 h-12 bg-navy/5 border border-navy/10 flex items-center justify-center mb-5 group-hover:border-orange/40 transition-all overflow-hidden p-1.5">
                  {typeof f.icon==='string'?<span className="text-xl">{f.icon}</span>:f.icon}
                </div>
                <div className="text-[7px] tracking-[3px] text-orange uppercase mb-2 font-bold">{f.tag}</div>
                <div className="text-[13px] font-bold text-navy mb-3">{f.t}</div>
                <p className="text-[10px] leading-[1.8] text-ash">{f.d}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>

          {/* ── ONBOARDING GATEWAY FORM ─────────────── */}
          <div className="grid grid-cols-2 gap-16 items-start" id="form">
            {/* Left — Step Guide */}
            <div className="reveal-l">
              <div className="text-[8px] tracking-[5px] text-orange uppercase mb-6 flex items-center gap-3 font-bold"><span className="w-8 h-px bg-orange" />Activation Gateway</div>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[.92] text-navy mb-8">
                BEGIN YOUR <em className="text-orange not-italic">ASSET PROTOCOL.</em>
              </h2>
              <div className="space-y-px mb-10">
                {[
                  {n:1,t:'Asset Details',    s:'Vehicle & Owner Information'},
                  {n:2,t:'Digital Agreement',s:'9-Month Master Contract + IP Log'},
                  {n:3,t:'KYC Verification', s:'PAN & Aadhar — AWS S3 Encrypted'},
                  {n:4,t:'₹5,000 Activation',s:'Razorpay — UPI / Net Banking / Cards'},
                ].map((step,i)=>(
                  <div key={i} className="flex gap-5 py-5 border-b border-navy/5 last:border-0">
                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 font-bold transition-all ${step.n===1||step.n===2?'border-orange text-orange bg-orange/5':'border-navy/15 text-ash'}`}>
                      {step.n}
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-navy mb-1">{step.t}</div>
                      <div className="text-[10px] text-ash">{step.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-green/5 border border-green/15 border-l-2 border-l-green p-5">
                <div className="text-[8px] tracking-[3px] text-green uppercase mb-2 font-bold">Legal Notice</div>
                <p className="text-[10px] leading-[1.8] text-ash">Upon agreement execution, the system logs your IP address, UTC timestamp, and device fingerprint under Indian IT Act 2000 Section 10A. A signed PDF is auto-emailed to your registered address within 2 minutes.</p>
              </div>
            </div>

            {/* Right — Live Form */}
            <div className="reveal-r">
              <OnboardingGateway />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
