"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, AlertTriangle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import { ManufacturerTab } from "@/utils";

const RegulatorMain = ({ setActiveTab }: { 
    setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>>;
}) => {

    const [investigationNotes, setInvestigationNotes] = useState("")

    const stats = {
        activeInvestigations: 12,
        complianceChecks: 89,
        pendingReviews: 34,
        violationsFound: 5,
    }

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Regulator Dashboard</h1>
                    <p className="text-muted-foreground mt-2">NAFDAC - Drug Enforcement Division</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                        <Building2 className="h-4 w-4 mr-2" />
                        Regulator
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Investigations</CardTitle>
                        <Eye className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.activeInvestigations}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-accent font-medium">+3</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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

                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
    )
}

export default RegulatorMain;