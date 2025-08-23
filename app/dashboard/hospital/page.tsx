"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Package, AlertTriangle, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { title: "Total Medications", value: "1,247", icon: Package, change: "+12%" },
    { title: "Verified Today", value: "89", icon: CheckCircle, change: "+5%" },
    { title: "Pending Verifications", value: "23", icon: Clock, change: "-2%" },
    { title: "Alerts", value: "3", icon: AlertTriangle, change: "+1" },
  ]

  const recentVerifications = [
    { id: "MED001", name: "Paracetamol 500mg", batch: "PAR2024001", status: "verified", time: "2 mins ago" },
    { id: "MED002", name: "Amoxicillin 250mg", batch: "AMX2024002", status: "verified", time: "5 mins ago" },
    { id: "MED003", name: "Ibuprofen 400mg", batch: "IBU2024003", status: "pending", time: "8 mins ago" },
    { id: "MED004", name: "Metformin 500mg", batch: "MET2024004", status: "flagged", time: "12 mins ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
            <p className="text-gray-600">Lagos University Teaching Hospital</p>
          </div>
          <Button className="cursor-pointer">
            <Package className="w-4 h-4 mr-2" />
            Verify Medication
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
                  <span className="text-emerald-600">{stat.change}</span> from last month
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
            <TabsTrigger value="inventory" className="cursor-pointer">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="patients" className="cursor-pointer">
              Patients
            </TabsTrigger>
            <TabsTrigger value="reports" className="cursor-pointer">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Verifications</CardTitle>
                  <CardDescription>Latest medication verifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVerifications.map((verification) => (
                      <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{verification.name}</p>
                          <p className="text-sm text-gray-600">Batch: {verification.batch}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <span className="text-xs text-gray-500">{verification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common hospital tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Verify New Medication
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Patient Medication History
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Counterfeit
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Inventory</CardTitle>
                <CardDescription>Current medication stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Inventory management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Patient medication records and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Patient management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Reports</CardTitle>
                <CardDescription>Verification reports and analytics</CardDescription>
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
