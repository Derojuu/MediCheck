"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, XCircle, Users } from "lucide-react"

const RegulatorReports = () => {
    return (
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
    )
}


export default RegulatorReports;