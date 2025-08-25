"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, Search, QrCode, Building2, FileText, Activity } from "lucide-react"
import { HospitalSidebar } from "@/components/hospital-sidebar"

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [reportMessage, setReportMessage] = useState("")

  // Mock data
  const stats = {
    totalMedications: 1247,
    verifiedToday: 89,
    pendingVerifications: 23,
    alerts: 3,
  }

  const recentVerifications = [
    { id: "VER001", medication: "Paracetamol 500mg", batch: "PAR2024001", patient: "John Doe", status: "verified", time: "2 mins ago", doctor: "Dr. Smith" },
    { id: "VER002", medication: "Amoxicillin 250mg", batch: "AMX2024002", patient: "Jane Smith", status: "verified", time: "5 mins ago", doctor: "Dr. Johnson" },
    { id: "VER003", medication: "Ibuprofen 400mg", batch: "IBU2024003", patient: "Mike Johnson", status: "pending", time: "8 mins ago", doctor: "Dr. Williams" },
    { id: "VER004", medication: "Metformin 500mg", batch: "MET2024004", patient: "Sarah Wilson", status: "flagged", time: "12 mins ago", doctor: "Dr. Brown" },
  ]

  const inventoryData = [
    { id: 1, medication: "Paracetamol 500mg", batch: "PAR2024001", quantity: 500, expiry: "2025-12-01", location: "Ward A", status: "Good" },
    { id: 2, medication: "Amoxicillin 250mg", batch: "AMX2024002", quantity: 200, expiry: "2025-08-15", location: "Pharmacy", status: "Expiring Soon" },
    { id: 3, medication: "Ibuprofen 400mg", batch: "IBU2024003", quantity: 750, expiry: "2026-03-20", location: "Emergency", status: "Good" },
    { id: 4, medication: "Insulin 100IU", batch: "INS2024004", quantity: 150, expiry: "2025-10-10", location: "ICU", status: "Good" },
    { id: 5, medication: "Aspirin 75mg", batch: "ASP2024005", quantity: 300, expiry: "2025-09-05", location: "Cardiology", status: "Low Stock" },
  ]

  const patientRecords = [
    { id: "PAT001", name: "John Doe", age: 45, condition: "Hypertension", medications: ["Lisinopril 10mg", "Hydrochlorothiazide 25mg"], lastVisit: "2024-08-20", doctor: "Dr. Smith" },
    { id: "PAT002", name: "Jane Smith", age: 32, condition: "Diabetes", medications: ["Metformin 500mg", "Insulin"], lastVisit: "2024-08-22", doctor: "Dr. Johnson" },
    { id: "PAT003", name: "Mike Johnson", age: 28, condition: "Infection", medications: ["Amoxicillin 250mg"], lastVisit: "2024-08-23", doctor: "Dr. Williams" },
    { id: "PAT004", name: "Sarah Wilson", age: 55, condition: "Arthritis", medications: ["Ibuprofen 400mg", "Paracetamol 500mg"], lastVisit: "2024-08-21", doctor: "Dr. Brown" },
  ]

  const handleVerifyMedication = () => {
    alert("Opening medication verification scanner...")
  }

  const handleViewPatientHistory = () => {
    setActiveTab("patients")
  }

  const handleReportCounterfeit = () => {
    if (reportMessage.trim()) {
      alert(`Counterfeit report submitted: ${reportMessage}`)
      setReportMessage("")
    } else {
      alert("Please enter a report message.")
    }
  }

  const handleViewAnalytics = () => {
    setActiveTab("reports")
  }

  return (
    <div className="flex h-screen bg-background">
      <HospitalSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Hospital Dashboard</h1>
                  <p className="text-muted-foreground">Welcome to Lagos University Teaching Hospital</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    Hospital
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMedications.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.verifiedToday}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+5</span> more than yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</div>
                    <p className="text-xs text-muted-foreground">Awaiting verification</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.alerts}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive">+1</span> this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Recent Verifications</CardTitle>
                    <CardDescription>Latest medication verification activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentVerifications.map((verification) => (
                        <div key={verification.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{verification.medication}</p>
                            <p className="text-xs text-muted-foreground">
                              Patient: {verification.patient} - {verification.doctor}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                verification.status === "verified"
                                  ? "default"
                                  : verification.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {verification.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{verification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                    <CardDescription>Common hospital tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" onClick={handleVerifyMedication}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Verify Medication
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleViewPatientHistory}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Patient History
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("inventory")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Check Inventory
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

          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Inventory Management</h1>
                  <p className="text-muted-foreground">Current medication stock levels and locations</p>
                </div>
                <Button onClick={() => alert("Adding new medication to inventory...")}>
                  <Package className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Inventory</CardTitle>
                  <CardDescription>All medications currently in hospital inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.medication}</TableCell>
                          <TableCell>{item.batch}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.expiry}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "Good"
                                  ? "default"
                                  : item.status === "Expiring Soon"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.status}
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

          {activeTab === "patients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Patient Records</h1>
                  <p className="text-muted-foreground">Patient medication records and history</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={() => alert(`Searching for: ${searchQuery}`)}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Medical Records</CardTitle>
                  <CardDescription>Current patients and their medication history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Medications</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Last Visit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientRecords.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.id}</TableCell>
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {patient.medications.map((med, index) => (
                                <Badge key={index} variant="outline" className="mr-1">
                                  {med}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{patient.doctor}</TableCell>
                          <TableCell>{patient.lastVisit}</TableCell>
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
                    <CardTitle>Verification Statistics</CardTitle>
                    <CardDescription>Monthly verification trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>August 2024</span>
                        <span className="font-semibold">2,156 verifications</span>
                      </div>
                      <div className="flex justify-between">
                        <span>July 2024</span>
                        <span className="font-semibold">1,934 verifications</span>
                      </div>
                      <div className="flex justify-between">
                        <span>June 2024</span>
                        <span className="font-semibold">1,821 verifications</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-green-600">+11.5%</span> increase from last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Counterfeit</CardTitle>
                    <CardDescription>Report suspected counterfeit medications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="report">Report Details</Label>
                      <Textarea
                        id="report"
                        placeholder="Describe the suspected counterfeit medication..."
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleReportCounterfeit} className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Alerts & Notifications</h1>
              
              <div className="space-y-4">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      Critical Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-white border rounded-lg">
                        <p className="font-medium">Suspected counterfeit batch detected</p>
                        <p className="text-sm text-muted-foreground">Batch: PAR2024001 - Paracetamol 500mg</p>
                        <p className="text-xs text-red-600">2 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Clock className="h-5 w-5" />
                      Expiry Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-white border rounded-lg">
                        <p className="font-medium">Medications expiring within 30 days</p>
                        <p className="text-sm text-muted-foreground">5 batches require attention</p>
                        <Button size="sm" className="mt-2">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">System maintenance scheduled</p>
                        <p className="text-sm text-muted-foreground">Tonight at 2:00 AM - 4:00 AM</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
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
                  <CardTitle>Hospital Settings</CardTitle>
                  <CardDescription>Manage your hospital preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="hospital-name">Hospital Name</Label>
                      <Input id="hospital-name" value="Lagos University Teaching Hospital" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license-number">Medical License Number</Label>
                      <Input id="license-number" value="HOSP-2024-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" value="admin@luth.edu.ng" />
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
