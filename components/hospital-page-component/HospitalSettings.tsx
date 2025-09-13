import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

const HospitalSettings = () => {
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
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Hospital Settings</CardTitle>
                    <CardDescription>Manage your hospital preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="hospital-name">Hospital Name</Label>
                            <Input id="hospital-name" value={orgData?.companyName ?? ''} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="license-number">Medical License Number</Label>
                            <Input id="license-number" value={orgData?.licenseNumber ?? 'Not provided'} readOnly />
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
                            <Label htmlFor="address">Hospital Address</Label>
                            <Textarea 
                                id="address" 
                                value={`${orgData?.address ?? ''}, ${orgData?.state ?? ''}, ${orgData?.country ?? ''}`} 
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

export default HospitalSettings