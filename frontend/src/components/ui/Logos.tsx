import React from 'react'

export const MainLogo = ({
  className = "h-14",
  dark = false,
  scrolled = true,
}: {
  className?: string
  dark?: boolean
  scrolled?: boolean
}) => {
  return (
    <img
      src="/mainlogo.jpeg"
      alt="8-LINES GROUP-INC"
      className={`object-contain transition-all duration-500 hover:brightness-110 active:scale-95 ${className} ${dark ? 'invert brightness-200' : ''}`}
      style={{
        mixBlendMode: dark ? 'screen' : 'multiply',
        filter: !scrolled && !dark
          ? 'drop-shadow(0 0 4px rgba(255,255,255,0.6))'
          : 'none',
      }}
    />
  )
}

export const DynamicLogo = ({
  className = "h-10 w-auto",
  dark = false,
  scrolled = true,
}: {
  className?: string
  dark?: boolean
  scrolled?: boolean
}) => {
  return (
    <div className={`relative ${className} flex items-center justify-center overflow-visible select-none`}>
      <MainLogo className="h-full w-full" dark={dark} scrolled={scrolled} />
    </div>
  )
}

export const MechanixLogo = ({ className = "h-20" }: { className?: string }) => (
  <svg viewBox="0 0 500 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 30C50 30 130 22 150 5C170 22 250 30 250 30V100C250 160 200 210 150 225C100 210 50 160 50 100V30Z" fill="#0C1D36" stroke="#F8931F" strokeWidth="8" />
    <path d="M150 35 L100 190 H150 L125 100 L195 70 Z" fill="#F8931F" />
    <path d="M110 70 L90 100 M95 75 L140 145" stroke="white" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
    <g transform="translate(280, 80)">
      <text x="0" y="40" className="font-display" style={{ fontSize: '52px', fontWeight: '900', letterSpacing: '1px' }} fill="#0C1D36">MECHANIX PRO</text>
      <text x="2" y="75" className="font-body" style={{ fontSize: '20px', fontWeight: '800' }} fill="#0C1D36">Your Roadside First Responders</text>
      <text x="2" y="105" className="font-body" style={{ fontSize: '14px', fontWeight: '600' }} fill="#0C1D36" opacity="0.5">An 8-Lines Group Company</text>
    </g>
  </svg>
)

export const CarLegacyLogo = ({ className = "h-32" }: { className?: string }) => (
  <svg viewBox="0 0 600 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 40)" fill="#12332B">
      <path d="M30 180C30 180 30 130 50 110L90 70H190L230 110C250 130 250 180 250 180H30Z" />
      <path d="M140 75L110 110H230L200 75H140Z" fill="white" opacity="0.2" />
      <rect x="60" y="130" width="45" height="15" rx="2" fill="white" opacity="0.9" />
      <rect x="175" y="130" width="45" height="15" rx="2" fill="white" opacity="0.9" />
      <rect x="110" y="145" width="60" height="20" rx="3" fill="#0C1D36" opacity="0.4" />
    </g>
    <g transform="translate(280, 100)">
      <text x="0" y="0" className="font-display" style={{ fontSize: '88px', fontWeight: '900', letterSpacing: '-2px' }} fill="#0C1D36">8-LINE</text>
      <text x="0" y="75" className="font-display" style={{ fontSize: '88px', fontWeight: '900', letterSpacing: '-2px' }} fill="#0C1D36">GROUP</text>
      <text x="0" y="140" className="font-display" style={{ fontSize: '88px', fontWeight: '900', letterSpacing: '-2px' }} fill="#0C1D36">INC.</text>
    </g>
  </svg>
)
