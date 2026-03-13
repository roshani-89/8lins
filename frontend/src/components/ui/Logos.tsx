import React from 'react'

export const MainLogo = ({ className = "h-14" }: { className?: string }) => (
  <svg viewBox="0 0 400 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* The 5 slanted lines icon with specific proportions */}
    <g transform="translate(130, 20)">
      <path d="M0 45 L50 45 L35 75 L-15 75 Z" fill="#0C1D36" opacity="0.4" />
      <path d="M30 35 L80 35 L65 65 L15 65 Z" fill="#0C1D36" opacity="0.6" />
      <path d="M60 25 L110 25 L95 55 L45 55 Z" fill="#0C1D36" opacity="0.8" />
      <path d="M90 15 L140 15 L125 45 L75 45 Z" fill="#0C1D36" />
      <path d="M120 5 L170 5 L155 35 L105 35 Z" fill="#0C1D36" />
    </g>
    {/* Typography matches the bold, semi-extended feel */}
    <text x="0" y="115" className="font-display" style={{ fontSize: '76px', fontWeight: '900', letterSpacing: '-1px' }} fill="#0C1D36">8-LINES</text>
    <text x="2" y="148" className="font-display" style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '4px' }} fill="#0C1D36">GROUP</text>
    <text x="5" y="174" className="font-mono" style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '2px' }} fill="#0C1D36">ASSET MANAGEMENT INFRASTRUCTURE.</text>
  </svg>
)

export const MechanixLogo = ({ className = "h-20" }: { className?: string }) => (
  <svg viewBox="0 0 500 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield with the specific split coloring if possible, or solid navy for simplicity */}
    <path d="M50 30C50 30 130 22 150 5C170 22 250 30 250 30V100C250 160 200 210 150 225C100 210 50 160 50 100V30Z" fill="#0C1D36" stroke="#F8931F" strokeWidth="8" />
    {/* The bold orange lightning bolt overlaying the wrench */}
    <path d="M150 35 L100 190 H150 L125 100 L195 70 Z" fill="#F8931F" />
    {/* Wrench detail */}
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
    {/* Car illustration as described in the screenshot */}
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
