"use client"

import Link from "next/link"
import { Shield, ArrowLeft, FileCheck, Users, AlertTriangle, Scale, Copyright, Ban } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using MediCheck services.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last Updated: October 30, 2025
          </p>
        </div>

        <div className="space-y-6">
          {/* Acceptance of Terms */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <FileCheck className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Acceptance of Terms
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing or using MediCheck ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this Platform.
              </p>
              <p>
                These terms apply to all visitors, users, and others who access or use the service, including manufacturers, distributors, hospitals, pharmacies, regulators, and consumers.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Shield className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Service Description
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                MediCheck provides a blockchain-based medication verification platform that enables:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Authentication of pharmaceutical products through QR codes and NFC tags</li>
                <li>Supply chain tracking and transparency using Hedera blockchain technology</li>
                <li>Batch management and ownership transfer capabilities</li>
                <li>Real-time verification for consumers and healthcare providers</li>
                <li>Regulatory compliance and reporting tools</li>
              </ul>
              <p className="text-sm mt-4">
                The Platform is provided "as is" and we reserve the right to modify or discontinue services at any time without notice.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Users className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  User Accounts and Responsibilities
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Creation</h3>
                <p>You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Security</h3>
                <p>You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized access or security breaches.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Verification</h3>
                <p>Organizations may be required to complete verification procedures before accessing certain features. We reserve the right to verify your identity and credentials at any time.</p>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Ban className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Prohibited Uses
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree not to use the Platform to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit false, misleading, or fraudulent information</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Interfere with or disrupt the Platform's operation</li>
                <li>Attempt to gain unauthorized access to any systems</li>
                <li>Circumvent blockchain verification mechanisms</li>
                <li>Create counterfeit medications or verification codes</li>
                <li>Resell or redistribute Platform access without authorization</li>
              </ul>
            </CardContent>
          </Card>

          {/* Blockchain Disclaimer */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <AlertTriangle className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Blockchain Verification Disclaimer
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                While MediCheck uses blockchain technology to provide immutable verification records, users should be aware:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Blockchain verification confirms data integrity but does not guarantee medication quality</li>
                <li>The Platform provides authentication tools but does not replace professional medical advice</li>
                <li>Users are responsible for verifying medication authenticity through multiple channels</li>
                <li>Blockchain transactions are irreversible once confirmed</li>
                <li>We are not liable for blockchain network failures or delays</li>
              </ul>
              <p className="text-sm mt-4 font-semibold text-foreground">
                Always consult healthcare professionals regarding medication safety and usage.
              </p>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Scale className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Limitation of Liability
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To the maximum extent permitted by law, MediCheck and its affiliates shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from unauthorized access or data breaches</li>
                <li>Service interruptions or technical failures</li>
                <li>Third-party actions or content</li>
                <li>Reliance on Platform information for medical decisions</li>
              </ul>
              <p className="text-sm mt-4">
                Our total liability shall not exceed the amount paid by you for Platform services in the twelve months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Copyright className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Intellectual Property
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Platform and its original content, features, and functionality are owned by MediCheck and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our services without explicit written permission.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <AlertTriangle className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Termination
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.
              </p>
              <p>
                Upon termination, your right to use the Platform will cease immediately. Blockchain records created during your use will remain immutable on the network.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Scale className="h-6 w-6 mr-3 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Governing Law
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                These Terms shall be governed by and construed in accordance with applicable international laws and regulations governing pharmaceutical products and blockchain technology.
              </p>
              <p>
                Any disputes arising from these Terms or use of the Platform shall be resolved through binding arbitration in accordance with international arbitration rules.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-2 border-accent/10 shadow-lg backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center mb-4">
                If you have questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:hellomedicheck@gmail.com" className="text-primary hover:underline">
                  hellomedicheck@gmail.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground text-center">
                By continuing to use MediCheck, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </main>
    </div>
  )
}
