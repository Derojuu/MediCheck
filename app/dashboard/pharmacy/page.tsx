"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pill, Package, AlertTriangle, TrendingUp, Clock, CheckCircle, Search } from "lucide-react"

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { title: "Prescriptions Filled", value: "342", icon: Pill, change: "+8%" },
    { title: "Medications Verified", value: "156", icon: CheckCircle, change: "+12%" },
    { title: "Pending Orders", value: "28", icon: Clock, change: "+3%" },
    { title: "Low Stock Alerts", value: "7", icon: AlertTriangle, change: "+2" },
  ]

  const recentPrescriptions = [
    { id: "RX001", patient: "John Doe", medication: "Lisinopril 10mg", status: "filled", time: "1 hour ago" },
    { id: "RX002", patient: "Jane Smith", medication: "Metformin 500mg", status: "pending", time: "2 hours ago" },
    { id: "RX003", patient: "Mike Johnson", medication: "Atorvastatin 20mg", status: "verified", time: "3 hours ago" },
    { id: "RX004", patient: "Sarah Wilson", medication: "Omeprazole 40mg", status: "filled", time: "4 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            <p className="text-gray-600">MedPlus Pharmacy - Victoria Island</p>
          </div>
          <Button className="cursor-pointer">
            <Pill className="w-4 h-4 mr-2" />
            New Prescription
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600">{stat.change}</span> from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="cursor-pointer">
              Overview
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="cursor-pointer">
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="inventory" className="cursor-pointer">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reports" className="cursor-pointer">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <CardDescription>Latest prescription activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{prescription.patient}</p>
                          <p className="text-sm text-gray-600">{prescription.medication}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <span className="text-xs text-gray-500">{prescription.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common pharmacy tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Pill className="w-4 h-4 mr-2" />
                    Fill Prescription
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Verify Medication
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Check Inventory
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>Search and manage prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search">Search Prescriptions</Label>
                      <Input
                        id="search"
                        placeholder="Search by patient name or prescription ID"
                        className="cursor-pointer"
                      />
                    </div>
                    <Button className="mt-6 cursor-pointer">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    Prescription management interface would be implemented here
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Inventory</CardTitle>
                <CardDescription>Current medication stock and ordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Inventory management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Reports</CardTitle>
                <CardDescription>Sales, inventory, and compliance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Reports and analytics interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
