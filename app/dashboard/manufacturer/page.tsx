"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Factory, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Search, 
  QrCode, 
  Building2, 
  FileText, 
  Truck,
  FlaskConical,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ArrowUpRight,
  Users,
  Calendar
} from "lucide-react"
import { ManufacturerSidebar } from "@/components/manufacturer-sidebar"
import { TeamManagement } from "@/components/team-management"
import { mockBatches, mockProducts, createBatch, getBatches, transferBatch, getTransferHistory, getManufacturerStats } from "@/lib/manufacturer-data"
import { ReportsAnalytics } from "@/components/reports-analytics";
import QRGenerationComponent from "@/components/QRGenerationComponent"

export default function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    pendingQuality: 0,
    recentTransfers: 0,
  })

  // Organization ID - in real app, this would come from auth context
  const organizationId = "org-1" // Manufacturer organization

  // Load real data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load batches
        const batchData = await getBatches(organizationId)
        setBatches(batchData)

        // Load stats
        const statsData = await getManufacturerStats(organizationId)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to mock data if database fails
        setBatches(mockBatches)
        setStats({
          totalBatches: mockBatches.length,
          activeBatches: mockBatches.filter(b => b.status !== "DELIVERED").length,
          pendingQuality: mockBatches.filter(b => b.status === "MANUFACTURING").length,
          recentTransfers: 5,
        })
      }
    }
    loadData()
  }, [])

  // Load transfer history from localStorage (mock off-chain storage)
  const [transferHistory, setTransferHistory] = useState<any[]>([])
  
  useEffect(() => {
    const loadTransferHistory = () => {
      try {
        const stored = localStorage.getItem('transferHistory')
        if (stored) {
          setTransferHistory(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Error loading transfer history:", error)
      }
    }
    loadTransferHistory()
  }, [])

  // New batch form state
  const [newBatch, setNewBatch] = useState({
    drugName: "",
    composition: "",
    batchSize: "",
    manufacturingDate: "",
    expiryDate: "",
    storageInstructions: "",
  })

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    toOrganization: "",
    transferReason: "",
    notes: "",
  })

  const recentTransfers = [
    {
      id: "T001",
      batchNumber: "PTC-2024-001",
      productName: "Paracetamol 500mg",
      fromEntity: "PharmaTech Industries",
      toEntity: "MediDistrib Lagos",
      quantity: 1500,
      transferDate: "2024-09-01",
      status: "Completed"
    },
    {
      id: "T002",
      batchNumber: "PTC-2024-003",
      productName: "Lisinopril 10mg", 
      fromEntity: "PharmaTech Industries",
      toEntity: "City Hospital Pharmacy",
      quantity: 3000,
      transferDate: "2024-08-30",
      status: "Completed"
    },
    {
      id: "T003",
      batchNumber: "PTC-2024-005",
      productName: "Aspirin 75mg",
      fromEntity: "PharmaTech Industries",
      toEntity: "HealthPlus Pharmacy",
      quantity: 5000,
      transferDate: "2024-09-02",
      status: "Pending"
    }
  ]

  const organizations = [
    { id: "1", name: "MediDistrib Lagos", type: "Distributor" },
    { id: "2", name: "HealthPlus Pharmacy", type: "Pharmacy" },
    { id: "3", name: "City Hospital Network", type: "Hospital" },
    { id: "4", name: "Metro Pharmacy Chain", type: "Pharmacy" },
    { id: "5", name: "Regional Medical Center", type: "Hospital" },
  ]

  const handleCreateBatch = async () => {
    try {
      if (!newBatch.drugName || !newBatch.batchSize || !newBatch.manufacturingDate || !newBatch.expiryDate) {
        alert("Please fill in all required fields")
        return
      }

      // In production, this would use the actual organizationId from context
      const organizationId = "temp-org-id" 
      
      const batchData = {
        organizationId,
        drugName: newBatch.drugName,
        composition: newBatch.composition || `${newBatch.drugName} with standard excipients`,
        batchSize: parseInt(newBatch.batchSize),
        manufacturingDate: new Date(newBatch.manufacturingDate),
        expiryDate: new Date(newBatch.expiryDate),
        storageInstructions: newBatch.storageInstructions || "Store at room temperature"
      }

      // For demo purposes, we'll add to the mock data
      const newBatchNumber = `PTC-2024-${String(batches.length + 1).padStart(3, '0')}`
      const selectedProduct = mockProducts.find(p => p.name === batchData.drugName)
      const mockNewBatch = {
        batchId: newBatchNumber,
        drugName: batchData.drugName,
        genericName: selectedProduct?.name || batchData.drugName,
        composition: batchData.composition,
        batchSize: batchData.batchSize,
        manufacturingDate: batchData.manufacturingDate,
        expiryDate: batchData.expiryDate,
        storageInstructions: batchData.storageInstructions,
        currentLocation: "Production Facility",
        status: "MANUFACTURING" as const,
        qrCodeData: `QR_${newBatchNumber.replace('-', '_')}_PENDING`,
        dosageForm: selectedProduct?.dosageForm || "Tablet",
        strength: selectedProduct?.strength || "N/A",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setBatches([...batches, mockNewBatch])
      setStats(prev => ({ ...prev, totalBatches: prev.totalBatches + 1, pendingQuality: prev.pendingQuality + 1 }))
      
      alert(`Batch ${newBatchNumber} created successfully!`)
      setIsCreateBatchOpen(false)
      setNewBatch({
        drugName: "",
        composition: "",
        batchSize: "",
        manufacturingDate: "",
        expiryDate: "",
        storageInstructions: "",
      })
    } catch (error) {
      console.error("Error creating batch:", error)
      alert("Error creating batch. Please try again.")
    }
  }

  const handleTransferBatch = async () => {
    try {
      if (!selectedBatch || !transferForm.toOrganization) {
        alert("Please select a destination organization")
        return
      }

      // Simulate off-chain transfer process
      console.log("🔄 Initiating off-chain transfer...")
      
      // Create transfer record (off-chain)
      const transferRecord = {
        id: `TXN-${Date.now()}`,
        batchId: selectedBatch.batchId,
        fromOrg: "PharmaTech Industries",
        toOrg: organizations.find(org => org.id === transferForm.toOrganization)?.name,
        transferDate: new Date().toISOString().split('T')[0],
        status: "In Progress",
        reason: transferForm.transferReason,
        notes: transferForm.notes,
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`, // Mock blockchain hash
        quantity: selectedBatch.batchSize,
        product: selectedBatch.drugName
      }
      
      console.log("📄 Transfer Record Created:", transferRecord)

      // Update batch status and location (off-chain update)
      const updatedBatches = batches.map(batch => 
        batch.batchId === selectedBatch.batchId 
          ? { 
              ...batch, 
              status: "IN_TRANSIT" as const, 
              currentLocation: `In Transit to ${transferRecord.toOrg}`,
              updatedAt: new Date()
            }
          : batch
      )
      setBatches(updatedBatches)

      // Add to recent transfers (mock data)
      const newTransfer = {
        id: transferRecord.id,
        batchNumber: selectedBatch.batchId,
        productName: selectedBatch.drugName,
        fromEntity: "PharmaTech Industries",
        toEntity: transferRecord.toOrg || "Unknown",
        quantity: selectedBatch.batchSize,
        transferDate: transferRecord.transferDate,
        status: "Pending",
        blockchainHash: transferRecord.blockchainHash,
        reason: transferForm.transferReason,
        notes: transferForm.notes
      }

      // Store in localStorage for persistence (mock off-chain storage)
      const existingTransfers = JSON.parse(localStorage.getItem('transferHistory') || '[]')
      existingTransfers.push(newTransfer)
      localStorage.setItem('transferHistory', JSON.stringify(existingTransfers))

      // Update UI
      alert(`✅ Off-chain Transfer Initiated Successfully!

Batch: ${selectedBatch.batchId}
To: ${transferRecord.toOrg}
Status: Pending Confirmation
Blockchain Hash: ${transferRecord.blockchainHash}

The transfer has been recorded off-chain and will be processed shortly.`)
      
      setIsTransferOpen(false)
      setSelectedBatch(null)
      setTransferForm({
        toOrganization: "",
        transferReason: "",
        notes: "",
      })
    } catch (error) {
      console.error("Error transferring batch:", error)
      alert("Error transferring batch. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY_FOR_DISPATCH":
        return "default"
      case "MANUFACTURING":
        return "secondary"
      case "IN_TRANSIT":
        return "outline"
      case "DELIVERED":
        return "default"
      case "EXPIRED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "READY_FOR_DISPATCH":
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />
      case "MANUFACTURING":
      case "IN_TRANSIT":
        return <Clock className="h-4 w-4" />
      case "EXPIRED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "READY_FOR_DISPATCH":
        return "Ready for Dispatch"
      case "MANUFACTURING":
        return "Manufacturing"
      case "IN_TRANSIT":
        return "In Transit"
      case "DELIVERED":
        return "Delivered"
      case "EXPIRED":
        return "Expired"
      default:
        return status
    }
  }

  const filteredBatches = batches.filter(batch =>
    batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.drugName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      <ManufacturerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Manufacturer Dashboard</h1>
                  <p className="text-muted-foreground">Welcome to PharmaTech Industries Manufacturing Portal</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manufacturer
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                    <Factory className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBatches}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+15%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeBatches}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently in circulation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Quality</CardTitle>
                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingQuality}</div>
                    <p className="text-xs text-muted-foreground">Awaiting QC approval</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Transfers</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.recentTransfers}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+8</span> this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                    <CardDescription>Common manufacturing tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" onClick={() => setActiveTab("batches")}>
                      <Package className="h-4 w-4 mr-2" />
                      Create New Batch
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("quality")}>
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Quality Control
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("transfers")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Transfer Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("qr-generator")}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Codes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Recent Activity</CardTitle>
                    <CardDescription>Latest batch and transfer activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransfers.slice(0, 4).map((transfer) => (
                        <div key={transfer.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{transfer.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.fromEntity} → {transfer.toEntity}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={transfer.status === "Completed" ? "default" : "secondary"}>
                              {transfer.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{transfer.transferDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "batches" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Batch Management</h1>
                  <p className="text-muted-foreground">Create, view, and manage product batches</p>
                </div>
                <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Batch
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Batch</DialogTitle>
                      <DialogDescription>Create a new manufacturing batch</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product">Product</Label>
                        <Select value={newBatch.drugName} onValueChange={(value) => setNewBatch({...newBatch, drugName: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.name} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Batch Size</Label>
                        <Input 
                          id="quantity" 
                          type="number" 
                          placeholder="Enter quantity"
                          value={newBatch.batchSize}
                          onChange={(e) => setNewBatch({...newBatch, batchSize: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="production-date">Production Date</Label>
                        <Input 
                          id="production-date" 
                          type="date" 
                          value={newBatch.manufacturingDate}
                          onChange={(e) => setNewBatch({...newBatch, manufacturingDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input 
                          id="expiry-date" 
                          type="date" 
                          value={newBatch.expiryDate}
                          onChange={(e) => setNewBatch({...newBatch, expiryDate: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="composition">Composition</Label>
                        <Textarea 
                          id="composition" 
                          placeholder="Enter composition details"
                          value={newBatch.composition}
                          onChange={(e) => setNewBatch({...newBatch, composition: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="notes">Storage Instructions</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Enter storage requirements"
                          value={newBatch.storageInstructions}
                          onChange={(e) => setNewBatch({...newBatch, storageInstructions: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setIsCreateBatchOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateBatch}>Create Batch</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Batch Overview</CardTitle>
                  <CardDescription>All manufacturing batches and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search batches by ID or product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Production Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Batch Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBatches.map((batch) => (
                        <TableRow key={batch.batchId}>
                          <TableCell className="font-medium">{batch.batchId}</TableCell>
                          <TableCell>{batch.drugName}</TableCell>
                          <TableCell>{batch.manufacturingDate.toISOString().split('T')[0]}</TableCell>
                          <TableCell>{batch.expiryDate.toISOString().split('T')[0]}</TableCell>
                          <TableCell>{batch.batchSize.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(batch.status)} className="flex items-center gap-1">
                              {getStatusIcon(batch.status)}
                              {getStatusDisplay(batch.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{batch.currentLocation}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => alert(`Viewing details for ${batch.batchId}\n\nComposition: ${batch.composition}\nStorage: ${batch.storageInstructions}\nQR Code: ${batch.qrCodeData}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedBatch(batch)
                                  setIsTransferOpen(true)
                                }}
                                disabled={batch.status === "DELIVERED" || batch.status === "IN_TRANSIT"}
                              >
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                Transfer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Transfer Dialog */}
              <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Batch</DialogTitle>
                    <DialogDescription>
                      Transfer batch {selectedBatch?.batchId} to another organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="to-organization">Destination Organization</Label>
                      <Select value={transferForm.toOrganization} onValueChange={(value) => setTransferForm({...transferForm, toOrganization: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name} ({org.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-reason">Transfer Reason</Label>
                      <Input 
                        id="transfer-reason" 
                        placeholder="e.g., Distribution, Sale, etc."
                        value={transferForm.transferReason}
                        onChange={(e) => setTransferForm({...transferForm, transferReason: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-notes">Notes (Optional)</Label>
                      <Textarea 
                        id="transfer-notes" 
                        placeholder="Additional transfer notes"
                        value={transferForm.notes}
                        onChange={(e) => setTransferForm({...transferForm, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleTransferBatch}>Initiate Transfer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Product Catalog</h1>
                  <p className="text-muted-foreground">Manage your product portfolio</p>
                </div>
                <Button onClick={() => alert("Adding new product...")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category:</span>
                          <span className="text-sm font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Form:</span>
                          <span className="text-sm font-medium">{product.dosageForm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">NAFDAC:</span>
                          <span className="text-sm font-medium">{product.nafdacNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Shelf Life:</span>
                          <span className="text-sm font-medium">{product.shelfLifeMonths} months</span>
                        </div>
                        <div className="pt-2">
                          <Badge variant="outline">{product.strength}</Badge>
                        </div>
                        <div className="pt-2">
                          <Button size="sm" className="w-full" onClick={() => alert(`Managing ${product.name}...`)}>
                            Manage Product
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "transfers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Batch Transfers</h1>
                  <p className="text-muted-foreground">Track all batch transfers and ownership changes</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transfer History</CardTitle>
                  <CardDescription>All batch transfers initiated from this facility</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transfer ID</TableHead>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Show recent off-chain transfers from localStorage */}
                      {transferHistory.slice(-10).reverse().map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-medium">{transfer.id}</TableCell>
                          <TableCell>{transfer.batchNumber}</TableCell>
                          <TableCell>{transfer.productName}</TableCell>
                          <TableCell>{transfer.fromEntity}</TableCell>
                          <TableCell>{transfer.toEntity}</TableCell>
                          <TableCell>{transfer.quantity.toLocaleString()}</TableCell>
                          <TableCell>{transfer.transferDate}</TableCell>
                          <TableCell>
                            <Badge variant={transfer.status === "Completed" ? "default" : "secondary"}>
                              {transfer.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Fallback to static mock data if no off-chain transfers */}
                      {transferHistory.length === 0 && recentTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-medium">{transfer.id}</TableCell>
                          <TableCell>{transfer.batchNumber}</TableCell>
                          <TableCell>{transfer.productName}</TableCell>
                          <TableCell>{transfer.fromEntity}</TableCell>
                          <TableCell>{transfer.toEntity}</TableCell>
                          <TableCell>{transfer.quantity.toLocaleString()}</TableCell>
                          <TableCell>{transfer.transferDate}</TableCell>
                          <TableCell>
                            <Badge variant={transfer.status === "Completed" ? "default" : "secondary"}>
                              {transfer.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "quality" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Quality Control</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Control Statistics</CardTitle>
                    <CardDescription>Overall quality performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Batches Passed</span>
                        <span className="font-semibold text-green-600">234 batches (94%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Testing</span>
                        <span className="font-semibold text-orange-600">12 batches (5%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed Quality</span>
                        <span className="font-semibold text-red-600">3 batches (1%)</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-green-600">+2.1%</span> improvement from last quarter
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent QC Tests</CardTitle>
                    <CardDescription>Latest quality control results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">PTC-2024-007 - Paracetamol 500mg</p>
                        <p className="text-sm text-muted-foreground">Potency Test - Passed</p>
                        <Badge variant="default">Approved</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">PTC-2024-006 - Omeprazole 20mg</p>
                        <p className="text-sm text-muted-foreground">Dissolution Test - In Progress</p>
                        <Badge variant="secondary">Testing</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">PTC-2024-005 - Aspirin 75mg</p>
                        <p className="text-sm text-muted-foreground">Stability Test - Passed</p>
                        <Badge variant="default">Approved</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "qr-generator" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">QR Code Generator</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Codes</CardTitle>
                  <CardDescription>Create QR codes for batch tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch-select">Select Batch</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch to generate QR code" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.batchId} value={batch.batchId}>
                              {batch.batchId} - {batch.drugName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => alert("QR Code generation feature coming soon!")}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === "team" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Team Management</h1>
              <TeamManagement />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Statistics</CardTitle>
                    <CardDescription>Monthly production metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Batches Produced</span>
                        <span className="font-semibold">156 batches</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Units Manufactured</span>
                        <span className="font-semibold">2.3M units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Pass Rate</span>
                        <span className="font-semibold">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transfers Completed</span>
                        <span className="font-semibold">89 transfers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Reports</CardTitle>
                    <CardDescription>Download detailed manufacturing reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting production report...")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Production Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting batch report...")}>
                      <Package className="h-4 w-4 mr-2" />
                      Batch Report (Excel)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting quality report...")}>
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Quality Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting transfer report...")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Transfer Report (PDF)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "qr-generation" && <QRGenerationComponent />}
          {activeTab === "reports" && <ReportsAnalytics />}
          {activeTab === "team" && <TeamManagement />}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Manufacturing Settings</CardTitle>
                  <CardDescription>Manage manufacturing facility preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="facility-name">Facility Name</Label>
                      <Input id="facility-name" value="PharmaTech Industries Ltd." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Manufacturing License</Label>
                      <Input id="license" value="MAN-2024-PTC-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" value="manufacturing@pharmatech.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Facility Address</Label>
                      <Textarea id="address" value="Industrial Estate, Agbara, Ogun State, Nigeria" rows={3} />
                    </div>
                    <Button onClick={() => alert("Settings saved successfully!")}>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
