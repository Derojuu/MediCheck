import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package } from "lucide-react"

const HospitalInventory = () => {

    const inventoryData = [
        { id: 1, medication: "Paracetamol 500mg", batch: "PAR2024001", quantity: 500, expiry: "2025-12-01", location: "Ward A", status: "Good" },
        { id: 2, medication: "Amoxicillin 250mg", batch: "AMX2024002", quantity: 200, expiry: "2025-08-15", location: "Pharmacy", status: "Expiring Soon" },
        { id: 3, medication: "Ibuprofen 400mg", batch: "IBU2024003", quantity: 750, expiry: "2026-03-20", location: "Emergency", status: "Good" },
        { id: 4, medication: "Insulin 100IU", batch: "INS2024004", quantity: 150, expiry: "2025-10-10", location: "ICU", status: "Good" },
        { id: 5, medication: "Aspirin 75mg", batch: "ASP2024005", quantity: 300, expiry: "2025-09-05", location: "Cardiology", status: "Low Stock" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Inventory Management</h1>
                    <p className="text-muted-foreground">Current medication stock levels and locations</p>
                </div>
                <Button onClick={() => alert("Adding new medication to inventory...")}>
                    <Package className="h-4 w-4 mr-2" />
                    Add Medication
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Inventory</CardTitle>
                    <CardDescription>All medications currently in hospital inventory</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.medication}</TableCell>
                                    <TableCell>{item.batch}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.expiry}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status === "Good"
                                                    ? "default"
                                                    : item.status === "Expiring Soon"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default HospitalInventory;