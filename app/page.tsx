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
      {/* Background Video */}
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Starfield */}
      <div className="absolute inset-0 z-10">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 z-30 w-full flex items-center justify-between p-6">
        {/* EXONOVA Logo */}
        <h2 className="text-2xl font-bold !text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          EXONOVA
        </h2>

        {/* Navigation Links */}
        <div className="flex gap-6 font-medium">
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">City Explorer</a>
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">Urban Planner</a>
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">Disaster Management</a>
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">Community</a>
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">Student Hub</a>
          <a href="#" className="!text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">About</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="text-center mb-8">
          <h1 className="text-8xl md:text-9xl font-extrabold mb-6 relative">
            <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]">
              EXONOVA
            </span>
          </h1>
          <p className="text-2xl md:text-3xl italic text-white font-light tracking-wide mb-8 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">
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
