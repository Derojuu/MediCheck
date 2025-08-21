"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Scan, Building2, Users, Pill, ChevronRight, QrCode, Activity, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-montserrat font-bold text-xl text-foreground">MedChain</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#verify"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Verify Drug
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="cursor-pointer">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Activity className="h-4 w-4 mr-2" />
            Blockchain-Powered Verification
          </Badge>
          <h1 className="font-montserrat font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
            Verify Any Medicine
            <span className="text-primary block">Instantly & Securely</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Protect yourself and your loved ones with our blockchain-powered medication verification system. Scan,
            verify, and trust with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consumer/scan">
              <Button size="lg" className="text-lg px-8 py-6 cursor-pointer">
                <Scan className="h-5 w-5 mr-2" />
                Scan Medicine Now
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent cursor-pointer">
                <Building2 className="h-5 w-5 mr-2" />
                Register Organization
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              Complete Medication Traceability
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From manufacturer to patient, every step is verified and secured on the blockchain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-montserrat">Manufacturers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create and track medication batches from production to distribution
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-montserrat">Distributors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage incoming shipments and outgoing transfers with full transparency
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-montserrat">Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Verify authenticity and manage inventory with real-time blockchain data
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-montserrat">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Instantly verify medication authenticity with a simple scan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="verify" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
            <QrCode className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Verify Your Medicine?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Scan any QR code or NFC tag on your medication packaging to instantly verify authenticity
            </p>
            <Link href="/consumer/scan">
              <Button size="lg" className="text-lg px-8 py-6 cursor-pointer">
                <Scan className="h-5 w-5 mr-2" />
                Start Scanning
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-montserrat font-bold text-lg">MedChain</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors cursor-pointer">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors cursor-pointer">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 MedChain. All rights reserved. Securing medication authenticity with blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
