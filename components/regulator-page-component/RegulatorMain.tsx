"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, AlertTriangle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import { ManufacturerTab } from "@/utils";

const RegulatorMain = ({ setActiveTab }: { 
    setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>>;
}) => {

    const [investigationNotes, setInvestigationNotes] = useState("")
    const [stats, setStats] = useState({
        activeInvestigations: 0,
        investigationGrowth: 0,
        complianceChecks: 0,
        complianceGrowth: 0,
        pendingReviews: 0,
        pendingGrowth: 0,
        violationsFound: 0,
        violationChange: 0,
    })
    const [activities, setActivities] = useState<any[]>([])
    const [alerts, setAlerts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResponse, activitiesResponse, alertsResponse] = await Promise.all([
                    fetch('/api/dashboard/regulator-stats'),
                    fetch('/api/dashboard/regulator-activities'),
                    fetch('/api/regulator/alerts')
                ])

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json()
                    setStats(statsData)
                }

                if (activitiesResponse.ok) {
                    const activitiesData = await activitiesResponse.json()
                    setActivities(Array.isArray(activitiesData) ? activitiesData : activitiesData.activities || [])
                }

                if (alertsResponse.ok) {
                    const alertsData = await alertsResponse.json()
                    setAlerts(alertsData.alerts || [])
                }
            } catch (error) {
                console.error('Error fetching regulator data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                {/* On mobile, stack heading and subheading vertically, but keep them together */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                    <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Regulator Dashboard
                    </h1>
                    <span className="text-muted-foreground mt-1 sm:mt-0 sm:ml-2">
                        NAFDAC - Drug Enforcement Division
                    </span>
                </div>
                {/* Hide ThemeToggle and badge on mobile, show on desktop */}
                <div className="hidden sm:flex items-center space-x-4">
                    <ThemeToggle />
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                        <Building2 className="h-4 w-4 mr-2" />
                        Regulator
                    </Badge>
                </div>
            </div>

            {/* Card Layout for Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Investigations</CardTitle>
                        <CardDescription>{stats.activeInvestigations}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Compliance Checks</CardTitle>
                        <CardDescription>{stats.complianceChecks}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Reviews</CardTitle>
                        <CardDescription>{stats.pendingReviews}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Violations Found</CardTitle>
                        <CardDescription>{stats.violationsFound}</CardDescription>
                    </CardHeader>
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
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-muted-foreground">Loading alerts...</span>
                                </div>
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No critical alerts at this time</p>
                                <p className="text-sm text-muted-foreground mt-1">System is monitoring for issues</p>
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{alert.message}</p>
                                        <p className="text-sm text-gray-600">{alert.location} - {alert.reporter} - {alert.time}</p>
                                        {alert.details && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {alert.details.batchId && `Batch: ${alert.details.batchId}`}
                                                {alert.details.manufacturer && ` | Mfg: ${alert.details.manufacturer}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                alert.severity === "critical"
                                                    ? "destructive"
                                                    : alert.severity === "high"
                                                        ? "destructive"
                                                        : alert.severity === "warning"
                                                            ? "secondary"
                                                            : "outline"
                                            }
                                            className={
                                                alert.severity === "critical" || alert.severity === "high"
                                                    ? "bg-red-100 text-red-800 animate-pulse"
                                                    : ""
                                            }
                                        >
                                            {alert.severity}
                                        </Badge>
                                        <Button 
                                            size="sm" 
                                            onClick={() => {
                                                if (alert.type === 'counterfeit_report') {
                                                    setActiveTab("investigations")
                                                } else if (alert.type === 'failed_transfer') {
                                                    setActiveTab("compliance")
                                                } else if (alert.type === 'license_expiring') {
                                                    setActiveTab("entities")
                                                } else {
                                                    window.alert(`Investigating ${alert.id}: ${alert.message}`)
                                                }
                                            }}
                                            className={
                                                alert.severity === "critical" || alert.severity === "high"
                                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                                    : ""
                                            }
                                        >
                                            {alert.type === 'counterfeit_report' ? 'Investigate' :
                                             alert.type === 'failed_transfer' ? 'Review' :
                                             alert.type === 'license_expiring' ? 'Check License' :
                                             'View'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-montserrat">Recent Activities</CardTitle>
                        <CardDescription>Latest regulatory activities and inspections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.length > 0 ? (
                                activities.map((activity: any) => (
                                    <div
                                        key={activity.id}
                                        className="flex flex-col xl:flex-row xl:items-center gap-2 xl:gap-4 p-2 rounded-lg border border-muted/30"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">{activity.type} - {activity.target}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.inspector} - {activity.findings}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row xl:flex-col items-center xl:items-end gap-2 xl:gap-1 text-right min-w-[120px]">
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
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="rounded-full bg-muted p-4 mb-4">
                                        <Clock className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">No Recent Activities</h3>
                                    <p className="text-muted-foreground text-sm mb-4 max-w-sm">
                                        There are no recent regulatory activities or inspections to display. 
                                        Activities will appear here when investigations, compliance reviews, or inspections are conducted.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setActiveTab("investigations")}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Start New Investigation
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
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

            {/* ...existing code... */}
        </div>
    )
}

export default RegulatorMain;