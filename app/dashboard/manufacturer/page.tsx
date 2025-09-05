"use client"
import { useState } from "react"
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
import { ManufacturerTab } from "@/utils"

export default function ManufacturerDashboard() {

  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard")

  return (
    <div className="flex h-screen bg-background">

      <ManufacturerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">

        <div className="p-8">

          {activeTab === "dashboard" && (
            <ManufacturerMain setActiveTab={setActiveTab} />
          )}

          {activeTab === "batches" && (
            <ManufacturerBatch />
          )}

          {activeTab === "products" && (
            <ManufacturerProducts />
          )}

          {activeTab === "transfers" && (
            <ManufacturerTransfers />
          )}

          {activeTab === "quality" && (
            <ManufacturerQuality />
          )}

          {activeTab === "transport" && (
            <ManufacturerTransport setActiveTab={setActiveTab} />
          )}

          {activeTab === "qr-generator" && (
            <QRGenerationComponent />
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
