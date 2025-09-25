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
  Camera
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
    <div className={`${isMobile ? 'w-full h-full flex flex-col' : 'w-64 h-screen'} bg-sidebar relative border-r border-sidebar-border shadow-lg flex flex-col`}>
      {!isMobile && (
        <div className="p-4 sm:p-6 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">MediCheck</span>
          </Link>
        </div>
      )}

      <div className={`${isMobile ? 'p-4' : 'px-4 sm:px-6 pb-4'} flex-shrink-0`}>
        <div className="bg-card/50 border border-border/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm hover:bg-card/60 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm sm:text-base truncate">{orgName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Active • Hospital</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className={`${isMobile ? 'px-2 flex-1 overflow-y-auto max-h-[40vh]' : 'px-2 sm:px-4 flex-1'} space-y-1 overflow-y-auto`}>
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

      <div className={`${isMobile ? 'p-4 border-t flex-shrink-0' : 'p-4 border-t flex-shrink-0'} space-y-3`}>
        {/* Theme Toggle - Only show on desktop */}
        {!isMobile && (
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
        )}
        
        {/* Sign Out Button */}
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
  )
}
