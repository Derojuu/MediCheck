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
import { LoadingSpinner } from "@/components/ui/loading";
import { toast } from "react-toastify";
import { Plus, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
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
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Create New Transfer</DialogTitle>
              <DialogDescription className="text-sm text-wrap">
                Transfer batch ownership to another organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="batch" className="text-sm font-medium">Batch</Label>
                <Select
                  value={newTransfer.batchId}
                  onValueChange={(value) => setNewTransfer(prev => ({ ...prev, batchId: value }))}
                >
                  <SelectTrigger className="w-full h-10 sm:h-11">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches && availableBatches.length > 0 ? (
                      availableBatches.map((batch) => (
                        <SelectItem key={batch.batchId} value={batch.batchId}>
                          {batch.batchId} - {batch.drugName} ({batch.batchSize} units)
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
                  <p className="text-sm text-muted-foreground text-wrap">No batches available for transfer</p>
                )}
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium">To Organization</Label>
                <Select
                  value={newTransfer.toOrgId}
                  onValueChange={(value) => setNewTransfer(prev => ({ ...prev, toOrgId: value }))}
                >
                  <SelectTrigger className="w-full h-10 sm:h-11">
                    <SelectValue placeholder="Select destination organization" />
                  </SelectTrigger>
                  <SelectContent>

                    {organizations && organizations.length > 0 ? (
                      organizations
                        .filter(org => org.id !== currentOrgId)
                        .map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.companyName} ({org.organizationType})
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
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add transfer notes..."
                  value={newTransfer.notes}
                  onChange={(e) => setNewTransfer(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[60px] sm:min-h-[80px] resize-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 sm:space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={createTransfer} 
                disabled={creating}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {creating ? "Creating..." : "Create Transfer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Transfers</CardTitle>
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{transfers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Outgoing</CardTitle>
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {transfers.filter(t => t.direction === 'OUTGOING').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Incoming</CardTitle>
            <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {transfers.filter(t => t.direction === 'INCOMING').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending Approval</CardTitle>
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {transfers.filter(t => t.canApprove).length}
            </div>
          </CardContent>
        </Card>
      </div>

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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.map((transfer) => (
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
                          <Badge variant={getStatusVariant(transfer.status)} className={getStatusColor(transfer.status)}>
                            {transfer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {transfers.map((transfer) => (
                  <Card key={transfer.id} className="border border-gray-200 w-full">
                    <CardContent className="p-2">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          {transfer.direction === 'OUTGOING' ? (
                            <ArrowUpRight className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{transfer.direction}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(transfer.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(transfer.status)} className={getStatusColor(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Batch ID</span>
                          <span className="text-sm font-medium">{transfer.batch.batchId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">Product</span>
                          <span className="text-sm">{transfer.batch.drugName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">From</span>
                          <span className="text-sm">{transfer.fromOrg.companyName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-muted-foreground">To</span>
                          <span className="text-sm">{transfer.toOrg.companyName}</span>
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