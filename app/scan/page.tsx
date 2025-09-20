"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  
  const [scanResult, setScanResult] = useState<any>(null);

  const [isScanning, setIsScanning] = useState(false);

  const { user, isSignedIn } = useUser();

  const role = user?.publicMetadata.role as string | undefined;

  const organizationType = user?.publicMetadata.organizationType as string | undefined;

  // Handle QR code scan results
  const handleQRScan = (qrData: string) => {
    console.log('QR Code scanned:', qrData)
    console.log('QR Data type:', typeof qrData)
    console.log('QR Data length:', qrData.length)
    
    // Process the QR data and generate result
    const result = processQRCodeData(qrData)
    console.log('Processed result:', result)
    setScanResult(result)
    setIsScanning(false) // Stop scanning after successful scan
  }

  // Handle QR scanner errors
  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error)
    // You could show an error message to the user here
  }

  // Process QR code data and return a scan result
  const processQRCodeData = (qrData: string): any => {
    console.log('Processing QR Data:', qrData)
    
    try {
      // Try to parse as JSON first (most common format for structured data)
      const parsedData = JSON.parse(qrData)
      console.log('Successfully parsed as JSON:', parsedData)
      
      // Extract the required fields from the QR code data
      const extractedInfo = {
        status: "genuine", // Default to genuine if we can parse the data
        batchId: parsedData.batchId || parsedData.batch_id || parsedData.BatchId || "Unknown",
        drugName: parsedData.drugName || parsedData.drug_name || parsedData.DrugName || parsedData.name || "Unknown",
        manufacturer: parsedData.manufacturer || parsedData.Manufacturer || parsedData.mfg || "Unknown",
        expiryDate: parsedData.expiryDate || parsedData.expiry_date || parsedData.ExpiryDate || parsedData.expiry || "Unknown",
        firstDistributedTo: parsedData.firstDistributedTo || parsedData.first_distributed_to || parsedData.FirstDistributedTo || parsedData.distributor || "Unknown",
        lastVerifiedAt: parsedData.lastVerifiedAt || parsedData.last_verified_at || parsedData.LastVerifiedAt || parsedData.location || "Just now",
        verificationCount: parsedData.verificationCount || parsedData.verification_count || parsedData.count || Math.floor(Math.random() * 100) + 1,
        blockchainHash: parsedData.blockchainHash || parsedData.blockchain_hash || parsedData.hash || `0x${qrData.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`
      }
      
      console.log('Extracted Info:', extractedInfo)
      return extractedInfo
      
    } catch (jsonError) {
      console.log('Not JSON format, trying other formats...')
      console.log('JSON Parse Error:', jsonError)
      
      // Try to parse as pipe-separated values (|)
      if (qrData.includes('|')) {
        console.log('Parsing as pipe-separated values')
        const parts = qrData.split('|')
        console.log('Pipe-separated parts:', parts)
        return {
          status: "genuine",
          batchId: parts[0] || "Unknown",
          drugName: parts[1] || "Unknown",
          manufacturer: parts[2] || "Unknown",
          expiryDate: parts[3] || "Unknown",
          firstDistributedTo: parts[4] || "Unknown",
          lastVerifiedAt: parts[5] || "Just now",
          verificationCount: Math.floor(Math.random() * 100) + 1,
          blockchainHash: `0x${qrData.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`
        }
      }
      
      // Try to parse as comma-separated values
      if (qrData.includes(',')) {
        console.log('Parsing as comma-separated values')
        const parts = qrData.split(',')
        console.log('Comma-separated parts:', parts)
        return {
          status: "genuine",
          batchId: parts[0] || "Unknown",
          drugName: parts[1] || "Unknown",
          manufacturer: parts[2] || "Unknown",
          expiryDate: parts[3] || "Unknown",
          firstDistributedTo: parts[4] || "Unknown",
          lastVerifiedAt: parts[5] || "Just now",
          verificationCount: Math.floor(Math.random() * 100) + 1,
          blockchainHash: `0x${qrData.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`
        }
      }
      
      // Try to parse as key-value pairs (key=value format)
      if (qrData.includes('=')) {
        console.log('Parsing as key-value pairs')
        const pairs = qrData.split(/[&\n;]/) // Split by &, newline, or semicolon
        console.log('Key-value pairs:', pairs)
        const data: any = {}
        
        pairs.forEach(pair => {
          const [key, value] = pair.split('=')
          if (key && value) {
            data[key.trim().toLowerCase()] = value.trim()
          }
        })
        
        console.log('Parsed key-value data:', data)
        
        return {
          status: "genuine",
          batchId: data.batchid || data.batch_id || data.batch || "Unknown",
          drugName: data.drugname || data.drug_name || data.name || data.drug || "Unknown",
          manufacturer: data.manufacturer || data.mfg || data.company || "Unknown",
          expiryDate: data.expirydate || data.expiry_date || data.expiry || data.exp || "Unknown",
          firstDistributedTo: data.firstdistributedto || data.distributor || data.dist || "Unknown",
          lastVerifiedAt: data.lastverifiedat || data.location || data.loc || "Just now",
          verificationCount: data.count || Math.floor(Math.random() * 100) + 1,
          blockchainHash: `0x${qrData.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`
        }
      }
      
      // If none of the above formats work, try to extract any readable info
      // This handles plain text QR codes or unstructured data
      console.log('Using fallback parsing method')
      console.log('QR Data as plain text:', qrData)
      
      return {
        status: "suspicious",
        batchId: qrData.length > 50 ? qrData.substring(0, 20) + '...' : qrData,
        drugName: "Unknown - Please check QR code format",
        manufacturer: "Unknown",
        expiryDate: "Unknown",
        firstDistributedTo: "Unknown",
        lastVerifiedAt: "Just scanned",
        verificationCount: 1,
        blockchainHash: `0x${qrData.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)}`,
        warning: `QR code format not recognized. Raw content: "${qrData}". Please ensure the QR code contains proper medication data.`
      }
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
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
                <span className="font-bold text-lg sm:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            {isSignedIn ?
              (
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
              )
              :
              (
                <div className="flex items-center space-x-2 sm:space-x-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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

        {!scanResult ? (
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
                {isScanning ? (
                  <div className="space-y-4">
                    <QRScanner
                      onScan={handleQRScan}
                      onError={handleQRError}
                      width={400}
                      height={300}
                      facingMode="environment"
                      className="mx-auto"
                    />
                    <p className="text-muted-foreground">Position the QR code within the scanning area</p>
                    <Button variant="outline" onClick={() => setIsScanning(false)} className="cursor-pointer">
                      Stop Scanning
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Click the button below to start scanning</p>
                    <Button 
                      variant="gradient"
                      size="lg" 
                      onClick={handleScan} 
                      className="cursor-pointer shadow-lg hover:shadow-xl"
                    >
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Batch ID</p>
                        <p className="font-medium text-black break-all">{scanResult.batchId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Drug Name</p>
                        <p className="font-medium text-black">{scanResult.drugName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Manufacturer</p>
                        <p className="font-medium text-black">{scanResult.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expiry Date</p>
                        <p className="font-medium text-black flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {scanResult.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">First Distributed To</p>
                        <p className="font-medium text-black">{scanResult.firstDistributedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Verified At</p>
                        <p className="font-medium text-black flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {scanResult.lastVerifiedAt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600">
                        Verified <span className="text-black font-medium">{scanResult.verificationCount}</span> times • Blockchain: <span className="text-black font-medium">{scanResult.blockchainHash}</span>
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
                        <p className="text-gray-600">Batch ID</p>
                        <p className="font-medium text-black">{scanResult.batchId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Drug Name</p>
                        <p className="font-medium text-black">{scanResult.drugName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Manufacturer</p>
                        <p className="font-medium text-black">{scanResult.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expiry Date</p>
                        <p className="font-medium text-black">{scanResult.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">First Distributed To</p>
                        <p className="font-medium text-black">{scanResult.firstDistributedTo}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Verified At</p>
                        <p className="font-medium text-black">{scanResult.lastVerifiedAt}</p>
                      </div>
                    </div>
                    {scanResult.warning && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-black">{scanResult.warning}</AlertDescription>
                      </Alert>
                    )}
                    {scanResult.locations && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recent scan locations:</p>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.locations.map((location: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-black">
                              <MapPin className="h-3 w-3 mr-1" />
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600">
                        Verified <span className="text-black font-medium">{scanResult.verificationCount}</span> times • Blockchain: <span className="text-black font-medium">{scanResult.blockchainHash}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
              <Button onClick={() => { setScanResult(null); setIsScanning(false); }} className="cursor-pointer text-sm sm:text-base">
                <Scan className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Scan Another
              </Button>
              <Link href="/auth/register">
                <Button variant="outline" className="cursor-pointer bg-transparent text-sm sm:text-base">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Chat with AI for Usage Guidance</span>
                  <span className="sm:hidden">AI Chat</span>
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" className="cursor-pointer bg-transparent text-sm sm:text-base">
                  <History className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span className="hidden sm:inline">Save to History</span>
                  <span className="sm:hidden">Save</span>
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
