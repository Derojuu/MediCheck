"use client";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Shield } from "lucide-react"; 
// 
import { RegulatorSidebar } from "@/components/regulator-page-component/regulator-sidebar";
import RegulatorInvestigations from "@/components/regulator-page-component/RegulatorInvestigations";
import RegulatorCompliance from "@/components/regulator-page-component/RegulatorCompliance";
import RegulatorSettings from "@/components/regulator-page-component/RegulatorSettings";
import RegulatorAlerts from "@/components/regulator-page-component/RegulatorAlerts";
import RegulatorReports from "@/components/regulator-page-component/RegulatorReports";
import RegulatorEntities from "@/components/regulator-page-component/RegulatorEntities";    
import RegulatorMain from "@/components/regulator-page-component/RegulatorMain";
import RegulatorAnalytics from "@/components/regulator-page-component/RegulatorAnalytics";
import { TeamMemberManagement } from "@/components/team-member-management";
import { ManufacturerTab } from "@/utils";
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "react-toastify";
// 

export default function RegulatorDashboard() {

  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [orgLoading, setOrgLoading] = useState(true);

  // Fetch orgId
  useEffect(() => {
    const loadOrg = async () => {
      setOrgLoading(true);
      try {
        const res = await fetch("/api/organizations/me");
        const data = await res.json();
        setOrgId(data.organizationId);
      } catch (error) {
        console.error("Error fetching organization:", error);
        toast.error("Failed to load organization data");
      } finally {
        setOrgLoading(false);
      }
    };
    loadOrg();
  }, []);

  return (

    <div className="flex h-screen bg-background">

      <RegulatorSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto lg:ml-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-sidebar-primary mr-2" /> {/* Shield icon */}
            <h1 className="font-semibold text-lg">MediCheck</h1>
          </div>
          <div className="flex items-center justify-end w-8">
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 lg:p-8">

          {activeTab === "dashboard" && (
            <RegulatorMain setActiveTab={setActiveTab} />
          )}

          {activeTab === "analytics" && (
            <RegulatorAnalytics />
          )}

          {activeTab === "investigations" && (
            <RegulatorInvestigations />
          )}

          {activeTab === "compliance" && (
            <RegulatorCompliance />
          )}

          {activeTab === "entities" && (
            <RegulatorEntities />
          )}

          {activeTab === "reports" && (
            <RegulatorReports />
          )}

          {activeTab === "alerts" && (
            <RegulatorAlerts />
          )}

          {activeTab === "team" && (
            <TeamMemberManagement 
              organizationType="regulator"
              organizationId={orgId}
            />
          )}

          {activeTab === "settings" && (
            <RegulatorSettings />
          )}
        </div>

      </main>

    </div>

  )
}
