"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, Package, Building2, Truck, CheckCircle } from "lucide-react"

export function TransferOwnership() {
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  // Mock data
  const availableBatches = [
    { id: "BTH-2024-001", drugName: "Paracetamol 500mg", status: "Ready for Dispatch" },
    { id: "BTH-2024-004", drugName: "Aspirin 100mg", status: "Ready for Dispatch" },
  ]

  const recipients = [
    { id: "dist-001", name: "Metro Medical Distributors", type: "Distributor", location: "New York" },
    { id: "dist-002", name: "HealthCare Supply Chain", type: "Distributor", location: "California" },
    { id: "hosp-001", name: "City General Hospital", type: "Hospital", location: "Chicago" },
    { id: "pharm-001", name: "MedPlus Pharmacy Chain", type: "Pharmacy", location: "Texas" },
  ]

  const recentTransfers = [
    {
      id: "TXN-001",
      batchId: "BTH-2024-002",
      drugName: "Amoxicillin 250mg",
      recipient: "Metro Medical Distributors",
      status: "Completed",
      date: "2024-01-15",
      blockchainHash: "0x1a2b3c4d...",
    },
    {
      id: "TXN-002",
      batchId: "BTH-2024-003",
      drugName: "Ibuprofen 400mg",
      recipient: "City General Hospital",
      status: "In Progress",
      date: "2024-01-16",
      blockchainHash: "0x5e6f7g8h...",
    },
  ]

  const handleTransfer = () => {
    // In real app, this would initiate blockchain transaction
    console.log("Transferring batch:", selectedBatch, "to:", selectedRecipient)
    setIsTransferModalOpen(false)
    setSelectedBatch("")
    setSelectedRecipient("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case "Distributor":
        return <Truck className="h-4 w-4" />
      case "Hospital":
        return <Building2 className="h-4 w-4" />
      case "Pharmacy":
        return <Package className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">Transfer Ownership</h1>
          <p className="text-muted-foreground">Transfer medication batches to distributors, hospitals, or pharmacies</p>
        </div>
        <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-montserrat">Transfer Batch Ownership</DialogTitle>
              <DialogDescription>Select a batch and recipient to initiate blockchain transfer</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch">Select Batch</Label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose batch to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.id} - {batch.drugName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recipient">Select Recipient</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose recipient organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        <div className="flex items-center space-x-2">
                          {getRecipientIcon(recipient.type)}
                          <span>
                            {recipient.name} ({recipient.type})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTransfer} disabled={!selectedBatch || !selectedRecipient}>
                Confirm Transfer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Available for Transfer
            </CardTitle>
            <CardDescription>Batches ready to be transferred to next entity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{batch.id}</p>
                    <p className="text-sm text-muted-foreground">{batch.drugName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">{batch.status}</Badge>
                    <Button size="sm" onClick={() => setIsTransferModalOpen(true)}>
                      Transfer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowUpRight className="h-5 w-5 mr-2" />
              Recent Transfers
            </CardTitle>
            <CardDescription>Latest ownership transfers and their blockchain status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{transfer.batchId}</p>
                    <Badge className={getStatusColor(transfer.status)}>{transfer.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{transfer.drugName}</p>
                  <p className="text-sm text-muted-foreground mb-2">To: {transfer.recipient}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{transfer.date}</span>
                    <span className="font-mono">{transfer.blockchainHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Complete history of all batch transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Drug Name</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Blockchain Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.id}</TableCell>
                  <TableCell>{transfer.batchId}</TableCell>
                  <TableCell>{transfer.drugName}</TableCell>
                  <TableCell>{transfer.recipient}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transfer.status)}>
                      {transfer.status === "Completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell className="font-mono text-xs">{transfer.blockchainHash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
