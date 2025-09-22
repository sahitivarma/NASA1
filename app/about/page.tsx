"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TeamMember {
  name: string
  role: string
  avatar: string
  bio: string
}

interface SDGGoal {
  number: number
  title: string
  description: string
  color: string
  icon: string
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<"mission" | "team" | "sdg">("mission")

  const teamMembers: TeamMember[] = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Technology Officer",
      avatar: "/team-sarah.jpg",
      bio: "Former NASA engineer specializing in satellite data analysis and urban modeling systems.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Urban Planner",
      avatar: "/team-marcus.jpg",
      bio: "15+ years experience in sustainable city development and climate resilience planning.",
    },
    {
      name: "Dr. Aisha Patel",
      role: "AI Research Director",
      avatar: "/team-aisha.jpg",
      bio: "Machine learning expert focused on predictive modeling for disaster prevention.",
    },
    {
      name: "James Thompson",
      role: "Community Engagement Lead",
      avatar: "/team-james.jpg",
      bio: "Social impact specialist connecting technology with grassroots community needs.",
    },
  ]

  const sdgGoals: SDGGoal[] = [
    {
      number: 3,
      title: "Good Health and Well-being",
      description: "Monitoring air quality, water safety, and urban health indicators",
      color: "#4C9F38",
      icon: "🏥",
    },
    {
      number: 6,
      title: "Clean Water and Sanitation",
      description: "Tracking water quality and access across urban communities",
      color: "#26BDE2",
      icon: "💧",
    },
    {
      number: 7,
      title: "Affordable and Clean Energy",
      description: "Analyzing energy access and promoting renewable infrastructure",
      color: "#FCC30B",
      icon: "⚡",
    },
    {
      number: 11,
      title: "Sustainable Cities and Communities",
      description: "Building resilient, inclusive, and sustainable urban environments",
      color: "#FD9D24",
      icon: "🏙️",
    },
    {
      number: 13,
      title: "Climate Action",
      description: "Predicting climate risks and supporting adaptation strategies",
      color: "#3F7E44",
      icon: "🌍",
    },
    {
      number: 15,
      title: "Life on Land",
      description: "Monitoring biodiversity and green space development in cities",
      color: "#56C02B",
      icon: "🌳",
    },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-30 fixed top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold neon-cyan">
            EXONOVA
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/city-explorer" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              City Explorer
            </Link>
            <Link href="/urban-planner" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Urban Planner
            </Link>
            <Link href="/disaster-command" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Disaster Command
            </Link>
            <Link href="/community" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Community
            </Link>
            <Link href="/student-hub" className="text-white/80 hover:text-[#00F0FF] transition-colors">
              Student Hub
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 pt-20 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6">
              <span className="neon-cyan">About</span> <span className="neon-purple">EXONOVA</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              <em>Empowering sustainable urban futures through advanced space technology and AI-driven insights</em>
            </p>
          </div>

          {/* Section Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-black/50 rounded-lg p-1 border border-[#00F0FF]/30">
              {(["mission", "team", "sdg"] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-8 py-3 rounded-md transition-all ${
                    activeSection === section
                      ? "bg-gradient-to-r from-[#00F0FF] to-[#9B59FF] text-black font-semibold shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {section === "mission" ? "Our Mission" : section === "team" ? "Our Team" : "SDG Impact"}
                </button>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          {activeSection === "mission" && (
            <div className="max-w-4xl mx-auto">
              <div className="holographic-panel p-8 rounded-lg mb-8">
                <h2 className="text-3xl font-bold neon-cyan mb-6 text-center">Our Mission</h2>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-white/90">
                    EXONOVA bridges the gap between cutting-edge space technology and grassroots urban development. We
                    believe that every city, regardless of size or resources, deserves access to the same sophisticated
                    monitoring and planning tools used by space agencies.
                  </p>
                  <p className="text-white/90">
                    Our platform democratizes satellite data, AI predictions, and urban modeling to create actionable
                    insights for sustainable development. From predicting natural disasters to optimizing green
                    infrastructure, we empower communities to build resilient, equitable futures.
                  </p>
                  <p className="text-white/90">
                    Through gamified learning experiences and community-driven data collection, we're not just building
                    better cities – we're building a generation of informed, engaged urban citizens who understand their
                    role in creating sustainable communities.
                  </p>
                </div>
              </div>

              {/* Vision Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="holographic-panel p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-bold neon-purple mb-3">Innovation</h3>
                  <p className="text-white/70">
                    Leveraging NASA-grade technology to solve urban challenges with unprecedented precision and scale.
                  </p>
                </div>
                <div className="holographic-panel p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold neon-cyan mb-3">Collaboration</h3>
                  <p className="text-white/70">
                    Connecting communities, governments, and researchers through shared data and collective action.
                  </p>
                </div>
                <div className="holographic-panel p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-xl font-bold neon-purple mb-3">Sustainability</h3>
                  <p className="text-white/70">
                    Every feature designed to promote environmental stewardship and long-term urban resilience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team Section */}
          {activeSection === "team" && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold neon-cyan mb-8 text-center">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="holographic-panel p-6 rounded-lg text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#9B59FF] p-1">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <img
                          src={member.avatar || "/placeholder.svg?height=80&width=80&query=professional avatar"}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-[#00F0FF] font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-white/70 leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SDG Section */}
          {activeSection === "sdg" && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold neon-cyan mb-8 text-center">UN Sustainable Development Goals</h2>
              <p className="text-center text-white/80 mb-8 max-w-3xl mx-auto">
                EXONOVA directly contributes to achieving the United Nations Sustainable Development Goals through
                data-driven urban solutions and community empowerment.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sdgGoals.map((goal) => (
                  <div key={goal.number} className="holographic-panel p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                        style={{ backgroundColor: goal.color }}
                      >
                        {goal.number}
                      </div>
                      <div className="text-3xl">{goal.icon}</div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{goal.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{goal.description}</p>
                    <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full animate-pulse"
                        style={{
                          backgroundColor: goal.color,
                          width: `${Math.floor(Math.random() * 40) + 60}%`,
                          boxShadow: `0 0 10px ${goal.color}`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16 mb-8">
            <div className="holographic-panel p-8 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold neon-purple mb-4">Join the Mission</h3>
              <p className="text-white/80 mb-6">
                Ready to transform your city with space-age technology? Start exploring our tools and become part of the
                sustainable urban revolution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/city-explorer">
                  <Button className="bg-gradient-to-r from-[#00F0FF] to-[#9B59FF] hover:from-[#00F0FF]/80 hover:to-[#9B59FF]/80 text-black font-semibold px-8 py-3">
                    Explore Cities
                  </Button>
                </Link>
                <Link href="/student-hub">
                  <Button className="bg-transparent border border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 px-8 py-3">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-10">
        <div className="grid-overlay"></div>
      </div>
    </div>
  )
}
