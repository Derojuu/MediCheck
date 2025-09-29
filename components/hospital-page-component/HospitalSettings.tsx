import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading"
import { Edit, Save, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface OrganizationData {
    id: string;
    companyName: string;
    contactEmail: string;
    contactPhone: string | null;
    contactPersonName: string | null;
    address: string;
    country: string;
    state: string | null;
    licenseNumber: string | null;
    nafdacNumber: string | null;
    businessRegNumber: string | null;
    rcNumber: string | null;
    pcnNumber: string | null;
    isVerified: boolean;
}

const HospitalSettings = () => {
    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<OrganizationData>>({});
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const orgResponse = await fetch('/api/organizations/me');
                if (orgResponse.ok) {
                    const orgResult = await orgResponse.json();
                    console.log('Organization data:', orgResult); // Debug log
                    if (orgResult.organization) {
                        setOrgData(orgResult.organization);
                        setEditedData(orgResult.organization);
                        // Check if current user can edit - this is a simple check
                        // In a real app, you'd check user roles more thoroughly
                        setCanEdit(true);
                    } else {
                        toast.error('No organization found for current user');
                    }
                } else {
                    toast.error('Failed to fetch organization data');
                }
            } catch (error) {
                console.error('Error fetching organization data:', error);
                toast.error('Failed to load hospital settings');
            } finally {
                setLoading(false);
            }
        };

        fetchOrgData();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData({ ...orgData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({ ...orgData });
    };

    const handleSave = async () => {
        if (!orgData || !editedData) return;

        setSaving(true);
        try {
            const response = await fetch('/api/organizations/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId: orgData.id,
                    companyName: editedData.companyName,
                    contactEmail: editedData.contactEmail,
                    contactPhone: editedData.contactPhone,
                    contactPersonName: editedData.contactPersonName,
                    address: editedData.address,
                    country: editedData.country,
                    state: editedData.state,
                    licenseNumber: editedData.licenseNumber,
                    nafdacNumber: editedData.nafdacNumber,
                    businessRegNumber: editedData.businessRegNumber,
                    rcNumber: editedData.rcNumber,
                    pcnNumber: editedData.pcnNumber
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setOrgData(result.organization);
                setEditedData(result.organization);
                setIsEditing(false);
                toast.success('Hospital settings updated successfully');
            } else {
                const error = await response.json();
                console.error('Update error:', error);
                if (response.status === 403) {
                    toast.error('You do not have permission to edit these settings');
                    setCanEdit(false);
                } else if (response.status === 404) {
                    toast.error('Organization not found');
                } else {
                    toast.error(error.error || 'Failed to update settings');
                }
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update hospital settings');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof OrganizationData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Hospital Settings</CardTitle>
                        <CardDescription>Loading organization settings...</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoadingSpinner size="large" text="Loading settings..." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-2">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1 text-base sm:text-sm">Manage your hospital preferences and configurations</p>
                </div>
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-0">
                    {!isEditing && canEdit ? (
                        <Button onClick={handleEdit} className="flex items-center gap-2 w-full sm:w-auto">
                            <Edit className="h-4 w-4" />
                            Edit Settings
                        </Button>
                    ) : !canEdit ? (
                        <div className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                            Contact administrator to edit settings
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 w-full sm:w-auto">
                                <Save className="h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hospital Information</CardTitle>
                    <CardDescription>
                        {isEditing ? 'Edit your hospital information below' : 'Your hospital information and credentials'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="hospital-name">Hospital Name *</Label>
                                <Input 
                                    id="hospital-name" 
                                    value={editedData?.companyName ?? ''} 
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">Contact Email *</Label>
                                <Input 
                                    id="contact-email" 
                                    type="email"
                                    value={editedData?.contactEmail ?? ''} 
                                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">Contact Phone</Label>
                                <Input 
                                    id="contact-phone" 
                                    value={editedData?.contactPhone ?? ''} 
                                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                    placeholder="Enter contact phone"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-person">Contact Person</Label>
                                <Input 
                                    id="contact-person" 
                                    value={editedData?.contactPersonName ?? ''} 
                                    onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                    placeholder="Enter contact person name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Hospital Address *</Label>
                            <Textarea 
                                id="address" 
                                value={editedData?.address ?? ''} 
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                readOnly={!isEditing}
                                rows={3}
                                className={isEditing ? 'border-primary' : ''}
                                placeholder="Enter hospital address"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input 
                                    id="country" 
                                    value={editedData?.country ?? ''} 
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                    placeholder="Enter country"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State/Province</Label>
                                <Input 
                                    id="state" 
                                    value={editedData?.state ?? ''} 
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                    placeholder="Enter state or province"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">License & Registration Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="license-number">Medical License Number</Label>
                                    <Input 
                                        id="license-number" 
                                        value={editedData?.licenseNumber ?? ''} 
                                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                                        readOnly={!isEditing}
                                        className={isEditing ? 'border-primary' : ''}
                                        placeholder="Enter medical license number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nafdac">NAFDAC Number</Label>
                                    <Input 
                                        id="nafdac" 
                                        value={editedData?.nafdacNumber ?? ''} 
                                        onChange={(e) => handleInputChange('nafdacNumber', e.target.value)}
                                        readOnly={!isEditing}
                                        className={isEditing ? 'border-primary' : ''}
                                        placeholder="Enter NAFDAC number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="business-reg">Business Registration Number</Label>
                                    <Input 
                                        id="business-reg" 
                                        value={editedData?.businessRegNumber ?? ''} 
                                        onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                                        readOnly={!isEditing}
                                        className={isEditing ? 'border-primary' : ''}
                                        placeholder="Enter business registration number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rc-number">RC Number</Label>
                                    <Input 
                                        id="rc-number" 
                                        value={editedData?.rcNumber ?? ''} 
                                        onChange={(e) => handleInputChange('rcNumber', e.target.value)}
                                        readOnly={!isEditing}
                                        className={isEditing ? 'border-primary' : ''}
                                        placeholder="Enter RC number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pcn-number">PCN Number</Label>
                                <Input 
                                    id="pcn-number" 
                                    value={editedData?.pcnNumber ?? ''} 
                                    onChange={(e) => handleInputChange('pcnNumber', e.target.value)}
                                    readOnly={!isEditing}
                                    className={isEditing ? 'border-primary' : ''}
                                    placeholder="Enter PCN number"
                                />
                            </div>
                        </div>

                        {orgData?.isVerified && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-800 font-medium">✅ Hospital Verified</p>
                                <p className="text-green-600 text-sm">Your hospital has been verified by the regulatory authorities.</p>
                            </div>
                        )}

                        {isEditing && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    <strong>Note:</strong> Fields marked with * are required. Changes will be saved immediately when you click "Save Changes".
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default HospitalSettings;