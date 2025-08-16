"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Package, Plus, Eye, ArrowUpRight, Calendar, MapPin } from "lucide-react"

export function BatchManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newBatch, setNewBatch] = useState({
    drugName: "",
    composition: "",
    batchSize: "",
    manufacturingDate: "",
    expiryDate: "",
    storageInstructions: "",
  })

  // Mock batch data
  const batches = [
    {
      id: "BTH-2024-001",
      drugName: "Paracetamol 500mg",
      status: "In Transit",
      expiryDate: "2025-12-15",
      batchSize: 10000,
      currentLocation: "City Distributor Hub",
    },
    {
      id: "BTH-2024-002",
      drugName: "Amoxicillin 250mg",
      status: "Delivered",
      expiryDate: "2025-08-20",
      batchSize: 5000,
      currentLocation: "Metro Pharmacy Chain",
    },
    {
      id: "BTH-2024-003",
      drugName: "Ibuprofen 400mg",
      status: "Manufacturing",
      expiryDate: "2026-01-10",
      batchSize: 15000,
      currentLocation: "Production Facility",
    },
    {
      id: "BTH-2024-004",
      drugName: "Aspirin 100mg",
      status: "Ready for Dispatch",
      expiryDate: "2025-11-30",
      batchSize: 8000,
      currentLocation: "Warehouse A",
    },
  ]

  const handleCreateBatch = () => {
    // In real app, this would create the batch
    console.log("Creating batch:", newBatch)
    setIsCreateModalOpen(false)
    setNewBatch({
      drugName: "",
      composition: "",
      batchSize: "",
      manufacturingDate: "",
      expiryDate: "",
      storageInstructions: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Manufacturing":
        return "bg-blue-100 text-blue-800"
      case "Ready for Dispatch":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">Manage Batches</h1>
          <p className="text-muted-foreground">Create and track your medication batches</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-montserrat">Create New Batch</DialogTitle>
              <DialogDescription>Enter the details for your new medication batch</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="drugName">Drug Name</Label>
                <Input
                  id="drugName"
                  value={newBatch.drugName}
                  onChange={(e) => setNewBatch({ ...newBatch, drugName: e.target.value })}
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={newBatch.batchSize}
                  onChange={(e) => setNewBatch({ ...newBatch, batchSize: e.target.value })}
                  placeholder="Number of units"
                />
              </div>
              <div>
                <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                <Input
                  id="manufacturingDate"
                  type="date"
                  value={newBatch.manufacturingDate}
                  onChange={(e) => setNewBatch({ ...newBatch, manufacturingDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newBatch.expiryDate}
                  onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="composition">Composition</Label>
                <Textarea
                  id="composition"
                  value={newBatch.composition}
                  onChange={(e) => setNewBatch({ ...newBatch, composition: e.target.value })}
                  placeholder="Active ingredients and composition"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="storageInstructions">Storage Instructions</Label>
                <Textarea
                  id="storageInstructions"
                  value={newBatch.storageInstructions}
                  onChange={(e) => setNewBatch({ ...newBatch, storageInstructions: e.target.value })}
                  placeholder="Storage temperature, humidity, and other requirements"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBatch}>Create Batch</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Batch Overview
          </CardTitle>
          <CardDescription>All medication batches in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Drug Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Batch Size</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>{batch.drugName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {batch.expiryDate}
                    </div>
                  </TableCell>
                  <TableCell>{batch.batchSize.toLocaleString()} units</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {batch.currentLocation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        Transfer
                      </Button>
                    </div>
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
