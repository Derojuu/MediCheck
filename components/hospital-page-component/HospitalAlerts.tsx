import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading"
import { AlertTriangle, Clock, Activity, Package } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface CriticalAlert {
    id: string;
    type: string;
    title: string;
    description: string;
    severity: string;
    timeAgo: string;
    batchId?: string;
}

interface ExpiryAlert {
    id: string;
    type: string;
    title: string;
    description: string;
    expiryDate: string;
    daysUntilExpiry: number;
}

interface SystemNotification {
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    timeAgo: string;
}

interface SuspiciousActivity {
    id: string;
    type: string;
    title: string;
    description: string;
    location?: string;
    timeAgo: string;
}

interface AlertsData {
    criticalAlerts: CriticalAlert[];
    expiryWarnings: {
        urgent: ExpiryAlert[];
        warning: ExpiryAlert[];
    };
    systemNotifications: SystemNotification[];
    suspiciousActivity: SuspiciousActivity[];
}

const HospitalAlerts = () => {
    const [alertsData, setAlertsData] = useState<AlertsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [orgId, setOrgId] = useState("");

    useEffect(() => {
        const fetchAlertsData = async () => {
            try {
                // Get organization ID
                const orgResponse = await fetch("/api/organizations/me");
                if (orgResponse.ok) {
                    const orgResult = await orgResponse.json();
                    const organizationId = orgResult.organizationId;
                    setOrgId(organizationId);

                    // Fetch alerts data
                    const alertsResponse = await fetch(`/api/hospital/alerts?orgId=${organizationId}`);
                    if (alertsResponse.ok) {
                        const data = await alertsResponse.json();
                        setAlertsData(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching alerts data:', error);
                toast.error('Failed to load alerts data');
            } finally {
                setLoading(false);
            }
        };

        fetchAlertsData();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'bg-red-600 border-red-200';
            case 'high': return 'bg-red-500 border-red-200';
            case 'medium': return 'bg-orange-500 border-orange-200';
            case 'low': return 'bg-yellow-500 border-yellow-200';
            default: return 'bg-gray-500 border-gray-200';
        }
    };

    const getUrgencyColor = (days: number) => {
        if (days <= 10) return 'border-red-200 bg-red-50';
        if (days <= 30) return 'border-orange-200 bg-orange-50';
        return 'border-gray-200 bg-gray-50';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Alerts & Notifications</h1>
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner size="large" text="Loading alerts..." />
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Alerts & Notifications</h1>

            <div className="space-y-4">
                {/* Critical Alerts */}
                {alertsData?.criticalAlerts && alertsData.criticalAlerts.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-800">
                                <AlertTriangle className="h-5 w-5" />
                                Critical Alerts ({alertsData.criticalAlerts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alertsData.criticalAlerts.map((alert) => (
                                    <div key={alert.id} className="p-3 bg-white border rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">{alert.title}</p>
                                                <p className="text-sm text-muted-foreground">{alert.description}</p>
                                            </div>
                                            <Badge variant="destructive" className="ml-2">
                                                {alert.severity.toLowerCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-red-600 mt-2">{alert.timeAgo}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Expiry Warnings */}
                {(alertsData && alertsData.expiryWarnings && 
                  ((alertsData.expiryWarnings.urgent && alertsData.expiryWarnings.urgent.length > 0) || 
                   (alertsData.expiryWarnings.warning && alertsData.expiryWarnings.warning.length > 0))) && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-800">
                                <Clock className="h-5 w-5" />
                                Expiry Warnings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alertsData?.expiryWarnings.urgent.map((alert) => (
                                    <div key={alert.id} className={`p-3 border rounded-lg ${getUrgencyColor(alert.daysUntilExpiry)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-red-800">🚨 {alert.title}</p>
                                                <p className="text-sm text-red-700">{alert.description}</p>
                                                <p className="text-xs text-red-600 mt-1">
                                                    Expires in {alert.daysUntilExpiry} day{alert.daysUntilExpiry !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {alertsData?.expiryWarnings.warning.map((alert) => (
                                    <div key={alert.id} className={`p-3 border rounded-lg ${getUrgencyColor(alert.daysUntilExpiry)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-orange-800">⚠️ {alert.title}</p>
                                                <p className="text-sm text-orange-700">{alert.description}</p>
                                                <p className="text-xs text-orange-600 mt-1">
                                                    Expires in {alert.daysUntilExpiry} day{alert.daysUntilExpiry !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(alertsData && alertsData.expiryWarnings && 
                                  ((alertsData.expiryWarnings.urgent && alertsData.expiryWarnings.urgent.length > 0) || 
                                   (alertsData.expiryWarnings.warning && alertsData.expiryWarnings.warning.length > 0))) && (
                                    <Button size="sm" className="mt-3">
                                        <Package className="h-4 w-4 mr-2" />
                                        View Inventory Details
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Suspicious Activity */}
                {alertsData?.suspiciousActivity && alertsData.suspiciousActivity.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-800">
                                <AlertTriangle className="h-5 w-5" />
                                Suspicious Activity ({alertsData.suspiciousActivity.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alertsData.suspiciousActivity.map((activity) => (
                                    <div key={activity.id} className="p-3 bg-white border rounded-lg">
                                        <p className="font-medium text-yellow-800">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        {activity.location && (
                                            <p className="text-xs text-muted-foreground">Location: {activity.location}</p>
                                        )}
                                        <p className="text-xs text-yellow-600 mt-1">{activity.timeAgo}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* System Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {alertsData?.systemNotifications && alertsData.systemNotifications.length > 0 ? (
                                alertsData.systemNotifications.map((notification) => (
                                    <div key={notification.id} className="p-3 border rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">{notification.title}</p>
                                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                            </div>
                                            <Badge variant="outline" className="ml-2">
                                                {notification.status.toLowerCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{notification.timeAgo}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 border rounded-lg">
                                    <p className="font-medium">System maintenance scheduled</p>
                                    <p className="text-sm text-muted-foreground">Tonight at 2:00 AM - 4:00 AM</p>
                                    <p className="text-xs text-muted-foreground">1 day ago</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* No Alerts Message */}
                {(!alertsData?.criticalAlerts || alertsData.criticalAlerts.length === 0) &&
                 (!alertsData?.expiryWarnings?.urgent || alertsData.expiryWarnings.urgent.length === 0) &&
                 (!alertsData?.expiryWarnings?.warning || alertsData.expiryWarnings.warning.length === 0) &&
                 (!alertsData?.suspiciousActivity || alertsData.suspiciousActivity.length === 0) && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 mb-1">All Clear!</h3>
                            <p className="text-green-600">No active alerts or warnings at this time.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default HospitalAlerts;