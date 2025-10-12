"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  LayoutDashboard,
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Settings,
  LogOut,
  Building2,
  X,
} from "lucide-react"
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { authRoutes } from "@/utils";
import { ManufacturerTab } from "@/utils";
import { useEffect, useState } from "react";

interface RegulatorSidebarProps {
  activeTab: ManufacturerTab
  setActiveTab: (tab: ManufacturerTab) => void
  isOpen?: boolean
  onClose?: () => void
}

export function RegulatorSidebar({ activeTab, setActiveTab, isOpen = false, onClose }: RegulatorSidebarProps) {

  const { signOut } = useClerk();
  
  // TODO: Replace with actual organization name from context, props, or API
  const [orgName, setOrgName] = useState<string>("Regulator Org");

  useEffect(() => {
    async function fetchOrgName() {
      try {
        const res = await fetch("/api/organization"); // Update endpoint as needed
        const data = await res.json();
        setOrgName(data.name || "Regulator Org");
      } catch {
        setOrgName("Regulator Org");
      }
    }
    fetchOrgName();
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    // { id: "investigations", label: "Investigations", icon: Eye },
    { id: "compliance", label: "Compliance", icon: CheckCircle },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "entities", label: "Registered Entities", icon: Users },
    { id: "team", label: "Team Members", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "analytics", label: "Analytics", icon: Eye },
  ]

  const handleTabClick = (tab: ManufacturerTab) => {
    setActiveTab(tab);
    // Close sidebar on mobile after selection
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">
              MediCheck
            </span>
          </Link>
        </div>

        {/* Organization Card */}
        <div className="p-4 pt-6 flex flex-col items-center border-b border-border bg-gradient-to-b from-sidebar-primary/10 to-transparent rounded-b-xl shadow-sm mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs rounded-full shadow bg-gradient-to-r from-blue-500/80 to-green-400/80 text-white border-0">
              <Shield className="h-3 w-3 mr-1 inline-block" />
              Regulator
            </Badge>
          </div>
          <span className="font-bold text-base text-sidebar-foreground text-center tracking-wide mb-1">
            {orgName}
          </span>
          <span className="text-xs text-muted-foreground text-center italic">Regulatory Authority</span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id as ManufacturerTab ? "secondary" : "ghost"}
                className="w-full justify-start cursor-pointer"
                onClick={() => handleTabClick(item.id as ManufacturerTab)}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                <span className="text-sm">{item.label}</span>
              </Button>
            )
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t flex-shrink-0 space-y-3">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground cursor-pointer text-xs sm:text-sm"
              onClick={() => signOut({ redirectUrl: authRoutes.login })}
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
              <span>Sign Out</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
