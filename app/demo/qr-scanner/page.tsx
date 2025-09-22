'use client'

import { QRScanner } from '@/components/qr-scanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'

export default function QRScannerDemo() {
  const [lastScanResult, setLastScanResult] = useState<string | null>(null)

  const handleScan = (data: string) => {
    console.log('QR Code scanned:', data)
    setLastScanResult(data)
  }

  const handleError = (error: string) => {
    console.error('QR Scanner error:', error)
  }

  return (
    <div className="container mx-auto p-6 relative overflow-hidden min-h-screen">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-48 h-48 bg-blue-500/6 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-green-500/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-500/8 rounded-full blur-xl"></div>
      </div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h1 className="text-2xl font-bold">QR Scanner Demo</h1>
        <ThemeToggle />
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Simple QR Scanner Demo</CardTitle>
          <p className="text-gray-600">Test the basic QR scanner functionality</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <QRScanner
              onScan={handleScan}
              onError={handleError}
              width={400}
              height={300}
            />
          </div>
          
          {lastScanResult && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
              <h3 className="font-semibold text-green-800">Last Scan Result:</h3>
              <p className="text-green-700 font-mono break-all">{lastScanResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
