"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    AlertTriangle, 
    Clock, 
    Activity, 
    Bell, 
    Shield, 
    FileX, 
    TrendingUp,
    CheckCircle,
    XCircle,
    Eye,
    RefreshCw,
    Calendar,
    MapPin,
    User
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AlertDetails {
    batchId?: string;
    drugName?: string;
    manufacturer?: string;
    description?: string;
    scanCount?: number;
    fromOrg?: string;
    toOrg?: string;
    notes?: string;
    companyName?: string;
    organizationType?: string;
    lastUpdated?: string;
}

interface Alert {
    id: string;
    type: 'counterfeit_report' | 'suspicious_pattern' | 'failed_transfer' | 'license_expiring';
    message: string;
    severity: 'critical' | 'high' | 'warning' | 'info';
    time: string;
    location: string;
    reporter: string;
    details: AlertDetails;
}

const RegulatorAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

    useEffect(() => {
        fetchAlerts()
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchAlerts = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/regulator/alerts')
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            setAlerts(data.alerts || [])
            setLastRefresh(new Date())
            
        } catch (error) {
            console.error('Error fetching alerts:', error)
            setError('Failed to load alerts. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleInvestigate = async (alertId: string, alertType: string) => {
        // Here you could navigate to specific investigation pages
        // or mark alerts as investigated
        console.log(`Investigating alert ${alertId} of type ${alertType}`)
        // For now, just show an alert
        alert(`Starting investigation for alert ${alertId}`)
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="h-4 w-4 text-red-600" />
            case 'high':
                return <XCircle className="h-4 w-4 text-orange-600" />
            case 'warning':
                return <Clock className="h-4 w-4 text-yellow-600" />
            case 'info':
                return <Activity className="h-4 w-4 text-blue-600" />
            default:
                return <Bell className="h-4 w-4 text-gray-600" />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
            case 'high':
                return 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
            case 'info':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
            default:
                return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'counterfeit_report':
                return <Shield className="h-4 w-4" />
            case 'suspicious_pattern':
                return <TrendingUp className="h-4 w-4" />
            case 'failed_transfer':
                return <FileX className="h-4 w-4" />
            case 'license_expiring':
                return <Calendar className="h-4 w-4" />
            default:
                return <Bell className="h-4 w-4" />
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'counterfeit_report':
                return <Badge variant="destructive" className="text-xs">Counterfeit</Badge>
            case 'suspicious_pattern':
                return <Badge variant="secondary" className="text-xs">Suspicious</Badge>
            case 'failed_transfer':
                return <Badge variant="outline" className="text-xs">Transfer</Badge>
            case 'license_expiring':
                return <Badge variant="default" className="text-xs">License</Badge>
            default:
                return <Badge variant="outline" className="text-xs">Alert</Badge>
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Alerts & Notifications</h1>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading alerts...</span>
                </div>
            </div>
        )
    }

    const criticalAlerts = alerts.filter(a => a.severity === 'critical')
    const highAlerts = alerts.filter(a => a.severity === 'high')
    const warningAlerts = alerts.filter(a => a.severity === 'warning')
    const infoAlerts = alerts.filter(a => a.severity === 'info')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Alerts & Notifications</h1>
                {/* Hide ThemeToggle on mobile, show on desktop */}
                <div className="hidden sm:block">
                    <ThemeToggle />
                </div>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{error}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={fetchAlerts}
                                className="ml-auto"
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Alert Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                                <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                                <p className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Info</p>
                                <p className="text-2xl font-bold text-blue-600">{infoAlerts.length}</p>
                            </div>
                            <Activity className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Refresh Controls */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchAlerts}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                            <AlertTriangle className="h-5 w-5" />
                            Critical Alerts ({criticalAlerts.length})
                        </CardTitle>
                        <CardDescription className="text-red-700 dark:text-red-300">
                            Immediate attention required
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {criticalAlerts.map((alert) => (
                                <div key={alert.id} className="p-4 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(alert.type)}
                                            {getTypeBadge(alert.type)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {alert.time}
                                        </div>
                                    </div>
                                    <p className="font-medium text-foreground mb-2">{alert.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {alert.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {alert.reporter}
                                        </div>
                                    </div>
                                    {alert.details && (
                                        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800 p-2 rounded mb-3">
                                            {alert.details.batchId && (
                                                <div>Batch ID: {alert.details.batchId}</div>
                                            )}
                                            {alert.details.drugName && (
                                                <div>Drug: {alert.details.drugName}</div>
                                            )}
                                            {alert.details.manufacturer && (
                                                <div>Manufacturer: {alert.details.manufacturer}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleInvestigate(alert.id, alert.type)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Investigate Now
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* High Priority Alerts */}
            {highAlerts.length > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                            <XCircle className="h-5 w-5" />
                            High Priority Alerts ({highAlerts.length})
                        </CardTitle>
                        <CardDescription className="text-orange-700 dark:text-orange-300">
                            Requires prompt review
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {highAlerts.map((alert) => (
                                <div key={alert.id} className="p-4 bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(alert.type)}
                                            {getTypeBadge(alert.type)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {alert.time}
                                        </div>
                                    </div>
                                    <p className="font-medium text-foreground mb-2">{alert.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {alert.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {alert.reporter}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleInvestigate(alert.id, alert.type)}
                                            className="text-orange-600 hover:bg-orange-50"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Review
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            Mark as Reviewed
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Warning Alerts */}
            {warningAlerts.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <Clock className="h-5 w-5" />
                            Warning Alerts ({warningAlerts.length})
                        </CardTitle>
                        <CardDescription className="text-yellow-700 dark:text-yellow-300">
                            Monitor and review when possible
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {warningAlerts.map((alert) => (
                                <div key={alert.id} className="p-3 bg-white dark:bg-gray-900 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(alert.type)}
                                            {getTypeBadge(alert.type)}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                                    </div>
                                    <p className="font-medium text-foreground text-sm mb-2">{alert.message}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-muted-foreground">
                                            {alert.location} • {alert.reporter}
                                        </div>
                                        <Button size="sm" variant="outline" className="text-xs">
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Information Alerts */}
            {infoAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Information Alerts ({infoAlerts.length})
                        </CardTitle>
                        <CardDescription>
                            General notifications and system updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {infoAlerts.map((alert) => (
                                <div key={alert.id} className="p-3 border rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(alert.type)}
                                            {getTypeBadge(alert.type)}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                                    </div>
                                    <p className="font-medium text-foreground text-sm mb-1">{alert.message}</p>
                                    <div className="text-xs text-muted-foreground">
                                        {alert.location} • {alert.reporter}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {alerts.length === 0 && !loading && (
                <Card>
                    <CardContent className="pt-12 pb-12">
                        <div className="text-center">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">All Clear!</h3>
                            <p className="text-muted-foreground">
                                No active alerts or notifications at this time.
                            </p>
                            <Button 
                                variant="outline" 
                                className="mt-4" 
                                onClick={fetchAlerts}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Check Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default RegulatorAlerts;