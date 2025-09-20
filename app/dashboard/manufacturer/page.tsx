"use client"
import { useState, useEffect } from "react"
// components import 
import { ManufacturerSidebar } from "@/components/manufacturer-page-component/manufacturer-sidebar";
import { TeamManagement } from "@/components/team-management";
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
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">

      <ManufacturerSidebar activeTab={activeTab} setActiveTab={setActiveTab} orgId={orgId} />

      <main className="flex-1 overflow-y-auto">

        <div className="p-4 sm:p-6 lg:p-8">

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
            <div className="space-y-6">
              <h1 className="font-montserrat font-bold text-3xl text-foreground">Team Management</h1>
              <TeamManagement />
            </div>
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
