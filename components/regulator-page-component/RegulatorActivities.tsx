import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface Activity {
  id: string;
  type: string;
  target: string;
  status: string;
  priority: string;
  time: string;
  inspector: string;
  findings: string;
}

const RegulatorActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/regulator-activities`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error('Failed to fetch regulator activities');
        }
      } catch (error) {
        console.error('Error fetching regulator activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Recent Activities</CardTitle>
          <CardDescription>Latest regulatory activities and inspections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">Recent Activities</CardTitle>
        <CardDescription>Latest regulatory activities and inspections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent activities found
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.type} - {activity.target}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.inspector} - {activity.findings}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 mb-1">
                    <Badge
                      variant={
                        activity.priority === "high"
                          ? "destructive"
                          : activity.priority === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {activity.priority}
                    </Badge>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "in-progress" || activity.status === "investigating"
                            ? "secondary"
                            : activity.status === "flagged"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatorActivities;