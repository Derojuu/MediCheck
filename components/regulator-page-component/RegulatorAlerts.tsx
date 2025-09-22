"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Activity } from "lucide-react"

const RegulatorAlerts = () => {

    const alerts = [
        { id: "ALT001", message: "Counterfeit batch detected: PAR2024001", severity: "critical", time: "30 mins ago", location: "Lagos", reporter: "Hospital Inspector" },
        { id: "ALT002", message: "Unusual distribution pattern flagged", severity: "warning", time: "2 hours ago", location: "Abuja", reporter: "System Alert" },
        { id: "ALT003", message: "License expiration reminder: 5 facilities", severity: "info", time: "4 hours ago", location: "Multiple", reporter: "Automated System" },
    ]

    return (
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
    )
}

export default RegulatorAlerts;