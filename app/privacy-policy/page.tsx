"use client"

import Link from "next/link"
import { Shield, ArrowLeft, Lock, Eye, Database, UserCheck, FileText, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-accent/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1.5 sm:p-2 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl text-foreground">MediCheck</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last Updated: October 30, 2025
          </p>
        </div>

        <div className="space-y-6">
          {/* Information We Collect */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Database className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Information We Collect
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                <p>When you register for MediCheck, we collect your name, email address, organization details, and role information to create and manage your account.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Verification Data</h3>
                <p>When you scan medications, we collect QR code data, batch information, and verification timestamps to provide our blockchain-based authentication services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
                <p>We automatically collect information about how you interact with our platform, including IP addresses, browser types, and access times for security and improvement purposes.</p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Eye className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  How We Use Your Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our medication verification services</li>
                <li>To authenticate and secure transactions on the blockchain</li>
                <li>To communicate with you about service updates and important notices</li>
                <li>To improve our platform and develop new features</li>
                <li>To detect, prevent, and address fraud and security issues</li>
                <li>To comply with legal obligations and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Lock className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Data Security
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>End-to-end encryption for all data transmissions</li>
                <li>Blockchain technology for immutable verification records</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Regular security audits and penetration testing</li>
                <li>Strict access controls and authentication protocols</li>
              </ul>
              <p className="text-sm mt-4">
                While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <UserCheck className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Your Privacy Rights
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-foreground">Correction:</strong> Update or correct inaccurate information</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-foreground">Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong className="text-foreground">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong className="text-foreground">Object:</strong> Object to certain processing of your data</li>
              </ul>
              <p className="text-sm mt-4">
                To exercise these rights, please contact us at hellomedicheck@gmail.com
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <FileText className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Cookies and Tracking
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-foreground">Essential Cookies:</strong> Required for platform functionality and security</li>
                <li><strong className="text-foreground">Performance Cookies:</strong> Help us understand how users interact with our platform</li>
                <li><strong className="text-foreground">Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-sm mt-4">
                You can control cookies through your browser settings, but disabling them may affect platform functionality.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Contact Us
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong className="text-foreground">Email:</strong> hellomedicheck@gmail.com</p>
                <p><strong className="text-foreground">Support:</strong> hellomedicheck@gmail.com</p>
              </div>
              <div className="mt-6">
                <Link href="/contact">
                  <Button variant="gradient" className="cursor-pointer">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="border-2 border-accent/10 shadow-lg backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of MediCheck after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </main>
    </div>
  )
}
