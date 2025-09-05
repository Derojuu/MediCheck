import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ManufacturerTransfers = () => {

    const [transferHistory, setTransferHistory] = useState<any[]>([])
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Batch Transfers</h1>
                    <p className="text-muted-foreground">Track all batch transfers and ownership changes</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>All batch transfers initiated from this facility</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transfer ID</TableHead>
                                <TableHead>Batch Number</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Show recent off-chain transfers from localStorage */}
                            {transferHistory.slice(-10).reverse().map((transfer) => (
                                <TableRow key={transfer.id}>
                                    <TableCell className="font-medium">{transfer.id}</TableCell>
                                    <TableCell>{transfer.batchNumber}</TableCell>
                                    <TableCell>{transfer.productName}</TableCell>
                                    <TableCell>{transfer.fromEntity}</TableCell>
                                    <TableCell>{transfer.toEntity}</TableCell>
                                    <TableCell>{transfer.quantity.toLocaleString()}</TableCell>
                                    <TableCell>{transfer.transferDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={transfer.status === "Completed" ? "default" : "secondary"}>
                                            {transfer.status}
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

export default ManufacturerTransfers;