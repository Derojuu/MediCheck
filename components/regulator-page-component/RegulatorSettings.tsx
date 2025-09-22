"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const RegulatorSettings = () => {
    return (
        <div className="space-y-6">
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Regulatory Agency Settings</CardTitle>
                    <CardDescription>Manage regulatory system preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="agency-name">Agency Name</Label>
                            <Input id="agency-name" value="National Agency for Food and Drug Administration and Control (NAFDAC)" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="division">Division</Label>
                            <Input id="division" value="Drug Enforcement Division" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Information</Label>
                            <Input id="contact" value="enforcement@nafdac.gov.ng" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="headquarters">Headquarters Address</Label>
                            <Textarea id="headquarters" value="Plot 2032, Olusegun Obasanjo Way, Zone 7, Wuse District, Abuja, FCT, Nigeria" rows={3} />
                        </div>
                        <Button onClick={() => alert("Settings saved successfully!")}>Save Settings</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default RegulatorSettings;