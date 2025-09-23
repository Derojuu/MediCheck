"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  LayoutDashboard,
  Package,
  Factory,
  QrCode,
  Settings,
  LogOut,
  Building2,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"
import { authRoutes } from "@/utils";
import { ManufacturerTab } from "@/utils"
import { useState, useEffect } from "react"

interface ManufacturerSidebarProps {
  activeTab: string
  setActiveTab: (tab: ManufacturerTab) => void
  orgId: string
  orgName?: string
  isMobile?: boolean
  onTabSelect?: () => void
}

export function ManufacturerSidebar({ 
  activeTab, 
  setActiveTab, 
  orgId, 
  orgName: propOrgName, 
  isMobile = false, 
  onTabSelect 
}: ManufacturerSidebarProps) {
  const { signOut } = useClerk()
  const [orgName, setOrgName] = useState(propOrgName || "Loading...")
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Fetch organization info only if not provided via props
  useEffect(() => {
    if (propOrgName) {
      setOrgName(propOrgName)
      return
    }

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
        setOrgName("Organization")
      }
    }

    fetchOrgInfo()
  }, [orgId, propOrgName])

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
    { id: "batches", label: "Batch Management", icon: Package },
    { id: "products", label: "Product Catalog", icon: Factory },
    // { id: "quality", label: "Quality Control", icon: FlaskConical },
    { id: "transfers", label: "Batch Transfers", icon: Truck },
    // { id: "transport", label: "Transport Management", icon: Truck },
    { id: "qr-generator", label: "QR Generator", icon: QrCode },
    // { id: "team", label: "Team Management", icon: Users },
    // { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTabSelect = (tab: ManufacturerTab) => {
    setActiveTab(tab)
    if (isMobile && onTabSelect) {
      onTabSelect()
    }
  }

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-64'} bg-sidebar relative border-r border-sidebar-border shadow-lg`}>
      {!isMobile && (
        <div className="p-4 sm:p-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">MediCheck</span>
          </Link>
        </div>
      )}

      <div className={`${isMobile ? 'p-4' : 'px-4 sm:px-6 pb-4'}`}>
        <div className="bg-sidebar-accent rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sidebar-foreground text-sm sm:text-base truncate">{orgName}</p>
              <Badge variant="secondary" className="text-xs">
                Manufacturer
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <nav className={`${isMobile ? 'px-2 flex-1' : 'px-2 sm:px-4'} space-y-1 ${isMobile ? 'overflow-y-auto' : 'overflow-y-auto h-[50vh]'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start cursor-pointer hover:bg-sidebar-accent/50 transition-all duration-200 group ${isMobile ? 'text-base h-12' : 'text-xs sm:text-sm'}`}
              onClick={() => handleTabSelect(item.id as ManufacturerTab)}
            >
              <Icon className={`${isMobile ? 'h-5 w-5 mr-3' : 'h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3'} group-hover:scale-110 transition-transform duration-200`} />
              <span className={isMobile ? '' : 'hidden sm:inline'}>{item.label}</span>
              {!isMobile && <span className="sm:hidden">{item.label.split(' ')[0]}</span>}
            </Button>
          )
        })}
      </nav>

      <div className={`${isMobile ? 'p-4 border-t' : 'absolute bottom-4 left-2 right-2 sm:left-4 sm:right-4'} space-y-2`}>
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className={`w-full justify-start text-muted-foreground cursor-pointer ${isMobile ? 'text-base h-12' : 'text-xs sm:text-sm'}`}
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className={`${isMobile ? 'h-5 w-5 mr-3' : 'h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3'} ${isSigningOut ? 'animate-spin' : ''}`} />
          <span className={isMobile ? '' : 'hidden sm:inline'}>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          {!isMobile && <span className="sm:hidden">{isSigningOut ? '...' : 'Out'}</span>}
        </Button>
      </div>
    </div>
  )
}
