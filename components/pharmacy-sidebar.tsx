"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  LayoutDashboard,
  Package,
  Pill,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Building2,
} from "lucide-react"
import Link from "next/link";
import { useClerk } from "@clerk/nextjs"
import { authRoutes } from "@/utils"

interface PharmacySidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function PharmacySidebar({ activeTab, setActiveTab }: PharmacySidebarProps) {

  const { signOut } = useClerk();
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "prescriptions", label: "Prescriptions", icon: ClipboardList },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 sm:w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4 sm:p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-sidebar-primary" />
          <span className="font-montserrat font-bold text-lg sm:text-xl text-sidebar-foreground">MedChain</span>
        </Link>
      </div>

      <div className="px-4 sm:px-6 pb-4">
        <div className="bg-sidebar-accent rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sidebar-foreground text-sm sm:text-base truncate">MedPlus Pharmacy</p>
              <Badge variant="secondary" className="text-xs">
                Pharmacy
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-2 sm:px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start cursor-pointer text-xs sm:text-sm"
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </Button>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-2 right-2 sm:left-4 sm:right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground cursor-pointer text-xs sm:text-sm"
          onClick={() => signOut({ redirectUrl: authRoutes.login })}
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </Button>
      </div>
      
    </div>
  )
}
