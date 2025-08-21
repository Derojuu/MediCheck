"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Scan,
  Building2,
  Users,
  Pill,
  ChevronRight,
  QrCode,
  Activity,
  Globe,
  CheckCircle,
  Zap,
  Lock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="font-montserrat font-black text-xl text-foreground">MedChain</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#verify"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Verify Drug
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="cursor-pointer bg-transparent hover:bg-primary/5 transition-all duration-300 border-primary/20 hover:border-primary/40"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors"
          >
            <Activity className="h-4 w-4 mr-2" />
            Blockchain-Powered Verification
          </Badge>
          <h1 className="font-montserrat font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground mb-8 leading-tight">
            Verify Any Medicine
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent block mt-2">
              Instantly & Securely
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Protect yourself and your loved ones with our blockchain-powered medication verification system. Scan,
            verify, and trust with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/consumer/scan">
              <Button
                size="lg"
                className="text-lg px-10 py-7 cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group"
              >
                <Scan className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Scan Medicine Now
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 bg-transparent cursor-pointer border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
              >
                <Building2 className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Register Organization
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>99.9% Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <span>Instant Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span>1M+ Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-primary/20 text-primary">
              Complete Solution
            </Badge>
            <h2 className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Complete Medication
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent block">
                Traceability
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From manufacturer to patient, every step is verified and secured on the blockchain with real-time tracking
              and analytics
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:-translate-y-2 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="font-montserrat font-bold text-xl">Manufacturers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Create and track medication batches from production to distribution with complete transparency
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:-translate-y-2 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="font-montserrat font-bold text-xl">Distributors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Manage incoming shipments and outgoing transfers with full transparency and real-time tracking
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:-translate-y-2 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Pill className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="font-montserrat font-bold text-xl">Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Verify authenticity and manage inventory with real-time blockchain data and automated alerts
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:-translate-y-2 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="font-montserrat font-bold text-xl">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Instantly verify medication authenticity with a simple scan and access complete medication history
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                1M+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">Medications Verified</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                500+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">Partner Organizations</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                99.9%
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">Accuracy Rate</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                24/7
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="verify" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-12 sm:p-16 lg:p-20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                <QrCode className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Ready to Verify
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent block">
                  Your Medicine?
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Scan any QR code or NFC tag on your medication packaging to instantly verify authenticity and access
                complete supply chain information
              </p>
              <Link href="/consumer/scan">
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group"
                >
                  <Scan className="h-7 w-7 mr-4 group-hover:rotate-12 transition-transform duration-300" />
                  Start Scanning Now
                  <ChevronRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card to-muted/20 border-t py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
              <span className="font-montserrat font-black text-2xl text-foreground">MedChain</span>
            </div>
            <div className="flex items-center space-x-8 text-sm">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t text-center">
            <p className="text-muted-foreground leading-relaxed">
              &copy; 2024 MedChain. All rights reserved. Securing medication authenticity with blockchain technology.
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Trusted by healthcare organizations worldwide for pharmaceutical supply chain integrity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
