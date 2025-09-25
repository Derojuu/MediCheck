"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, AlertTriangle, FileCheck, TrendingUp, Users } from "lucide-react"
import {ThemeToggle} from "@/components/theme-toggle"

interface TransferData {
    id: string;
    batchId: string;
    fromOrgId: string;
    toOrgId: string;
    transferDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    notes?: string;
    batch: {
        batchId: string;
        drugName: string;
        manufacturingDate: string;
        expiryDate: string;
    };
    fromOrg: {
        companyName: string;
        organizationType: string;
        contactEmail: string;
    };
    toOrg: {
        companyName: string;
        organizationType: string;
        contactEmail: string;
    };
}

interface ComplianceStats {
    totalTransfers: number;
    pendingReviews: number;
    completedTransfers: number;
    flaggedTransfers: number;
    complianceRate: number;
}

const RegulatorCompliance = () => {
    const [transfers, setTransfers] = useState<TransferData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<ComplianceStats>({
        totalTransfers: 0,
        pendingReviews: 0,
        completedTransfers: 0,
        flaggedTransfers: 0,
        complianceRate: 0
    })

    useEffect(() => {
        fetchComplianceData()
    }, [])

    const fetchComplianceData = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/regulator/compliance')
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            setTransfers(data.transfers || [])
            
            // Calculate statistics
            const total = data.transfers?.length || 0
            const pending = data.transfers?.filter((t: TransferData) => t.status === 'PENDING').length || 0
            const completed = data.transfers?.filter((t: TransferData) => t.status === 'COMPLETED').length || 0
            const failed = data.transfers?.filter((t: TransferData) => t.status === 'FAILED').length || 0
            const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0
            
            setStats({
                totalTransfers: total,
                pendingReviews: pending,
                completedTransfers: completed,
                flaggedTransfers: failed,
                complianceRate
            })
            
        } catch (error) {
            console.error('Error fetching compliance data:', error)
            setError('Failed to load compliance data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleApproveTransfer = async (transferId: string, status: 'COMPLETED' | 'FAILED', notes?: string) => {
        try {
            const response = await fetch('/api/regulator/compliance', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transferId, status, notes }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            // Update local state
            setTransfers(prev => 
                prev.map(transfer => 
                    transfer.id === transferId 
                        ? { ...transfer, status, notes }
                        : transfer
                )
            )
            
            // Recalculate stats
            await fetchComplianceData()
            
        } catch (error) {
            console.error('Error updating transfer:', error)
            setError('Failed to update transfer status. Please try again.')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                </Badge>
            case 'IN_PROGRESS':
                return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    In Progress
                </Badge>
            case 'COMPLETED':
                return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </Badge>
            case 'FAILED':
                return <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                </Badge>
            case 'CANCELLED':
                return <Badge variant="outline">Cancelled</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getOrganizationTypeColor = (type: string) => {
        switch (type) {
            case 'MANUFACTURER':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            case 'DRUG_DISTRIBUTOR':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            case 'HOSPITAL':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            case 'PHARMACY':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate)
        const now = new Date()
        const sixMonthsFromNow = new Date(now.getTime() + (6 * 30 * 24 * 60 * 60 * 1000))
        return expiry <= sixMonthsFromNow
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Compliance Monitoring</h1>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading compliance data...</span>
                </div>
            </div>
        )
    }
    const pendingTransfers = transfers.filter(t => t.status === 'PENDING')
    const recentTransfers = transfers.slice(0, 10)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div className="flex flex-row items-center gap-2">
                    <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Compliance Monitoring</h1>
                </div>
                {/* Hide ThemeToggle on mobile, show on desktop */}
                <div className="hidden sm:block">
                    <ThemeToggle />
                </div>
            </div>
            {error && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{error}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={fetchComplianceData}
                                className="ml-auto"
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
                        <FileCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransfers}</div>
                        <p className="text-xs text-muted-foreground">
                            All ownership transfers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            Successful transfers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Flagged Transfers</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.flaggedTransfers}</div>
                        <p className="text-xs text-muted-foreground">
                        Failed/cancelled
                    </p>
                </CardContent>
            </Card>
            </div>

            {/* Pending Transfers Section */}
            {pendingTransfers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            Pending Transfers ({pendingTransfers.length})
                        </CardTitle>
                        <CardDescription>Transfers requiring immediate regulatory approval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingTransfers.slice(0, 5).map((transfer) => (
                                <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="font-medium">{transfer.batch.drugName}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {transfer.fromOrg.companyName} → {transfer.toOrg.companyName}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Batch: {transfer.batch.batchId} | Transfer Date: {formatDate(transfer.transferDate)}
                                            {isExpiringSoon(transfer.batch.expiryDate) && (
                                                <span className="text-orange-600 ml-2">⚠️ Expires Soon</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleApproveTransfer(transfer.id, 'COMPLETED')}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleApproveTransfer(transfer.id, 'FAILED', 'Rejected by regulator')}
                                            className="text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* All Transfers Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Ownership Transfers</CardTitle>
                            <CardDescription>Complete history of ownership transfers across the supply chain</CardDescription>
                        </div>
                        <Button variant="outline" onClick={fetchComplianceData}>
                            <Users className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {transfers.length === 0 ? (
                        <div className="text-center py-12">
                            <FileCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">No transfers found</p>
                            <p className="text-sm text-muted-foreground">There are currently no ownership transfers to review.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Medication Details</TableHead>
                                    <TableHead>From Organization</TableHead>
                                    <TableHead>To Organization</TableHead>
                                    <TableHead>Transfer Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transfers.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{transfer.batch.drugName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Batch: {transfer.batch.batchId}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Mfg: {formatDate(transfer.batch.manufacturingDate)} | 
                                                    Exp: {formatDate(transfer.batch.expiryDate)}
                                                    {isExpiringSoon(transfer.batch.expiryDate) && (
                                                        <span className="text-orange-600 ml-1">⚠️</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{transfer.fromOrg.companyName}</div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs mt-1 ${getOrganizationTypeColor(transfer.fromOrg.organizationType)}`}
                                                >
                                                    {transfer.fromOrg.organizationType.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{transfer.toOrg.companyName}</div>
                                                <Badge 
                                                    variant="outline" 
                                                    className={`text-xs mt-1 ${getOrganizationTypeColor(transfer.toOrg.organizationType)}`}
                                                >
                                                    {transfer.toOrg.organizationType.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDate(transfer.transferDate)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(transfer.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {transfer.status === 'PENDING' ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveTransfer(transfer.id, 'COMPLETED')}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleApproveTransfer(transfer.id, 'FAILED', 'Rejected by regulator')}
                                                            className="text-red-600 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        {transfer.status === 'COMPLETED' ? 'Processed' : 'Reviewed'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default RegulatorCompliance;