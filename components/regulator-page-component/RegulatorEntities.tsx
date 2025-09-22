"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"
const RegulatorEntities = () => {


    const registeredEntities = [
        { id: "ENT001", name: "PharmaCorp Ltd", type: "Manufacturer", location: "Lagos", license: "MAN-2024-001", status: "Active", lastInspection: "2024-07-15" },
        { id: "ENT002", name: "MedDistribute Inc", type: "Distributor", location: "Abuja", license: "DIST-2024-002", status: "Active", lastInspection: "2024-06-20" },
        { id: "ENT003", name: "HealthPlus Pharmacy", type: "Pharmacy", location: "Port Harcourt", license: "PHR-2024-003", status: "Under Review", lastInspection: "2024-08-01" },
        { id: "ENT004", name: "CureAll Hospital", type: "Hospital", location: "Kano", license: "HOS-2024-004", status: "Active", lastInspection: "2024-05-10" },
        { id: "ENT005", name: "MediCare Clinic", type: "Clinic", location: "Ibadan", license: "CLI-2024-005", status: "Expired", lastInspection: "2024-02-15" },
    ]

    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Registered Entities</h1>
                    <p className="text-muted-foreground">All registered pharmaceutical entities</p>
                </div>
                <Button onClick={() => alert("Registering new entity...")}>
                    <Users className="h-4 w-4 mr-2" />
                    Register Entity
                </Button>
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
                                <TableHead>Entity ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Inspection</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registeredEntities.map((entity) => (
                                <TableRow key={entity.id}>
                                    <TableCell className="font-medium">{entity.id}</TableCell>
                                    <TableCell>{entity.name}</TableCell>
                                    <TableCell>{entity.type}</TableCell>
                                    <TableCell>{entity.location}</TableCell>
                                    <TableCell>{entity.license}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                entity.status === "Active"
                                                    ? "default"
                                                    : entity.status === "Under Review"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {entity.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{entity.lastInspection}</TableCell>
                                    <TableCell>
                                        <Button size="sm" onClick={() => alert(`Managing ${entity.name}...`)}>
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegulatorEntities;