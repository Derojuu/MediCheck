"use client"
import { useState, useRef, useEffect } from "react"
import { QrCode, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QRScanner, QRScannerRef } from "@/components/qr-scanner"

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

interface ConsumerQRScannerProps {
  onScanResult: (result: ScanResult) => void
  onScanTime: (time: string) => void
}

export function ConsumerQRScanner({ onScanResult, onScanTime }: ConsumerQRScannerProps) {

  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  
  const qrScannerRef = useRef<QRScannerRef>(null)

  const [scannedQRcodeResult, setScannedQRcodeResult] = useState("");

  const handleQRScan = (qrData: string) => {
    setScannedQRcodeResult(qrData)
  }

  useEffect(() => {
    if (scannedQRcodeResult) {
      console.log(scannedQRcodeResult);
      window.location.href = scannedQRcodeResult;
    }
  }, [scannedQRcodeResult])

  // Process QR code data and return a scan result
  const processQRCodeData = (qrData: string): ScanResult => {
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
          verificationScore: parsedData.verificationScore || 85,
          safetyRating: parsedData.safetyRating || "Safe to Use",
          aiRecommendation: parsedData.aiRecommendation || "This medication appears to be genuine. Please follow prescribed dosage.",
          sideEffects: parsedData.sideEffects || ["Consult prescriber"],
          dosage: parsedData.dosage || "Follow prescription instructions",
        }
      }
    } catch (e) {
      // Not JSON, treat as simple batch ID
    }

    // Fallback for simple QR codes or unparseable data
    return {
      id: `scan-${Date.now()}`,
      status: "genuine",
      drugName: "Unknown Medication",
      batchId: qrData.length > 20 ? qrData.substring(0, 20) + '...' : qrData,
      manufacturer: "Unknown Manufacturer",
      expiryDate: "Check packaging",
      verificationScore: 75,
      safetyRating: "Verification needed",
      aiRecommendation: "Unable to fully verify this medication. Please consult your pharmacist for additional verification.",
      sideEffects: ["Consult healthcare provider"],
      dosage: "Follow prescription instructions",
    }
  }

  // Handle QR scanner errors
  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "genuine":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
      case "suspicious":
        return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800"
      case "fake":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-950 dark:border-slate-700"
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
    <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 font-bold">
          <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg sm:text-xl">Medication Scanner</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* QR Scanner */}
        <div className="flex justify-center px-0 xs:px-2 sm:px-8 md:px-12">
          <QRScanner
            ref={qrScannerRef}
            onScan={handleQRScan}
            onError={handleQRError}
            width={220}
            height={160}
            facingMode="environment"
            autoStart={false}
            className="mx-auto w-full max-w-[95vw] xs:max-w-[320px] sm:w-[450px] sm:h-[350px] md:w-[500px] md:h-[400px] lg:w-[550px] lg:h-[450px]"
          />
        </div>

        {/* Scan Result */}
        {scanResult && (
          <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between font-bold gap-2">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-base xs:text-lg sm:text-xl">Verification Result</span>
                <Badge className={`${getStatusColor(scanResult.status)} border-primary/20 text-xs sm:text-sm`}>
                  {getStatusIcon(scanResult.status)}
                  <span className="ml-2 capitalize">{scanResult.status}</span>
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 xs:space-y-4 sm:space-y-6">
              {/* Drug Information */}
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-semibold text-sm xs:text-base sm:text-lg text-slate-900 dark:text-slate-100 break-words">{scanResult.drugName}</h3>
                  <p className="text-xs xs:text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">Manufactured by {scanResult.manufacturer}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-sm sm:text-base">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Batch ID:</span>
                    <p className="font-medium break-all">{scanResult.batchId}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Expires:</span>
                    <p className="font-medium break-words">{scanResult.expiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Safety Information */}
              <div className={`p-2 xs:p-3 sm:p-4 rounded-lg border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 ${getStatusColor(scanResult.status)}`}>
                <h4 className="font-bold mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Safety Assessment</h4>
                <p className="text-xs sm:text-sm">{scanResult.safetyRating}</p>
              </div>

              {/* Dosage Information */}
              <div className="space-y-1 xs:space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs xs:text-sm sm:text-base">Recommended Dosage</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">{scanResult.dosage}</p>
              </div>

              {/* Side Effects */}
              <div className="space-y-1 xs:space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs xs:text-sm sm:text-base">Possible Side Effects</h4>
                <div className="flex flex-wrap gap-1 xs:gap-2">
                  {scanResult.sideEffects.map((effect: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5 dark:border-primary/40 dark:hover:bg-primary/10">
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
  )
}