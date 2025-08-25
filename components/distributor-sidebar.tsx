"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  LayoutDashboard,
  Package,
  Truck,
  ArrowUpRight,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Building2,
} from "lucide-react"
import Link from "next/link"

interface DistributorSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DistributorSidebar({ activeTab, setActiveTab }: DistributorSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "shipments", label: "Shipments", icon: Truck },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "transfer", label: "Transfer Ownership", icon: ArrowUpRight },
    { id: "partners", label: "Partners", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
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
              <p className="font-medium text-sidebar-foreground">MedDistribute Nigeria Ltd</p>
              <Badge variant="secondary" className="text-xs">
                Distributor
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start cursor-pointer"
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/auth/login">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground cursor-pointer">
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  )
}
