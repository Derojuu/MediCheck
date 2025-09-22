import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner, LoadingTable } from "@/components/ui/loading"
import {
    Factory,
    Package,
    QrCode,
    Building2,
    Truck,
    FlaskConical,
    Activity,
} from "lucide-react";
import { ManufacturerTab } from "@/utils";

interface RecentActivity {
    id: string;
    type: 'batch' | 'transfer';
    batchId?: string;
    productName: string;
    fromEntity?: string;
    toEntity?: string;
    status: string;
    createdAt: string;
}

const ManufacturerMain = ({ setActiveTab, orgId }: { 
    setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>>;
    orgId: string;
}) => {

    const [stats, setStats] = useState({
        totalBatches: 0,
        activeBatches: 0,
        pendingQuality: 0,
        recentTransfers: 0,
    });

    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(true);

    // Fetch recent activity data from database
    const fetchRecentActivity = async () => {
        try {
            setLoadingActivity(true);
            const response = await fetch(`/api/dashboard/recent-activity?orgId=${orgId}`);
            if (response.ok) {
                const data = await response.json();
                setRecentActivity(data);
            }
        } catch (error) {
            console.error('Error fetching recent activity:', error);
        } finally {
            setLoadingActivity(false);
        }
    };

    // Fetch dashboard stats from database
    const fetchStats = async () => {
        try {
            const response = await fetch(`/api/dashboard/stats?orgId=${orgId}`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        if (orgId) {
            fetchRecentActivity();
            fetchStats();
        }
    }, [orgId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500';
            case 'completed':
            case 'manufactured':
                return 'bg-green-500';
            case 'in_transit':
                return 'bg-blue-500';
            case 'delivered':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Loading animation component
    const ActivitySkeleton = () => (
        <LoadingTable rows={5} columns={3} />
    );

    // Empty state component with animation
    const EmptyActivity = () => (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-4">
                <Activity 
                    className="w-16 h-16 text-gray-300 animate-pulse" 
                    strokeWidth={1.5}
                />
                <div className="absolute inset-0 w-16 h-16 border-2 border-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Recent Activity</h3>
            <p className="text-sm text-gray-500 mb-4">
                When you create batches or initiate transfers, they'll appear here
            </p>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("products")}
                >
                    Create Product
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("batches")}
                >
                    Create Batch
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-bold text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Manufacturer Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Welcome to PharmaTech Industries Manufacturing Portal</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 text-sm font-medium">
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
                        <Button 
                            variant="gradient"
                            className="w-full justify-start shadow-lg hover:shadow-xl" 
                            onClick={() => setActiveTab("batches")}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Create New Batch
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" 
                            onClick={() => setActiveTab("quality")}
                        >
                            <FlaskConical className="h-4 w-4 mr-2" />
                            Quality Control
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" 
                            onClick={() => setActiveTab("transfers")}
                        >
                            <Truck className="h-4 w-4 mr-2" />
                            Transfer Management
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full justify-start hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60" 
                            onClick={() => setActiveTab("qr-generator")}
                        >
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Codes
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-effect border-2 border-primary/20 shadow-xl backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Latest batch and transfer activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingActivity ? (
                            <ActivitySkeleton />
                        ) : recentActivity.length === 0 ? (
                            <EmptyActivity />
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.slice(0, 4).map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-200">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                            {activity.type === 'batch' ? (
                                                <Package className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Truck className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {activity.type === 'batch' 
                                                    ? `Batch - ${activity.productName}`
                                                    : `Transfer: ${activity.productName}`
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.type === 'transfer' && activity.toEntity
                                                    ? `To ${activity.toEntity}`
                                                    : formatDate(activity.createdAt)
                                                }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge 
                                                variant={activity.status === "completed" ? "default" : "secondary"} 
                                                className={`${getStatusColor(activity.status)} text-white border-primary/20`}
                                            >
                                                {activity.status.replace('_', ' ')}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ManufacturerMain;