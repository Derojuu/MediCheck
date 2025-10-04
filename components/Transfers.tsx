"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "react-toastify";
import { Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, Search, Filter, X } from "lucide-react";
import { TransferProps, MedicationBatchInfoProps, OrganizationProp } from "@/utils";
import { BatchStatus } from "@/lib/generated/prisma";

interface TransfersProps {
  orgId?: string;
  allBatches: MedicationBatchInfoProps[];
  loadBatches: () => void;
}

const Transfers = ({ orgId, allBatches, loadBatches }: TransfersProps) => {

  const [transfers, setTransfers] = useState<TransferProps[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState(orgId || "");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [directionFilter, setDirectionFilter] = useState("ALL");

  // Create transfer form state
  const [newTransfer, setNewTransfer] = useState({
    batchId: "",
    toOrgId: "",
    notes: ""
  });


  // Transform allBatches to the expected format
  const availableBatches =
    allBatches
      ?.map(batch => ({
        id: batch.id,
        batchId: batch.batchId,
        drugName: batch.drugName,
        batchSize: batch.batchSize,
        status: batch.status,
      }))
      // 🛑 Exclude batches with IN_TRANSIT status
      .filter(
        batch =>
          batch.batchId &&
          batch.drugName &&
          batch.status !== BatchStatus.IN_TRANSIT
      ) || [];



  const loadTransfers = async () => {
    if (!currentOrgId) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/transfer/ownership?organizationId=${currentOrgId}`);

      const data = await res.json();

      if (res.ok) {
        setTransfers(data.transfers || []);
      }
      else {
        toast.error(data.error || "Failed to load transfers");
      }
    }
    catch (error) {
      toast.error("Failed to load transfers");
    }
    finally {
      setLoading(false);
    }
  };

  const getAllOrganization = async () => {
    const res = await fetch(`/api/organizations`);
    const data = await res.json();
    console.log(data)
    setOrganizations(data)
  }


  // Fetch transfers once orgId is available
  useEffect(() => {
    if (currentOrgId) {
      console.log("Current org ID:", currentOrgId);
      loadTransfers();
      getAllOrganization()
    }

  }, [currentOrgId, allBatches]);


  const createTransfer = async () => {

    if (!newTransfer.batchId || !newTransfer.toOrgId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("/api/transfer/ownership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: newTransfer.batchId,
          fromOrgId: currentOrgId,
          toOrgId: newTransfer.toOrgId,
          notes: newTransfer.notes
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Transfer created successfully");
        setShowCreateDialog(false);
        setNewTransfer({ batchId: "", toOrgId: "", notes: "" });
        loadTransfers();
        loadBatches()
      }
      else {
        toast.error(data.error || "Failed to create transfer");
      }
    }
    catch (error) {
      toast.error("Failed to create transfer");
    }
    finally {
      setCreating(false);
    }
  };


  const updateTransferStatus = async (transferId: string, status: string, notes?: string) => {
    setUpdating(transferId);
    try {
      const res = await fetch(`/api/transfer/ownership/${transferId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: currentOrgId,
          status,
          notes
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Transfer status updated to ${status}`);
        loadTransfers();
      } else {
        toast.error(data.error || "Failed to update transfer");
      }
    } catch (error) {
      toast.error("Failed to update transfer");
      console.error("Update transfer error:", error);
    } finally {
      setUpdating("");
    }
  };


  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary";
      case "IN_PROGRESS": return "default";
      case "COMPLETED": return "default";
      case "FAILED": return "destructive";
      case "CANCELLED": return "destructive";
      default: return "secondary";
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-green-600";
      case "FAILED": return "text-red-600";
      case "CANCELLED": return "text-red-600";
      case "IN_PROGRESS": return "text-blue-600";
      default: return "text-yellow-600";
    }
  };

  // Filter and search functionality
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = searchQuery === "" || 
      transfer.batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromOrg.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toOrg.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || transfer.status === statusFilter;
    const matchesDirection = directionFilter === "ALL" || transfer.direction === directionFilter;

    return matchesSearch && matchesStatus && matchesDirection;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDirectionFilter("ALL");
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL" || directionFilter !== "ALL";

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Batch Transfers</h1>
        <div className="flex items-center justify-center p-6 sm:p-8">
          <LoadingSpinner size="large" text="Loading transfers..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Batch Transfers</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track all batch transfers and ownership changes</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer w-full sm:w-auto" disabled={!currentOrgId || !availableBatches.length}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Transfer</span>
              <span className="sm:hidden">New Transfer</span>
              {!availableBatches.length && " (No batches)"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-lg sm:text-xl font-semibold">Create New Transfer</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2">
                Transfer batch ownership to another organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-1">
              <div className="space-y-2">
                <Label htmlFor="batch" className="text-sm font-medium text-foreground">Select Batch *</Label>
                <Select
                  value={newTransfer.batchId}
                  onValueChange={(value) => setNewTransfer(prev => ({ ...prev, batchId: value }))}
                >
                  <SelectTrigger className="w-full h-12 text-left">
                    <SelectValue placeholder="Choose a batch to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches && availableBatches.length > 0 ? (
                      availableBatches.map((batch) => (
                        <SelectItem key={batch.batchId} value={batch.batchId} className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{batch.batchId}</span>
                            <span className="text-sm text-muted-foreground">{batch.drugName} • {batch.batchSize} units</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-batches" disabled>
                        No batches available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!availableBatches.length && (
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="text-sm text-orange-700 dark:text-orange-300">No batches available for transfer</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium text-foreground">Destination Organization *</Label>
                <Select
                  value={newTransfer.toOrgId}
                  onValueChange={(value) => setNewTransfer(prev => ({ ...prev, toOrgId: value }))}
                >
                  <SelectTrigger className="w-full h-12 text-left">
                    <SelectValue placeholder="Choose destination organization" />
                  </SelectTrigger>
                  <SelectContent>

                    {organizations && organizations.length > 0 ? (
                      organizations
                        .filter(org => org.id !== currentOrgId)
                        .map((org) => (
                          <SelectItem key={org.id} value={org.id} className="py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{org.companyName}</span>
                              <span className="text-sm text-muted-foreground capitalize">{org.organizationType.toLowerCase()}</span>
                            </div>
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-orgs" disabled>
                        Loading organizations...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>



              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">Transfer Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or instructions for this transfer..."
                  value={newTransfer.notes}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground">Optional - Add context or special instructions</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
              <Button 
                onClick={createTransfer} 
                disabled={creating || !newTransfer.batchId || !newTransfer.toOrgId}
                className="w-full h-12 font-medium"
                size="lg"
              >
                {creating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Transfer...</span>
                  </div>
                ) : (
                  "Create Transfer"
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateDialog(false)}
                className="w-full h-10"
                disabled={creating}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">Total Transfers</CardTitle>
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold">
              {hasActiveFilters ? filteredTransfers.length : transfers.length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? "Filtered results" : "All time"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">Outgoing</CardTitle>
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {hasActiveFilters ? 
                filteredTransfers.filter(t => t.direction === 'OUTGOING').length :
                transfers.filter(t => t.direction === 'OUTGOING').length
              }
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Sent out</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-2 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">Incoming</CardTitle>
            <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {hasActiveFilters ? 
                filteredTransfers.filter(t => t.direction === 'INCOMING').length :
                transfers.filter(t => t.direction === 'INCOMING').length
              }
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Received</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-2 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">Pending Approval</CardTitle>
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {hasActiveFilters ? 
                filteredTransfers.filter(t => t.canApprove).length :
                transfers.filter(t => t.canApprove).length
              }
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Need action</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by batch ID, product, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-10">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="OUTGOING">Outgoing</SelectItem>
                  <SelectItem value="INCOMING">Incoming</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-10 px-3 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {statusFilter !== "ALL" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
              {directionFilter !== "ALL" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {directionFilter}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground self-center">
                {filteredTransfers.length} of {transfers.length} transfers
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Transfer History</CardTitle>
          <CardDescription className="text-sm">All batch transfers involving your organization</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {transfers.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
              No transfers found. Create your first transfer to get started.
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-muted-foreground text-sm sm:text-base mb-2">
                No transfers match your search criteria
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Direction</TableHead>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {transfer.direction === 'OUTGOING' ? (
                              <ArrowUpRight className="h-4 w-4 text-blue-600 mr-2" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4 text-green-600 mr-2" />
                            )}
                            <span className="text-sm">{transfer.direction}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{transfer.batch.batchId}</TableCell>
                        <TableCell>{transfer.batch.drugName}</TableCell>
                        <TableCell>{transfer.fromOrg.companyName}</TableCell>
                        <TableCell>{transfer.toOrg.companyName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(transfer.status)} className={getStatusColor(transfer.status) + " bg-transparent border-none shadow-none p-0 font-semibold"}>
                            {transfer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {transfer.canApprove ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs"
                                onClick={() => updateTransferStatus(transfer.id, "COMPLETED")}
                                disabled={updating === transfer.id}
                              >
                                {updating === transfer.id ? "..." : "Accept"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs text-red-600 hover:text-red-700"
                                onClick={() => updateTransferStatus(transfer.id, "CANCELLED")}
                                disabled={updating === transfer.id}
                              >
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="md:hidden space-y-3">
                {filteredTransfers.map((transfer) => (
                  <Card key={transfer.id} className="shadow-sm border-0 bg-card">
                    <CardContent className="p-4">
                      {/* Header with direction and status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {transfer.direction === 'OUTGOING' ? (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="font-medium text-sm">Outgoing</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-green-600">
                              <ArrowDownLeft className="h-4 w-4" />
                              <span className="font-medium text-sm">Incoming</span>
                            </div>
                          )}
                        </div>
                        <Badge variant={getStatusVariant(transfer.status)} className={`${getStatusColor(transfer.status)} text-xs bg-transparent border-none shadow-none p-0 font-semibold`}>
                          {transfer.status}
                        </Badge>
                      </div>

                      {/* Main content */}
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4 flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Batch</span>
                            <span className="font-mono text-base font-semibold break-all">{transfer.batch.batchId}</span>
                          </div>
                          <div>
                            <span className="text-sm text-foreground">{transfer.batch.drugName}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">From</span>
                            <p className="text-sm font-medium text-foreground leading-tight">{transfer.fromOrg.companyName}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">To</span>
                            <p className="text-sm font-medium text-foreground leading-tight">{transfer.toOrg.companyName}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-border/40 flex flex-col gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(transfer.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          {/* Quick actions for mobile */}
                          {transfer.canApprove && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs"
                                onClick={() => updateTransferStatus(transfer.id, "COMPLETED")}
                                disabled={updating === transfer.id}
                              >
                                {updating === transfer.id ? "..." : "Accept"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                                onClick={() => updateTransferStatus(transfer.id, "CANCELLED")}
                                disabled={updating === transfer.id}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transfers;