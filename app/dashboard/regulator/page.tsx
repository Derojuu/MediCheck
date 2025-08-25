"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, AlertTriangle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Eye, Building2, Search, Activity, Users } from "lucide-react"
import { RegulatorSidebar } from "@/components/regulator-sidebar"

export default function RegulatorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [investigationNotes, setInvestigationNotes] = useState("")

  // Mock data
  const stats = {
    activeInvestigations: 12,
    complianceChecks: 89,
    pendingReviews: 34,
    violationsFound: 5,
  }

  const recentActivities = [
    {
      id: "REG001",
      type: "Inspection",
      target: "PharmaCorp Ltd",
      status: "completed",
      priority: "high",
      time: "2 hours ago",
      inspector: "Dr. Adebayo",
      findings: "Minor compliance issues"
    },
    {
      id: "REG002",
      type: "Compliance Review",
      target: "MedDistribute Inc",
      status: "in-progress",
      priority: "medium",
      time: "4 hours ago",
      inspector: "Dr. Okafor",
      findings: "Under review"
    },
    {
      id: "REG003",
      type: "Investigation",
      target: "HealthPlus Pharmacy",
      status: "pending",
      priority: "high",
      time: "6 hours ago",
      inspector: "Dr. Emeka",
      findings: "Suspicious batch detected"
    },
    {
      id: "REG004",
      type: "License Renewal",
      target: "CureAll Hospital",
      status: "approved",
      priority: "low",
      time: "1 day ago",
      inspector: "Dr. Nkem",
      findings: "All requirements met"
    },
  ]

  const alerts = [
    { id: "ALT001", message: "Counterfeit batch detected: PAR2024001", severity: "critical", time: "30 mins ago", location: "Lagos", reporter: "Hospital Inspector" },
    { id: "ALT002", message: "Unusual distribution pattern flagged", severity: "warning", time: "2 hours ago", location: "Abuja", reporter: "System Alert" },
    { id: "ALT003", message: "License expiration reminder: 5 facilities", severity: "info", time: "4 hours ago", location: "Multiple", reporter: "Automated System" },
  ]

  const investigations = [
    { id: "INV001", title: "Counterfeit Paracetamol Investigation", target: "Multiple Facilities", status: "Active", priority: "Critical", startDate: "2024-08-20", inspector: "Dr. Adebayo" },
    { id: "INV002", title: "Expired Drug Distribution", target: "MedChain Pharmacy", status: "Under Review", priority: "High", startDate: "2024-08-18", inspector: "Dr. Okafor" },
    { id: "INV003", title: "Unlicensed Distribution Activity", target: "QuickMed Ltd", status: "Pending", priority: "High", startDate: "2024-08-15", inspector: "Dr. Emeka" },
    { id: "INV004", title: "Storage Condition Violations", target: "HealthStore Inc", status: "Completed", priority: "Medium", startDate: "2024-08-10", inspector: "Dr. Nkem" },
  ]

  const registeredEntities = [
    { id: "ENT001", name: "PharmaCorp Ltd", type: "Manufacturer", location: "Lagos", license: "MAN-2024-001", status: "Active", lastInspection: "2024-07-15" },
    { id: "ENT002", name: "MedDistribute Inc", type: "Distributor", location: "Abuja", license: "DIST-2024-002", status: "Active", lastInspection: "2024-06-20" },
    { id: "ENT003", name: "HealthPlus Pharmacy", type: "Pharmacy", location: "Port Harcourt", license: "PHR-2024-003", status: "Under Review", lastInspection: "2024-08-01" },
    { id: "ENT004", name: "CureAll Hospital", type: "Hospital", location: "Kano", license: "HOS-2024-004", status: "Active", lastInspection: "2024-05-10" },
    { id: "ENT005", name: "MediCare Clinic", type: "Clinic", location: "Ibadan", license: "CLI-2024-005", status: "Expired", lastInspection: "2024-02-15" },
  ]

  const handleStartInvestigation = () => {
    if (investigationNotes.trim()) {
      alert(`New investigation started: ${investigationNotes}`)
      setInvestigationNotes("")
    } else {
      alert("Please enter investigation details.")
    }
  }

  const handleComplianceCheck = () => {
    setActiveTab("compliance")
  }

  const handleGenerateReport = () => {
    setActiveTab("reports")
  }

  const handleViewAnalytics = () => {
    setActiveTab("reports")
  }

  return (
    <div className="flex h-screen bg-background">
      <RegulatorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Regulator Dashboard</h1>
                  <p className="text-muted-foreground">NAFDAC - Drug Enforcement Division</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Building2 className="h-4 w-4 mr-2" />
                    Regulator
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Investigations</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeInvestigations}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-accent">+3</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Checks</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.complianceChecks}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-primary">+15%</span> this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-orange-600">+7%</span> increase
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Violations Found</CardTitle>
                    <XCircle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.violationsFound}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">-2</span> from last month
                    </p>
                  </CardContent>
                </Card>
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
                          <p className="text-sm text-gray-600">{alert.location} - {alert.reporter} - {alert.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          <Button size="sm" onClick={() => window.alert(`Investigating ${alert.id}...`)}>
                            Investigate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Recent Activities</CardTitle>
                    <CardDescription>Latest regulatory activities and inspections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.type} - {activity.target}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.inspector} - {activity.findings}
                            </p>
                          </div>
                          <div className="text-right">
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
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                    <CardDescription>Common regulatory tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="investigation-notes">Investigation Notes</Label>
                      <Textarea
                        id="investigation-notes"
                        placeholder="Enter investigation details..."
                        value={investigationNotes}
                        onChange={(e) => setInvestigationNotes(e.target.value)}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button className="w-full justify-start" onClick={handleStartInvestigation}>
                      <Eye className="h-4 w-4 mr-2" />
                      Start Investigation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleComplianceCheck}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Compliance Check
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleGenerateReport}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
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

          {activeTab === "investigations" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Investigations Management</h1>
                  <p className="text-muted-foreground">Active and completed investigations</p>
                </div>
                <Button onClick={() => alert("Creating new investigation...")}>
                  <Eye className="h-4 w-4 mr-2" />
                  New Investigation
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Investigations</CardTitle>
                  <CardDescription>Complete list of regulatory investigations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by investigation title, target, or inspector..."
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
                        <TableHead>Investigation ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Inspector</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investigations.map((investigation) => (
                        <TableRow key={investigation.id}>
                          <TableCell className="font-medium">{investigation.id}</TableCell>
                          <TableCell>{investigation.title}</TableCell>
                          <TableCell>{investigation.target}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                investigation.status === "Completed"
                                  ? "default"
                                  : investigation.status === "Active"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {investigation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                investigation.priority === "Critical"
                                  ? "destructive"
                                  : investigation.priority === "High"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {investigation.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{investigation.startDate}</TableCell>
                          <TableCell>{investigation.inspector}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => alert(`Managing investigation ${investigation.id}...`)}>
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

          {activeTab === "compliance" && (
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Compliance Monitoring</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Statistics</CardTitle>
                    <CardDescription>Overall compliance performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Fully Compliant</span>
                        <span className="font-semibold text-green-600">156 entities (78%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minor Issues</span>
                        <span className="font-semibold text-orange-600">34 entities (17%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Major Violations</span>
                        <span className="font-semibold text-red-600">10 entities (5%)</span>
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
                    <CardTitle>Upcoming Inspections</CardTitle>
                    <CardDescription>Scheduled regulatory inspections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">PharmaCorp Ltd - Manufacturing Facility</p>
                        <p className="text-sm text-muted-foreground">August 28, 2024 - Dr. Adebayo</p>
                        <Badge variant="secondary">Routine Inspection</Badge>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-medium">MedDistribute Inc - Warehouse Audit</p>
                        <p className="text-sm text-muted-foreground">August 30, 2024 - Dr. Okafor</p>
                        <Badge variant="outline">Follow-up</Badge>
                      </div>
                      <Button className="w-full mt-4" onClick={() => alert("Scheduling new inspection...")}>
                        Schedule New Inspection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "entities" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-montserrat font-bold text-3xl text-foreground">Registered Entities</h1>
                  <p className="text-muted-foreground">All registered pharmaceutical entities</p>
                </div>
                <Button onClick={() => alert("Registering new entity...")}>
                  <Users className="h-4 w-4 mr-2" />
                  Register Entity
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Registered Entities</CardTitle>
                  <CardDescription>Complete database of registered pharmaceutical entities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Inspection</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registeredEntities.map((entity) => (
                        <TableRow key={entity.id}>
                          <TableCell className="font-medium">{entity.id}</TableCell>
                          <TableCell>{entity.name}</TableCell>
                          <TableCell>{entity.type}</TableCell>
                          <TableCell>{entity.location}</TableCell>
                          <TableCell>{entity.license}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                entity.status === "Active"
                                  ? "default"
                                  : entity.status === "Under Review"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {entity.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{entity.lastInspection}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => alert(`Managing ${entity.name}...`)}>
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
                    <CardTitle>Regulatory Activity</CardTitle>
                    <CardDescription>Monthly regulatory statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Inspections Completed</span>
                        <span className="font-semibold">89 inspections</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investigations Opened</span>
                        <span className="font-semibold">12 cases</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Violations Detected</span>
                        <span className="font-semibold">5 violations</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Licenses Renewed</span>
                        <span className="font-semibold">23 renewals</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Reports</CardTitle>
                    <CardDescription>Download detailed regulatory reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting investigation report...")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Investigation Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting compliance report...")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Compliance Report (Excel)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting entity report...")}>
                      <Users className="h-4 w-4 mr-2" />
                      Entity Report (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => alert("Exporting violation report...")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Violation Report (PDF)
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
                      {alerts.filter(a => a.severity === 'critical').map((alert) => (
                        <div key={alert.id} className="p-3 bg-white border rounded-lg">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{alert.location} - {alert.reporter} - {alert.time}</p>
                          <Button size="sm" className="mt-2" onClick={() => window.alert(`Investigating ${alert.id}...`)}>
                            Investigate Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Clock className="h-5 w-5" />
                      Warning Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.filter(a => a.severity === 'warning').map((alert) => (
                        <div key={alert.id} className="p-3 bg-white border rounded-lg">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{alert.location} - {alert.reporter} - {alert.time}</p>
                          <Button size="sm" variant="outline" className="mt-2" onClick={() => window.alert(`Reviewing ${alert.id}...`)}>
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Information Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {alerts.filter(a => a.severity === 'info').map((alert) => (
                        <div key={alert.id} className="p-3 border rounded-lg">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{alert.location} - {alert.reporter} - {alert.time}</p>
                        </div>
                      ))}
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
                  <CardTitle>Regulatory Agency Settings</CardTitle>
                  <CardDescription>Manage regulatory system preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agency-name">Agency Name</Label>
                      <Input id="agency-name" value="National Agency for Food and Drug Administration and Control (NAFDAC)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division</Label>
                      <Input id="division" value="Drug Enforcement Division" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" value="enforcement@nafdac.gov.ng" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headquarters">Headquarters Address</Label>
                      <Textarea id="headquarters" value="Plot 2032, Olusegun Obasanjo Way, Zone 7, Wuse District, Abuja, FCT, Nigeria" rows={3} />
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
