"use client"

import React from 'react'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'minimal' | 'dashboard'
  className?: string
}

export function AnimatedBackground({ variant = 'default', className = '' }: AnimatedBackgroundProps) {
  const getBackgroundPattern = () => {
    switch (variant) {
      case 'hero':
        return (
          <>
            {/* Hero section with large, dramatic orbs */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 gradient-transition"></div>
            <div className="absolute top-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl bg-decoration animate-pulse duration-[12000ms]"></div>
            <div className="absolute bottom-20 right-4 sm:right-10 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl bg-decoration animate-pulse duration-[10000ms] delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl bg-decoration gradient-transition"></div>
            <div className="absolute top-32 right-1/4 w-32 h-32 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-2xl bg-decoration animate-pulse duration-[8000ms] delay-1000"></div>
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-accent/12 to-primary/12 rounded-full blur-3xl bg-decoration animate-pulse duration-[14000ms] delay-3000"></div>
          </>
        )
      
      case 'minimal':
        return (
          <>
            {/* Minimal pattern for focused content */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-primary/6 rounded-full blur-2xl bg-decoration animate-pulse duration-[6000ms]"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/6 rounded-full blur-2xl bg-decoration animate-pulse duration-[8000ms] delay-2000"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/8 rounded-full blur-xl bg-decoration animate-pulse duration-[4000ms] delay-1000"></div>
          </>
        )
      
      case 'dashboard':
        return (
          <>
            {/* Dashboard optimized pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/4 rounded-full blur-3xl bg-decoration animate-pulse duration-[10000ms]"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/4 rounded-full blur-3xl bg-decoration animate-pulse duration-[12000ms] delay-3000"></div>
            <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-primary/6 rounded-full blur-2xl bg-decoration animate-pulse duration-[7000ms] delay-1500"></div>
          </>
        )
      
      default:
        return (
          <>
            {/* Default versatile pattern */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl bg-decoration gradient-transition animate-pulse duration-[8000ms]"></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-2xl bg-decoration gradient-transition animate-pulse duration-[6000ms] delay-1000"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl bg-decoration gradient-transition animate-pulse duration-[10000ms] delay-2000"></div>
            <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-xl bg-decoration gradient-transition animate-pulse duration-[4000ms] delay-500"></div>
            <div className="absolute top-10 left-1/4 w-24 h-24 bg-primary/8 rounded-full blur-2xl bg-decoration animate-pulse duration-[7000ms] delay-3000"></div>
            <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-accent/6 rounded-full blur-3xl bg-decoration animate-pulse duration-[9000ms] delay-1500"></div>
          </>
        )
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {getBackgroundPattern()}
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-primary/20 rounded-full animate-ping`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}