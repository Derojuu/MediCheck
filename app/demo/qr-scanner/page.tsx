'use client'

import { QRScanner } from '@/components/qr-scanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="container mx-auto p-6">
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
