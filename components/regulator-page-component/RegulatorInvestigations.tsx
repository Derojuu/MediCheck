"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const RegulatorInvestigations = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const investigations = [
        { id: "INV001", title: "Counterfeit Paracetamol Investigation", target: "Multiple Facilities", status: "Active", priority: "Critical", startDate: "2024-08-20", inspector: "Dr. Adebayo" },
        { id: "INV002", title: "Expired Drug Distribution", target: "MedChain Pharmacy", status: "Under Review", priority: "High", startDate: "2024-08-18", inspector: "Dr. Okafor" },
        { id: "INV003", title: "Unlicensed Distribution Activity", target: "QuickMed Ltd", status: "Pending", priority: "High", startDate: "2024-08-15", inspector: "Dr. Emeka" },
        { id: "INV004", title: "Storage Condition Violations", target: "HealthStore Inc", status: "Completed", priority: "Medium", startDate: "2024-08-10", inspector: "Dr. Nkem" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Investigations Management</h1>
                    <p className="text-muted-foreground">Active and completed investigations</p>
                </div>
                <Button onClick={() => alert("Creating new investigation...")}>
                    <Eye className="h-4 w-4 mr-2" />
                    New Investigation
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Investigations</CardTitle>
                    <CardDescription>Complete list of regulatory investigations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by investigation title, target, or inspector..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => alert(`Searching for: ${searchQuery}`)}>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Investigation ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Inspector</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investigations.map((investigation) => (
                                <TableRow key={investigation.id}>
                                    <TableCell className="font-medium">{investigation.id}</TableCell>
                                    <TableCell>{investigation.title}</TableCell>
                                    <TableCell>{investigation.target}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                investigation.status === "Completed"
                                                    ? "default"
                                                    : investigation.status === "Active"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {investigation.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                investigation.priority === "Critical"
                                                    ? "destructive"
                                                    : investigation.priority === "High"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {investigation.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{investigation.startDate}</TableCell>
                                    <TableCell>{investigation.inspector}</TableCell>
                                    <TableCell>
                                        <Button size="sm" onClick={() => alert(`Managing investigation ${investigation.id}...`)}>
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

export default RegulatorInvestigations;