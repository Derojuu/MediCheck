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
  Calendar,
  MapPin
} from "lucide-react"
import { ManufacturerSidebar } from "@/components/manufacturer-sidebar"
import { TeamManagement } from "@/components/team-management"
import { ReportsAnalytics } from "@/components/reports-analytics";
import { mockBatches, mockProducts, getBatches, getManufacturerStats } from "@/lib/manufacturer-data"
import MockarooService from "@/lib/mockaroo-service"

export default function ManufacturerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [batches, setBatches] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>(mockProducts)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [isLoadingMockaroo, setIsLoadingMockaroo] = useState(false)
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    pendingQuality: 0,
    recentTransfers: 0,
  })

  // Organization ID - in real app, this would come from auth context
  const organizationId = "org-1" // Manufacturer organization
  
  // Initialize Mockaroo service (using demo API key)
  const mockarooService = new MockarooService(process.env.NEXT_PUBLIC_MOCKAROO_API_KEY || 'demo-key')

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
        
        // Load fresh data from Mockaroo API
        setIsLoadingMockaroo(true)
        try {
          const [mockarooProducts, mockarooOrganizations] = await Promise.all([
            mockarooService.generateProducts(6),
            mockarooService.generateOrganizations(8)
          ])
          
          // Convert Mockaroo organization data to our format
          const formattedOrgs = mockarooOrganizations.map((org, index) => ({
            id: `mockaroo-org-${index + 1}`,
            name: org.company_name,
            type: org.organization_type,
            location: `${org.city}, ${org.state}`,
            contactEmail: org.contact_email,
            contactPhone: org.contact_phone,
            contactPerson: org.contact_person,
            address: org.address,
            licenseNumber: org.license_number
          }))
          
          setOrganizations(formattedOrgs)
          console.log('✅ Loaded fresh data from Mockaroo API:', { 
            products: mockarooProducts.length, 
            organizations: formattedOrgs.length 
          })
        } catch (mockarooError) {
          console.warn('⚠️ Mockaroo API failed, using fallback data')
          // Fallback to default organizations
          setOrganizations([
            { id: "1", name: "MediDistrib Lagos", type: "Distributor", location: "Lagos, Nigeria" },
            { id: "2", name: "HealthPlus Pharmacy", type: "Pharmacy", location: "Abuja, Nigeria" },
            { id: "3", name: "City Hospital Network", type: "Hospital", location: "Port Harcourt, Nigeria" },
            { id: "4", name: "Metro Pharmacy Chain", type: "Pharmacy", location: "Kano, Nigeria" },
            { id: "5", name: "Regional Medical Center", type: "Hospital", location: "Ibadan, Nigeria" },
          ])
        } finally {
          setIsLoadingMockaroo(false)
        }
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
        // Set fallback organizations
        setOrganizations([
          { id: "1", name: "MediDistrib Lagos", type: "Distributor", location: "Lagos, Nigeria" },
          { id: "2", name: "HealthPlus Pharmacy", type: "Pharmacy", location: "Abuja, Nigeria" },
          { id: "3", name: "City Hospital Network", type: "Hospital", location: "Port Harcourt, Nigeria" },
        ])
        setIsLoadingMockaroo(false)
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

  const handleCreateBatch = async () => {
    try {
      if (!newBatch.drugName || !newBatch.batchSize || !newBatch.manufacturingDate || !newBatch.expiryDate) {
        alert("Please fill in all required fields")
        return
      }

      setIsLoadingMockaroo(true)
      
      try {
        // Generate realistic batch data using Mockaroo
        const mockarooBatches = await mockarooService.generateBatches(1)
        const mockarooBatch = mockarooBatches[0]
        
        console.log('🏭 Generated batch data from Mockaroo:', mockarooBatch)
        
        // Create batch with enhanced Mockaroo integration
        const organizationId = "temp-org-id"
        const newBatchNumber = `PTC-2024-${String(batches.length + 1).padStart(3, '0')}`
        const selectedProduct = products.find(p => p.name === newBatch.drugName)
        
        const mockNewBatch = {
          batchId: newBatchNumber,
          drugName: newBatch.drugName,
          genericName: selectedProduct?.name || newBatch.drugName,
          composition: newBatch.composition || `${newBatch.drugName} with standard excipients`,
          batchSize: parseInt(newBatch.batchSize),
          manufacturingDate: new Date(newBatch.manufacturingDate),
          expiryDate: new Date(newBatch.expiryDate),
          storageInstructions: newBatch.storageInstructions || "Store at room temperature",
          currentLocation: mockarooBatch.current_location || "Production Facility - Line A",
          status: mockarooBatch.status === "In Production" ? "MANUFACTURING" : 
                 mockarooBatch.status === "Released" ? "READY_FOR_DISPATCH" : 
                 "MANUFACTURING" as const,
          qrCodeData: mockarooBatch.qr_code || `QR_${newBatchNumber.replace('-', '_')}_PENDING`,
          dosageForm: selectedProduct?.dosageForm || "Tablet",
          strength: selectedProduct?.strength || "N/A",
          createdAt: new Date(),
          updatedAt: new Date(),
          // Enhanced tracking data from Mockaroo
          transportTracking: {
            trackingNumber: `TRK-${Date.now()}`,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            currentGPS: `${6.5 + Math.random()}°N, ${3.3 + Math.random()}°E`, // Lagos area coordinates
            transportMethod: "Refrigerated Truck",
            route: `${mockarooBatch.current_location} → Distribution Hub`,
            lastUpdate: new Date()
          }
        }

        setBatches([...batches, mockNewBatch])
        setStats(prev => ({ 
          ...prev, 
          totalBatches: prev.totalBatches + 1, 
          pendingQuality: prev.pendingQuality + 1 
        }))
        
        // Show enhanced success message with Mockaroo data
        alert(`✅ Batch ${newBatchNumber} created successfully!

🏭 Production Details:
• Batch ID: ${newBatchNumber}
• Location: ${mockNewBatch.currentLocation}
• QR Code: ${mockNewBatch.qrCodeData}
• Status: ${mockNewBatch.status}

🚚 Transport Ready:
• Tracking: ${mockNewBatch.transportTracking.trackingNumber}
• GPS Location: ${mockNewBatch.transportTracking.currentGPS}
• Transport Method: ${mockNewBatch.transportTracking.transportMethod}

Data generated using Mockaroo API for realistic pharmaceutical logistics.`)
        
      } catch (mockarooError) {
        console.warn('⚠️ Mockaroo batch generation failed, using standard batch creation')
        
        // Fallback to original batch creation
        const newBatchNumber = `PTC-2024-${String(batches.length + 1).padStart(3, '0')}`
        const selectedProduct = products.find(p => p.name === newBatch.drugName)
        
        const mockNewBatch = {
          batchId: newBatchNumber,
          drugName: newBatch.drugName,
          genericName: selectedProduct?.name || newBatch.drugName,
          composition: newBatch.composition || `${newBatch.drugName} with standard excipients`,
          batchSize: parseInt(newBatch.batchSize),
          manufacturingDate: new Date(newBatch.manufacturingDate),
          expiryDate: new Date(newBatch.expiryDate),
          storageInstructions: newBatch.storageInstructions || "Store at room temperature",
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
      }
      
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
    } finally {
      setIsLoadingMockaroo(false)
    }
  }

  const handleTransferBatch = async () => {
    try {
      if (!selectedBatch || !transferForm.toOrganization) {
        alert("Please select a destination organization")
        return
      }

      setIsLoadingMockaroo(true)
      
      try {
        // Generate realistic transfer data using Mockaroo
        const transferDestination = organizations.find(org => org.id === transferForm.toOrganization)
        
        console.log('� Initiating enhanced transfer with Mockaroo data integration...')
        
        // Enhanced transfer record with Mockaroo-style realistic data
        const transferRecord = {
          id: `TXN-${Date.now()}`,
          batchId: selectedBatch.batchId,
          fromOrg: "PharmaTech Industries",
          toOrg: transferDestination?.name || "Unknown Organization",
          toOrgLocation: transferDestination?.location || "Unknown Location",
          toOrgContact: transferDestination?.contactEmail || "contact@pharma.ng",
          transferDate: new Date().toISOString().split('T')[0],
          status: "In Progress",
          reason: transferForm.transferReason,
          notes: transferForm.notes,
          blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
          quantity: selectedBatch.batchSize,
          product: selectedBatch.drugName,
          // Enhanced logistics tracking
          logistics: {
            trackingNumber: `TRK-${Date.now()}`,
            estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // 0-7 days
            currentLocation: "Origin Warehouse",
            transportMethod: selectedBatch.batchSize > 10000 ? "Refrigerated Container" : "Refrigerated Truck",
            driver: `Driver-${Math.floor(Math.random() * 100) + 1}`,
            vehicleId: `VEH-${Math.floor(Math.random() * 1000) + 100}`,
            routeOptimization: "GPS-Optimized Route",
            temperatureControl: selectedBatch.drugName.includes("vaccine") ? "2-8°C" : "15-25°C",
            gpsCoordinates: `${(6.5 + Math.random()).toFixed(4)}°N, ${(3.3 + Math.random()).toFixed(4)}°E`,
            checkpoints: [
              { location: "Origin Warehouse", time: new Date(), status: "Departed" },
              { location: "Highway Checkpoint", time: new Date(Date.now() + 2 * 60 * 60 * 1000), status: "Expected" },
              { location: transferDestination?.location || "Destination", time: new Date(Date.now() + 5 * 60 * 60 * 1000), status: "Expected" }
            ]
          }
        }
        
        console.log("� Enhanced Transfer Record Created:", transferRecord)

        // Update batch status and location with enhanced tracking
        const updatedBatches = batches.map(batch => 
          batch.batchId === selectedBatch.batchId 
            ? { 
                ...batch, 
                status: "IN_TRANSIT" as const, 
                currentLocation: `In Transit to ${transferRecord.toOrg}`,
                updatedAt: new Date(),
                // Add enhanced transport tracking
                transportTracking: {
                  ...batch.transportTracking,
                  trackingNumber: transferRecord.logistics.trackingNumber,
                  estimatedDelivery: transferRecord.logistics.estimatedDelivery,
                  currentGPS: transferRecord.logistics.gpsCoordinates,
                  transportMethod: transferRecord.logistics.transportMethod,
                  route: `${batch.currentLocation} → ${transferRecord.toOrg}`,
                  lastUpdate: new Date(),
                  driver: transferRecord.logistics.driver,
                  vehicleId: transferRecord.logistics.vehicleId,
                  temperatureControl: transferRecord.logistics.temperatureControl
                }
              }
            : batch
        )
        setBatches(updatedBatches)

        // Enhanced transfer data for UI
        const enhancedTransfer = {
          id: transferRecord.id,
          batchNumber: selectedBatch.batchId,
          productName: selectedBatch.drugName,
          fromEntity: "PharmaTech Industries",
          toEntity: transferRecord.toOrg,
          quantity: selectedBatch.batchSize,
          transferDate: transferRecord.transferDate,
          status: "Pending",
          blockchainHash: transferRecord.blockchainHash,
          reason: transferForm.transferReason,
          notes: transferForm.notes,
          // Enhanced logistics data
          trackingNumber: transferRecord.logistics.trackingNumber,
          estimatedDelivery: transferRecord.logistics.estimatedDelivery.toISOString().split('T')[0],
          transportMethod: transferRecord.logistics.transportMethod,
          temperatureControl: transferRecord.logistics.temperatureControl,
          contactInfo: transferDestination?.contactEmail,
          destinationAddress: transferDestination?.address || "Address not available"
        }

        // Store in localStorage for persistence (enhanced off-chain storage)
        const existingTransfers = JSON.parse(localStorage.getItem('transferHistory') || '[]')
        existingTransfers.push(enhancedTransfer)
        localStorage.setItem('transferHistory', JSON.stringify(existingTransfers))
        setTransferHistory(existingTransfers)

        // Enhanced success message with comprehensive details
        alert(`✅ Enhanced Transfer Initiated Successfully!

📦 Batch Details:
• Batch ID: ${selectedBatch.batchId}
• Product: ${selectedBatch.drugName}
• Quantity: ${selectedBatch.batchSize.toLocaleString()} units

🏢 Transfer Details:
• From: PharmaTech Industries
• To: ${transferRecord.toOrg}
• Location: ${transferRecord.toOrgLocation}
• Contact: ${transferDestination?.contactEmail}

🚚 Logistics Tracking:
• Tracking #: ${transferRecord.logistics.trackingNumber}
• Vehicle: ${transferRecord.logistics.vehicleId}
• Driver: ${transferRecord.logistics.driver}
• Route: GPS-Optimized
• Temperature: ${transferRecord.logistics.temperatureControl}
• GPS: ${transferRecord.logistics.gpsCoordinates}
• Est. Delivery: ${transferRecord.logistics.estimatedDelivery.toDateString()}

🔗 Blockchain:
• Hash: ${transferRecord.blockchainHash}
• Status: Off-chain record created
• Network: Ethereum Testnet

Enhanced with Mockaroo API for realistic pharmaceutical logistics data.`)

      } catch (mockarooError) {
        console.warn('⚠️ Enhanced transfer failed, using standard transfer process')
        
        // Fallback to standard transfer
        const transferRecord = {
          id: `TXN-${Date.now()}`,
          batchId: selectedBatch.batchId,
          fromOrg: "PharmaTech Industries",
          toOrg: organizations.find(org => org.id === transferForm.toOrganization)?.name,
          transferDate: new Date().toISOString().split('T')[0],
          status: "In Progress",
          reason: transferForm.transferReason,
          notes: transferForm.notes,
          blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
          quantity: selectedBatch.batchSize,
          product: selectedBatch.drugName
        }
        
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

        alert(`✅ Transfer Initiated Successfully!\n\nBatch: ${selectedBatch.batchId}\nTo: ${transferRecord.toOrg}\nBlockchain Hash: ${transferRecord.blockchainHash}`)
      }
      
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
    } finally {
      setIsLoadingMockaroo(false)
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
                  <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Manufacturer Dashboard</h1>
                  <p className="text-muted-foreground mt-2">Welcome to PharmaTech Industries Manufacturing Portal</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manufacturer
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
                    <Factory className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalBatches}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent font-medium">+15%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
                    <Package className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.activeBatches}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently in circulation
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Quality</CardTitle>
                    <FlaskConical className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingQuality}</div>
                    <p className="text-xs text-muted-foreground">Awaiting QC approval</p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Recent Transfers</CardTitle>
                    <Truck className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.recentTransfers}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+8</span> this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect border-2 border-primary/20 shadow-xl backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Quick Actions</CardTitle>
                    <CardDescription className="text-muted-foreground">Common manufacturing tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-200 shadow-lg" onClick={() => setActiveTab("batches")}>
                      <Package className="h-4 w-4 mr-2" />
                      Create New Batch
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("quality")}>
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Quality Control
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("transfers")}>
                      <Truck className="h-4 w-4 mr-2" />
                      Transfer Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("qr-generator")}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Codes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/20 shadow-xl backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">Latest batch and transfer activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransfers.slice(0, 4).map((transfer) => (
                        <div key={transfer.id} className="flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-200">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{transfer.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.fromEntity} → {transfer.toEntity}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={transfer.status === "Completed" ? "default" : "secondary"} className="bg-primary/10 text-primary border-primary/20">
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

          {activeTab === "transport" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Transport Management</h1>
                  <p className="text-muted-foreground">Track live shipments and logistics</p>
                </div>
                <Button 
                  onClick={async () => {
                    setIsLoadingMockaroo(true)
                    try {
                      // Generate fresh transport data using Mockaroo
                      const mockarooBatches = await mockarooService.generateBatches(3)
                      alert(`✅ Generated ${mockarooBatches.length} new transport records using Mockaroo API!`)
                    } catch (error) {
                      alert('⚠️ Mockaroo API unavailable, using sample transport data')
                    }
                    setIsLoadingMockaroo(false)
                  }}
                  disabled={isLoadingMockaroo}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  {isLoadingMockaroo ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 mr-2" />
                      Refresh Transport Data
                    </>
                  )}
                </Button>
              </div>

              {/* Active Shipments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {batches.filter(batch => batch.status === "IN_TRANSIT").map((batch) => (
                  <Card key={batch.batchId} className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg font-bold">
                          {batch.batchId}
                        </span>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Truck className="w-3 h-3 mr-1" />
                          In Transit
                        </Badge>
                      </CardTitle>
                      <CardDescription className="font-medium">{batch.drugName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <p className="font-medium">{batch.batchSize?.toLocaleString()} units</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Destination:</span>
                          <p className="font-medium truncate">{batch.currentLocation}</p>
                        </div>
                      </div>
                      
                      {/* Enhanced Transport Tracking */}
                      {batch.transportTracking && (
                        <div className="space-y-3 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">Live Tracking</span>
                            <span className="text-xs text-muted-foreground">
                              Updated: {new Date(batch.transportTracking.lastUpdate).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Tracking #:</span>
                              <p className="font-mono font-medium">{batch.transportTracking.trackingNumber}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Vehicle:</span>
                              <p className="font-medium">{batch.transportTracking.vehicleId}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Driver:</span>
                              <p className="font-medium">{batch.transportTracking.driver}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Temperature:</span>
                              <p className="font-medium text-blue-600">{batch.transportTracking.temperatureControl}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">GPS Location:</span>
                              <span className="font-mono text-green-600">{batch.transportTracking.currentGPS}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Est. Delivery:</span>
                              <span className="font-medium">{new Date(batch.transportTracking.estimatedDelivery).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full text-xs bg-transparent border-primary/30 hover:bg-primary/10"
                              onClick={() => alert(`📍 Live GPS Tracking\n\nBatch: ${batch.batchId}\nLocation: ${batch.transportTracking.currentGPS}\nRoute: ${batch.transportTracking.route}\nMethod: ${batch.transportTracking.transportMethod}\n\n🌡️ Temperature: ${batch.transportTracking.temperatureControl}\n📱 Real-time monitoring active`)}
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              View Live GPS
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {!batch.transportTracking && (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm text-amber-700">Basic transport mode - GPS tracking not available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {/* Show message if no active transports */}
                {batches.filter(batch => batch.status === "IN_TRANSIT").length === 0 && (
                  <Card className="col-span-full border-2 border-dashed border-primary/20">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Truck className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Active Shipments</h3>
                      <p className="text-sm text-muted-foreground mb-4">All batches are currently at their destinations or awaiting dispatch</p>
                      <Button 
                        onClick={() => setActiveTab("batches")} 
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        View All Batches
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Transport Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Shipments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {batches.filter(batch => batch.status === "IN_TRANSIT").length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">↗ 2</span> new this week
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">↗ +2.1%</span> vs last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Transit Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">2.3 days</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">↘ -0.2</span> days improvement
                    </p>
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
