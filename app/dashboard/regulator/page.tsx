<<<<<<< HEAD
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
=======
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, AlertTriangle, FileText, TrendingUp, Clock, CheckCircle, XCircle, Eye, Building2, Search, Activity, Users } from "lucide-react"
import { RegulatorSidebar } from "@/components/regulator-sidebar"
import { RegulatorStats, RegulatorActivities, RegulatorQuickActions, RegulatorSettings } from "@/components/regulator-page-component"

export default function RegulatorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for other sections
  const alerts = [
    { id: "ALT001", message: "Counterfeit batch detected: PAR2024001", severity: "critical", time: "30 mins ago", location: "Lagos", reporter: "Hospital Inspector" },
    { id: "ALT002", message: "Unusual distribution pattern flagged", severity: "warning", time: "2 hours ago", location: "Abuja", reporter: "System Alert" },
    { id: "ALT003", message: "License expiration reminder: 5 facilities", severity: "info", time: "4 hours ago", location: "Multiple", reporter: "Automated System" },
  ] as const;

  const investigations = [
    { id: "INV001", title: "Counterfeit Paracetamol Investigation", target: "Multiple Facilities", status: "Active", priority: "Critical", startDate: "2024-08-20", inspector: "Dr. Adebayo" },
    { id: "INV002", title: "Expired Drug Distribution", target: "MedChain Pharmacy", status: "Under Review", priority: "High", startDate: "2024-08-18", inspector: "Dr. Okafor" },
    { id: "INV003", title: "Unlicensed Distribution Activity", target: "QuickMed Ltd", status: "Pending", priority: "High", startDate: "2024-08-15", inspector: "Dr. Emeka" },
    { id: "INV004", title: "Storage Condition Violations", target: "HealthStore Inc", status: "Completed", priority: "Medium", startDate: "2024-08-10", inspector: "Dr. Nkem" },
  ]

  const registeredEntities = [
    { id: "ENT001", name: "PharmaCorp Ltd", type: "Manufacturer", location: "Lagos", license: "MAN-2024-001", status: "Active", lastInspection: "2024-07-15" },
    { id: "ENT002", name: "MedDistribute Inc", type: "Distributor", location: "Abuja", license: "DIST-2024-002", status: "Active", lastInspection: "2024-06-20" },
    { id: "ENT003", name: "HealthPlus Pharmacy", type: "Pharmacy", location: "Port Harcourt", license: "PHR-2024-003", status: "Under Review", lastInspection: "2024-08-01" },
    { id: "ENT004", name: "CureAll Hospital", type: "Hospital", location: "Kano", license: "HOS-2024-004", status: "Active", lastInspection: "2024-05-10" },
    { id: "ENT005", name: "MediCare Clinic", type: "Clinic", location: "Ibadan", license: "CLI-2024-005", status: "Expired", lastInspection: "2024-02-15" },
  ]

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-56 h-56 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-accent/6 rounded-full blur-xl"></div>
      </div>
      
      <RegulatorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Regulator Dashboard</h1>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">NAFDAC - Drug Enforcement Division</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Regulator
                  </Badge>
                </div>
              </div>

              {/* Stats Cards */}
              <RegulatorStats />

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RegulatorActivities />
                <RegulatorQuickActions onTabChange={setActiveTab} />
              </div>
            </div>
>>>>>>> f6356b6af929b75cb041b1d15fa6909bed780e8d
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
