"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
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

export default function HomePage() {

  const { user, isSignedIn } = useUser();

  const { signOut } = useClerk();

  const role = user?.publicMetadata.role as string | undefined;

  const organizationType = user?.publicMetadata.organizationType as string | undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-foreground">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono">Blockchain Verified</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-10">
              <Link
                href="#verify"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2"
              >
                Verify Drug
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group py-2"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            {/* auth */}
            {isSignedIn ?
              (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    className=" justify-start cursor-pointer bg-accent text-white"
                    onClick={() => signOut({ redirectUrl: authRoutes.login })}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                  <Link
                    href={getRedirectPath(role, organizationType)}
                    className="inline-block rounded-xl bg-accent px-6 py-2 text-white font-semibold shadow-md hover:shadow-lg hover:bg-accent/90 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                </div>
              )
              :
              (
                <div className="flex items-center space-x-4">
                  <Link href={authRoutes.login}>
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 font-medium px-6 py-2.5"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href={authRoutes.register}>
                    <Button className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-medium px-6 py-2.5 animate-pulse-glow">
                      Get Started
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            {/*  */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto text-center animate-slide-in-up">
          <Badge
            variant="secondary"
            className="mb-8 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-primary/15 to-accent/15 text-primary border-primary/30 hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer"
          >
            <Award className="h-4 w-4 mr-2" />
            Enterprise-Grade Blockchain Security
          </Badge>

          <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground mb-10 leading-[0.9]">
            Verify Any Medicine
            <span className="text-gradient block mt-4 animate-fade-in-scale">Instantly & Securely</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-16 max-w-5xl mx-auto leading-relaxed font-light">
            Protect yourself and your loved ones with our enterprise-grade blockchain medication verification system.
            <span className="text-primary font-medium"> Scan, verify, and trust</span> with military-level security.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <Link href={publicRoutes.scan}>
              <Button
                size="lg"
                className="text-xl px-12 py-8 cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 group font-semibold rounded-2xl"
              >
                <Scan className="h-7 w-7 mr-4 group-hover:rotate-12 transition-transform duration-300" />
                Scan Medicine Now
                <ChevronRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href={authRoutes.register}>
              <Button
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 bg-transparent cursor-pointer border-2 border-primary/40 hover:border-primary hover:bg-primary/10 transition-all duration-500 group font-semibold rounded-2xl"
              >
                <Building2 className="h-7 w-7 mr-4 group-hover:scale-110 transition-transform duration-300" />
                Register Organization
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="flex items-center gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6" />
                <span className="font-bold text-lg">99.9%</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">Accuracy Rate</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="flex items-center gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-6 w-6" />
                <span className="font-bold text-lg">256-bit</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">Encryption</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="flex items-center gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6" />
                <span className="font-bold text-lg">&lt;2s</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">Verification</span>
            </div>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="flex items-center gap-2 text-accent group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
                <span className="font-bold text-lg">1M+</span>
              </div>
              <span className="text-sm text-muted-foreground font-medium">Verified Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Badge
              variant="outline"
              className="mb-6 px-6 py-3 text-sm font-semibold border-primary/30 text-primary bg-primary/5"
            >
              <Star className="h-4 w-4 mr-2" />
              Complete Enterprise Solution
            </Badge>
            <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-8">
              Complete Medication
              <span className="text-gradient block mt-2">Traceability Ecosystem</span>
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              From manufacturer to patient, every step is verified and secured on the blockchain with
              <span className="text-primary font-medium"> real-time tracking and advanced analytics</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <Card className="group text-center hover:shadow-2xl transition-all duration-700 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-4 cursor-pointer glass-effect">
              <CardHeader className="pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Building2 className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-bold text-2xl mb-4">Manufacturers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Create and track medication batches from production to distribution with complete transparency and
                  real-time analytics
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-700 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-4 cursor-pointer glass-effect">
              <CardHeader className="pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Globe className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-bold text-2xl mb-4">Distributors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Manage incoming shipments and outgoing transfers with full transparency and automated compliance
                  reporting
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-700 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-4 cursor-pointer glass-effect">
              <CardHeader className="pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Pill className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-bold text-2xl mb-4">Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Verify authenticity and manage inventory with real-time blockchain data and intelligent automated
                  alerts
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-2xl transition-all duration-700 border-0 bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-4 cursor-pointer glass-effect">
              <CardHeader className="pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Users className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="font-bold text-2xl mb-4">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Instantly verify medication authenticity with a simple scan and access complete medication history and
                  safety data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="group cursor-pointer">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-500">
                1M+
              </div>
              <div className="text-base sm:text-lg text-muted-foreground font-medium">Medications Verified Daily</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-500">
                500+
              </div>
              <div className="text-base sm:text-lg text-muted-foreground font-medium">Enterprise Partners</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-500">
                99.9%
              </div>
              <div className="text-base sm:text-lg text-muted-foreground font-medium">Accuracy Guarantee</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-500">
                24/7
              </div>
              <div className="text-base sm:text-lg text-muted-foreground font-medium">Global Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="verify" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-primary/15 via-accent/10 to-primary/15 rounded-3xl p-16 sm:p-20 lg:p-24 overflow-hidden glass-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl"></div>
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mb-12 shadow-2xl animate-pulse-glow">
                <QrCode className="h-12 w-12 text-white" />
              </div>
              <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-8">
                Ready to Verify
                <span className="text-gradient block mt-4">Your Medicine?</span>
              </h2>
              <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                Scan any QR code or NFC tag on your medication packaging to instantly verify authenticity and access
                <span className="text-primary font-medium"> complete supply chain intelligence</span>
              </p>
              <Link href={publicRoutes.scan}>
                <Button
                  size="lg"
                  className="text-2xl px-16 py-10 cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 group font-semibold rounded-2xl"
                >
                  <Scan className="h-8 w-8 mr-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Scanning Now
                  <ChevronRight className="h-7 w-7 ml-4 group-hover:translate-x-3 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card/80 to-muted/40 border-t py-20 px-4 sm:px-6 lg:px-8 glass-effect">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-3xl text-foreground">MedChain</span>
                <span className="text-sm text-muted-foreground font-mono">Enterprise Blockchain Security</span>
              </div>
            </div>
            <div className="flex items-center space-x-10 text-base">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer font-medium relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>
          <div className="pt-12 border-t text-center">
            <p className="text-muted-foreground leading-relaxed text-lg mb-3">
              &copy; 2024 MedChain. All rights reserved. Securing medication authenticity with enterprise blockchain
              technology.
            </p>
            <p className="text-base text-muted-foreground/80">
              Trusted by healthcare organizations worldwide for pharmaceutical supply chain integrity and patient
              safety.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
