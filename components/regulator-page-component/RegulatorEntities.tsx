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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Registered Entities</h1>
                    <p className="text-muted-foreground">All registered pharmaceutical entities</p>
                </div>
                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Register Entity
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
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

                                    <div className="grid grid-cols-2 gap-4">
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

                                    <div className="grid grid-cols-2 gap-4">
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
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

                                    <div className="grid grid-cols-2 gap-4">
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

                            <div className="flex justify-end space-x-2">
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

            <Card>
                <CardHeader>
                    <CardTitle>All Registered Entities</CardTitle>
                    <CardDescription>Complete database of registered pharmaceutical entities</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
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
                                        <TableCell className="font-medium">{entity.companyName}</TableCell>
                                        <TableCell>{getOrganizationType(entity.organizationType)}</TableCell>
                                        <TableCell>{entity.state ? `${entity.address}, ${entity.state}` : entity.address}</TableCell>
                                        <TableCell>{entity.licenseNumber || entity.nafdacNumber || 'N/A'}</TableCell>
                                        <TableCell>{entity.contactEmail}</TableCell>
                                        <TableCell>{getStatusBadge(entity)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {!entity.isVerified && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleVerifyEntity(entity.id, true)}
                                                        className="text-green-600 hover:bg-green-50"
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
                                                        className="text-red-600 hover:bg-red-50"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Suspend
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
                </CardContent>
            </Card>
        </div>
    )
}

export default RegulatorEntities;