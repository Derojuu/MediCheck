"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const handleThemeToggle = () => {
    if (!buttonRef.current) return
    
    setIsAnimating(true)
    
    // Get button position
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Create spreading blur overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      backdrop-filter: blur(0px);
      background: radial-gradient(circle at ${centerX}px ${centerY}px, 
        ${theme === 'light' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'} 0%, 
        ${theme === 'light' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)'} 40%,
        ${theme === 'light' ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.3)'} 80%,
        transparent 100%);
      clip-path: circle(0% at ${centerX}px ${centerY}px);
      transition: clip-path 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), backdrop-filter 0.6s ease-out;
    `
    
    document.body.appendChild(overlay)
    
    // Start the spreading animation with blur
    requestAnimationFrame(() => {
      const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
      overlay.style.clipPath = `circle(${maxDistance}px at ${centerX}px ${centerY}px)`
      overlay.style.backdropFilter = 'blur(8px)'
    })
    
    // Change theme in the middle of animation
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light")
    }, 300)
    
    // Remove overlay and reset
    setTimeout(() => {
      overlay.remove()
      setIsAnimating(false)
    }, 600)
  }

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      disabled={isAnimating}
      className="h-9 w-9 cursor-pointer relative overflow-hidden
                 transition-all duration-200 ease-out
                 hover:scale-105 hover:shadow-md active:scale-95"
    >
      {/* Simple background transition */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 
                      dark:from-blue-50 dark:to-purple-50 
                      opacity-0 hover:opacity-20 transition-opacity duration-200 rounded-md" />
      
      {/* Sun icon */}
      <Sun className={`h-[1.2rem] w-[1.2rem] 
                       transition-all duration-300 ease-out
                       ${theme === 'dark' 
                         ? 'rotate-90 scale-0 opacity-0' 
                         : 'rotate-0 scale-100 opacity-100'
                       }
                       text-yellow-600`} />
      
      {/* Moon icon */}
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] 
                        transition-all duration-300 ease-out
                        ${theme === 'light' 
                          ? '-rotate-90 scale-0 opacity-0' 
                          : 'rotate-0 scale-100 opacity-100'
                        }
                        text-blue-500`} />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}