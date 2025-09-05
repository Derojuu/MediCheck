import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ManufacturerQuality = () => {
    return (
        <div className="space-y-6">
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Quality Control</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quality Control Statistics</CardTitle>
                        <CardDescription>Overall quality performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Batches Passed</span>
                                <span className="font-semibold text-green-600">234 batches (94%)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pending Testing</span>
                                <span className="font-semibold text-orange-600">12 batches (5%)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Failed Quality</span>
                                <span className="font-semibold text-red-600">3 batches (1%)</span>
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
                        <CardTitle>Recent QC Tests</CardTitle>
                        <CardDescription>Latest quality control results</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 border rounded-lg">
                                <p className="font-medium">PTC-2024-007 - Paracetamol 500mg</p>
                                <p className="text-sm text-muted-foreground">Potency Test - Passed</p>
                                <Badge variant="default">Approved</Badge>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="font-medium">PTC-2024-006 - Omeprazole 20mg</p>
                                <p className="text-sm text-muted-foreground">Dissolution Test - In Progress</p>
                                <Badge variant="secondary">Testing</Badge>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="font-medium">PTC-2024-005 - Aspirin 75mg</p>
                                <p className="text-sm text-muted-foreground">Stability Test - Passed</p>
                                <Badge variant="default">Approved</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default ManufacturerQuality;