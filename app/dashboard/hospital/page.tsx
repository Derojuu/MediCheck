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
// 
import { toast } from "react-toastify";

import { ManufacturerTab } from "@/utils";
import { MedicationBatchInfoProps } from "@/utils";

export default function HospitalDashboard() {

  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");

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



  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-80 h-80 bg-primary/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-16 w-60 h-60 bg-accent/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-primary/7 rounded-full blur-xl"></div>
      </div>

      <HospitalSidebar activeTab={activeTab} setActiveTab={setActiveTab} orgId={orgId} />

      <main className="flex-1 overflow-y-auto relative z-10">

        <div className="p-4 sm:p-6 lg:p-8">

          {activeTab === "dashboard" && (
            <HospitalMain setActiveTab={setActiveTab} orgId={orgId} />
          )}

          {activeTab === "inventory" && (
            <HospitalInventory orgId={orgId} />
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
            <QRScanner onScan={handleQRScan}  />
          )}

          {activeTab === "settings" && (
            <HospitalSettings />
          )}
          
        </div>

      </main>

    </div>
  )
}
