"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  LayoutDashboard,
  Package,
  BarChart3,
  AlertTriangle,
  Settings,
  LogOut,
  Building2,
  Truck,
  Camera,
  Users
} from "lucide-react"
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { authRoutes } from "@/utils";
import { ManufacturerTab } from "@/utils";
import { useState, useEffect } from "react"

interface HospitalSidebarProps {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<ManufacturerTab>>
  orgId: string
  isMobile?: boolean
  onTabSelect?: () => void
}

export function HospitalSidebar({ activeTab, setActiveTab, orgId, isMobile, onTabSelect }: HospitalSidebarProps) {

  const { signOut } = useClerk();
  const [orgName, setOrgName] = useState("Loading...")
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Fetch organization info
  useEffect(() => {
    const fetchOrgInfo = async () => {
      if (!orgId) return
      
      try {
        const response = await fetch(`/api/organizations/info?orgId=${orgId}`)
        if (response.ok) {
          const data = await response.json()
          setOrgName(data.companyName)
        }
      } catch (error) {
        console.error('Error fetching organization info:', error)
        setOrgName("Hospital")
      }
    }

    fetchOrgInfo()
  }, [orgId])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({ redirectUrl: authRoutes.login })
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    // { id: "patients", label: "Patient Records", icon: Users },
    { id: "team", label: "Team Members", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "qr-scanner", label: "Qr Scanner", icon: Camera },
    { id: "transfers", label: "Batch Transfers", icon: Truck },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTabClick = (tab: ManufacturerTab) => {
    setActiveTab(tab as ManufacturerTab);
    if (isMobile && onTabSelect) {
      onTabSelect();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`${isMobile ? 'w-full h-full flex flex-col' : 'w-64 h-screen'} bg-sidebar border-r border-sidebar-border shadow-lg flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0 flex items-center">
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
        <div className="p-4 pt-6 flex flex-col items-center border-b border-border bg-gradient-to-b from-blue-100/40 to-transparent rounded-b-xl shadow-sm mb-2">
          <Badge variant="secondary" className="mb-2 px-3 py-1 text-xs rounded-full shadow bg-gradient-to-r from-blue-500/80 to-green-400/80 text-white border-0">
            Hospital
          </Badge>
          <span className="font-bold text-base text-sidebar-foreground text-center tracking-wide mb-1">
            {orgName}
          </span>
          <span className="text-xs text-muted-foreground text-center italic">Active • Hospital</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start cursor-pointer hover:bg-sidebar-accent/50 transition-all duration-200 group ${isMobile ? 'text-base h-12' : 'text-xs sm:text-sm'}`}
                onClick={() => handleTabClick(item.id as ManufacturerTab)}
              >
                <Icon className={`${isMobile ? 'h-5 w-5 mr-3' : 'h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3'} group-hover:scale-110 transition-transform duration-200`} />
                <span className={isMobile ? '' : 'hidden sm:inline'}>{item.label}</span>
                {!isMobile && <span className="sm:hidden">{item.label.split(' ')[0]}</span>}
              </Button>
            )
          })}
        </nav>
        {/* Sign Out */}
        <div className="p-4 border-t flex-shrink-0">
          <Button
            variant="ghost"
            className={`w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors ${isMobile ? 'text-base h-12' : 'text-xs sm:text-sm'}`}
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className={`${isMobile ? 'h-5 w-5 mr-3' : 'h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3'} ${isSigningOut ? 'animate-spin' : ''}`} />
            <span className={isMobile ? 'block' : 'hidden sm:inline'}>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            {!isMobile && <span className="sm:hidden">{isSigningOut ? '...' : 'Out'}</span>}
          </Button>
        </div>
      </div>
    </>
  )
}
