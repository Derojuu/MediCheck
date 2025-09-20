"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Scan, User, Building2, MapPin, Activity, QrCode, Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function TeamMemberDashboard() {
  const [activeTab, setActiveTab] = useState("scan")
  const [scanResult, setScanResult] = useState<any>(null)

  // Mock user data
  const userProfile = {
    name: "Dr. Sarah Johnson",
    role: "Quality Control Manager",
    organization: "Pharma Corp Ltd.",
    organizationType: "Manufacturer",
    joinDate: "2023-06-15",
    email: "sarah.johnson@pharmacorp.com",
  }

  // Mock scan history
  const scanHistory = [
    {
      id: 1,
      batchId: "BTH-2024-001",
      drugName: "Paracetamol 500mg",
      scanTime: "2024-01-16 14:30:00",
      location: "Quality Control Lab",
      result: "Verified",
      notes: "Batch quality check passed",
    },
    {
      id: 2,
      batchId: "BTH-2024-002",
      drugName: "Amoxicillin 250mg",
      scanTime: "2024-01-16 11:15:00",
      location: "Production Floor",
      result: "Verified",
      notes: "Pre-shipment verification",
    },
    {
      id: 3,
      batchId: "BTH-2024-003",
      drugName: "Ibuprofen 400mg",
      scanTime: "2024-01-15 16:45:00",
      location: "Warehouse A",
      result: "Warning",
      notes: "Approaching expiry date",
    },
  ]

  const handleScan = () => {
    // Simulate QR/NFC scan
    const mockScanResult = {
      batchId: "BTH-2024-005",
      drugName: "Aspirin 100mg",
      manufacturer: "Pharma Corp Ltd.",
      status: "Verified",
      expiryDate: "2025-12-31",
      currentLocation: "Quality Control Lab",
      lastVerified: new Date().toISOString(),
    }
    setScanResult(mockScanResult)
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "Verified":
        return "bg-green-100 text-green-800"
      case "Warning":
        return "bg-yellow-100 text-yellow-800"
      case "Error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MedChain</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Building2 className="h-4 w-4 mr-2" />
                {userProfile.organizationType}
              </Badge>
              <Link href="/auth/login">
                <Button variant="outline" className="bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Team Member Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Welcome back, {userProfile.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR/NFC Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR/NFC Scanner
                </CardTitle>
                <CardDescription>Scan medication QR codes or NFC tags for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Position QR code or NFC tag in the scanner area</p>
                  <Button onClick={handleScan}>
                    <Scan className="h-4 w-4 mr-2" />
                    Simulate Scan
                  </Button>
                </div>

                {scanResult && (
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Scan Result</h3>
                      <Badge className={getResultColor(scanResult.status)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {scanResult.status}
                      </Badge>
                    </div>
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
                        <p className="font-medium">{scanResult.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Location</p>
                        <p className="font-medium">{scanResult.currentLocation}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Verified</p>
                        <p className="font-medium">{new Date(scanResult.lastVerified).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scan History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Scans
                </CardTitle>
                <CardDescription>Your recent medication verification activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{scan.batchId}</p>
                          <p className="text-sm text-muted-foreground">{scan.drugName}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {scan.scanTime}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {scan.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getResultColor(scan.result)}>{scan.result}</Badge>
                        {scan.notes && <p className="text-xs text-muted-foreground mt-1">{scan.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.role}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="font-medium">{userProfile.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{userProfile.organizationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Join Date:</span>
                    <span className="font-medium">{userProfile.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-xs">{userProfile.email}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Scans</span>
                  <span className="font-bold text-2xl">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold text-lg">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Verified</span>
                  <span className="font-bold text-lg text-green-600">245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Warnings</span>
                  <span className="font-bold text-lg text-yellow-600">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
