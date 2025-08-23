"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Package, Users, AlertTriangle, TrendingUp, Clock, ArrowRightLeft } from "lucide-react"

export default function DrugDistributorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { title: "Active Shipments", value: "47", icon: Truck, change: "+12%" },
    { title: "Inventory Items", value: "2,341", icon: Package, change: "+8%" },
    { title: "Partner Facilities", value: "156", icon: Users, change: "+5%" },
    { title: "Pending Orders", value: "23", icon: Clock, change: "+3%" },
  ]

  const recentShipments = [
    { id: "SHP001", destination: "Lagos General Hospital", items: "45 items", status: "in-transit", eta: "2 hours" },
    { id: "SHP002", destination: "MedPlus Pharmacy", items: "23 items", status: "delivered", eta: "Delivered" },
    { id: "SHP003", destination: "HealthCare Clinic", items: "67 items", status: "preparing", eta: "4 hours" },
    { id: "SHP004", destination: "City Hospital", items: "89 items", status: "in-transit", eta: "6 hours" },
  ]

  const lowStockItems = [
    { name: "Paracetamol 500mg", current: "45", minimum: "100", supplier: "PharmaCorp" },
    { name: "Amoxicillin 250mg", current: "23", minimum: "50", supplier: "MediLab" },
    { name: "Ibuprofen 400mg", current: "12", minimum: "75", supplier: "HealthPharma" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
            <p className="text-gray-600">MedDistribute Nigeria Ltd - Wholesaler</p>
          </div>
          <Button className="cursor-pointer">
            <Package className="w-4 h-4 mr-2" />
            New Shipment
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

        {/* Low Stock Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
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
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {item.current} / {item.minimum}
                    </p>
                    <Button size="sm" className="mt-1 cursor-pointer">
                      Reorder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="cursor-pointer">
              Overview
            </TabsTrigger>
            <TabsTrigger value="shipments" className="cursor-pointer">
              Shipments
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
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Latest distribution activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentShipments.map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{shipment.destination}</p>
                          <p className="text-sm text-gray-600">{shipment.items}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <span className="text-xs text-gray-500">{shipment.eta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common distribution tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Truck className="w-4 h-4 mr-2" />
                    Track Shipment
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Inventory
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Transfer Ownership
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Management</CardTitle>
                <CardDescription>Track and manage all shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Shipment management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Current stock levels and ordering</CardDescription>
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
                <CardTitle>Distribution Reports</CardTitle>
                <CardDescription>Analytics and performance reports</CardDescription>
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
