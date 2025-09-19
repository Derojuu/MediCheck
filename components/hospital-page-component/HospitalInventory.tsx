import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading"
import { Package } from "lucide-react"
import { useState, useEffect } from "react"

interface BatchData {
    id: string;
    batchId: string;
    drugName: string;
    batchSize: number;
    expiryDate: string;
    status: string;
    manufacturingDate: string;
    transferDate: string;
    receivedFrom: string;
    fromOrgType: string;
}

interface HospitalInventoryProps {
    orgId: string;
}

const HospitalInventory = ({ orgId }: HospitalInventoryProps) => {
    const [batches, setBatches] = useState<BatchData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            if (!orgId) return;
            
            try {
                setLoading(true);
                // Fetch batches that have been transferred TO this hospital
                const response = await fetch(`/api/hospital/inventory?orgId=${orgId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBatches(data);
                } else {
                    console.error('Failed to fetch hospital inventory');
                }
            } catch (error) {
                console.error('Error fetching batches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, [orgId]);

    const getStatus = (expiryDate: string) => {
        const expiry = new Date(expiryDate);
        const today = new Date();
        const tenDaysFromNow = new Date();
        tenDaysFromNow.setDate(today.getDate() + 10);

        if (expiry < today) {
            return "Expired";
        } else if (expiry <= tenDaysFromNow) {
            return "Expiring Soon";
        } else {
            return "Good";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Inventory Management</h1>
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner size="large" text="Loading inventory..." />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Inventory Management</h1>
                    <p className="text-muted-foreground">Current medication stock levels and status</p>
                </div>
                {/* <Button onClick={() => alert("Adding new medication to inventory...")}>
                    <Package className="h-4 w-4 mr-2" />
                    Add Medication
                </Button> */}
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
                                <TableHead>Batch ID</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Received From</TableHead>
                                <TableHead>Transfer Date</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No inventory data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                batches.map((batch) => {
                                    const status = getStatus(batch.expiryDate);
                                    return (
                                        <TableRow key={batch.id}>
                                            <TableCell className="font-medium">{batch.drugName}</TableCell>
                                            <TableCell>{batch.batchId}</TableCell>
                                            <TableCell>{batch.batchSize}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{batch.receivedFrom}</div>
                                                    <div className="text-sm text-muted-foreground capitalize">
                                                        {batch.fromOrgType.toLowerCase()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatDate(batch.transferDate)}</TableCell>
                                            <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        status === "Good"
                                                            ? "default"
                                                            : status === "Expiring Soon"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                >
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default HospitalInventory;