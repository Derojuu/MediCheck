import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle} from "lucide-react";

const HospitalReports = () => {

    const [reportMessage, setReportMessage] = useState("")

    const handleReportCounterfeit = () => {
        if (reportMessage.trim()) {
            alert(`Counterfeit report submitted: ${reportMessage}`)
            setReportMessage("")
        } else {
            alert("Please enter a report message.")
        }
    }



    return (
        <div className="space-y-6">
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Verification Statistics</CardTitle>
                        <CardDescription>Monthly verification trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>August 2024</span>
                                <span className="font-semibold">2,156 verifications</span>
                            </div>
                            <div className="flex justify-between">
                                <span>July 2024</span>
                                <span className="font-semibold">1,934 verifications</span>
                            </div>
                            <div className="flex justify-between">
                                <span>June 2024</span>
                                <span className="font-semibold">1,821 verifications</span>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-green-600">+11.5%</span> increase from last month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Report Counterfeit</CardTitle>
                        <CardDescription>Report suspected counterfeit medications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="report">Report Details</Label>
                            <Textarea
                                id="report"
                                placeholder="Describe the suspected counterfeit medication..."
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <Button onClick={handleReportCounterfeit} className="w-full">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Submit Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default HospitalReports;