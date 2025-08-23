"use client"

import { useState, useRef } from "react"
import {
  Camera,
  QrCode,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  History,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock scan results
const mockScanResults = [
  {
    id: "genuine-1",
    status: "genuine",
    drugName: "Paracetamol 500mg",
    batchId: "BT-2024-001",
    manufacturer: "PharmaCorp Ltd",
    expiryDate: "2025-12-15",
    verificationScore: 98,
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    scanTime: new Date().toISOString(),
  },
  {
    id: "suspicious-1",
    status: "suspicious",
    drugName: "Amoxicillin 250mg",
    batchId: "BT-2024-002",
    manufacturer: "Unknown",
    expiryDate: "2024-08-20",
    verificationScore: 45,
    blockchainHash: null,
    scanTime: new Date().toISOString(),
  },
  {
    id: "fake-1",
    status: "fake",
    drugName: "Ibuprofen 400mg",
    batchId: "INVALID",
    manufacturer: "Counterfeit Source",
    expiryDate: "Unknown",
    verificationScore: 12,
    blockchainHash: null,
    scanTime: new Date().toISOString(),
  },
]

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [scanMethod, setScanMethod] = useState("qr") // 'qr' or 'nfc'
  const videoRef = useRef(null)

  const startScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    // Simulate camera access
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }
    } catch (error) {
      console.log("Camera access denied or not available")
    }

    // Simulate scan delay
    setTimeout(() => {
      const randomResult = mockScanResults[Math.floor(Math.random() * mockScanResults.length)]
      setScanResult(randomResult)
      setScanHistory((prev) => [randomResult, ...prev.slice(0, 9)]) // Keep last 10 scans
      setIsScanning(false)

      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }, 3000)
  }

  const stopScan = () => {
    setIsScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "genuine":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "suspicious":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "fake":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "genuine":
        return <CheckCircle className="w-5 h-5" />
      case "suspicious":
        return <AlertTriangle className="w-5 h-5" />
      case "fake":
        return <XCircle className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/organization"
              className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Medication Scanner</h1>
              <p className="text-slate-600">Verify medication authenticity instantly</p>
            </div>
          </div>
          <Button variant="outline" className="cursor-pointer bg-transparent">
            <History className="w-4 h-4 mr-2" />
            Scan History
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="w-6 h-6 text-cyan-600" />
                <span>Scanner</span>
              </CardTitle>

              {/* Scan Method Toggle */}
              <div className="flex justify-center space-x-2 mt-4">
                <Button
                  variant={scanMethod === "qr" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScanMethod("qr")}
                  className="cursor-pointer"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button
                  variant={scanMethod === "nfc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScanMethod("nfc")}
                  className="cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  NFC
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Camera/Scanner View */}
              <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden">
                {isScanning ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-cyan-400 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>

                        {/* Scanning Line Animation */}
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                        Scanning... Please hold steady
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="w-12 h-12 text-slate-400" />
                      </div>
                      <p className="text-slate-400">
                        {scanMethod === "qr" ? "Position QR code in frame" : "Hold device near NFC tag"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scan Controls */}
              <div className="flex justify-center space-x-4">
                {!isScanning ? (
                  <Button
                    onClick={startScan}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scan
                  </Button>
                ) : (
                  <Button onClick={stopScan} variant="outline" className="px-8 py-3 cursor-pointer bg-transparent">
                    Stop Scan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {scanResult && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Scan Result</span>
                    <Badge className={`${getStatusColor(scanResult.status)} border`}>
                      {getStatusIcon(scanResult.status)}
                      <span className="ml-2 capitalize">{scanResult.status}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Drug Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{scanResult.drugName}</h3>
                      <p className="text-slate-600">Batch ID: {scanResult.batchId}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Manufacturer:</span>
                        <p className="font-medium">{scanResult.manufacturer}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Expiry Date:</span>
                        <p className="font-medium">{scanResult.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Verification Score</span>
                      <span className="font-bold text-lg">{scanResult.verificationScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          scanResult.verificationScore >= 80
                            ? "bg-emerald-500"
                            : scanResult.verificationScore >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${scanResult.verificationScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  {scanResult.blockchainHash && (
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-slate-900">Blockchain Verification</h4>
                      <p className="text-xs font-mono text-slate-600 break-all">{scanResult.blockchainHash}</p>
                      <div className="flex items-center space-x-2 text-sm text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified on blockchain</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Scans */}
            {scanHistory.length > 0 && (
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scanHistory.slice(0, 5).map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(scan.status)}
                          <div>
                            <p className="font-medium text-sm">{scan.drugName}</p>
                            <p className="text-xs text-slate-600">{scan.batchId}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(scan.status)}>
                          {scan.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
