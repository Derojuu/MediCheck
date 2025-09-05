import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Factory,
    Package,
    QrCode,
    Building2,
    Truck,
    FlaskConical,
} from "lucide-react";
import { ManufacturerTab } from "@/utils"

const ManufacturerMain = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>> }) => {

    const [stats, setStats] = useState({
        totalBatches: 0,
        activeBatches: 0,
        pendingQuality: 0,
        recentTransfers: 0,
    })

    const dummyTransfers = [
        {
            id: "T001",
            batchNumber: "PTC-2024-001",
            productName: "Paracetamol 500mg",
            fromEntity: "PharmaTech Industries",
            toEntity: "MediDistrib Lagos",
            quantity: 1500,
            transferDate: "2024-09-01",
            status: "Completed"
        },
        {
            id: "T002",
            batchNumber: "PTC-2024-003",
            productName: "Lisinopril 10mg",
            fromEntity: "PharmaTech Industries",
            toEntity: "City Hospital Pharmacy",
            quantity: 3000,
            transferDate: "2024-08-30",
            status: "Completed"
        },
        {
            id: "T003",
            batchNumber: "PTC-2024-005",
            productName: "Aspirin 75mg",
            fromEntity: "PharmaTech Industries",
            toEntity: "HealthPlus Pharmacy",
            quantity: 5000,
            transferDate: "2024-09-02",
            status: "Pending"
        }
    ]

    const [recentTransfers, setRecentTransfers] = useState(dummyTransfers)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Manufacturer Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome to PharmaTech Industries Manufacturing Portal</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                        <Building2 className="h-4 w-4 mr-2" />
                        Manufacturer
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
                        <Factory className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.totalBatches}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-accent font-medium">+15%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.activeBatches}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently in circulation
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Quality</CardTitle>
                        <FlaskConical className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingQuality}</div>
                        <p className="text-xs text-muted-foreground">Awaiting QC approval</p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Transfers</CardTitle>
                        <Truck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.recentTransfers}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-primary">+8</span> this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-effect border-2 border-primary/20 shadow-xl backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Quick Actions</CardTitle>
                        <CardDescription className="text-muted-foreground">Common manufacturing tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-200 shadow-lg" onClick={() => setActiveTab("batches")}>
                            <Package className="h-4 w-4 mr-2" />
                            Create New Batch
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("quality")}>
                            <FlaskConical className="h-4 w-4 mr-2" />
                            Quality Control
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("transfers")}>
                            <Truck className="h-4 w-4 mr-2" />
                            Transfer Management
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" onClick={() => setActiveTab("qr-generator")}>
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Codes
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/20 shadow-xl backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Activity</CardTitle>
                        <CardDescription className="text-muted-foreground">Latest batch and transfer activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransfers.slice(0, 4).map((transfer) => (
                                <div key={transfer.id} className="flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-200">
                                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{transfer.productName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {transfer.fromEntity} → {transfer.toEntity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={transfer.status === "Completed" ? "default" : "secondary"} className="bg-primary/10 text-primary border-primary/20">
                                            {transfer.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">{transfer.transferDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ManufacturerMain;