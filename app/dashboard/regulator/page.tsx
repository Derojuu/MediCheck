"use client";
import { useState } from "react"
// 
import { RegulatorSidebar } from "@/components/regulator-page-component/regulator-sidebar";
import RegulatorInvestigations from "@/components/regulator-page-component/RegulatorInvestigations";
import RegulatorCompliance from "@/components/regulator-page-component/RegulatorCompliance";
import RegulatorSettings from "@/components/regulator-page-component/RegulatorSettings";
import RegulatorAlerts from "@/components/regulator-page-component/RegulatorAlerts";
import RegulatorReports from "@/components/regulator-page-component/RegulatorResports";
import RegulatorEntities from "@/components/regulator-page-component/RegulatorEntities";
import RegulatorMain from "@/components/regulator-page-component/RegulatorMain";
import RegulatorAnalytics from "@/components/regulator-page-component/RegulatorAnalytics";
import { ManufacturerTab } from "@/utils";
// 

export default function RegulatorDashboard() {

  const [activeTab, setActiveTab] = useState<ManufacturerTab>("dashboard");

  return (

    <div className="flex h-screen bg-background">

      <RegulatorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">

        <div className="p-8">

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

          {activeTab === "settings" && (
            <RegulatorSettings />
          )}
        </div>

      </main>

    </div>

  )
}
