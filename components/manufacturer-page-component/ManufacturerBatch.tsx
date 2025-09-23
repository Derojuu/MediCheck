import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Plus,
    Search,
    Eye,
    ArrowUpRight,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { MedicationBatchInfoProps } from "@/utils"

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    dosageForm?: string;
    strength?: string;
    activeIngredients: string[];
    nafdacNumber?: string;
    shelfLifeMonths?: number;
    storageConditions?: string;
}

// Mock organization data for transfer destination dropdown
const mockOrganizations = [
    {
        id: "org-001",
        companyName: "MedCorp Distributors",
        organizationType: "DRUG_DISTRIBUTOR"
    },
    {
        id: "org-002",
        companyName: "City General Hospital",
        organizationType: "HOSPITAL"
    },
    {
        id: "org-003",
        companyName: "QuickCare Pharmacy",
        organizationType: "PHARMACY"
    },
    {
        id: "org-004",
        companyName: "HealthLink Distributors",
        organizationType: "DRUG_DISTRIBUTOR"
    },
    {
        id: "org-005",
        companyName: "Metro Medical Center",
        organizationType: "HOSPITAL"
    },
    {
        id: "org-006",
        companyName: "WellCare Pharmacy Chain",
        organizationType: "PHARMACY"
    },
    {
        id: "org-007",
        companyName: "National Health Regulator",
        organizationType: "REGULATOR"
    }
];

const ManufacturerBatch = ({ orgId, allBatches, loadBatches }: { orgId: string; allBatches: MedicationBatchInfoProps[]; loadBatches: () => void }) => {

    const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [batches, setBatches] = useState<MedicationBatchInfoProps[]>(allBatches);

    const [newBatch, setNewBatch] = useState({
        drugName: "",
        composition: "",
        batchSize: "",
        manufacturingDate: "",
        expiryDate: "",
        storageInstructions: "",
    });

    const [products, setProducts] = useState<Product[]>([]);

    const [searchQuery, setSearchQuery] = useState("");

    const [isTransferOpen, setIsTransferOpen] = useState(false);

    const [selectedBatch, setSelectedBatch] = useState<any>(null);

    const [organizations, setOrganizations] = useState<any[]>(mockOrganizations);

    useEffect(() => {
        setBatches(allBatches);
        if (orgId) {
            loadProducts();
        }
    }, [allBatches, orgId]);

    const loadProducts = async () => {
        try {
            const res = await fetch(`/api/products?organizationId=${orgId}`);
            const data = await res.json();
            
            if (res.ok) {
                setProducts(data.products || []);
            } else {
                console.error("Failed to load products:", data.error);
            }
        } catch (error) {
            console.error("Failed to load products:", error);
        }
    };

    const handleCreateBatch = async (e: React.FormEvent) => {

        e.preventDefault();

        setIsLoading(true)

        if (!orgId) return;

        try {

            if (!newBatch?.drugName || !newBatch?.batchSize || !newBatch.manufacturingDate || !newBatch.expiryDate) {
                toast.info("Please fill in all required fields")
                return
            };

            const res = await fetch("/api/batches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newBatch, organizationId: orgId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast.success("Batch created successfully!");

            setIsCreateBatchOpen(false);

            loadBatches()

        }
        catch (error) {
            toast("Error creating batch. Please try again.")
        }
        finally {
            setIsLoading(false)
        }
    }

    const filteredBatches = batches.filter(batch =>
        batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.drugName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Transfer form state
    const [transferForm, setTransferForm] = useState({
        toOrganization: "",
        transferReason: "",
        notes: "",
    })

    const getStatusColor = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case "READY_FOR_DISPATCH":
                return "default"
            case "MANUFACTURING":
                return "secondary"
            case "IN_TRANSIT":
                return "outline"
            case "DELIVERED":
                return "default"
            case "EXPIRED":
                return "destructive"
            default:
                return "secondary"
        }
    }

    const getStatusIcon = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case "READY_FOR_DISPATCH":
            case "DELIVERED":
                return <CheckCircle className="h-4 w-4" />
            case "MANUFACTURING":
            case "IN_TRANSIT":
                return <Clock className="h-4 w-4" />
            case "EXPIRED":
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getStatusDisplay = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case "READY_FOR_DISPATCH":
                return "Ready for Dispatch"
            case "MANUFACTURING":
                return "Manufacturing"
            case "IN_TRANSIT":
                return "In Transit"
            case "DELIVERED":
                return "Delivered"
            case "EXPIRED":
                return "Expired"
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Batch Management</h1>
                    <p className="text-muted-foreground">Create, view, and manage product batches</p>
                </div>
                {/* create batch dialog */}
                <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer" disabled={products.length === 0}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Batch
                            {products.length === 0 && " (No products)"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Batch</DialogTitle>
                            <DialogDescription>Create a new manufacturing batch</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateBatch} method="post">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product">Product</Label>
                                    <Select
                                        value={newBatch.drugName}
                                        onValueChange={(value) => setNewBatch({ ...newBatch, drugName: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <SelectItem key={product.id} value={product.name}>
                                                        {product.name} ({product.category})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-products" disabled>
                                                    No products available - Create products first
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Batch Size</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={newBatch.batchSize}
                                        onChange={(e) => setNewBatch({ ...newBatch, batchSize: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="production-date">Production Date</Label>
                                    <Input
                                        id="production-date"
                                        type="date"
                                        value={newBatch.manufacturingDate}
                                        onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expiry-date">Expiry Date</Label>
                                    <Input
                                        id="expiry-date"
                                        type="date"
                                        value={newBatch.expiryDate}
                                        onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="composition">Composition</Label>
                                    <Textarea
                                        id="composition"
                                        placeholder="Enter composition details"
                                        value={newBatch.composition}
                                        onChange={(e) => setNewBatch({ ...newBatch, composition: e.target.value })}
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="notes">Storage Instructions</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Enter storage requirements"
                                        value={newBatch.storageInstructions}
                                        onChange={(e) => setNewBatch({ ...newBatch, storageInstructions: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button className="cursor-pointer" variant="outline" onClick={() => setIsCreateBatchOpen(false)}>
                                    Cancel
                                </Button>
                                <Button className="cursor-pointer">{isLoading ? "Creating..." : "Create Batch"}</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Batch Overview</CardTitle>
                    <CardDescription>All manufacturing batches and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search batches by ID or product name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Batch ID</TableHead>
                                    <TableHead className="min-w-[150px]">Product</TableHead>
                                    <TableHead className="min-w-[120px] hidden sm:table-cell">Production Date</TableHead>
                                    <TableHead className="min-w-[120px] hidden md:table-cell">Expiry Date</TableHead>
                                    <TableHead className="min-w-[100px] hidden sm:table-cell">Batch Size</TableHead>
                                    <TableHead className="min-w-[120px]">Status</TableHead>
                                    <TableHead className="min-w-[120px] hidden md:table-cell">Location</TableHead>
                                    <TableHead className="min-w-[140px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBatches.map((batch) => (
                                    <TableRow key={batch.batchId}>
                                        <TableCell className="font-medium">{batch.batchId}</TableCell>
                                        <TableCell className="font-medium">{batch.drugName}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{new Date(batch.manufacturingDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="hidden md:table-cell">{new Date(batch.expiryDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{batch.batchSize.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(batch.status)} className="flex items-center gap-1 w-fit">
                                                {getStatusIcon(batch.status)}
                                                <span className="text-xs">{getStatusDisplay(batch.status)}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{batch.currentLocation || 'Not set'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => alert(`Viewing details for ${batch.batchId}\n\nComposition: ${batch.composition}\nStorage: ${batch.storageInstructions}\nQR Code: ${batch.qrCodeData}`)}
                                                    className="w-full sm:w-auto cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBatch(batch)
                                                        setIsTransferOpen(true)
                                                    }}
                                                    // disabled={batch.status === "DELIVERED" || batch.status === "IN_TRANSIT"}
                                                    disabled={batch.status === "IN_TRANSIT"}
                                                    className="w-full sm:w-auto cursor-pointer"
                                                >
                                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                                    {batch.status === "IN_TRANSIT" ? "In Transit": "Transfer"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Dialog */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Batch</DialogTitle>
                        <DialogDescription>
                            Transfer batch {selectedBatch?.batchId} to another organization
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="to-organization">Destination Organization</Label>
                            <Select
                                value={transferForm.toOrganization}
                                onValueChange={(value) => setTransferForm({ ...transferForm, toOrganization: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.companyName} ({org.organizationType})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transfer-reason">Transfer Reason</Label>
                            <Input
                                id="transfer-reason"
                                placeholder="e.g., Distribution, Sale, etc."
                                value={transferForm.transferReason}
                                onChange={(e) => setTransferForm({ ...transferForm, transferReason: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transfer-notes">Notes (Optional)</Label>
                            <Textarea
                                id="transfer-notes"
                                placeholder="Additional transfer notes"
                                value={transferForm.notes}
                                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
                            Cancel
                        </Button>
                        {/* handle transfer batch function */}
                        <Button>Initiate Transfer</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManufacturerBatch;