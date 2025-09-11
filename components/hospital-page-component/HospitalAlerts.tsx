import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Activity } from "lucide-react"

const HospitalAlerts = () => {
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
                            <div className="p-3 bg-white border rounded-lg">
                                <p className="font-medium">Suspected counterfeit batch detected</p>
                                <p className="text-sm text-muted-foreground">Batch: PAR2024001 - Paracetamol 500mg</p>
                                <p className="text-xs text-red-600">2 hours ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <Clock className="h-5 w-5" />
                            Expiry Warnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 bg-white border rounded-lg">
                                <p className="font-medium">Medications expiring within 30 days</p>
                                <p className="text-sm text-muted-foreground">5 batches require attention</p>
                                <Button size="sm" className="mt-2">View Details</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 border rounded-lg">
                                <p className="font-medium">System maintenance scheduled</p>
                                <p className="text-sm text-muted-foreground">Tonight at 2:00 AM - 4:00 AM</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default HospitalAlerts;