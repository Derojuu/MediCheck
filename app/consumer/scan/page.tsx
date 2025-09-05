"use client"

import { useState, useRef } from "react"
import { QrCode, CheckCircle, AlertTriangle, XCircle, ArrowLeft, MessageCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QRScanner } from "@/components/qr-scanner"
import Link from "next/link"

interface ChatMessage {
  type: "user" | "ai"
  content: string
}

interface ScanResult {
  id: string
  status: "genuine" | "suspicious" | "fake"
  drugName: string
  batchId: string
  manufacturer: string
  expiryDate: string
  verificationScore: number
  safetyRating: string
  aiRecommendation: string
  sideEffects: string[]
  dosage: string
}

// Mock scan results for consumers
const mockConsumerResults: ScanResult[] = [
  {
    id: "consumer-genuine-1",
    status: "genuine",
    drugName: "Paracetamol 500mg",
    batchId: "BT-2024-001",
    manufacturer: "PharmaCorp Ltd",
    expiryDate: "2025-12-15",
    verificationScore: 98,
    safetyRating: "Safe to Use",
    aiRecommendation: "This medication is authentic and safe. Take as prescribed by your healthcare provider.",
    sideEffects: ["Nausea", "Dizziness", "Stomach upset"],
    dosage: "Take 1-2 tablets every 4-6 hours as needed",
  },
  {
    id: "consumer-suspicious-1",
    status: "suspicious",
    drugName: "Amoxicillin 250mg",
    batchId: "BT-2024-002",
    manufacturer: "Unknown",
    expiryDate: "2024-08-20",
    verificationScore: 45,
    safetyRating: "Caution Required",
    aiRecommendation: "This medication shows suspicious characteristics. Please consult your pharmacist before use.",
    sideEffects: ["Unknown"],
    dosage: "Consult healthcare provider",
  },
]

export default function ConsumerScanPage() {

  const [isScanning, setIsScanning] = useState(false)

  const [scanResult, setScanResult] = useState<ScanResult | null > (null)
  
  const [showAIChat, setShowAIChat] = useState(false)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]> ([])
  
  const [chatInput, setChatInput] = useState("")

  const [lastScanTime, setLastScanTime] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle QR code scan results
  const handleQRScan = (qrData: string) => {
    console.log('QR Code scanned:', qrData)
    
    // Process the QR data and generate result
    const result = processQRCodeData(qrData)
    setScanResult(result)
    setLastScanTime(new Date().toLocaleTimeString())
  }

  // Handle QR scanner errors
  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error)
    // You could show an error message to the user here
  }

  // Process QR code data and return a scan result
  const processQRCodeData = (qrData: string): ScanResult => {
    // In a real app, you would send this to your backend API
    // For now, we'll simulate based on the QR data content

    try {
      // Try to parse JSON data
      const parsedData = JSON.parse(qrData)

      if (parsedData.drugName && parsedData.batchId) {
        // Real medicine data
        return {
          id: `scan-${Date.now()}`,
          status: parsedData.status || "genuine",
          drugName: parsedData.drugName,
          batchId: parsedData.batchId,
          manufacturer: parsedData.manufacturer || "Unknown Manufacturer",
          expiryDate: parsedData.expiryDate || "Unknown",
          verificationScore: parsedData.verificationScore || 95,
          safetyRating: parsedData.safetyRating || "Safe to Use",
          aiRecommendation: parsedData.aiRecommendation || "This medication appears to be authentic. Follow prescribed dosage.",
          sideEffects: parsedData.sideEffects || ["Consult healthcare provider"],
          dosage: parsedData.dosage || "Follow prescription instructions",
        }
      }
    } catch (e) {
      // Not JSON, treat as plain text or demo data
    }

    // For demo purposes, return a random result based on QR content
    const isDemo = qrData.includes('demo') || qrData.includes('test')
    const randomResult = mockConsumerResults[Math.floor(Math.random() * mockConsumerResults.length)]

    return {
      ...randomResult,
      id: `scan-${Date.now()}`,
      // Add the scanned QR data for reference
      batchId: qrData.length > 20 ? qrData.substring(0, 20) + '...' : qrData
    }
  }

  const stopScan = () => {
    setIsScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track: MediaStreamTrack) => track.stop())
    }
  }

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = { type: "user", content: chatInput }
    const aiResponse: ChatMessage = {
      type: "ai",
      content: `Based on your scan of ${scanResult?.drugName}, I recommend following the prescribed dosage. ${scanResult?.aiRecommendation}`,
    }

    setChatMessages([...chatMessages, userMessage, aiResponse])
    setChatInput("")
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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
            <Link href="/consumer/profile" className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Verify Your Medication</h1>
              <p className="text-slate-600">Scan to check authenticity and get AI guidance</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowAIChat(!showAIChat)} className="cursor-pointer border-primary/20 hover:border-primary/40 hover:bg-primary/5">
            <MessageCircle className="w-4 h-4 mr-2 text-primary" />
            AI Assistant
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-2 font-bold">
                  <QrCode className="w-6 h-6 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medication Scanner</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* QR Scanner */}
                <div className="flex justify-center">
                  <QRScanner
                    onScan={handleQRScan}
                    onError={handleQRError}
                    width={400}
                    height={300}
                    facingMode="environment"
                    autoStart={true}
                    className="mx-auto"
                  />
                </div>

                {/* Scan Controls */}
                <div className="flex justify-center">
                  {!isScanning ? (
                    <Button
                      onClick={() => setIsScanning(true)}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Scan Medication
                    </Button>
                  ) : (
                    <Button onClick={stopScan} variant="outline" className="px-8 py-3 cursor-pointer bg-transparent border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                      Stop Scan
                    </Button>
                  )}
                </div>

                {/* Scan Result */}
                {scanResult && (
                  <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between font-bold">
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Verification Result</span>
                        <Badge className={`${getStatusColor(scanResult.status)} border-primary/20`}>
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
                          <p className="text-slate-600">Manufactured by {scanResult.manufacturer}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Batch ID:</span>
                            <p className="font-medium">{scanResult.batchId}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">Expires:</span>
                            <p className="font-medium">{scanResult.expiryDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Safety Information */}
                      <div className={`p-4 rounded-lg border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 ${getStatusColor(scanResult.status)}`}>
                        <h4 className="font-bold mb-2">Safety Assessment</h4>
                        <p className="text-sm">{scanResult.safetyRating}</p>
                      </div>

                      {/* Dosage Information */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900">Recommended Dosage</h4>
                        <p className="text-sm text-slate-600">{scanResult.dosage}</p>
                      </div>

                      {/* Side Effects */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900">Possible Side Effects</h4>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.sideEffects.map((effect: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Assistant */}
          <div className={`${showAIChat ? "block" : "hidden lg:block"}`}>
            <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-bold">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Health Assistant</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3 h-64 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm">Ask me anything about your medication!</p>
                    </div>
                  ) : (
                    chatMessages.map((message: ChatMessage, index: number) => (
                      <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.type === "user" 
                              ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg" 
                              : "bg-gradient-to-r from-primary/5 to-accent/5 text-slate-900 border border-primary/10"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Ask about dosage, side effects..."
                    className="flex-1 px-3 py-2 border-2 border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 text-sm hover:border-primary/30 transition-colors duration-200"
                  />
                  <Button onClick={sendChatMessage} size="sm" className="cursor-pointer bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg">
                    Send
                  </Button>
                </div>

                {/* AI Recommendation */}
                {scanResult && (
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <h4 className="font-bold text-primary mb-2">AI Recommendation</h4>
                    <p className="text-sm text-slate-800">{scanResult.aiRecommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
