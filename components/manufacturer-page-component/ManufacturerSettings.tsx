import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


const ManufacturerSettings = () => {
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
                    <Input id="facility-name" value="PharmaTech Industries Ltd." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="license">Manufacturing License</Label>
                    <Input id="license" value="MAN-2024-PTC-001" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Information</Label>
                    <Input id="contact" value="manufacturing@pharmatech.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Facility Address</Label>
                    <Textarea id="address" value="Industrial Estate, Agbara, Ogun State, Nigeria" rows={3} />
                </div>
                <Button onClick={() => alert("Settings saved successfully!")}>Save Settings</Button>
                </div>
            </CardContent>
            </Card>
        </div>
    )
}

export default ManufacturerSettings;