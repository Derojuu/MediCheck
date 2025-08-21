"use client"

import { useState, useRef } from "react"
import { Camera, QrCode, CheckCircle, AlertTriangle, XCircle, ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock scan results for consumers
const mockConsumerResults = [
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
  const [scanResult, setScanResult] = useState(null)
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState("")
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
      const randomResult = mockConsumerResults[Math.floor(Math.random() * mockConsumerResults.length)]
      setScanResult(randomResult)
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

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = { type: "user", content: chatInput }
    const aiResponse = {
      type: "ai",
      content: `Based on your scan of ${scanResult?.drugName}, I recommend following the prescribed dosage. ${scanResult?.aiRecommendation}`,
    }

    setChatMessages([...chatMessages, userMessage, aiResponse])
    setChatInput("")
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
            <Link href="/consumer/profile" className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Verify Your Medication</h1>
              <p className="text-slate-600">Scan to check authenticity and get AI guidance</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowAIChat(!showAIChat)} className="cursor-pointer">
            <MessageCircle className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <QrCode className="w-6 h-6 text-cyan-600" />
                  <span>Medication Scanner</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Camera/Scanner View */}
                <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
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
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                          Scanning medication...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                          <Camera className="w-12 h-12 text-slate-400" />
                        </div>
                        <p className="text-slate-400">Position medication QR code in frame</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Controls */}
                <div className="flex justify-center">
                  {!isScanning ? (
                    <Button
                      onClick={startScan}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 cursor-pointer"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Scan Medication
                    </Button>
                  ) : (
                    <Button onClick={stopScan} variant="outline" className="px-8 py-3 cursor-pointer bg-transparent">
                      Stop Scan
                    </Button>
                  )}
                </div>

                {/* Scan Result */}
                {scanResult && (
                  <Card className="border border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Verification Result</span>
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
                      <div className={`p-4 rounded-lg border ${getStatusColor(scanResult.status)}`}>
                        <h4 className="font-medium mb-2">Safety Assessment</h4>
                        <p className="text-sm">{scanResult.safetyRating}</p>
                      </div>

                      {/* Dosage Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-900">Recommended Dosage</h4>
                        <p className="text-sm text-slate-600">{scanResult.dosage}</p>
                      </div>

                      {/* Side Effects */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-900">Possible Side Effects</h4>
                        <div className="flex flex-wrap gap-2">
                          {scanResult.sideEffects.map((effect, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
            <Card className="border-0 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-cyan-600" />
                  <span>AI Health Assistant</span>
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
                    chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            message.type === "user" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-900"
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
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                  <Button onClick={sendChatMessage} size="sm" className="cursor-pointer">
                    Send
                  </Button>
                </div>

                {/* AI Recommendation */}
                {scanResult && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <h4 className="font-medium text-cyan-900 mb-2">AI Recommendation</h4>
                    <p className="text-sm text-cyan-800">{scanResult.aiRecommendation}</p>
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
