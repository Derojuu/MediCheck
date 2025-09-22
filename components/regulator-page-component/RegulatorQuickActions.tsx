import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Shield, FileText, TrendingUp } from "lucide-react"
import { useState } from "react"

interface RegulatorQuickActionsProps {
  onTabChange: (tab: string) => void;
}

const RegulatorQuickActions = ({ onTabChange }: RegulatorQuickActionsProps) => {
  const [investigationNotes, setInvestigationNotes] = useState("");

  const handleStartInvestigation = () => {
    if (investigationNotes.trim()) {
      alert(`New investigation started: ${investigationNotes}`);
      setInvestigationNotes("");
    } else {
      alert("Please enter investigation details.");
    }
  };

  const handleComplianceCheck = () => {
    onTabChange("compliance");
  };

  const handleGenerateReport = () => {
    onTabChange("reports");
  };

  const handleViewAnalytics = () => {
    onTabChange("reports");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">Quick Actions</CardTitle>
        <CardDescription>Common regulatory tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="investigation-notes">Investigation Notes</Label>
          <Textarea
            id="investigation-notes"
            placeholder="Enter investigation details..."
            value={investigationNotes}
            onChange={(e) => setInvestigationNotes(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
        <Button className="w-full justify-start" onClick={handleStartInvestigation}>
          <Eye className="h-4 w-4 mr-2" />
          Start Investigation
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={handleComplianceCheck}
        >
          <Shield className="h-4 w-4 mr-2" />
          Compliance Check
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={handleGenerateReport}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
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
  );
};

export default RegulatorQuickActions;