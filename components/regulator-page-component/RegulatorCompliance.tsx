"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const RegulatorCompliance = () => {
    return (
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
    )
}

export default RegulatorCompliance;