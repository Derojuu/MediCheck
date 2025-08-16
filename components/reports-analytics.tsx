"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, AlertTriangle, Package } from "lucide-react"

export function ReportsAnalytics() {
  // Mock analytics data
  const monthlyStats = {
    batchesCreated: 45,
    transfersCompleted: 38,
    verificationScans: 1247,
    counterfeitDetected: 2,
  }

  const topDrugs = [
    { name: "Paracetamol 500mg", batches: 12, scans: 456 },
    { name: "Amoxicillin 250mg", batches: 8, scans: 234 },
    { name: "Ibuprofen 400mg", batches: 10, scans: 189 },
    { name: "Aspirin 100mg", batches: 6, scans: 167 },
  ]

  const recentAlerts = [
    {
      id: 1,
      type: "Counterfeit Detected",
      batch: "BTH-2024-005",
      location: "Downtown Pharmacy",
      severity: "High",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Expiry Warning",
      batch: "BTH-2023-089",
      location: "Warehouse B",
      severity: "Medium",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "Multiple Scans",
      batch: "BTH-2024-001",
      location: "Various Locations",
      severity: "Low",
      time: "3 days ago",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your medication verification system</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="batches">Batch Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification Trends</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Batches Created</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.batchesCreated}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transfers Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.transfersCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">+15%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verification Scans</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyStats.verificationScans.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">+23%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Counterfeit Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{monthlyStats.counterfeitDetected}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive">+1</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Drugs */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Drugs</CardTitle>
              <CardDescription>Most verified medications this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDrugs.map((drug, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{drug.name}</p>
                      <p className="text-sm text-muted-foreground">{drug.batches} batches</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{drug.scans} scans</p>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(drug.scans / 500) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Analytics</CardTitle>
              <CardDescription>Detailed analytics for medication batches</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Batch analytics charts and data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Trends</CardTitle>
              <CardDescription>Consumer verification patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Verification trend charts and analysis will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Security Alerts
              </CardTitle>
              <CardDescription>Recent security alerts and suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch: {alert.batch} • Location: {alert.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
