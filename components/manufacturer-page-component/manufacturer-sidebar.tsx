"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
}

export function ManufacturerSidebar({ activeTab, setActiveTab, orgId }: ManufacturerSidebarProps) {
  const { signOut } = useClerk()
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
        setOrgName("Organization")
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

  return (
    <div className="w-64 bg-sidebar relative border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-sidebar-primary" />
          <span className="font-montserrat font-bold text-xl text-sidebar-foreground">MedChain</span>
        </Link>
      </div>

      <div className="px-6 pb-4">
        <div className="bg-sidebar-accent rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">{orgName}</p>
              <Badge variant="secondary" className="text-xs">
                Manufacturer
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1 overflow-y-auto h-[50vh]">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start cursor-pointer"
              onClick={() => setActiveTab(item.id as ManufacturerTab)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground cursor-pointer"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className={`h-4 w-4 mr-3 ${isSigningOut ? 'animate-spin' : ''}`} />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  )
}
