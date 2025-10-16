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
  Truck,
  Users,
  BarChart3,
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
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "batches", label: "Batch Management", icon: Package },
    { id: "products", label: "Product Catalog", icon: Factory },
    { id: "transfers", label: "Batch Transfers", icon: Truck },
    { id: "qr-generator", label: "QR Generator", icon: QrCode },
    { id: "team", label: "Team Management", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTabSelect = (tab: ManufacturerTab) => {
    setActiveTab(tab)
    if (isMobile && onTabSelect) {
      onTabSelect()
    }
  }

  // For closing sidebar when clicking overlay (mobile)
  const [showSidebar, setShowSidebar] = useState(true);

  const handleOverlayClick = () => {
    setShowSidebar(false);
    if (onTabSelect) onTabSelect();
  };

  useEffect(() => {
    if (!isMobile) setShowSidebar(true);
    else setShowSidebar(true); // Always open when rendered, but can be closed
  }, [isMobile]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-all duration-300 pointer-events-auto"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.15)",
          }}
          onClick={handleOverlayClick}
        />
      )}
      {/* Sidebar */}
      {(!isMobile || showSidebar) && (
        <div
          className={`${
            isMobile
              ? 'w-4/5 max-w-xs fixed top-0 left-0 z-50 bg-sidebar flex flex-col h-[100dvh]'
              : 'w-64 h-screen bg-sidebar'
          } border-r border-sidebar-border shadow-lg`}
          style={isMobile ? { top: 0, left: 0 } : {}}
        >
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 border-b border-border flex-shrink-0 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-sidebar-foreground bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/80 bg-clip-text">
                MediCheck
              </span>
            </Link>
            {/* Close button for mobile */}
            {isMobile && (
              <button
                aria-label="Close sidebar"
                className="ml-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => {
                  setShowSidebar(false);
                  if (onTabSelect) onTabSelect();
                }}
              >
                <span className="sr-only">Close sidebar</span>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-gray-600 dark:text-gray-300"><path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
          {/* Organization Card */}
          <div className="p-4 pt-6 flex flex-col items-center border-b border-border bg-gradient-to-b from-blue-100/40 to-transparent rounded-b-xl shadow-sm mb-2">
            <Badge variant="secondary" className="mb-2 px-3 py-1 text-xs rounded-full shadow bg-gradient-to-r from-blue-500/80 to-green-400/80 text-white border-0">
              Manufacturer
            </Badge>
            <span className="font-bold text-base text-sidebar-foreground text-center tracking-wide mb-1">
              {orgName}
            </span>
            <span className="text-xs text-muted-foreground text-center italic">Manufacturing Organization</span>
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
                  onClick={() => handleTabSelect(item.id as ManufacturerTab)}
                >
                  <Icon className={`${isMobile ? 'h-5 w-5 mr-3' : 'h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3'} group-hover:scale-110 transition-transform duration-200`} />
                  <span className={isMobile ? '' : 'hidden sm:inline'}>{item.label}</span>
                  {!isMobile && <span className="sm:hidden">{item.label.split(' ')[0]}</span>}
                </Button>
              )
            })}
          </nav>
          {/* Sign Out Button */}
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
      )}
    </>
  )
}
