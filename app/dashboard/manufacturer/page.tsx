"use client"
import { useState, useEffect } from "react"
// components import 
import { ManufacturerSidebar } from "@/components/manufacturer-page-component/manufacturer-sidebar";
import { TeamMemberManagement } from "@/components/team-member-management";
import QRGenerationComponent from "@/components/QRGenerationComponent";
import ManufacturerReports from "@/components/manufacturer-page-component/ManufacturerReports";
import ManufacturerSettings from "@/components/manufacturer-page-component/ManufacturerSettings";
import ManufacturerTransport from "@/components/manufacturer-page-component/ManufacturerTransport";
import ManufacturerQuality from "@/components/manufacturer-page-component/ManufacturerQuality";
import ManufacturerProducts from "@/components/manufacturer-page-component/ManufacturerProducts";
import ManufacturerBatch from "@/components/manufacturer-page-component/ManufacturerBatch";
import Transfers from "@/components/Transfers";
import ManufacturerMain from "@/components/manufacturer-page-component/ManufacturerMain"
import { LoadingSpinner } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
// icons
import { Menu, Shield, X } from "lucide-react"
// 
import { ManufacturerTab } from "@/utils";
import { toast } from "react-toastify";
import { MedicationBatchInfoProps } from "@/utils";

export default function ManufacturerDashboard() {

  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");
  const [orgId, setOrgId] = useState("");
  const [batches, setBatches] = useState<MedicationBatchInfoProps[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orgName, setOrgName] = useState("Loading...");

  // 1️⃣ Fetch orgId and orgName
  useEffect(() => {
    const loadOrg = async () => {
      setOrgLoading(true);
      try {
        const res = await fetch("/api/organizations/me");
        const data = await res.json();
        setOrgId(data.organizationId);
        
        // Fetch organization info for name
        const infoRes = await fetch(`/api/organizations/info?orgId=${data.organizationId}`);
        if (infoRes.ok) {
          const infoData = await infoRes.json();
          setOrgName(infoData.companyName);
        }
      }
      catch (err) {
        toast.error(`Failed to fetch org: ${err instanceof Error ? err.message : String(err)}`);
      }
      finally {
        setOrgLoading(false);
      }
    };

    loadOrg();

  }, []);

  const loadBatches = async () => {

    setBatchesLoading(true);
    try {
      const res = await fetch(`/api/batches/${orgId}`);
      const data = await res.json();
      setBatches(data);
      toast.success("Fetched batches");
    }
    catch (err) {
      toast.error(`Failed to fetch batches: ${err instanceof Error ? err.message : String(err)}`);
    }
    finally {
      setBatchesLoading(false);
    }
  };

  // 2️⃣ Fetch batches when orgId is ready
  useEffect(() => {

    if (!orgId) return;

    loadBatches();

  }, [orgId]);


  // 3️⃣ Guard rendering while loading
  if (orgLoading || batchesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden page-transition">
      {/* Simplified Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl bg-decoration"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/4 rounded-full blur-2xl bg-decoration"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-primary/6 rounded-full blur-xl bg-decoration"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">MediCheck</span>
          </div>
          
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-background shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">MediCheck</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <ManufacturerSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              orgId={orgId}
              orgName={orgName}
              isMobile={true}
              onTabSelect={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ManufacturerSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          orgId={orgId}
          orgName={orgName}
          isMobile={false}
        />
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 lg:ml-0">
        <div className="p-4 sm:p-6 lg:p-8 page-enter mt-16 lg:mt-0">

          {activeTab === "dashboard" && (
            <ManufacturerMain setActiveTab={setActiveTab} orgId={orgId} />
          )}

          {activeTab === "batches" && (
            <ManufacturerBatch orgId={orgId} allBatches={batches} loadBatches={loadBatches} />
          )}

          {activeTab === "products" && (
            <ManufacturerProducts orgId={orgId} />
          )}

          {activeTab === "transfers" && (
            <Transfers orgId={orgId} allBatches={batches} loadBatches={loadBatches} />
          )}

          {activeTab === "quality" && (
            <ManufacturerQuality />
          )}

          {activeTab === "transport" && (
            <ManufacturerTransport setActiveTab={setActiveTab} />
          )}

          {activeTab === "qr-generator" && (
            <QRGenerationComponent allBatches={batches} />
          )}

          {activeTab === "team" && (
            <TeamMemberManagement 
              organizationType="MANUFACTURER" 
              organizationId={orgId}
            />
          )}

          {activeTab === "reports" && (
            <ManufacturerReports />
          )}

          {activeTab === "settings" && (
            <ManufacturerSettings />
          )}
        </div>
      </main>

    </div>
  )
}
