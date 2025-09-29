import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading"
import { AlertTriangle, Clock, Activity, Package, X, Eye, EyeOff, Filter, RefreshCw, TrendingUp, Shield, Bell, Calendar } from "lucide-react"
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
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
    const [showDismissed, setShowDismissed] = useState(false);
    const [filterType, setFilterType] = useState<string>("ALL");

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

    const handleDismissAlert = (alertId: string, alertType: string) => {
        setDismissedAlerts(prev => new Set([...prev, alertId]));
        toast.success(`${alertType} alert dismissed`);
    };

    const handleRefreshAlerts = async () => {
        setLoading(true);
        try {
            const alertsResponse = await fetch(`/api/hospital/alerts?orgId=${orgId}`);
            if (alertsResponse.ok) {
                const data = await alertsResponse.json();
                setAlertsData(data);
                toast.success('Alerts refreshed');
            }
        } catch (error) {
            console.error('Error refreshing alerts:', error);
            toast.error('Failed to refresh alerts');
        } finally {
            setLoading(false);
        }
    };

    const getVisibleAlerts = (alerts: any[], type: string) => {
        if (!alerts) return [];
        
        const filtered = showDismissed 
            ? alerts 
            : alerts.filter(alert => !dismissedAlerts.has(alert.id));
        
        if (filterType === "ALL") return filtered;
        return filtered.filter(alert => alert.type === filterType || alert.severity === filterType);
    };

    const getAlertStatistics = () => {
        if (!alertsData) return { total: 0, critical: 0, expiring: 0, dismissed: 0, active: 0, suspicious: 0 };

        const allAlerts = [
            ...(alertsData.criticalAlerts || []),
            ...(alertsData.expiryWarnings?.urgent || []),
            ...(alertsData.expiryWarnings?.warning || []),
            ...(alertsData.suspiciousActivity || [])
        ];

        return {
            total: allAlerts.length,
            critical: (alertsData.criticalAlerts?.length || 0) + (alertsData.expiryWarnings?.urgent?.length || 0),
            expiring: (alertsData.expiryWarnings?.urgent?.length || 0) + (alertsData.expiryWarnings?.warning?.length || 0),
            dismissed: dismissedAlerts.size,
            active: allAlerts.filter(alert => !dismissedAlerts.has(alert.id)).length,
            suspicious: alertsData.suspiciousActivity?.length || 0
        };
    };

    const stats = getAlertStatistics();

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
            <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Alerts & Notifications</h1>
                <div className="flex items-center justify-center p-6 sm:p-8">
                    <LoadingSpinner size="large" text="Loading alerts..." />
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-montserrat font-bold text-2xl sm:text-3xl text-foreground">Alerts & Notifications</h1>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">Monitor critical alerts and system notifications</p>
                </div>
                
                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshAlerts}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filter Bar (commented out, not needed for now) */}
            {/**
            <Card className="shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Filter:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['ALL', 'critical', 'high', 'medium', 'low', 'expiry_urgent', 'expiry_warning'].map((filter) => (
                                <Button
                                    key={filter}
                                    variant={filterType === filter ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFilterType(filter)}
                                    className="text-xs h-8"
                                >
                                    {filter === 'ALL' ? 'All' : 
                                     filter === 'expiry_urgent' ? 'Urgent Expiry' :
                                     filter === 'expiry_warning' ? 'Expiry Warning' :
                                     filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </Button>
                            ))}
                        </div>
                        {(dismissedAlerts.size > 0 || filterType !== 'ALL') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setDismissedAlerts(new Set());
                                    setFilterType('ALL');
                                    setShowDismissed(false);
                                }}
                                className="text-xs"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
            */}

            {/* Alert Statistics Dashboard */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <Card className="shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Alerts</p>
                                <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                            </div>
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-2 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Critical</p>
                                <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.critical}</div>
                            </div>
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-2 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Expiring</p>
                                <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.expiring}</div>
                            </div>
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-2 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Suspicious</p>
                                <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.suspicious}</div>
                            </div>
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-2 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active</p>
                                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</div>
                            </div>
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-2 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Dismissed</p>
                                <div className="text-xl sm:text-2xl font-bold text-gray-600">{stats.dismissed}</div>
                            </div>
                            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Insights */}
            {stats.total > 0 && (
                <Card className="shadow-sm bg-muted/30">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm sm:text-base">Alert Summary</h4>
                                <p className="text-sm text-muted-foreground">
                                    {stats.critical > 0 ? (
                                        <span className="text-red-600 font-medium">
                                            {stats.critical} critical alert{stats.critical !== 1 ? 's' : ''} require immediate attention
                                        </span>
                                    ) : stats.expiring > 0 ? (
                                        <span className="text-orange-600 font-medium">
                                            {stats.expiring} medication{stats.expiring !== 1 ? 's are' : ' is'} expiring soon
                                        </span>
                                    ) : stats.suspicious > 0 ? (
                                        <span className="text-yellow-600 font-medium">
                                            {stats.suspicious} suspicious activit{stats.suspicious !== 1 ? 'ies' : 'y'} detected
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-medium">
                                            All systems operating normally - no critical issues detected
                                        </span>
                                    )}
                                    {stats.dismissed > 0 && (
                                        <span className="ml-2 text-muted-foreground">
                                            • {stats.dismissed} alert{stats.dismissed !== 1 ? 's' : ''} dismissed
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {/* Critical Alerts */}
                {alertsData?.criticalAlerts && getVisibleAlerts(alertsData.criticalAlerts, 'critical').length > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200 text-lg sm:text-xl">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Critical Alerts</span>
                                <Badge variant="destructive" className="ml-auto text-xs">
                                    {getVisibleAlerts(alertsData.criticalAlerts, 'critical').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {getVisibleAlerts(alertsData.criticalAlerts, 'critical').map((alert) => (
                                <Card key={alert.id} className={`bg-white dark:bg-card border-0 shadow-sm ${dismissedAlerts.has(alert.id) ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                                <Badge variant="destructive" className="text-xs">
                                                    {alert.severity.toLowerCase()}
                                                </Badge>
                                                {dismissedAlerts.has(alert.id) && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Dismissed
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{alert.timeAgo}</span>
                                                {!dismissedAlerts.has(alert.id) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDismissAlert(alert.id, 'Critical')}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm sm:text-base leading-tight">{alert.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{alert.description}</p>
                                            {alert.batchId && (
                                                <div className="bg-muted/30 rounded-lg p-2 mt-3">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Batch ID</span>
                                                    <p className="font-mono text-sm font-semibold">{alert.batchId}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Expiry Warnings */}
                {(alertsData && alertsData.expiryWarnings && 
                  (getVisibleAlerts(alertsData.expiryWarnings.urgent || [], 'expiry').length > 0 || 
                   getVisibleAlerts(alertsData.expiryWarnings.warning || [], 'expiry').length > 0)) && (
                    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200 text-lg sm:text-xl">
                                <Clock className="h-5 w-5" />
                                <span>Expiry Warnings</span>
                                <Badge variant="outline" className="ml-auto text-xs border-orange-300">
                                    {getVisibleAlerts(alertsData.expiryWarnings.urgent || [], 'expiry').length + 
                                     getVisibleAlerts(alertsData.expiryWarnings.warning || [], 'expiry').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Urgent Expiry Warnings */}
                            {getVisibleAlerts(alertsData?.expiryWarnings.urgent || [], 'expiry_urgent').map((alert) => (
                                <Card key={alert.id} className={`bg-white dark:bg-card border-2 border-red-200 dark:border-red-800 shadow-sm ${dismissedAlerts.has(alert.id) ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                                <Badge variant="destructive" className="text-xs">
                                                    Urgent
                                                </Badge>
                                                {dismissedAlerts.has(alert.id) && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Dismissed
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                                    {alert.daysUntilExpiry} day{alert.daysUntilExpiry !== 1 ? 's' : ''}
                                                </Badge>
                                                {!dismissedAlerts.has(alert.id) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDismissAlert(alert.id, 'Urgent Expiry')}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm sm:text-base text-red-800 dark:text-red-200 leading-tight">
                                                {alert.title}
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{alert.description}</p>
                                            <div className="bg-red-50 dark:bg-red-950/40 rounded-lg p-3 mt-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wide">Expires</span>
                                                    <span className="text-sm font-semibold text-red-800 dark:text-red-200">
                                                        {new Date(alert.expiryDate).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Warning Expiry Alerts */}
                            {getVisibleAlerts(alertsData?.expiryWarnings.warning || [], 'expiry_warning').map((alert) => (
                                <Card key={alert.id} className={`bg-white dark:bg-card border-2 border-orange-200 dark:border-orange-800 shadow-sm ${dismissedAlerts.has(alert.id) ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                                    Warning
                                                </Badge>
                                                {dismissedAlerts.has(alert.id) && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Dismissed
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                                    {alert.daysUntilExpiry} day{alert.daysUntilExpiry !== 1 ? 's' : ''}
                                                </Badge>
                                                {!dismissedAlerts.has(alert.id) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDismissAlert(alert.id, 'Expiry Warning')}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-orange-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm sm:text-base text-orange-800 dark:text-orange-200 leading-tight">
                                                {alert.title}
                                            </h4>
                                            <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">{alert.description}</p>
                                            <div className="bg-orange-50 dark:bg-orange-950/40 rounded-lg p-3 mt-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">Expires</span>
                                                    <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                                                        {new Date(alert.expiryDate).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric', 
                                                            year: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Action Button */}
                            {(alertsData && alertsData.expiryWarnings && 
                              ((alertsData.expiryWarnings.urgent && alertsData.expiryWarnings.urgent.length > 0) || 
                               (alertsData.expiryWarnings.warning && alertsData.expiryWarnings.warning.length > 0))) && (
                                <div className="pt-3 border-t border-border/40">
                                    <Button size="sm" className="w-full sm:w-auto">
                                        <Package className="h-4 w-4 mr-2" />
                                        View Inventory Details
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Suspicious Activity */}
                {alertsData?.suspiciousActivity && getVisibleAlerts(alertsData.suspiciousActivity, 'suspicious').length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-lg sm:text-xl">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Suspicious Activity</span>
                                <Badge variant="outline" className="ml-auto text-xs border-yellow-300">
                                    {getVisibleAlerts(alertsData.suspiciousActivity, 'suspicious').length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {getVisibleAlerts(alertsData.suspiciousActivity, 'suspicious').map((activity) => (
                                <Card key={activity.id} className={`bg-white dark:bg-card border-0 shadow-sm ${dismissedAlerts.has(activity.id) ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                                <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                                                    Suspicious
                                                </Badge>
                                                {dismissedAlerts.has(activity.id) && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Dismissed
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                                                {!dismissedAlerts.has(activity.id) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDismissAlert(activity.id, 'Suspicious Activity')}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-yellow-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm sm:text-base text-yellow-800 dark:text-yellow-200 leading-tight">
                                                {activity.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                                            {activity.location && (
                                                <div className="bg-yellow-50 dark:bg-yellow-950/40 rounded-lg p-3 mt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">Location</span>
                                                        <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">{activity.location}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* System Notifications */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Activity className="h-5 w-5" />
                            <span>System Notifications</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {alertsData?.systemNotifications && alertsData.systemNotifications.length > 0 ? (
                            alertsData.systemNotifications.map((notification) => (
                                <Card key={notification.id} className="bg-muted/30 border-0 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Activity className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                                <Badge variant="outline" className="text-xs">
                                                    {notification.status.toLowerCase()}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{notification.timeAgo}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm sm:text-base leading-tight">{notification.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{notification.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="bg-muted/30 border-0 shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <Activity className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm sm:text-base leading-tight">System maintenance scheduled</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">Tonight at 2:00 AM - 4:00 AM</p>
                                            <span className="text-xs text-muted-foreground">1 day ago</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* No Alerts Message */}
                {(!alertsData?.criticalAlerts || alertsData.criticalAlerts.length === 0) &&
                 (!alertsData?.expiryWarnings?.urgent || alertsData.expiryWarnings.urgent.length === 0) &&
                 (!alertsData?.expiryWarnings?.warning || alertsData.expiryWarnings.warning.length === 0) &&
                 (!alertsData?.suspiciousActivity || alertsData.suspiciousActivity.length === 0) && (
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 shadow-sm">
                        <CardContent className="p-6 sm:p-8 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                                    <Activity className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-200 mb-2">All Clear!</h3>
                            <p className="text-sm sm:text-base text-green-600 dark:text-green-300 leading-relaxed">
                                No active alerts or warnings at this time. Your system is running smoothly.
                                {stats.dismissed > 0 && (
                                    <span className="block mt-2 text-xs text-green-500">
                                        {stats.dismissed} alert{stats.dismissed !== 1 ? 's have' : ' has'} been dismissed
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default HospitalAlerts;