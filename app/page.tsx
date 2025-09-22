"use client"

import { useState, useEffect } from "react"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/pNZ2TNDvKXI?autoplay=1&mute=1&loop=1&playlist=pNZ2TNDvKXI&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.7)",
            transform: "scale(1.2)",
            transformOrigin: "center center",
            minWidth: "100%",
            minHeight: "100%",
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />

        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Starfield Animation */}
      <div className="absolute inset-0 z-10">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="text-center mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-6 relative">
            <span className="relative inline-block">
              <span className="absolute inset-0 text-[#00F0FF]/30 blur-sm">EXONOVA</span>
              <span className="relative text-white">EXONOVA</span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl italic text-[#00F0FF] font-light tracking-wide mb-8">
            "Protecting Tomorrow, Today"
          </p>
        </div>
      </div>

      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div className="grid-overlay"></div>
      </div>
    </div>
  )
}
