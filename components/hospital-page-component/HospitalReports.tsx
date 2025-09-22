import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { AlertTriangle, TrendingUp } from "lucide-react";
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
                <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>
                <div className="flex items-center justify-center p-8">
                    <LoadingSpinner size="large" text="Loading reports..." />
                </div>
            </div>
        );
    }



    return (
        <div className="space-y-6">
            <h1 className="font-montserrat font-bold text-3xl text-foreground">Reports & Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Verification Statistics
                        </CardTitle>
                        <CardDescription>Monthly verification trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reportsData?.monthlyStats.slice(-3).map((stat) => (
                                <div key={stat.month} className="flex justify-between items-center">
                                    <span className="text-sm">{stat.month}</span>
                                    <div className="text-right">
                                        <span className="font-semibold">{stat.verifications} verifications</span>
                                        {stat.suspiciousScans > 0 && (
                                            <p className="text-xs text-orange-600">
                                                {stat.suspiciousScans} suspicious scans
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-type">Report Type *</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
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
                            <Label htmlFor="severity">Severity *</Label>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger>
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
                            <Label htmlFor="report">Report Details *</Label>
                            <Textarea
                                id="report"
                                placeholder="Describe the suspected counterfeit medication in detail..."
                                value={reportMessage}
                                onChange={(e) => setReportMessage(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <Button 
                            onClick={handleReportCounterfeit} 
                            disabled={submitting}
                            className="w-full"
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Batch ID</TableHead>
                                    <TableHead>Medication</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportsData.recentReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="text-sm">
                                            {formatDate(report.createdAt)}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {report.batchId}
                                        </TableCell>
                                        <TableCell>{report.drugName}</TableCell>
                                        <TableCell className="text-sm">
                                            {report.reportType.replace('_', ' ').toLowerCase()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getSeverityColor(report.severity) as any}>
                                                {report.severity.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {report.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default HospitalReports;