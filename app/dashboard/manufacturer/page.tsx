"use client"
import { useState, useEffect } from "react"
// components import 
import { ManufacturerSidebar } from "@/components/manufacturer-sidebar";
import { TeamManagement } from "@/components/team-management";
import QRGenerationComponent from "@/components/QRGenerationComponent";
import ManufacturerReports from "@/components/ManufacturerReports";
import ManufacturerSettings from "@/components/ManufacturerSettings";
import ManufacturerTransport from "@/components/ManufacturerTransport";
import ManufacturerQuality from "@/components/ManufacturerQuality";
import ManufacturerProducts from "@/components/ManufacturerProducts";
import ManufacturerBatch from "@/components/ManufacturerBatch";
import ManufacturerTransfers from "@/components/ManufacturerTransfers";
import ManufacturerMain from "@/components/ManufacturerMain"
// 
import { ManufacturerTab } from "@/utils";
import { toast } from "react-toastify";
import { MedicationBatchInfoProps } from "@/utils";

export default function ManufacturerDashboard() {

  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");

  const [orgId, setOrgId] = useState("");

  const [batches, setBatches] = useState <MedicationBatchInfoProps[]>([]);

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
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">

      <ManufacturerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">

        <div className="p-8">

          {activeTab === "dashboard" && (
            <ManufacturerMain setActiveTab={setActiveTab} />
          )}

          {activeTab === "batches" && (
            <ManufacturerBatch orgId={orgId} allBatches={batches} loadBatches={loadBatches} />
          )}

          {activeTab === "products" && (
            <ManufacturerProducts />
          )}

          {activeTab === "transfers" && (
            <ManufacturerTransfers orgId={orgId} allBatches={batches} />
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
