"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { publicRoutes, authRoutes } from "@/utils";
import { useUser } from "@clerk/nextjs";
import { getRedirectPath } from "@/utils";
import {
  Shield,
  Scan,
  Building2,
  Users,
  Pill,
  ChevronRight,
  QrCode,
  Globe,
  CheckCircle,
  Zap,
  Lock,
  TrendingUp,
  Star,
  Award,
  LogOut,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {

  const { user, isSignedIn } = useUser();

  const { signOut } = useClerk();

  const role = user?.publicMetadata.role as string | undefined;

  const organizationType = user?.publicMetadata.organizationType as string | undefined;

  // Simple scroll animation handler
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate');
        }
      });
    };

    // Initial check
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background Decorations with Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl bg-decoration gradient-transition animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-2xl bg-decoration gradient-transition animate-pulse duration-[6000ms] delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl bg-decoration gradient-transition animate-pulse duration-[10000ms] delay-2000"></div>
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-xl bg-decoration gradient-transition animate-pulse duration-[4000ms] delay-500"></div>
        {/* Additional animated orbs for dynamic effect */}
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-primary/8 rounded-full blur-2xl bg-decoration animate-pulse duration-[7000ms] delay-3000"></div>
        <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-accent/6 rounded-full blur-3xl bg-decoration animate-pulse duration-[9000ms] delay-1500"></div>
      </div>
      
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg sm:rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg md:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MediCheck</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
              <Link
                href="#verify"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2 text-sm xl:text-base"
              >
                Verify Drug
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2 text-sm xl:text-base"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2 text-sm xl:text-base"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            {/* auth */}
            {isSignedIn ?
              (
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start cursor-pointer hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
                    onClick={() => signOut({ redirectUrl: authRoutes.login })}
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 md:mr-3" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                  <Link href={getRedirectPath(role, organizationType)}>
                    <Button 
                      variant="gradient"
                      size="sm"
                      className="cursor-pointer font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm px-2 sm:px-3 md:px-6"
                    >
                      <span className="hidden sm:inline">Dashboard</span>
                      <span className="sm:hidden">Dash</span>
                    </Button>
                  </Link>
                </div>
              )
              :
              (
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                  <ThemeToggle />
                  <Link href={authRoutes.login}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer font-medium text-xs sm:text-sm px-2 sm:px-3 md:px-6"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href={authRoutes.register}>
                    <Button 
                      variant="gradient"
                      size="sm"
                      className="cursor-pointer font-medium shadow-lg hover:shadow-xl animate-pulse-glow text-xs sm:text-sm px-2 sm:px-3 md:px-6"
                    >
                      <span className="hidden sm:inline">Get Started</span>
                      <span className="sm:hidden">Start</span>
                    </Button>
                  </Link>
                </div>
              )}
            {/*  */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-3 sm:px-4 md:px-6 lg:px-8 overflow-hidden pt-32 sm:pt-36 md:pt-40 lg:pt-44 xl:pt-52">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 gradient-transition"></div>
        <div className="absolute top-10 sm:top-20 left-2 sm:left-4 md:left-10 w-32 h-32 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl bg-decoration animate-pulse duration-[12000ms]"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-4 md:right-10 w-24 h-24 sm:w-48 sm:h-48 md:w-80 md:h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl bg-decoration animate-pulse duration-[10000ms] delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl bg-decoration gradient-transition"></div>
        {/* Additional floating orbs */}
        <div className="absolute top-16 sm:top-32 right-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-2xl bg-decoration animate-pulse duration-[8000ms] delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-r from-accent/12 to-primary/12 rounded-full blur-3xl bg-decoration animate-pulse duration-[14000ms] delay-3000"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="scroll-animate">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-foreground mb-6 sm:mb-8 md:mb-10 leading-[0.9] tracking-tight px-2">
              Verify Any Medicine
              <span className="text-gradient block mt-2 sm:mt-4">Instantly & Securely</span>
            </h1>
          </div>

          <div className="scroll-animate">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground mb-8 sm:mb-12 md:mb-16 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed font-light px-4">
              Protect yourself and your loved ones with our enterprise-grade blockchain medication verification system.
              <span className="text-primary font-medium"> Scan, verify, and trust</span> with military-level security.
            </p>
          </div>

          <div className="scroll-animate">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
              <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer">
                <div className="flex items-center gap-1 sm:gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="font-bold text-sm sm:text-base md:text-lg">99.9%</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center">Accuracy Rate</span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer">
                <div className="flex items-center gap-1 sm:gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="font-bold text-sm sm:text-base md:text-lg">256-bit</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center">Encryption</span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer">
                <div className="flex items-center gap-1 sm:gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="font-bold text-sm sm:text-base md:text-lg">&lt;2s</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center">Verification</span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer">
                <div className="flex items-center gap-1 sm:gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="font-bold text-sm sm:text-base md:text-lg">1M+</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center">Verified Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <div className="scroll-animate">
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-foreground mb-4 sm:mb-6 md:mb-8 px-4">
                Complete Medication
                <span className="text-gradient block mt-1 sm:mt-2">Traceability Ecosystem</span>
              </h2>
            </div>
            <div className="scroll-animate">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4">
                From manufacturer to patient, every step is verified and secured on the blockchain with
                <span className="text-primary font-medium"> real-time tracking and advanced analytics</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="scroll-animate">
              <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 cursor-pointer glass-effect h-full">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="mx-auto text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-all duration-500">
                    🏭
                  </div>
                  <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">Manufacturers</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Create and track medication batches with complete transparency and real-time analytics
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="scroll-animate">
              <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 cursor-pointer glass-effect h-full">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="mx-auto text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-all duration-500">
                    🚚
                  </div>
                  <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">Distributors</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Manage shipments and transfers with transparency and automated compliance reporting
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="scroll-animate">
              <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 cursor-pointer glass-effect h-full">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="mx-auto text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-all duration-500">
                    🏥
                  </div>
                  <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">Pharmacies</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Verify authenticity and manage inventory with blockchain data and automated alerts
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="scroll-animate">
              <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 cursor-pointer glass-effect h-full">
                <CardHeader className="pb-4 sm:pb-6">
                  <div className="mx-auto text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 transition-all duration-500">
                    👥
                  </div>
                  <CardTitle className="font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4">Patients</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    Verify medication authenticity with simple scan and access complete medication history
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center">
            <div className="scroll-animate">
              <div className="group cursor-pointer">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-gradient transition-all duration-500">
                  1M+
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-medium px-1">Medications Verified Daily</div>
              </div>
            </div>
            <div className="scroll-animate">
              <div className="group cursor-pointer">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-gradient transition-all duration-500">
                  500+
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-medium px-1">Enterprise Partners</div>
              </div>
            </div>
            <div className="scroll-animate">
              <div className="group cursor-pointer">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-gradient transition-all duration-500">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-medium px-1">Accuracy Guarantee</div>
              </div>
            </div>
            <div className="scroll-animate">
              <div className="group cursor-pointer">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-gradient transition-all duration-500">
                  24/7
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground font-medium px-1">Global Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="verify" 
        className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl sm:max-w-5xl lg:max-w-6xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 overflow-hidden glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl sm:rounded-3xl"></div>
            <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-32 h-32 sm:w-60 sm:h-60 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10">
              <div className="scroll-animate">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-accent rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 md:mb-12 shadow-2xl animate-pulse-glow">
                  <QrCode className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
                </div>
              </div>
              <div className="scroll-animate">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-white mb-4 sm:mb-6 md:mb-8 px-4">
                  Ready to Verify
                  <span className="block mt-2 sm:mt-4">Your Medicine?</span>
                </h2>
              </div>
              <div className="scroll-animate">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4">
                  Scan any QR code or NFC tag on your medication packaging to instantly verify authenticity and access
                  <span className="text-primary font-medium"> complete supply chain intelligence</span>
                </p>
              </div>
              <div className="scroll-animate">
                <Link href={publicRoutes.scan}>
                  <Button
                    variant="gradient"
                    size="xl"
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 cursor-pointer shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 group font-semibold w-full sm:w-auto"
                  >
                    <Scan className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 mr-2 sm:mr-3 md:mr-4 lg:mr-5" />
                    <span className="hidden sm:inline">Start Scanning Now</span>
                    <span className="sm:hidden">Scan Now</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 ml-1 sm:ml-2 md:ml-3 lg:ml-4 group-hover:translate-x-3 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card/80 to-muted/40 border-t py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 glass-effect">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 sm:mb-12 md:mb-16 gap-8">
            {/* Left: Logo and description */}
            <div className="flex flex-col items-center md:items-start md:ml-16">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-2">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg sm:rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-lg sm:rounded-xl">
                    <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <span className="font-bold text-xl sm:text-2xl md:text-3xl text-foreground">MediCheck</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-mono mb-2 md:mb-0">
                Enterprise Blockchain Security
              </span>
            </div>
            {/* Right: Social Media & Links */}
            <div className="flex flex-col sm:flex-row items-center md:items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 text-sm sm:text-base md:mr-16">
              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                <Link
                  href="https://x.com/medi_check2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-all duration-300 cursor-pointer group"
                  aria-label="Follow us on X (Twitter)"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#55ACEE" d="M31.993,6.077C30.816,6.6,29.552,6.953,28.223,7.11c1.355-0.812,2.396-2.098,2.887-3.63c-1.269,0.751-2.673,1.299-4.168,1.592C25.744,3.797,24.038,3,22.149,3c-3.625,0-6.562,2.938-6.562,6.563c0,0.514,0.057,1.016,0.169,1.496C10.301,10.785,5.465,8.172,2.227,4.201c-0.564,0.97-0.888,2.097-0.888,3.3c0,2.278,1.159,4.286,2.919,5.464c-1.075-0.035-2.087-0.329-2.972-0.821c-0.001,0.027-0.001,0.056-0.001,0.082c0,3.181,2.262,5.834,5.265,6.437c-0.55,0.149-1.13,0.23-1.729,0.23c-0.424,0-0.834-0.041-1.234-0.117c0.834,2.606,3.259,4.504,6.13,4.558c-2.245,1.76-5.075,2.811-8.15,2.811c-0.53,0-1.053-0.031-1.566-0.092C2.905,27.913,6.355,29,10.062,29c12.072,0,18.675-10.001,18.675-18.675c0-0.284-0.008-0.568-0.02-0.85C30,8.55,31.112,7.395,31.993,6.077z"/>
                  </svg>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/medicheck25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-all duration-300 cursor-pointer group"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#2867b2" d="M512,64c0,-35.323 -28.677,-64 -64,-64l-384,0c-35.323,0 -64,28.677 -64,64l0,384c0,35.323 28.677,64 64,64l384,0c35.323,0 64,-28.677 64,-64l0,-384Z"/>
                    <rect fill="#fff" height="257.962" width="85.76" x="61.053" y="178.667"/>
                    <path fill="#fff" d="M104.512,54.28c-29.341,0-48.512,19.29-48.512,44.573c0,24.752,18.588,44.574,47.377,44.574l0.554,0c29.903,0,48.516-19.822,48.516-44.574c-0.555-25.283-18.611-44.573-47.935-44.573Z"/>
                    <path fill="#fff" d="M357.278,172.601c-45.49,0-65.866,25.017-77.276,42.589l0,-36.523l-85.738,0c1.137,24.197,0,257.961,0,257.961l85.737,0l0,-144.064c0,-7.711,0.554,-15.42,2.827,-20.931c6.188,-15.4,20.305,-31.352,43.993,-31.352c31.012,0,43.436,23.664,43.436,58.327l0,138.02l85.741,0l0,-147.93c0,-79.237-42.305,-116.097-98.72,-116.097Z"/>
                  </svg>
                </Link>
              </div>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="pt-8 sm:pt-10 md:pt-12 border-t text-center">
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
              &copy; 2025 MediCheck. All rights reserved. Securing medication authenticity with enterprise blockchain
              technology.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground/80">
              Trusted by healthcare organizations worldwide for pharmaceutical supply chain integrity and patient
              safety.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
