"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eye, Search, CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const RegulatorInvestigations = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [investigations, setInvestigations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isNewInvestigationOpen, setIsNewInvestigationOpen] = useState(false)
    const [newInvestigation, setNewInvestigation] = useState({
        batchId: '',
        reportType: '',
        severity: '',
        description: '',
        location: ''
    })

    useEffect(() => {
        const fetchInvestigations = async () => {
            try {
                const response = await fetch('/api/regulator/investigations')
                if (response.ok) {
                    const data = await response.json()
                    setInvestigations(data.investigations)
                }
            } catch (error) {
                console.error('Error fetching investigations:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInvestigations()
    }, [])

    const handleCreateInvestigation = async () => {
        try {
            console.log('Creating investigation with data:', newInvestigation);
            const response = await fetch('/api/regulator/investigations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newInvestigation,
                    status: 'PENDING'
                }),
            })

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                setInvestigations(prev => [data.investigation, ...prev])
                setNewInvestigation({
                    batchId: '',
                    reportType: '',
                    severity: '',
                    description: '',
                    location: ''
                })
                setIsNewInvestigationOpen(false)
                alert('Investigation created successfully!')
            } else {
                alert(`Failed to create investigation: ${data.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Error creating investigation:', error)
            alert(`Error creating investigation: ${error}`)
        }
    }

    const handleUpdateStatus = async (investigationId: string, status: string, resolution?: string) => {
        try {
            const response = await fetch(`/api/regulator/investigations/${investigationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, resolution }),
            })

            if (response.ok) {
                setInvestigations(prev => 
                    prev.map(inv => 
                        inv.id === investigationId 
                            ? { ...inv, status, resolution }
                            : inv
                    )
                )
            }
        } catch (error) {
            console.error('Error updating investigation:', error)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary">Pending</Badge>
            case 'INVESTIGATING':
                return <Badge variant="default" className="bg-blue-100 text-blue-800">Investigating</Badge>
            case 'RESOLVED':
                return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
            case 'DISMISSED':
                return <Badge variant="outline">Dismissed</Badge>
            case 'ESCALATED':
                return <Badge variant="destructive">Escalated</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'LOW':
                return <Badge variant="outline" className="text-green-600">Low</Badge>
            case 'MEDIUM':
                return <Badge variant="outline" className="text-yellow-600">Medium</Badge>
            case 'HIGH':
                return <Badge variant="outline" className="text-orange-600">High</Badge>
            case 'CRITICAL':
                return <Badge variant="destructive">Critical</Badge>
            default:
                return <Badge variant="outline">{severity}</Badge>
        }
    }

    const filteredInvestigations = investigations.filter(inv =>
        inv.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.batch?.drugName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.consumers?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Investigations Management</h1>
                    <p className="text-muted-foreground">Active and completed investigations</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Dialog open={isNewInvestigationOpen} onOpenChange={setIsNewInvestigationOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Investigation
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Investigation</DialogTitle>
                            <DialogDescription>
                                Start a new regulatory investigation into potential counterfeit or safety issues.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="batchId">Batch ID (Optional)</Label>
                                <Input
                                    id="batchId"
                                    placeholder="Enter batch ID if known"
                                    value={newInvestigation.batchId}
                                    onChange={(e) => setNewInvestigation(prev => ({ ...prev, batchId: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reportType">Investigation Type</Label>
                                <Select value={newInvestigation.reportType} onValueChange={(value) => setNewInvestigation(prev => ({ ...prev, reportType: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select investigation type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COUNTERFEIT_SUSPICION">Counterfeit Suspicion</SelectItem>
                                        <SelectItem value="QUALITY_ISSUE">Quality Issue</SelectItem>
                                        <SelectItem value="ADVERSE_REACTION">Adverse Reaction</SelectItem>
                                        <SelectItem value="PACKAGING_DEFECT">Packaging Defect</SelectItem>
                                        <SelectItem value="SUPPLY_CHAIN_ISSUE">Supply Chain Issue</SelectItem>
                                        <SelectItem value="REGULATORY_VIOLATION">Regulatory Violation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="severity">Severity Level</Label>
                                <Select value={newInvestigation.severity} onValueChange={(value) => setNewInvestigation(prev => ({ ...prev, severity: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select severity level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="CRITICAL">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Input
                                    id="location"
                                    placeholder="Location where issue was reported"
                                    value={newInvestigation.location}
                                    onChange={(e) => setNewInvestigation(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Investigation Details</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide detailed description of the issue requiring investigation..."
                                    value={newInvestigation.description}
                                    onChange={(e) => setNewInvestigation(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewInvestigationOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateInvestigation}
                                disabled={!newInvestigation.reportType || !newInvestigation.severity || !newInvestigation.description}
                            >
                                Create Investigation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Investigations</CardTitle>
                    <CardDescription>Complete list of regulatory investigations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by investigation title, target, or inspector..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search ({filteredInvestigations.length})
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Batch/Drug</TableHead>
                                <TableHead>Reporter</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Loading investigations...
                                    </TableCell>
                                </TableRow>
                            ) : filteredInvestigations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No investigations found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInvestigations.map((investigation) => (
                                    <TableRow key={investigation.id}>
                                        <TableCell className="max-w-xs">
                                            <div className="truncate" title={investigation.description}>
                                                {investigation.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{investigation.batch?.drugName || 'N/A'}</div>
                                                <div className="text-sm text-muted-foreground">{investigation.batch?.batchId || ''}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{investigation.consumers?.fullName || 'System'}</TableCell>
                                        <TableCell>{investigation.reportType?.replace('_', ' ')}</TableCell>
                                        <TableCell>{getSeverityBadge(investigation.severity)}</TableCell>
                                        <TableCell>{getStatusBadge(investigation.status)}</TableCell>
                                        <TableCell>{new Date(investigation.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {investigation.status === 'PENDING' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateStatus(investigation.id, 'INVESTIGATING')}
                                                    >
                                                        Start
                                                    </Button>
                                                )}
                                                {investigation.status === 'INVESTIGATING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateStatus(investigation.id, 'RESOLVED', 'Investigation completed')}
                                                            className="text-green-600 hover:bg-green-50"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Resolve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateStatus(investigation.id, 'ESCALATED')}
                                                            className="text-red-600 hover:bg-red-50"
                                                        >
                                                            <AlertTriangle className="h-4 w-4 mr-1" />
                                                            Escalate
                                                        </Button>
                                                    </>
                                                )}
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegulatorInvestigations;