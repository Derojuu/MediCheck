"use client"

import { useState } from "react"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ConsumerQRScanner, ConsumerChatAI } from "@/components/consumer-page-component"

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

export default function ConsumerScanPage() {
  const [showAIChat, setShowAIChat] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [lastScanTime, setLastScanTime] = useState<string>("")

  const handleScanResult = (result: ScanResult) => {
    setScanResult(result)
  }

  const handleScanTime = (time: string) => {
    setLastScanTime(time)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/consumer/profile" className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Verify Your Medication</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Scan to check authenticity and get AI guidance</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowAIChat(!showAIChat)} className="cursor-pointer border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-sm sm:text-base">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-primary" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <ConsumerQRScanner 
              onScanResult={handleScanResult}
              onScanTime={handleScanTime}
            />
          </div>

          {/* AI Chat Assistant */}
          <ConsumerChatAI 
            scanResult={scanResult}
            showChat={showAIChat}
          />
        </div>
      </div>
    </div>
  )
}