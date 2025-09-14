"use client"

import { useState, useRef } from "react"
import { QrCode, CheckCircle, AlertTriangle, XCircle, Camera } from "lucide-react"
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
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const qrScannerRef = useRef<QRScannerRef>(null)

  // Save scan data to database
  const saveScanToDatabase = async (qrData: string, scanResult: ScanResult) => {
    try {
      // Extract unit ID from QR data
      let unitId = null;
      let scanResultEnum = 'GENUINE'; // Default
      
      try {
        const parsedData = JSON.parse(qrData);
        unitId = parsedData.unitId || parsedData.id;
        
        // Map scan result status to database enum
        switch (scanResult.status.toLowerCase()) {
          case 'genuine':
            scanResultEnum = 'GENUINE';
            break;
          case 'suspicious':
            scanResultEnum = 'SUSPICIOUS';
            break;
          case 'fake':
            scanResultEnum = 'COUNTERFEIT';
            break;
          default:
            scanResultEnum = 'GENUINE';
        }
      } catch (e) {
        // If QR data is not JSON, try to use it as unitId
        unitId = qrData;
      }

      if (!unitId) {
        console.error('No unit ID found in QR data');
        return;
      }

      // Get user's location if available
      let latitude = null;
      let longitude = null;
      
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (error) {
          console.log('Could not get location:', error);
        }
      }

      // Save to database
      const response = await fetch('/api/consumer/save-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitId,
          scanResult: scanResultEnum,
          latitude,
          longitude,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Scan saved successfully:', result);
      } else {
        const error = await response.json();
        console.error('Failed to save scan:', error);
      }
    } catch (error) {
      console.error('Error saving scan to database:', error);
    }
  }

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

  // Handle QR code scan results
  const handleQRScan = async (qrData: string) => {
    console.log('QR Code scanned:', qrData)
    
    // Process the QR data and generate result
    const result = processQRCodeData(qrData)
    setScanResult(result)
    onScanResult(result)
    
    const scanTime = new Date().toLocaleTimeString()
    onScanTime(scanTime)

    // Save scan to database
    await saveScanToDatabase(qrData, result)
  }

  // Handle QR scanner errors
  const handleQRError = (error: string) => {
    console.error('QR Scanner error:', error)
  }

  const stopScan = () => {
    setIsScanning(false)
    if (qrScannerRef.current) {
      qrScannerRef.current.stopCamera()
    }
  }

  const startScan = () => {
    setIsScanning(true)
    if (qrScannerRef.current) {
      qrScannerRef.current.startCamera()
    }
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
          <QrCode className="w-6 h-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Medication Scanner</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* QR Scanner */}
        <div className="flex justify-center">
          <QRScanner
            ref={qrScannerRef}
            onScan={handleQRScan}
            onError={handleQRError}
            width={400}
            height={300}
            facingMode="environment"
            autoStart={false}
            className="mx-auto"
          />
        </div>

        {/* Scan Controls */}
        <div className="flex justify-center">
          {!isScanning ? (
            <Button
              onClick={startScan}
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
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{scanResult.drugName}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Manufactured by {scanResult.manufacturer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Batch ID:</span>
                    <p className="font-medium">{scanResult.batchId}</p>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">Expires:</span>
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
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Recommended Dosage</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{scanResult.dosage}</p>
              </div>

              {/* Side Effects */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">Possible Side Effects</h4>
                <div className="flex flex-wrap gap-2">
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