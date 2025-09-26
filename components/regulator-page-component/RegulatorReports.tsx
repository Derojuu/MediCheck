"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    FileText, 
    CheckCircle, 
    XCircle, 
    Users, 
    Download, 
    AlertTriangle, 
    TrendingUp, 
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Shield
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AnalyticsData {
    scansByOrgType: Array<{ region: string; _count: { id: number } }>;
    counterfeitBySeverity: Array<{ severity: string; _count: { id: number } }>;
    organizationStats: Array<{ organizationType: string; isVerified: boolean; _count: { id: number } }>;
    transferStats: Array<{ status: string; _count: { id: number } }>;
    batchStats: Array<{ status: string; _count: { id: number } }>;
    scansByRegion: Array<{ region: string; _count: { id: number } }>;
    summary: {
        totalOrganizations: number;
        verifiedOrganizations: number;
        totalBatches: number;
        totalScans: number;
        totalInvestigations: number;
        activeInvestigations: number;
        resolvedInvestigations: number;
    };
}

interface ReportData {
    reportType: string;
    generatedAt: string;
    data: any;
}

const RegulatorReports = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [generatingReport, setGeneratingReport] = useState<string | null>(null)
    const [selectedReportType, setSelectedReportType] = useState<string>("summary")

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/regulator/analytics')
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            setAnalytics(data.analytics)
            
        } catch (error) {
            console.error('Error fetching analytics:', error)
            setError('Failed to load analytics data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const generateReport = async (reportType: string) => {
        try {
            setGeneratingReport(reportType)
            const response = await fetch(`/api/regulator/reports?type=${reportType}`)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const reportData: ReportData = await response.json()
            
            // Create and download the report as JSON for now
            // In a real implementation, you'd generate PDF/Excel files
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
                type: 'application/json' 
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
        } catch (error) {
            console.error('Error generating report:', error)
            setError(`Failed to generate ${reportType} report. Please try again.`)
        } finally {
            setGeneratingReport(null)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'resolved':
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            case 'pending':
            case 'investigating':
            case 'in_transit':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            case 'failed':
            case 'dismissed':
            case 'flagged':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Loading analytics data...</span>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
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
                                onClick={fetchAnalytics}
                                className="ml-auto"
                            >
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Statistics */}
            {analytics && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.summary.totalOrganizations}</div>
                                <p className="text-xs text-muted-foreground">
                                    {analytics.summary.verifiedOrganizations} verified ({Math.round((analytics.summary.verifiedOrganizations / analytics.summary.totalOrganizations) * 100)}%)
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Investigations</CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{analytics.summary.activeInvestigations}</div>
                                <p className="text-xs text-muted-foreground">
                                    {analytics.summary.resolvedInvestigations} resolved this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{analytics.summary.totalScans}</div>
                                <p className="text-xs text-muted-foreground">
                                    This month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Medication Batches</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{analytics.summary.totalBatches}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total registered
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Analytics Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Organization Types Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Organization Distribution
                                </CardTitle>
                                <CardDescription>Breakdown by organization type and verification status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.organizationStats.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge 
                                                    variant={stat.isVerified ? "default" : "outline"}
                                                    className="text-xs"
                                                >
                                                    {stat.organizationType.replace('_', ' ')}
                                                </Badge>
                                                {stat.isVerified ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-semibold">{stat._count.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transfer Status Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Transfer Status
                                </CardTitle>
                                <CardDescription>Ownership transfer compliance overview</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.transferStats.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <Badge className={`${getStatusColor(stat.status)} text-xs`}>
                                                {stat.status}
                                            </Badge>
                                            <span className="font-semibold">{stat._count.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Counterfeit Reports by Severity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Counterfeit Reports
                                </CardTitle>
                                <CardDescription>Reports categorized by severity level</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.counterfeitBySeverity.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <Badge 
                                                variant={stat.severity === 'CRITICAL' ? 'destructive' : 
                                                        stat.severity === 'HIGH' ? 'secondary' : 'outline'}
                                                className="text-xs"
                                            >
                                                {stat.severity}
                                            </Badge>
                                            <span className="font-semibold">{stat._count.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Regional Scan Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Scan Distribution
                                </CardTitle>
                                <CardDescription>Scans by region this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.scansByRegion.slice(0, 5).map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{stat.region || 'Unknown'}</span>
                                            <span className="font-semibold">{stat._count.id}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
            {/* Report Generation Section */}
            <Card>
                <CardHeader>
                    {/* Make header stack on mobile, row on desktop */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Generate Reports
                            </CardTitle>
                            <CardDescription>
                                Download detailed regulatory reports in various formats
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Use grid for proper wrapping and prevent overflow */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3 min-w-0">
                            <h4 className="font-medium text-sm text-muted-foreground">COMPLIANCE REPORTS</h4>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 break-words whitespace-normal"
                                onClick={() => generateReport("compliance")}
                                disabled={generatingReport === "compliance"}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {generatingReport === "compliance" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mt-1"></div>
                                    ) : (
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                    )}
                                    <div className="text-left w-full min-w-0">
                                        <div className="font-medium break-words">Compliance Report</div>
                                        <div className="text-xs text-muted-foreground break-words">
                                            Ownership transfers, compliance rates, and regulatory approvals
                                        </div>
                                    </div>
                                </div>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 break-words whitespace-normal"
                                onClick={() => generateReport("investigations")}
                                disabled={generatingReport === "investigations"}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {generatingReport === "investigations" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mt-1"></div>
                                    ) : (
                                        <FileText className="h-4 w-4 text-blue-600 mt-1" />
                                    )}
                                    <div className="text-left w-full min-w-0">
                                        <div className="font-medium break-words">Investigation Report</div>
                                        <div className="text-xs text-muted-foreground break-words">
                                            Active cases, counterfeit reports, and investigation outcomes
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </div>

                        <div className="space-y-3 min-w-0">
                            <h4 className="font-medium text-sm text-muted-foreground">ENTITY REPORTS</h4>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 break-words whitespace-normal"
                                onClick={() => generateReport("entities")}
                                disabled={generatingReport === "entities"}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {generatingReport === "entities" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mt-1"></div>
                                    ) : (
                                        <Users className="h-4 w-4 text-purple-600 mt-1" />
                                    )}
                                    <div className="text-left w-full min-w-0">
                                        <div className="font-medium break-words">Entity Report</div>
                                        <div className="text-xs text-muted-foreground break-words">
                                            Organization registry, verification status, and activities
                                        </div>
                                    </div>
                                </div>
                            </Button>

                            <Button 
                                variant="outline" 
                                className="w-full justify-start h-auto p-4 break-words whitespace-normal"
                                onClick={() => generateReport("violations")}
                                disabled={generatingReport === "violations"}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {generatingReport === "violations" ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mt-1"></div>
                                    ) : (
                                        <AlertTriangle className="h-4 w-4 text-red-600 mt-1" />
                                    )}
                                    <div className="text-left w-full min-w-0">
                                        <div className="font-medium break-words">Violation Report</div>
                                        <div className="text-xs text-muted-foreground break-words">
                                            High-severity incidents, violations, and enforcement actions
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        {/* Stack summary section on mobile */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h4 className="font-medium text-sm">Summary Report</h4>
                                <p className="text-xs text-muted-foreground">
                                    Comprehensive overview of all regulatory activities
                                </p>
                            </div>
                            <Button 
                                onClick={() => generateReport("summary")}
                                disabled={generatingReport === "summary"}
                                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                            >
                                {generatingReport === "summary" ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Generate Summary
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Summary */}
            {analytics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent Activity Summary
                        </CardTitle>
                        <CardDescription>Key metrics and recent regulatory activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">INVESTIGATIONS</h4>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Active Cases</span>
                                        <span className="font-medium text-orange-600">{analytics.summary.activeInvestigations}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Resolved</span>
                                        <span className="font-medium text-green-600">{analytics.summary.resolvedInvestigations}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total Cases</span>
                                        <span className="font-medium">{analytics.summary.totalInvestigations}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">ORGANIZATIONS</h4>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Registered</span>
                                        <span className="font-medium">{analytics.summary.totalOrganizations}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Verified</span>
                                        <span className="font-medium text-green-600">{analytics.summary.verifiedOrganizations}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Verification Rate</span>
                                        <span className="font-medium">
                                            {Math.round((analytics.summary.verifiedOrganizations / analytics.summary.totalOrganizations) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground">SUPPLY CHAIN</h4>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Medication Batches</span>
                                        <span className="font-medium">{analytics.summary.totalBatches}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Monthly Scans</span>
                                        <span className="font-medium text-blue-600">{analytics.summary.totalScans}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Scan Activity</span>
                                        <span className="font-medium text-green-600">
                                            {analytics.summary.totalScans > 0 ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}



export default RegulatorReports;