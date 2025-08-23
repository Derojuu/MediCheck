"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Eye } from "lucide-react"

export default function RegulatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { title: "Active Investigations", value: "12", icon: Eye, change: "+3" },
    { title: "Compliance Checks", value: "89", icon: CheckCircle, change: "+15%" },
    { title: "Pending Reviews", value: "34", icon: Clock, change: "+7%" },
    { title: "Violations Found", value: "5", icon: XCircle, change: "-2" },
  ]

  const recentActivities = [
    {
      id: "REG001",
      type: "Inspection",
      target: "PharmaCorp Ltd",
      status: "completed",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: "REG002",
      type: "Compliance Review",
      target: "MedDistribute Inc",
      status: "in-progress",
      priority: "medium",
      time: "4 hours ago",
    },
    {
      id: "REG003",
      type: "Investigation",
      target: "HealthPlus Pharmacy",
      status: "pending",
      priority: "high",
      time: "6 hours ago",
    },
    {
      id: "REG004",
      type: "License Renewal",
      target: "CureAll Hospital",
      status: "approved",
      priority: "low",
      time: "1 day ago",
    },
  ]

  const alerts = [
    { id: "ALT001", message: "Counterfeit batch detected: PAR2024001", severity: "critical", time: "30 mins ago" },
    { id: "ALT002", message: "Unusual distribution pattern flagged", severity: "warning", time: "2 hours ago" },
    { id: "ALT003", message: "License expiration reminder: 5 facilities", severity: "info", time: "4 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
            <p className="text-gray-600">NAFDAC - Drug Enforcement Division</p>
          </div>
          <Button className="cursor-pointer">
            <Shield className="w-4 h-4 mr-2" />
            New Investigation
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

        {/* Alerts Section */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-600">{alert.time}</p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "critical"
                        ? "destructive"
                        : alert.severity === "warning"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {alert.severity}
                  </Badge>
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
            <TabsTrigger value="investigations" className="cursor-pointer">
              Investigations
            </TabsTrigger>
            <TabsTrigger value="compliance" className="cursor-pointer">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="reports" className="cursor-pointer">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest regulatory activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-gray-600">{activity.target}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              activity.priority === "high"
                                ? "destructive"
                                : activity.priority === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {activity.priority}
                          </Badge>
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : activity.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common regulatory tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Start Investigation
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Compliance Check
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start cursor-pointer bg-transparent" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investigations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Investigations</CardTitle>
                <CardDescription>Ongoing regulatory investigations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Investigation management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Monitoring</CardTitle>
                <CardDescription>Track compliance across all registered entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Compliance monitoring interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Reports</CardTitle>
                <CardDescription>Generate and view regulatory reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Reports generation interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
