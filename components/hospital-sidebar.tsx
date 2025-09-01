"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  AlertTriangle,
  Settings,
  LogOut,
  Building2,
} from "lucide-react"
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { authRoutes } from "@/utils";

interface HospitalSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function HospitalSidebar({ activeTab, setActiveTab }: HospitalSidebarProps) {

  const { signOut } = useClerk();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "patients", label: "Patient Records", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
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
              <p className="font-medium text-sidebar-foreground">Lagos University Teaching Hospital</p>
              <Badge variant="secondary" className="text-xs">
                Hospital
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
        <Button
          variant="ghost"
          className=" justify-start text-muted-foreground cursor-pointer"
          onClick={() => signOut({ redirectUrl: authRoutes.login })}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
