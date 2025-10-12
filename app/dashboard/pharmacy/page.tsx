"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pill, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, Search, QrCode, Building2, FileText, Activity } from "lucide-react"
import { PharmacySidebar } from "@/components/pharmacy-sidebar"
import { TeamMemberManagement } from "@/components/team-member-management"
import { toast } from "react-toastify"

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [prescriptionSearch, setPrescriptionSearch] = useState("")
  const [orgId, setOrgId] = useState("")
  const [orgLoading, setOrgLoading] = useState(true)

  // Fetch orgId
  useEffect(() => {
    const loadOrg = async () => {
      setOrgLoading(true);
      try {
        const res = await fetch("/api/organizations/me");
        const data = await res.json();
        setOrgId(data.organizationId);
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("Failed to load organization data");
      } finally {
        setOrgLoading(false);
      }
    };
    loadOrg();
  }, []);

  // Mock data
  const stats = {
    prescriptionsFilled: 342,
    medicationsVerified: 156,
    pendingOrders: 28,
    lowStockAlerts: 7,
  }

  const recentPrescriptions = [
    { id: "RX001", patient: "John Doe", medication: "Lisinopril 10mg", batch: "LIS2024001", status: "filled", time: "1 hour ago", doctor: "Dr. Smith", quantity: "30 tablets" },
    { id: "RX002", patient: "Jane Smith", medication: "Metformin 500mg", batch: "MET2024002", status: "pending", time: "2 hours ago", doctor: "Dr. Johnson", quantity: "60 tablets" },
    { id: "RX003", patient: "Mike Johnson", medication: "Atorvastatin 20mg", batch: "ATO2024003", status: "verified", time: "3 hours ago", doctor: "Dr. Williams", quantity: "30 tablets" },
    { id: "RX004", patient: "Sarah Wilson", medication: "Omeprazole 40mg", batch: "OME2024004", status: "filled", time: "4 hours ago", doctor: "Dr. Brown", quantity: "14 capsules" },
  ]

  const inventoryData = [
    { id: 1, medication: "Lisinopril 10mg", batch: "LIS2024001", stock: 240, reorderLevel: 50, supplier: "PharmaCorp", price: 850, status: "Good" },
    { id: 2, medication: "Metformin 500mg", batch: "MET2024002", stock: 180, reorderLevel: 100, supplier: "MediLab", price: 1200, status: "Good" },
    { id: 3, medication: "Atorvastatin 20mg", batch: "ATO2024003", stock: 45, reorderLevel: 50, supplier: "HealthPharma", price: 2400, status: "Low Stock" },
    { id: 4, medication: "Omeprazole 40mg", batch: "OME2024004", stock: 320, reorderLevel: 75, supplier: "PharmaCorp", price: 1650, status: "Good" },
    { id: 5, medication: "Aspirin 75mg", batch: "ASP2024005", stock: 25, reorderLevel: 100, supplier: "MediLab", price: 450, status: "Critical" },
  ]

  const prescriptionHistory = [
    { id: "RX001", patient: "John Doe", date: "2024-08-25", medications: ["Lisinopril 10mg"], doctor: "Dr. Smith", status: "Completed" },
    { id: "RX002", patient: "Jane Smith", date: "2024-08-24", medications: ["Metformin 500mg", "Insulin"], doctor: "Dr. Johnson", status: "Completed" },
    { id: "RX003", patient: "Mike Johnson", date: "2024-08-23", medications: ["Atorvastatin 20mg"], doctor: "Dr. Williams", status: "Completed" },
    { id: "RX004", patient: "Sarah Wilson", date: "2024-08-22", medications: ["Omeprazole 40mg", "Pantoprazole 20mg"], doctor: "Dr. Brown", status: "Completed" },
    { id: "RX005", patient: "David Lee", date: "2024-08-21", medications: ["Aspirin 75mg"], doctor: "Dr. Davis", status: "Pending" },
  ]

  const handleFillPrescription = () => {
    alert("Opening prescription filling interface...")
  }

  const handleVerifyMedication = () => {
    alert("Opening medication verification scanner...")
  }

  const handleCheckInventory = () => {
    setActiveTab("inventory")
  }

  const handleViewReports = () => {
    setActiveTab("reports")
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 left-24 w-80 h-80 bg-primary/3 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 right-1/3 w-44 h-44 bg-accent/7 rounded-full blur-xl"></div>
      </div>
      
      <PharmacySidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pharmacy Dashboard</h1>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">Welcome to MedPlus Pharmacy - Victoria Island</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Pharmacy
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions Filled</CardTitle>
                    <Pill className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.prescriptionsFilled}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent font-medium">+8%</span> from last week
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Medications Verified</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.medicationsVerified}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">+12</span> more than yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">Awaiting processing</p>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.lowStockAlerts}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive">+2</span> new alerts
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Recent Prescriptions</CardTitle>
                    <CardDescription>Latest prescription activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPrescriptions.map((prescription) => (
                        <div key={prescription.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{prescription.patient}</p>
                            <p className="text-xs text-muted-foreground">
                              {prescription.medication} - {prescription.quantity} ({prescription.doctor})
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                prescription.status === "filled"
                                  ? "default"
                                  : prescription.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {prescription.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{prescription.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                    <CardDescription>Common pharmacy tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" onClick={handleFillPrescription}>
                      <Pill className="h-4 w-4 mr-2" />
                      Fill Prescription
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleVerifyMedication}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Verify Medication
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleCheckInventory}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Check Inventory
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleViewReports}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Prescription Management</h1>
                  <p className="text-muted-foreground">Search and manage all prescriptions</p>
                </div>
                <Button onClick={() => alert("Adding new prescription...")}>
                  <Pill className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Search Prescriptions</CardTitle>
                  <CardDescription>Find prescriptions by patient name, prescription ID, or medication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by patient name, prescription ID, or medication..."
                        value={prescriptionSearch}
                        onChange={(e) => setPrescriptionSearch(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => alert(`Searching for: ${prescriptionSearch}`)}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>RX ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medications</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptionHistory.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">{prescription.id}</TableCell>
                          <TableCell>{prescription.patient}</TableCell>
                          <TableCell>{prescription.date}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {prescription.medications.map((med, index) => (
                                <Badge key={index} variant="outline" className="mr-1">
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{prescription.doctor}</TableCell>
                          <TableCell>
                            <Badge
                              variant={prescription.status === "Completed" ? "default" : "secondary"}
                            >
                              {prescription.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => alert(`Viewing details for ${prescription.id}`)}>
                              View
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
                  <p className="text-muted-foreground">Current medication stock and ordering</p>
                </div>
                <Button onClick={() => alert("Adding new medication to inventory...")}>
                  <Package className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Inventory</CardTitle>
                  <CardDescription>All medications currently in pharmacy stock</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Price (₦)</TableHead>
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
                          <TableCell>{item.reorderLevel}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{item.price.toLocaleString()}</TableCell>
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
                              onClick={() => alert(`Reordering ${item.medication}...`)}
                              disabled={item.status === "Good"}
                            >
                              Reorder
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

          {activeTab === "team" && (
            <TeamMemberManagement 
              organizationType="pharmacy"
              organizationId={orgId}
            />
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Statistics</CardTitle>
                    <CardDescription>Monthly sales and revenue trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>August 2024</span>
                        <span className="font-semibold">₦2,450,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>July 2024</span>
                        <span className="font-semibold">₦2,180,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>June 2024</span>
                        <span className="font-semibold">₦1,980,000</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-green-600">+12.4%</span> increase from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prescription Trends</CardTitle>
                    <CardDescription>Most filled prescriptions this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Lisinopril 10mg</span>
                        <span className="font-semibold">156 prescriptions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Metformin 500mg</span>
                        <span className="font-semibold">142 prescriptions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Omeprazole 40mg</span>
                        <span className="font-semibold">128 prescriptions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atorvastatin 20mg</span>
                        <span className="font-semibold">115 prescriptions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Report</CardTitle>
                    <CardDescription>Regulatory compliance status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>License Status</span>
                        <Badge variant="default">Valid</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Inspection</span>
                        <span className="text-sm">July 15, 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Next Renewal</span>
                        <span className="text-sm">January 2025</span>
                      </div>
                      <Button className="w-full mt-4" onClick={() => alert("Generating compliance report...")}>
                        Generate Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Reports</CardTitle>
                    <CardDescription>Download detailed reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting sales report...")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Sales Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting inventory report...")}>
                      <Package className="h-4 w-4 mr-2" />
                      Inventory Report (Excel)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting prescription report...")}>
                      <Pill className="h-4 w-4 mr-2" />
                      Prescription Report (PDF)
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
                  <CardTitle>Pharmacy Settings</CardTitle>
                  <CardDescription>Manage your pharmacy preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
                      <Input id="pharmacy-name" value="MedPlus Pharmacy" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license-number">Pharmacy License Number</Label>
                      <Input id="license-number" value="PHR-2024-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" value="admin@medplus.com.ng" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" value="123 Victoria Island, Lagos, Nigeria" rows={3} />
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
