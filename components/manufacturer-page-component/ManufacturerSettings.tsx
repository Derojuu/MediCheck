import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading"
import { useState, useEffect } from "react"

interface OrganizationData {
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
}

const ManufacturerSettings = () => {
    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const response = await fetch('/api/organizations/me');
                if (response.ok) {
                    const data = await response.json();
                    setOrgData(data.organization);
                }
            } catch (error) {
                console.error('Error fetching organization data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Manufacturing Settings</CardTitle>
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
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
            <Card>
            <CardHeader>
                <CardTitle>Manufacturing Settings</CardTitle>
                <CardDescription>Manage manufacturing facility preferences and configurations</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="facility-name">Facility Name</Label>
                    <Input id="facility-name" value={orgData?.companyName || ''} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="license">Manufacturing License</Label>
                    <Input id="license" value={orgData?.licenseNumber ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nafdac">NAFDAC Number</Label>
                    <Input id="nafdac" value={orgData?.nafdacNumber ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="business-reg">Business Registration Number</Label>
                    <Input id="business-reg" value={orgData?.businessRegNumber ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rc-number">RC Number</Label>
                    <Input id="rc-number" value={orgData?.rcNumber ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Email</Label>
                    <Input id="contact" value={orgData?.contactEmail ?? ''} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input id="phone" value={orgData?.contactPhone ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <Input id="contact-person" value={orgData?.contactPersonName ?? 'Not provided'} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Facility Address</Label>
                    <Textarea 
                        id="address" 
                        value={`${orgData?.address || ''}, ${orgData?.state || ''}, ${orgData?.country || ''}`} 
                        rows={3} 
                        readOnly 
                    />
                </div>
                <Button onClick={() => alert("Contact administrator to update organization settings")}>
                    Request Settings Update
                </Button>
                </div>
            </CardContent>
            </Card>
        </div>
    )
}

export default ManufacturerSettings;