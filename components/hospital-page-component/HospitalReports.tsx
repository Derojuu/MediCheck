import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertTriangle, TrendingUp, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

interface MonthlyStats {
    month: string;
    verifications: number;
    suspiciousScans: number;
}

interface CounterfeitReport {
    id: string;
    batchId: string;
    drugName: string;
    reportType: string;
    severity: string;
    status: string;
    description: string;
    createdAt: string;
}

interface ReportsData {
    monthlyStats: MonthlyStats[];
    growthPercentage: number;
    recentReports: CounterfeitReport[];
}

const HospitalReports = () => {
    const [reportMessage, setReportMessage] = useState("");
    const [reportType, setReportType] = useState("");
    const [severity, setSeverity] = useState("");
    const [reportsData, setReportsData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [orgId, setOrgId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get organization ID
                const orgResponse = await fetch("/api/organizations/me");
                if (orgResponse.ok) {
                    const orgResult = await orgResponse.json();
                    const organizationId = orgResult.organizationId;
                    setOrgId(organizationId);

                    // Fetch reports data
                    const reportsResponse = await fetch(`/api/hospital/reports?orgId=${organizationId}`);
                    if (reportsResponse.ok) {
                        const data = await reportsResponse.json();
                        setReportsData(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching reports data:', error);
                toast.error('Failed to load reports data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleReportCounterfeit = async () => {
        if (!reportMessage.trim() || !reportType || !severity) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/hospital/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orgId,
                    reportType,
                    severity,
                    description: reportMessage.trim(),
                    // reporterId: undefined // Only include if you have it
                }),
            });

            if (response.ok) {
                toast.success("Counterfeit report submitted successfully");
                setReportMessage("");
                setReportType("");
                setSeverity("");
                
                // Refresh reports data
                const reportsResponse = await fetch(`/api/hospital/reports?orgId=${orgId}`);
                if (reportsResponse.ok) {
                    const data = await reportsResponse.json();
                    setReportsData(data);
                }
            } else {
                const error = await response.json();
                toast.error(error.error || "Failed to submit report");
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error("Failed to submit counterfeit report");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'destructive';
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            case 'low': return 'default';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="font-bold text-2xl sm:text-3xl text-foreground">Reports & Analytics</h1>
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner size="large" text="Loading reports..." />
                </div>
            </div>
        );
    }



    return (
        <div className="space-y-6">
            <h1 className="font-bold text-2xl sm:text-3xl text-foreground">Reports & Analytics</h1>

            {/* Visual Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                                <p className="text-2xl font-bold text-blue-600">{reportsData?.recentReports?.length || 0}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card  className="border-2 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {reportsData?.recentReports?.filter(r => r.status.toLowerCase() === 'pending').length || 0}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {reportsData?.recentReports?.filter(r => r.status.toLowerCase() === 'resolved').length || 0}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-red-200 dark:border-red-800">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {reportsData?.recentReports?.filter(r => r.severity.toLowerCase() === 'critical').length || 0}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Verification Statistics
                        </CardTitle>
                        <CardDescription>Monthly verification trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 sm:space-y-4">
                            {reportsData?.monthlyStats.slice(-3).map((stat, index, array) => {
                                const maxVerifications = Math.max(...array.map(s => s.verifications));
                                const progressWidth = maxVerifications > 0 ? (stat.verifications / maxVerifications) * 100 : 0;
                                
                                return (
                                    <div key={stat.month} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{stat.month}</span>
                                            <div className="text-right">
                                                <span className="font-semibold text-sm sm:text-base">{stat.verifications} verifications</span>
                                                {stat.suspiciousScans > 0 && (
                                                    <p className="text-xs text-orange-600 mt-1">
                                                        {stat.suspiciousScans} suspicious
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${progressWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    <span className={reportsData && reportsData.growthPercentage >= 0 ? "text-green-600" : "text-red-600"}>
                                        {reportsData && reportsData.growthPercentage >= 0 ? '+' : ''}{reportsData?.growthPercentage ?? 0}%
                                    </span> change from last month
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Report Counterfeit
                        </CardTitle>
                        <CardDescription>Report suspected counterfeit medications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="report-type" className="text-sm font-medium">Report Type *</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger className={`h-10 sm:h-11 ${reportType ? 'border-green-500' : 'border-border'}`}>
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COUNTERFEIT_DETECTED">Counterfeit Detected</SelectItem>
                                    <SelectItem value="PACKAGING_ISSUE">Packaging Issue</SelectItem>
                                    <SelectItem value="EXPIRY_MISMATCH">Expiry Mismatch</SelectItem>
                                    <SelectItem value="MULTIPLE_SCANS">Multiple Scans</SelectItem>
                                    <SelectItem value="SUSPICIOUS_ACTIVITY">Suspicious Activity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="severity" className="text-sm font-medium">Severity *</Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger className={`h-10 sm:h-11 ${severity ? 'border-green-500' : 'border-border'}`}>
                                    <SelectValue placeholder="Select severity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="CRITICAL">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="report" className="text-sm font-medium">Report Details *</Label>
                                <span className="text-xs text-muted-foreground">
                                    {reportMessage.length}/500
                                </span>
                            </div>
                            <Textarea
                                id="report"
                                placeholder="Describe the suspected counterfeit medication in detail..."
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                rows={4}
                                maxLength={500}
                                className={`min-h-[100px] text-sm sm:text-base ${
                                    reportMessage.length > 0 ? 'border-green-500' : 'border-border'
                                }`}
                            />
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                                <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all"
                                    style={{ width: `${Math.min((reportMessage.length / 500) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={handleReportCounterfeit} 
                            disabled={submitting || !reportType || !severity || !reportMessage.trim()}
                            className="w-full h-10 sm:h-11"
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {submitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {reportsData?.recentReports && reportsData.recentReports.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Counterfeit Reports</CardTitle>
                        <CardDescription>Latest reports from your hospital</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="hidden sm:table-cell">Batch ID</TableHead>
                                        <TableHead>Medication</TableHead>
                                        <TableHead className="hidden md:table-cell">Type</TableHead>
                                        <TableHead>Severity</TableHead>
                                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportsData.recentReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDate(report.createdAt)}
                                                </div>
                                                <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                    {report.batchId}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell font-mono text-sm">
                                                {report.batchId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{report.drugName}</div>
                                                <div className="md:hidden text-xs text-muted-foreground mt-1">
                                                    {report.reportType.replace('_', ' ').toLowerCase()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm">
                                                {report.reportType.replace('_', ' ').toLowerCase()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getSeverityColor(report.severity) as any} className="text-xs">
                                                    {report.severity.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline" className="text-xs">
                                                    {report.status.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default HospitalReports;