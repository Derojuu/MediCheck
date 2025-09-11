import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
const HospitalSettings = () => {
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
                            <Input id="hospital-name" value="Lagos University Teaching Hospital" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="license-number">Medical License Number</Label>
                            <Input id="license-number" value="HOSP-2024-001" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Information</Label>
                            <Input id="contact" value="admin@luth.edu.ng" />
                        </div>
                        <Button onClick={() => alert("Settings saved successfully!")}>Save Settings</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default HospitalSettings