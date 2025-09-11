import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  FileText, 
  Truck,
  FlaskConical,

} from "lucide-react"


const ManufacturerReports = () => {
    return (
        <div className="space-y-6">

            <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Production Statistics</CardTitle>
                        <CardDescription>Monthly production metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Batches Produced</span>
                            <span className="font-semibold">156 batches</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Units Manufactured</span>
                            <span className="font-semibold">2.3M units</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Quality Pass Rate</span>
                            <span className="font-semibold">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Transfers Completed</span>
                            <span className="font-semibold">89 transfers</span>
                        </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export Reports</CardTitle>
                        <CardDescription>Download detailed manufacturing reports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start" onClick={() => alert("Exporting production report...")}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Production Report (PDF)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => alert("Exporting batch report...")}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Batch Report (Excel)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => alert("Exporting quality report...")}
                        >
                            <FlaskConical className="h-4 w-4 mr-2" />
                            Quality Report (PDF)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => alert("Exporting transfer report...")}
                        >
                            <Truck className="h-4 w-4 mr-2" />
                            Transfer Report (PDF)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ManufacturerReports;