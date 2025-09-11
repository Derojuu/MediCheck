import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, TrendingUp, Clock, CheckCircle, QrCode, Building2 } from "lucide-react";
import { ManufacturerTab } from "@/utils";


const HospitalMain = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>> }) => {

    const stats = {
        totalMedications: 1247,
        verifiedToday: 89,
        pendingVerifications: 23,
        alerts: 3,
    }

    const handleVerifyMedication = () => {
        alert("Opening medication verification scanner...")
    }

    const handleViewAnalytics = () => {
        setActiveTab("reports")
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Hospital Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome to Lagos University Teaching Hospital</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
                        <Building2 className="h-4 w-4 mr-2" />
                        Hospital
                    </Badge>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Medications</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.totalMedications.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-accent font-medium">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Verified Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.verifiedToday}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-primary font-medium">+5</span> more than yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</div>
                        <p className="text-xs text-muted-foreground">Awaiting verification</p>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.alerts}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-destructive font-medium">+1</span> this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                        <CardDescription>Common hospital tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" onClick={handleVerifyMedication}>
                            <QrCode className="h-4 w-4 mr-2" />
                            Verify Medication
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={() => setActiveTab("inventory")}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Check Inventory
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={handleViewAnalytics}
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Analytics
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default HospitalMain;