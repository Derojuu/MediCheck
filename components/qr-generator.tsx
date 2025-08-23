"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QrCode, Download, Copy, RefreshCw } from "lucide-react"

export function QRGenerator() {
  const [batchData, setBatchData] = useState({
    batchId: "",
    productName: "",
    manufacturer: "",
    expiryDate: "",
    quantity: "",
    description: "",
  })
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)

  const generateQR = () => {
    // Simulate QR generation
    const qrData = {
      ...batchData,
      timestamp: new Date().toISOString(),
      blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
    }

    console.log("[v0] Generating QR for batch:", qrData)

    // Simulate QR code generation (in real app, this would use a QR library)
    setGeneratedQR(
      `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" strokeWidth="2"/>
        <text x="100" y="100" textAnchor="middle" fontFamily="monospace" fontSize="12">QR Code</text>
        <text x="100" y="120" textAnchor="middle" fontFamily="monospace" fontSize="8">${batchData.batchId}</text>
      </svg>
    `)}`,
    )
  }

  const downloadQR = () => {
    if (generatedQR) {
      const link = document.createElement("a")
      link.download = `batch-${batchData.batchId}-qr.svg`
      link.href = generatedQR
      link.click()
    }
  }

  const copyBatchId = () => {
    navigator.clipboard.writeText(batchData.batchId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Batch Information
          </CardTitle>
          <CardDescription>Enter batch details to generate QR code for blockchain verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchId">Batch ID</Label>
            <div className="flex gap-2">
              <Input
                id="batchId"
                placeholder="e.g., PAR2024001"
                value={batchData.batchId}
                onChange={(e) => setBatchData({ ...batchData, batchId: e.target.value })}
                className="cursor-pointer"
              />
              <Button variant="outline" size="icon" onClick={copyBatchId} className="cursor-pointer bg-transparent">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., Paracetamol 500mg"
              value={batchData.productName}
              onChange={(e) => setBatchData({ ...batchData, productName: e.target.value })}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Select
              value={batchData.manufacturer}
              onValueChange={(value) => setBatchData({ ...batchData, manufacturer: value })}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharmaCorp">PharmaCorp Ltd</SelectItem>
                <SelectItem value="mediLab">MediLab Industries</SelectItem>
                <SelectItem value="healthPharma">HealthPharma Inc</SelectItem>
                <SelectItem value="globalMeds">Global Meds Ltd</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={batchData.expiryDate}
              onChange={(e) => setBatchData({ ...batchData, expiryDate: e.target.value })}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              placeholder="e.g., 10000 tablets"
              value={batchData.quantity}
              onChange={(e) => setBatchData({ ...batchData, quantity: e.target.value })}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional batch information..."
              value={batchData.description}
              onChange={(e) => setBatchData({ ...batchData, description: e.target.value })}
              className="cursor-pointer"
            />
          </div>

          <Button
            onClick={generateQR}
            className="w-full cursor-pointer"
            disabled={!batchData.batchId || !batchData.productName || !batchData.manufacturer}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated QR Code</CardTitle>
          <CardDescription>QR code for batch verification and blockchain tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {generatedQR ? (
            <div className="space-y-4">
              <div className="flex justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <img src={generatedQR || "/placeholder.svg"} alt="Generated QR Code" className="w-48 h-48" />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Batch ID:</strong> {batchData.batchId}
                </p>
                <p>
                  <strong>Product:</strong> {batchData.productName}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {batchData.manufacturer}
                </p>
                <p>
                  <strong>Expiry:</strong> {batchData.expiryDate}
                </p>
                <p>
                  <strong>Quantity:</strong> {batchData.quantity}
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={downloadQR} className="flex-1 cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
                <Button variant="outline" onClick={generateQR} className="cursor-pointer bg-transparent">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <QrCode className="w-16 h-16 mb-4 opacity-50" />
              <p>Fill in batch information and click "Generate QR Code"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
