"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleThemeToggle = () => {
    setIsAnimating(true)
    
    // Add theme switching animation to body
    document.body.classList.add('theme-switch-animation')
    
    // Trigger background orb animation
    const decorations = document.querySelectorAll('.bg-decoration')
    decorations.forEach((el) => {
      el.classList.add('animate-pulse', 'duration-1000')
    })
    
    setTheme(theme === "light" ? "dark" : "light")
    
    // Reset animation state and classes after animation completes
    setTimeout(() => {
      setIsAnimating(false)
      document.body.classList.remove('theme-switch-animation')
      decorations.forEach((el) => {
        el.classList.remove('animate-pulse', 'duration-1000')
      })
    }, 800)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className="h-9 w-9 cursor-pointer relative overflow-hidden group 
                 transition-all duration-300 ease-in-out
                 hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/20 
                 dark:hover:shadow-blue-500/20 active:scale-95
                 hover:glow-effect"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 
                      dark:from-blue-400/20 dark:to-purple-400/20 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
      
      {/* Sun icon with enhanced animations */}
      <Sun className={`h-[1.2rem] w-[1.2rem] 
                       transition-all duration-700 ease-in-out
                       ${theme === 'dark' 
                         ? '-rotate-180 scale-0 opacity-0' 
                         : 'rotate-0 scale-100 opacity-100'
                       }
                       ${isAnimating ? 'animate-spin' : ''}
                       text-yellow-500 drop-shadow-sm hover:drop-shadow-lg
                       group-hover:scale-110`} />
      
      {/* Moon icon with enhanced animations */}
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] 
                        transition-all duration-700 ease-in-out
                        ${theme === 'light' 
                          ? 'rotate-180 scale-0 opacity-0' 
                          : 'rotate-0 scale-100 opacity-100'
                        }
                        ${isAnimating ? 'animate-pulse' : ''}
                        text-blue-400 drop-shadow-sm hover:drop-shadow-lg
                        group-hover:scale-110`} />
      
      {/* Animated ripple effect on click */}
      {isAnimating && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400/50 
                          dark:border-blue-400/50 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-yellow-400/30 
                          dark:border-blue-400/30 animate-ping delay-100" 
               style={{ animationDuration: '1s' }} />
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 
                          dark:bg-blue-400/10 animate-pulse" />
        </>
      )}
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}