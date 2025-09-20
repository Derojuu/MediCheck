"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Package, Users, AlertTriangle, TrendingUp, Clock, ArrowRightLeft, Building2, QrCode, FileText, Search } from "lucide-react"
import { DistributorSidebar } from "@/components/distributor-sidebar"
import { TransferOwnership } from "@/components/transfer-ownership"

export default function DrugDistributorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const stats = {
    activeShipments: 47,
    inventoryItems: 2341,
    partnerFacilities: 156,
    pendingOrders: 23,
  }

  const recentShipments = [
    { id: "SHP001", destination: "Lagos General Hospital", items: "45 items", status: "in-transit", eta: "2 hours", driver: "John Adebayo", value: "₦450,000" },
    { id: "SHP002", destination: "MedPlus Pharmacy", items: "23 items", status: "delivered", eta: "Delivered", driver: "Sarah Okafor", value: "₦230,000" },
    { id: "SHP003", destination: "HealthCare Clinic", items: "67 items", status: "preparing", eta: "4 hours", driver: "Mike Okonkwo", value: "₦670,000" },
    { id: "SHP004", destination: "City Hospital", items: "89 items", status: "in-transit", eta: "6 hours", driver: "Grace Emeka", value: "₦890,000" },
  ]

  const lowStockItems = [
    { name: "Paracetamol 500mg", current: "45", minimum: "100", supplier: "PharmaCorp", reorderAmount: "500", status: "Critical" },
    { name: "Amoxicillin 250mg", current: "23", minimum: "50", supplier: "MediLab", reorderAmount: "200", status: "Critical" },
    { name: "Ibuprofen 400mg", current: "12", minimum: "75", supplier: "HealthPharma", reorderAmount: "300", status: "Critical" },
    { name: "Insulin 100IU", current: "8", minimum: "25", supplier: "DiabetesCare", reorderAmount: "100", status: "Critical" },
  ]

  const inventoryData = [
    { id: 1, medication: "Paracetamol 500mg", batch: "PAR2024001", stock: 450, location: "Warehouse A", supplier: "PharmaCorp", status: "Good" },
    { id: 2, medication: "Amoxicillin 250mg", batch: "AMX2024002", stock: 23, location: "Warehouse B", supplier: "MediLab", status: "Low Stock" },
    { id: 3, medication: "Ibuprofen 400mg", batch: "IBU2024003", stock: 12, location: "Warehouse A", supplier: "HealthPharma", status: "Critical" },
    { id: 4, medication: "Insulin 100IU", batch: "INS2024004", stock: 8, location: "Cold Storage", supplier: "DiabetesCare", status: "Critical" },
    { id: 5, medication: "Aspirin 75mg", batch: "ASP2024005", stock: 300, location: "Warehouse C", supplier: "CardiacCare", status: "Good" },
  ]

  const partners = [
    { id: 1, name: "Lagos General Hospital", type: "Hospital", location: "Lagos", status: "Active", lastOrder: "2024-08-23" },
    { id: 2, name: "MedPlus Pharmacy", type: "Pharmacy", location: "Victoria Island", status: "Active", lastOrder: "2024-08-24" },
    { id: 3, name: "HealthCare Clinic", type: "Clinic", location: "Abuja", status: "Active", lastOrder: "2024-08-22" },
    { id: 4, name: "City Hospital", type: "Hospital", location: "Port Harcourt", status: "Pending", lastOrder: "2024-08-20" },
  ]

  const handleTrackShipment = () => {
    alert("Opening shipment tracking interface...")
  }

  const handleManageInventory = () => {
    setActiveTab("inventory")
  }

  const handleTransferOwnership = () => {
    setActiveTab("transfer")
  }

  const handleViewAnalytics = () => {
    setActiveTab("reports")
  }

  return (
    <div className="flex h-screen bg-background">
      <DistributorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Distributor Dashboard</h1>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">Welcome to MedDistribute Nigeria Ltd - Wholesaler</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Distributor
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Shipments</CardTitle>
                    <Truck className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeShipments}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Items</CardTitle>
                    <Package className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.inventoryItems.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+8%</span> growth
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Partner Facilities</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.partnerFacilities}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+5</span> new partners
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">Awaiting processing</p>
                  </CardContent>
                </Card>
              </div>

              {/* Low Stock Alert */}
              <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    Critical Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Supplier: {item.supplier}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">
                            {item.current} / {item.minimum}
                          </p>
                          <Badge variant="destructive">{item.status}</Badge>
                        </div>
                        <Button size="sm" className="ml-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg" onClick={() => alert(`Reordering ${item.reorderAmount} units of ${item.name}...`)}>
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Shipments</CardTitle>
                    <CardDescription>Latest distribution activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentShipments.map((shipment) => (
                        <div key={shipment.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{shipment.destination}</p>
                            <p className="text-xs text-muted-foreground">
                              {shipment.items} - {shipment.driver} - {shipment.value}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                shipment.status === "delivered"
                                  ? "default"
                                  : shipment.status === "in-transit"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {shipment.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{shipment.eta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Quick Actions</CardTitle>
                    <CardDescription>Common distribution tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg" onClick={handleTrackShipment}>
                      <Truck className="h-4 w-4 mr-2" />
                      Track Shipment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      onClick={handleManageInventory}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Inventory
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleTransferOwnership}
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transfer Ownership
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleViewAnalytics}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "shipments" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Shipment Management</h1>
                  <p className="text-muted-foreground">Track and manage all shipments</p>
                </div>
                <Button onClick={() => alert("Creating new shipment...")}>
                  <Truck className="h-4 w-4 mr-2" />
                  New Shipment
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Shipments</CardTitle>
                  <CardDescription>Complete shipment tracking and management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by shipment ID, destination, or driver..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => alert(`Searching for: ${searchQuery}`)}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shipment ID</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ETA</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.id}</TableCell>
                          <TableCell>{shipment.destination}</TableCell>
                          <TableCell>{shipment.items}</TableCell>
                          <TableCell>{shipment.driver}</TableCell>
                          <TableCell>{shipment.value}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                shipment.status === "delivered"
                                  ? "default"
                                  : shipment.status === "in-transit"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{shipment.eta}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => alert(`Tracking ${shipment.id}...`)}>
                              Track
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Inventory Management</h1>
                  <p className="text-muted-foreground">Current stock levels and warehouse management</p>
                </div>
                <Button onClick={() => alert("Adding new stock...")}>
                  <Package className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Inventory</CardTitle>
                  <CardDescription>All medications currently in warehouses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.medication}</TableCell>
                          <TableCell>{item.batch}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Good"
                                  ? "default"
                                  : item.status === "Low Stock"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => alert(`Managing ${item.medication} inventory...`)}
                            >
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "transfer" && <TransferOwnership />}

          {activeTab === "partners" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Partner Management</h1>
                  <p className="text-muted-foreground">Manage partner facilities and relationships</p>
                </div>
                <Button onClick={() => alert("Adding new partner...")}>
                  <Users className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Partner Facilities</CardTitle>
                  <CardDescription>All registered partner facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell className="font-medium">{partner.name}</TableCell>
                          <TableCell>{partner.type}</TableCell>
                          <TableCell>{partner.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={partner.status === "Active" ? "default" : "secondary"}
                            >
                              {partner.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{partner.lastOrder}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => alert(`Managing ${partner.name} partnership...`)}>
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribution Statistics</CardTitle>
                    <CardDescription>Monthly distribution performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>August 2024</span>
                        <span className="font-semibold">2,456 shipments</span>
                      </div>
                      <div className="flex justify-between">
                        <span>July 2024</span>
                        <span className="font-semibold">2,234 shipments</span>
                      </div>
                      <div className="flex justify-between">
                        <span>June 2024</span>
                        <span className="font-semibold">2,087 shipments</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-green-600">+9.9%</span> increase from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analysis</CardTitle>
                    <CardDescription>Monthly revenue trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>August 2024</span>
                        <span className="font-semibold">₦45,600,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>July 2024</span>
                        <span className="font-semibold">₦41,200,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>June 2024</span>
                        <span className="font-semibold">₦38,900,000</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-green-600">+10.7%</span> revenue growth
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Reports</CardTitle>
                    <CardDescription>Download detailed reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting shipment report...")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Shipment Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting inventory report...")}>
                      <Package className="h-4 w-4 mr-2" />
                      Inventory Report (Excel)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting partner report...")}>
                      <Users className="h-4 w-4 mr-2" />
                      Partner Report (PDF)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>On-time Delivery</span>
                        <Badge variant="default">94.5%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Customer Satisfaction</span>
                        <Badge variant="default">4.8/5.0</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Inventory Turnover</span>
                        <Badge variant="secondary">12.3x</Badge>
                      </div>
                      <Button className="w-full mt-4" onClick={() => alert("Generating performance report...")}>
                        Generate Detailed Report
                      </Button>
                    </div>
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
                  <CardTitle>Distributor Settings</CardTitle>
                  <CardDescription>Manage your distributor preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" value="MedDistribute Nigeria Ltd" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license-number">Distribution License Number</Label>
                      <Input id="license-number" value="DIST-2024-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" value="admin@meddistribute.com.ng" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warehouses">Main Warehouse Address</Label>
                      <Textarea id="warehouses" value="123 Industrial Estate, Lagos, Nigeria" rows={3} />
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
