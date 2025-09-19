import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface StatsData {
  activeInvestigations: number;
  investigationGrowth: number;
  complianceChecks: number;
  complianceGrowth: number;
  pendingReviews: number;
  pendingGrowth: number;
  violationsFound: number;
  violationChange: number;
}

const RegulatorStats = () => {
  const [stats, setStats] = useState<StatsData>({
    activeInvestigations: 0,
    investigationGrowth: 0,
    complianceChecks: 0,
    complianceGrowth: 0,
    pendingReviews: 0,
    pendingGrowth: 0,
    violationsFound: 0,
    violationChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/regulator-stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch regulator stats');
        }
      } catch (error) {
        console.error('Error fetching regulator stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Investigations</CardTitle>
          <Eye className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.activeInvestigations}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats.investigationGrowth >= 0 ? "text-accent font-medium" : "text-red-600 font-medium"}>
              {stats.investigationGrowth >= 0 ? '+' : ''}{stats.investigationGrowth}
            </span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Checks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.complianceChecks}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats.complianceGrowth >= 0 ? "text-primary" : "text-red-600"}>
              {stats.complianceGrowth >= 0 ? '+' : ''}{stats.complianceGrowth}%
            </span> this month
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats.pendingGrowth >= 0 ? "text-orange-600" : "text-green-600"}>
              {stats.pendingGrowth >= 0 ? '+' : ''}{stats.pendingGrowth}%
            </span> change
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Violations Found</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.violationsFound}</div>
          <p className="text-xs text-muted-foreground">
            <span className={stats.violationChange <= 0 ? "text-green-600" : "text-red-600"}>
              {stats.violationChange >= 0 ? '+' : ''}{stats.violationChange}
            </span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatorStats;