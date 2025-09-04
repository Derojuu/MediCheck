"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      // Mock different scan results
      const results = [
        {
          status: "genuine",
          batchId: "BTH-2024-001",
          drugName: "Paracetamol 500mg",
          manufacturer: "Pharma Corp Ltd.",
          expiryDate: "2025-12-15",
          firstDistributedTo: "Metro Medical Distributors",
          lastVerifiedAt: "Downtown Pharmacy, New York",
          verificationCount: 23,
          blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        },
        {
          status: "fake",
          message: "This medication could not be verified in our blockchain database.",
          reportSuggestion: "Please report this to authorities immediately.",
        },
        {
          status: "suspicious",
          batchId: "BTH-2024-002",
          drugName: "Amoxicillin 250mg",
          manufacturer: "Unknown Manufacturer",
          warning: "This batch has been scanned multiple times in different cities within 24 hours.",
          locations: ["New York", "Los Angeles", "Chicago"],
        },
      ]

      const randomResult = results[Math.floor(Math.random() * results.length)]
      setScanResult(randomResult)
      setIsScanning(false)
    }, 2000)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MedChain</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/register">
                <Button variant="outline" className="cursor-pointer bg-transparent border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                  Create Account
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 cursor-pointer transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Verify Your Medicine</h1>
          <p className="text-muted-foreground">Scan the QR code or NFC tag on your medication packaging</p>
        </div>

        {!scanResult ? (
          <Card className="max-w-2xl mx-auto border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center font-bold">
                <QrCode className="h-6 w-6 mr-2 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medicine Scanner</span>
              </CardTitle>
              <CardDescription>Position your medication's QR code or NFC tag in the scanner area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="animate-spin mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-muted-foreground">Scanning and verifying on blockchain...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Click the button below to start scanning</p>
                    <Button size="lg" onClick={handleScan} className="cursor-pointer">
                      <Scan className="h-5 w-5 mr-2" />
                      Start Scan
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Scan Result */}
            <Card className={`max-w-2xl mx-auto ${getStatusColor(scanResult.status)}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">{getStatusIcon(scanResult.status)}</div>
                <CardTitle className="text-2xl">
                  {scanResult.status === "genuine" && "Genuine Medicine ✓"}
                  {scanResult.status === "fake" && "Fake Medicine Detected ⚠️"}
                  {scanResult.status === "suspicious" && "Suspicious Activity ⚠️"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scanResult.status === "genuine" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Batch ID</p>
                        <p className="font-medium">{scanResult.batchId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Drug Name</p>
                        <p className="font-medium">{scanResult.drugName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Manufacturer</p>
                        <p className="font-medium">{scanResult.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expiry Date</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {scanResult.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">First Distributed To</p>
                        <p className="font-medium">{scanResult.firstDistributedTo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Verified At</p>
                        <p className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {scanResult.lastVerifiedAt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Verified {scanResult.verificationCount} times • Blockchain: {scanResult.blockchainHash}
                      </p>
                    </div>
                  </div>
                )}

                {scanResult.status === "fake" && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{scanResult.message}</AlertDescription>
                    </Alert>
                    <p className="text-sm text-muted-foreground">{scanResult.reportSuggestion}</p>
                  </div>
                )}

                {scanResult.status === "suspicious" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Batch ID</p>
                        <p className="font-medium">{scanResult.batchId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Drug Name</p>
                        <p className="font-medium">{scanResult.drugName}</p>
                      </div>
                    </div>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{scanResult.warning}</AlertDescription>
                    </Alert>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Recent scan locations:</p>
                      <div className="flex flex-wrap gap-2">
                        {scanResult.locations.map((location: string, index: number) => (
                          <Badge key={index} variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button onClick={() => setScanResult(null)} className="cursor-pointer">
                <Scan className="h-4 w-4 mr-2" />
                Scan Another
              </Button>
              <Link href="/auth/register">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with AI for Usage Guidance
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="cursor-pointer bg-transparent">
                  <History className="h-4 w-4 mr-2" />
                  Save to History
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Need More Information?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Create a free account to access additional features:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    AI-powered medication guidance and safety information
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Save verification history for future reference
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Receive alerts for recalls and expiry notifications
                  </li>
                </ul>
                <div className="pt-4">
                  <Link href="/auth/register">
                    <Button className="w-full cursor-pointer">Create Free Account</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
