"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, CheckCircle, XCircle, AlertTriangle, Eye, Edit, Plus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
const RegulatorEntities = () => {
    const [entities, setEntities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isRegistering, setIsRegistering] = useState(false)
    const [showRegisterDialog, setShowRegisterDialog] = useState(false)
    const [formData, setFormData] = useState({
        companyName: "",
        organizationType: "",
        contactEmail: "",
        contactPhone: "",
        contactPersonName: "",
        address: "",
        country: "Nigeria",
        state: "",
        licenseNumber: "",
        nafdacNumber: "",
        businessRegNumber: "",
        rcNumber: "",
        pcnNumber: "",
        agencyName: "",
        officialId: "",
        distributorType: ""
    })

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const response = await fetch('/api/regulator/entities')
                if (response.ok) {
                    const data = await response.json()
                    setEntities(data.entities)
                }
            } catch (error) {
                console.error('Error fetching entities:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEntities()
    }, [])

    const handleVerifyEntity = async (entityId: string, isVerified: boolean) => {
        try {
            const response = await fetch(`/api/regulator/entities/${entityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isVerified, isActive: true }),
            })

            if (response.ok) {
                setEntities(prev => 
                    prev.map(entity => 
                        entity.id === entityId 
                            ? { ...entity, isVerified }
                            : entity
                    )
                )
            }
        } catch (error) {
            console.error('Error updating entity:', error)
        }
    }

    const handleRegisterEntity = async () => {
        setIsRegistering(true)
        try {
            const response = await fetch('/api/regulator/entities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const data = await response.json()
                setEntities(prev => [...prev, data.entity])
                setShowRegisterDialog(false)
                setFormData({
                    companyName: "",
                    organizationType: "",
                    contactEmail: "",
                    contactPhone: "",
                    contactPersonName: "",
                    address: "",
                    country: "Nigeria",
                    state: "",
                    licenseNumber: "",
                    nafdacNumber: "",
                    businessRegNumber: "",
                    rcNumber: "",
                    pcnNumber: "",
                    agencyName: "",
                    officialId: "",
                    distributorType: ""
                })
            } else {
                console.error('Failed to register entity')
            }
        } catch (error) {
            console.error('Error registering entity:', error)
        } finally {
            setIsRegistering(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getStatusBadge = (entity: any) => {
        if (!entity.isActive) {
            return <Badge variant="destructive">Inactive</Badge>
        }
        if (!entity.isVerified) {
            return <Badge variant="secondary">Under Review</Badge>
        }
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
    }

    const getOrganizationType = (type: string) => {
        switch (type) {
            case 'MANUFACTURER': return 'Manufacturer'
            case 'DRUG_DISTRIBUTOR': return 'Distributor'
            case 'HOSPITAL': return 'Hospital'
            case 'PHARMACY': return 'Pharmacy'
            default: return type
        }
    }

    
    return (
        <div className="space-y-6 px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Registered Entities</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">All registered pharmaceutical entities</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                    <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Register Entity</span>
                                <span className="sm:hidden">Register</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Register New Entity</DialogTitle>
                                <DialogDescription>
                                    Add a new pharmaceutical entity to the regulatory database
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Basic Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="companyName">Company Name *</Label>
                                            <Input
                                                id="companyName"
                                                value={formData.companyName}
                                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="organizationType">Organization Type *</Label>
                                            <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MANUFACTURER">Manufacturer</SelectItem>
                                                    <SelectItem value="DRUG_DISTRIBUTOR">Drug Distributor</SelectItem>
                                                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                                                    <SelectItem value="PHARMACY">Pharmacy</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="contactEmail">Contact Email *</Label>
                                            <Input
                                                id="contactEmail"
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                                placeholder="contact@company.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="contactPhone">Contact Phone</Label>
                                            <Input
                                                id="contactPhone"
                                                value={formData.contactPhone}
                                                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                                placeholder="+234-xxx-xxx-xxxx"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contactPersonName">Contact Person Name</Label>
                                        <Input
                                            id="contactPersonName"
                                            value={formData.contactPersonName}
                                            onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                            placeholder="Full name of contact person"
                                        />
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Location Information</h3>
                                    
                                    <div>
                                        <Label htmlFor="address">Address *</Label>
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Full business address"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="country">Country *</Label>
                                            <Input
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => handleInputChange('country', e.target.value)}
                                                placeholder="Nigeria"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                placeholder="State/Province"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Regulatory Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Regulatory Information</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="licenseNumber">License Number</Label>
                                            <Input
                                                id="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                                placeholder="Operating license number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="nafdacNumber">NAFDAC Number</Label>
                                            <Input
                                                id="nafdacNumber"
                                                value={formData.nafdacNumber}
                                                onChange={(e) => handleInputChange('nafdacNumber', e.target.value)}
                                                placeholder="NAFDAC registration number"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                                            <Input
                                                id="businessRegNumber"
                                                value={formData.businessRegNumber}
                                                onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                                                placeholder="Business registration number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="rcNumber">RC Number</Label>
                                            <Input
                                                id="rcNumber"
                                                value={formData.rcNumber}
                                                onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                                                placeholder="Corporate Affairs Commission number"
                                            />
                                        </div>
                                    </div>

                                    {formData.organizationType === 'PHARMACY' && (
                                        <div>
                                            <Label htmlFor="pcnNumber">PCN Number</Label>
                                            <Input
                                                id="pcnNumber"
                                                value={formData.pcnNumber}
                                                onChange={(e) => handleInputChange('pcnNumber', e.target.value)}
                                                placeholder="Pharmacists Council of Nigeria number"
                                            />
                                        </div>
                                    )}

                                    {formData.organizationType === 'DRUG_DISTRIBUTOR' && (
                                        <div>
                                            <Label htmlFor="distributorType">Distributor Type</Label>
                                            <Select value={formData.distributorType} onValueChange={(value) => handleInputChange('distributorType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select distributor type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                                                    <SelectItem value="RETAIL">Retail</SelectItem>
                                                    <SelectItem value="IMPORT_EXPORT">Import/Export</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="officialId">Official ID</Label>
                                        <Input
                                            id="officialId"
                                            value={formData.officialId}
                                            onChange={(e) => handleInputChange('officialId', e.target.value)}
                                            placeholder="Official identification number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                                <Button variant="outline" onClick={() => setShowRegisterDialog(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleRegisterEntity} 
                                    disabled={isRegistering || !formData.companyName || !formData.organizationType || !formData.contactEmail || !formData.address || !formData.country}
                                >
                                    {isRegistering ? "Registering..." : "Register Entity"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="overflow-x-auto">
                <CardHeader>
                    <CardTitle>All Registered Entities</CardTitle>
                    <CardDescription>Complete database of registered pharmaceutical entities</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Responsive Table: Show table on md+ screens, show cards on mobile */}
                    <div className="hidden md:block w-full overflow-x-auto">
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>License</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Loading entities...
                                        </TableCell>
                                    </TableRow>
                                ) : entities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            No entities found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    entities.map((entity) => (
                                        <TableRow key={entity.id}>
                                            <TableCell className="font-medium whitespace-nowrap max-w-[140px] overflow-hidden text-ellipsis">{entity.companyName}</TableCell>
                                            <TableCell className="whitespace-nowrap">{getOrganizationType(entity.organizationType)}</TableCell>
                                            <TableCell className="whitespace-nowrap">{entity.state ? `${entity.address}, ${entity.state}` : entity.address}</TableCell>
                                            <TableCell className="whitespace-nowrap">{entity.licenseNumber || entity.nafdacNumber || 'N/A'}</TableCell>
                                            <TableCell className="whitespace-nowrap">{entity.contactEmail}</TableCell>
                                            <TableCell>{getStatusBadge(entity)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                                                    {!entity.isVerified && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleVerifyEntity(entity.id, true)}
                                                            className="text-green-600 hover:bg-green-50"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">Verify</span>
                                                            <span className="sm:hidden">✔</span>
                                                        </Button>
                                                    )}
                                                    {entity.isVerified && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleVerifyEntity(entity.id, false)}
                                                            className="text-red-600 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            <span className="hidden sm:inline">Suspend</span>
                                                            <span className="sm:hidden">✖</span>
                                                        </Button>
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
                    </div>
                    {/* Mobile Card List */}
                    <div className="block md:hidden w-full">
                        {loading ? (
                            <div className="py-8 text-center text-muted-foreground">Loading entities...</div>
                        ) : entities.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">No entities found</div>
                        ) : (
                            <div className="flex flex-col gap-4 p-2">
                                {entities.map((entity) => (
                                    <div key={entity.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-base">{entity.companyName}</span>
                                            {getStatusBadge(entity)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{getOrganizationType(entity.organizationType)}</div>
                                        <div className="text-sm">{entity.state ? `${entity.address}, ${entity.state}` : entity.address}</div>
                                        <div className="text-xs">License: <span className="font-medium">{entity.licenseNumber || entity.nafdacNumber || 'N/A'}</span></div>
                                        <div className="text-xs">Contact: <span className="font-medium">{entity.contactEmail}</span></div>
                                        <div className="flex gap-2 mt-2">
                                            {!entity.isVerified && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleVerifyEntity(entity.id, true)}
                                                    className="text-green-600 hover:bg-green-50 flex-1"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Verify
                                                </Button>
                                            )}
                                            {entity.isVerified && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleVerifyEntity(entity.id, false)}
                                                    className="text-red-600 hover:bg-red-50 flex-1"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Suspend
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" className="flex-1">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegulatorEntities;