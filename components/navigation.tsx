"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/city-explorer", label: "City Explorer" },
    { href: "/urban-planner", label: "Urban Planner" },
    { href: "/disaster-command", label: "Disaster Management" },
    { href: "/community", label: "Community" },
    { href: "/student-hub", label: "Student Hub" },
    { href: "/about", label: "About" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 bg-black/95 backdrop-blur-sm border-b border-blue-900/50">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-300 hover:text-blue-100 transition-colors">
          EXONOVA
        </Link>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all duration-300 relative group ${
                pathname === item.href ? "text-blue-300 font-semibold" : "text-gray-400 hover:text-blue-300"
              }`}
            >
              {item.label}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
