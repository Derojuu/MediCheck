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
import { toast } from "react-toastify"
import { $Enums } from "@/lib/generated/prisma"
import {
    Plus,
    Search,
    Eye,
    ArrowUpRight,
    CheckCircle,
    Clock,
    XCircle,
    Zap,
} from "lucide-react";
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

    const [organizations, setOrganizations] = useState<any[]>([]);

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
            toast.error("Error creating batch. Please try again.")
        }
        finally {
            setIsLoading(false)
        }
    }

    const filteredBatches = batches.filter(batch =>
        batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.drugName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const [transferForm, setTransferForm] = useState({
        toOrganization: "",
        transferReason: "",
        notes: "",
    })

    // Batch viewing state
    const [isViewBatchOpen, setIsViewBatchOpen] = useState(false);
    const [viewingBatch, setViewingBatch] = useState<MedicationBatchInfoProps | null>(null);
    const [isTransferring, setIsTransferring] = useState(false);

    // Get organizations for transfer
    const loadOrganizations = async () => {
        try {
            const res = await fetch("/api/organizations");
            if (res.ok) {
                const data = await res.json();
                // Filter out the current organization from the list
                const otherOrgs = data.filter((org: any) => org.id !== orgId);
                setOrganizations(otherOrgs);
            }
        } catch (error) {
            console.error("Failed to load organizations:", error);
            toast.error("Failed to load organizations");
        }
    };

    // Load organizations when transfer dialog opens
    useEffect(() => {
        if (isTransferOpen && organizations.length === 0) {
            loadOrganizations();
        }
    }, [isTransferOpen]);

    // Handle batch transfer
    const handleTransferBatch = async () => {
        if (!selectedBatch || !transferForm.toOrganization) {
            toast.error("Please select a destination organization");
            return;
        }

        if (!transferForm.transferReason.trim()) {
            toast.error("Please provide a transfer reason");
            return;
        }

        setIsTransferring(true);

        try {
            const transferData = {
                batchId: selectedBatch.batchId,
                fromOrgId: orgId,
                toOrgId: transferForm.toOrganization,
                notes: transferForm.notes || "",
            };

            const res = await fetch("/api/transfer/ownership", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transferData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Batch transfer initiated successfully!");
                setIsTransferOpen(false);
                setTransferForm({
                    toOrganization: "",
                    transferReason: "",
                    notes: "",
                });
                setSelectedBatch(null);
                // Reload batches to reflect the status change
                loadBatches();
            } else {
                toast.error(data.error || "Failed to initiate transfer");
            }
        } catch (error) {
            console.error("Transfer error:", error);
            toast.error("Failed to initiate transfer. Please try again.");
        } finally {
            setIsTransferring(false);
        }
    };

    const getStatusColor = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case $Enums.BatchStatus.DELIVERED:
                return "default"
            case $Enums.BatchStatus.CREATED:
                return "secondary"
            case $Enums.BatchStatus.IN_TRANSIT:
                return "outline"
            case $Enums.BatchStatus.FLAGGED:
                return "destructive"
            case $Enums.BatchStatus.EXPIRED:
                return "destructive"
            case $Enums.BatchStatus.RECALLED:
                return "destructive"
            default:
                return "secondary"
        }
    }

    const getStatusIcon = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case $Enums.BatchStatus.DELIVERED:
                return <CheckCircle className="h-4 w-4" />
            case $Enums.BatchStatus.CREATED:
            case $Enums.BatchStatus.IN_TRANSIT:
                return <Clock className="h-4 w-4" />
            case $Enums.BatchStatus.EXPIRED:
            case $Enums.BatchStatus.FLAGGED:
            case $Enums.BatchStatus.RECALLED:
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getStatusDisplay = (status: string) => {
        // use enum value instead of hardcoding
        switch (status) {
            case $Enums.BatchStatus.DELIVERED:
                return "Delivered"
            case $Enums.BatchStatus.CREATED:
                return "Created"
            case $Enums.BatchStatus.IN_TRANSIT:
                return "In Transit"
            case $Enums.BatchStatus.FLAGGED:
                return "Flagged"
            case $Enums.BatchStatus.EXPIRED:
                return "Expired"
            case $Enums.BatchStatus.RECALLED:
                return "Recalled"
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Batch Management</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Create, view, and manage product batches</p>
                </div>
                {/* create batch dialog */}
                <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer w-full sm:w-auto" disabled={products.length === 0}>
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Create Batch</span>
                            <span className="sm:hidden">New Batch</span>
                            {products.length === 0 && <span className="hidden sm:inline"> (No products)</span>}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Batch Overview Stats */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batches.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All batches created
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {batches.filter(batch => batch.status === $Enums.BatchStatus.IN_TRANSIT).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Currently being transferred
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Created</CardTitle>
                        <Zap className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {batches.filter(batch => batch.status === $Enums.BatchStatus.CREATED).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ready for processing
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Batch Overview</CardTitle>
                    <CardDescription>All manufacturing batches and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search batches by ID or product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4">
                        {filteredBatches.map((batch) => (
                            <Card key={batch.batchId} className="border border-border/50">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-sm">{batch.batchId}</h3>
                                                <p className="text-sm text-muted-foreground">{batch.drugName}</p>
                                            </div>
                                            <Badge variant={getStatusColor(batch.status)} className="flex items-center gap-1">
                                                {getStatusIcon(batch.status)}
                                                <span className="text-xs">{getStatusDisplay(batch.status)}</span>
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-muted-foreground">Production:</span>
                                                <br />
                                                <span>{new Date(batch.manufacturingDate).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Expiry:</span>
                                                <br />
                                                <span>{new Date(batch.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Size:</span>
                                                <br />
                                                <span>{batch.batchSize.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Location:</span>
                                                <br />
                                                <span>{batch.currentLocation || 'Not set'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setViewingBatch(batch)
                                                    setIsViewBatchOpen(true)
                                                }}
                                                className="flex-1 cursor-pointer min-h-[44px] touch-manipulation"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedBatch(batch)
                                                    setIsTransferOpen(true)
                                                }}
                                                disabled={batch.status === $Enums.BatchStatus.IN_TRANSIT}
                                                className="flex-1 cursor-pointer min-h-[44px] touch-manipulation"
                                            >
                                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                                {batch.status === $Enums.BatchStatus.IN_TRANSIT ? "In Transit": "Transfer"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {filteredBatches.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No batches found matching your search.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[120px]">Batch ID</TableHead>
                                    <TableHead className="min-w-[150px]">Product</TableHead>
                                    <TableHead className="min-w-[120px] hidden sm:table-cell">Production Date</TableHead>
                                    <TableHead className="min-w-[120px] hidden md:table-cell">Expiry Date</TableHead>
                                    <TableHead className="min-w-[100px] hidden sm:table-cell">Batch Size</TableHead>
                                    <TableHead className="min-w-[120px]">Status</TableHead>
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
                                        <TableCell>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setViewingBatch(batch)
                                                        setIsViewBatchOpen(true)
                                                    }}
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
                                                    disabled={batch.status === $Enums.BatchStatus.IN_TRANSIT}
                                                    className="w-full sm:w-auto cursor-pointer"
                                                >
                                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                                    {batch.status === $Enums.BatchStatus.IN_TRANSIT ? "In Transit": "Transfer"}
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

            {/* Batch Details View Dialog */}
            <Dialog open={isViewBatchOpen} onOpenChange={setIsViewBatchOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Batch Details</DialogTitle>
                        <DialogDescription>
                            Detailed information for batch {viewingBatch?.batchId}
                        </DialogDescription>
                    </DialogHeader>
                    {viewingBatch && (
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{viewingBatch.batchId}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{viewingBatch.drugName}</p>
                                    <Badge variant={getStatusColor(viewingBatch.status)} className="flex items-center gap-1 w-fit">
                                        {getStatusIcon(viewingBatch.status)}
                                        <span className="text-xs">{getStatusDisplay(viewingBatch.status)}</span>
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Batch Size:</span>
                                        <span className="ml-2 font-medium">{viewingBatch.batchSize.toLocaleString()} units</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Current Location:</span>
                                        <span className="ml-2 font-medium">{viewingBatch.currentLocation || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Production Information</h4>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Manufacturing Date:</span>
                                        <div className="font-medium">{new Date(viewingBatch.manufacturingDate).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Expiry Information</h4>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Expiry Date:</span>
                                        <div className="font-medium">{new Date(viewingBatch.expiryDate).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Composition */}
                            {viewingBatch.composition && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Composition</h4>
                                    <div className="text-sm p-3 bg-muted/10 rounded border">
                                        {viewingBatch.composition}
                                    </div>
                                </div>
                            )}

                            {/* Storage Instructions */}
                            {viewingBatch.storageInstructions && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Storage Instructions</h4>
                                    <div className="text-sm p-3 bg-muted/10 rounded border">
                                        {viewingBatch.storageInstructions}
                                    </div>
                                </div>
                            )}
                            
                            {/* Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Tracking Information</h4>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div>Created: {new Date(viewingBatch.createdAt).toLocaleString()}</div>
                                        <div>Last Updated: {new Date(viewingBatch.updatedAt).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Identifiers</h4>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div>Batch ID: {viewingBatch.id}</div>
                                        <div>Organization ID: {viewingBatch.organizationId}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={() => setIsViewBatchOpen(false)}>
                            Close
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsViewBatchOpen(false)
                                if (viewingBatch) {
                                    setSelectedBatch(viewingBatch)
                                    setIsTransferOpen(true)
                                }
                            }}
                            disabled={viewingBatch?.status === $Enums.BatchStatus.IN_TRANSIT}
                        >
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Transfer Batch
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Transfer Dialog */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Transfer Batch</DialogTitle>
                        <DialogDescription className="text-sm">
                            Transfer batch {selectedBatch?.batchId} to another organization
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="to-organization" className="text-sm font-medium">Destination Organization *</Label>
                            <Select
                                value={transferForm.toOrganization}
                                onValueChange={(value) => setTransferForm({ ...transferForm, toOrganization: value })}>
                                <SelectTrigger className="w-full min-h-[44px]">
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {organizations.length > 0 ? (
                                        organizations.map((org) => (
                                            <SelectItem key={org.id} value={org.id} className="py-3">
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">{org.companyName}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {org.organizationType}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-orgs" disabled className="py-3">
                                            <span className="text-muted-foreground">
                                                No organizations available
                                            </span>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transfer-reason" className="text-sm font-medium">Transfer Reason *</Label>
                            <Input
                                id="transfer-reason"
                                placeholder="e.g., Distribution, Sale, Supply Chain Transfer"
                                value={transferForm.transferReason}
                                onChange={(e) => setTransferForm({ ...transferForm, transferReason: e.target.value })}
                                className="w-full min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transfer-notes" className="text-sm font-medium">Additional Notes (Optional)</Label>
                            <Textarea
                                id="transfer-notes"
                                placeholder="Any additional information about this transfer..."
                                value={transferForm.notes}
                                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                                rows={3}
                                className="resize-none min-h-[100px]"
                            />
                        </div>
                        
                        {/* Transfer Summary */}
                        {selectedBatch && transferForm.toOrganization && (
                            <div className="p-3 bg-muted/20 rounded-lg border">
                                <h4 className="text-sm font-medium mb-2">Transfer Summary</h4>
                                <div className="text-xs space-y-1">
                                    <div><span className="text-muted-foreground">Batch:</span> {selectedBatch.batchId}</div>
                                    <div><span className="text-muted-foreground">Product:</span> {selectedBatch.drugName}</div>
                                    <div><span className="text-muted-foreground">Size:</span> {selectedBatch.batchSize.toLocaleString()} units</div>
                                    <div><span className="text-muted-foreground">To:</span> {organizations.find(org => org.id === transferForm.toOrganization)?.companyName}</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end sm:space-x-2 mt-6 pt-4 border-t">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsTransferOpen(false)
                                setTransferForm({
                                    toOrganization: "",
                                    transferReason: "",
                                    notes: "",
                                })
                            }}
                            disabled={isTransferring}
                            className="w-full sm:w-auto order-2 sm:order-1 min-h-[44px] touch-manipulation"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleTransferBatch}
                            disabled={isTransferring || !transferForm.toOrganization || !transferForm.transferReason.trim()}
                            className="w-full sm:w-auto order-1 sm:order-2 min-h-[44px] touch-manipulation"
                        >
                            {isTransferring ? (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 animate-spin" />
                                    Initiating Transfer...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4" />
                                    Initiate Transfer
                                </div>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManufacturerBatch;