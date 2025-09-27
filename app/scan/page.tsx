"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { QRScanner } from "@/components/qr-scanner";
import { publicRoutes, authRoutes } from "@/utils";
import { useUser } from "@clerk/nextjs";
import { getRedirectPath } from "@/utils";
import {
  Shield,
  Scan,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  History,
  QrCode,
} from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const { user, isSignedIn } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const organizationType = user?.publicMetadata.organizationType as string | undefined;

  // Handle QR code scan results
  const handleQRScan = (qrData: string) => {
    if (qrData) {
      window.location.href = qrData;
    }
  }

  // Handle QR scanner errors
  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error)
    // You could show an error message to the user here
  }

  const handleScan = () => {
    setIsScanning(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "genuine":
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case "fake":
        return <XCircle className="h-8 w-8 text-red-600" />
      case "suspicious":
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />
      default:
        return <Scan className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "genuine":
        return "border-green-200 bg-green-50"
      case "fake":
        return "border-red-200 bg-red-50"
      case "suspicious":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-border bg-card"
    }
  }

  // Mobile header for extra polish
  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">MediCheck</span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <MobileHeader />
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-accent/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-accent/8 rounded-full blur-xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg glass-effect hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href={publicRoutes.home} className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MediCheck</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            {isSignedIn ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle />
                <Link href={getRedirectPath(role, organizationType)}>
                  <Button 
                    variant="gradient"
                    size="sm"
                    className="cursor-pointer font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm px-3 sm:px-6"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dash</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggle />
                <Link href={authRoutes.register}>
                  <Button variant="outline" size="sm" className="cursor-pointer font-medium text-xs sm:text-sm px-3 sm:px-6">
                    <span className="hidden sm:inline">Create Account</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
                <Link href={authRoutes.login}>
                  <Button 
                    variant="gradient"
                    size="sm"
                    className="cursor-pointer font-medium shadow-lg hover:shadow-xl text-xs sm:text-sm px-3 sm:px-6"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <Link
            href={publicRoutes.home}
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 cursor-pointer transition-colors duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Verify Your Medicine</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Scan the QR code or NFC tag on your medication packaging</p>
        </div>
        <Card className="max-w-2xl mx-auto border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 glass-effect">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center font-bold">
              <QrCode className="h-6 w-6 mr-2 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medicine Scanner</span>
            </CardTitle>
            <CardDescription>Position your medication's QR code or NFC tag in the scanner area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <QRScanner
                onScan={handleQRScan}
                onError={handleQRError}
                width={320}
                height={240}
                facingMode="environment"
                className="mx-auto"
              />
              <p className="text-muted-foreground mt-4">Position the QR code within the scanning area</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
