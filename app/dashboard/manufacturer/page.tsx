"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Users, QrCode, ArrowUpRight, Calendar, Building2, Truck } from "lucide-react"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { BatchManagement } from "@/components/batch-management"
import { TransferOwnership } from "@/components/transfer-ownership"
import { TeamManagement } from "@/components/team-management"
import { ReportsAnalytics } from "@/components/reports-analytics"

export default function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data
  const stats = {
    totalBatches: 1247,
    drugsInTransit: 89,
    counterfeitReports: 3,
    expiredDrugsAlert: 12,
  }

  const recentActivity = [
    { id: 1, action: "Batch Created", batch: "BTH-2024-001", drug: "Paracetamol 500mg", time: "2 hours ago" },
    { id: 2, action: "Transfer Completed", batch: "BTH-2024-002", drug: "Amoxicillin 250mg", time: "4 hours ago" },
    { id: 3, action: "QR Generated", batch: "BTH-2024-003", drug: "Ibuprofen 400mg", time: "6 hours ago" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <OrganizationSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back to your organization dashboard</p>
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
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBatches.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+12%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Drugs in Transit</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.drugsInTransit}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+5</span> new shipments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Counterfeit Reports</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.counterfeitReports}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive">+1</span> this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expiry Alerts</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.expiredDrugsAlert}</div>
                    <p className="text-xs text-muted-foreground">Expiring within 30 days</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Recent Activity</CardTitle>
                    <CardDescription>Latest actions in your organization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.batch} - {activity.drug}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" onClick={() => setActiveTab("batches")}>
                      <Package className="h-4 w-4 mr-2" />
                      Create New Batch
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("qr-generation")}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Codes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("transfer")}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Transfer Ownership
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setActiveTab("team")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "batches" && <BatchManagement />}
          {activeTab === "qr-generation" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">QR/NFC Generation</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Codes</CardTitle>
                  <CardDescription>Create QR codes for your medication batches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">QR code generation functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === "transfer" && <TransferOwnership />}
          {activeTab === "reports" && <ReportsAnalytics />}
          {activeTab === "team" && <TeamManagement />}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>Manage your organization preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
