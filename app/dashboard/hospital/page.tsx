"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// components import 
import { HospitalSidebar } from "@/components/hospital-sidebar";
import HospitalSettings from "@/components/hospital-page-component/HospitalSettings";
import HospitalAlerts from "@/components/hospital-page-component/HospitalAlerts";
import HospitalReports from "@/components/hospital-page-component/HospitalReports";
import HospitalInventory from "@/components/hospital-page-component/HospitalInventory";
import HospitalMain from "@/components/hospital-page-component/HospitalMain";
import Transfers from "@/components/Transfers";
import QRScanner from "@/components/qr-scanner";
import { TeamMemberManagement } from "@/components/team-member-management";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, Shield, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// 
import { toast } from "react-toastify";

import { ManufacturerTab } from "@/utils";
import { MedicationBatchInfoProps } from "@/utils";

export default function HospitalDashboard() {

  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [orgId, setOrgId] = useState("");
  
  const [batches, setBatches] = useState<MedicationBatchInfoProps[]>([]);

  const [orgLoading, setOrgLoading] = useState(true);

  const [batchesLoading, setBatchesLoading] = useState(false);

  const [scannedQRcodeResult, setScannedQRcodeResult] = useState("");

  const handleQRScan = (qrData: string) => {
    setScannedQRcodeResult(qrData)
  }

  useEffect(() => {
    if (scannedQRcodeResult) {
      console.log(scannedQRcodeResult);
      window.location.href = scannedQRcodeResult;
    }
  }, [scannedQRcodeResult])

  // 1️⃣ Fetch orgId
  useEffect(() => {

    const loadOrg = async () => {

      setOrgLoading(true);
      try {
        const res = await fetch("/api/organizations/me");
        const data = await res.json();
        setOrgId(data.organizationId);
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
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">Loading hospital dashboard...</p>
        </div>
      </div>
    );
  }

  // Mobile Header Component
  const MobileHeader = () => (
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
  );

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-80 h-80 bg-primary/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-16 w-60 h-60 bg-accent/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-primary/7 rounded-full blur-xl"></div>
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <HospitalSidebar activeTab={activeTab} setActiveTab={setActiveTab} orgId={orgId} />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-background shadow-xl" onClick={e => e.stopPropagation()}>
            <HospitalSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              orgId={orgId}
              isMobile={true}
              onTabSelect={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative z-10 lg:ml-0">

        <div className="p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">

          {activeTab === "dashboard" && (
            <HospitalMain setActiveTab={setActiveTab} orgId={orgId} />
          )}

          {activeTab === "inventory" && (
            <HospitalInventory orgId={orgId} />
          )}

          {activeTab === "team" && (
            <TeamMemberManagement 
              organizationType="hospital"
              organizationId={orgId}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsDashboard 
              dashboardType="hospital"
              title="Hospital Analytics"
            />
          )}

          {activeTab === "reports" && (
            <HospitalReports />
          )}

          {activeTab === "alerts" && (
            <HospitalAlerts />
          )}

          {activeTab === "transfers" && (
            <Transfers orgId={orgId} allBatches={batches} loadBatches={loadBatches} />
          )}

          {activeTab === "qr-scanner" && (
            <div className="flex justify-center items-center min-h-[500px]">
              {/* Desktop: Card wrap */}
              <div className="hidden lg:block w-full max-w-[600px]">
                <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Removed CardHeader with QR Scanner title */}
                  <CardContent>
                    <div className="flex justify-center items-center">
                      <QRScanner onScan={handleQRScan} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Mobile: No Card wrap, fill space */}
              <div className="block lg:hidden w-full">
                <QRScanner onScan={handleQRScan} />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <HospitalSettings />
          )}
          
        </div>

      </main>

    </div>
  )
}
