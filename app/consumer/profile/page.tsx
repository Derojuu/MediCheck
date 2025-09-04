"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  User,
  MessageCircle,
  History,
  Settings,
  Scan,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Bell,
  LogOut,
} from "lucide-react"
import Link from "next/link";
import { authRoutes } from "@/utils"
import { useClerk } from "@clerk/nextjs"

export default function ConsumerProfile() {

  const [activeTab, setActiveTab] = useState("profile");

  const { signOut } = useClerk();

  // Mock user data
  const userProfile = {
    name: "John Smith",
    email: "john.smith@email.com",
    joinDate: "2024-01-10",
    totalScans: 15,
    language: "English",
  }

  // Mock scan history
  const scanHistory = [
    {
      id: 1,
      batchId: "BTH-2024-001",
      drugName: "Paracetamol 500mg",
      manufacturer: "Pharma Corp Ltd.",
      scanDate: "2024-01-16",
      location: "Home",
      result: "Verified",
      expiryDate: "2025-12-15",
    },
    {
      id: 2,
      batchId: "BTH-2024-003",
      drugName: "Ibuprofen 400mg",
      manufacturer: "MedLife Pharmaceuticals",
      scanDate: "2024-01-15",
      location: "Home",
      result: "Warning",
      expiryDate: "2024-03-20",
      warning: "Approaching expiry date",
    },
    {
      id: 3,
      batchId: "BTH-2024-002",
      drugName: "Amoxicillin 250mg",
      manufacturer: "HealthCare Inc.",
      scanDate: "2024-01-14",
      location: "Home",
      result: "Verified",
      expiryDate: "2025-08-30",
    },
  ]

  const getResultColor = (result: string) => {
    switch (result) {
      case "Verified":
        return "bg-green-100 text-green-800"
      case "Warning":
        return "bg-yellow-100 text-yellow-800"
      case "Error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MedChain</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/scan">
                <Button variant="outline" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                  <Scan className="h-4 w-4 mr-2 text-primary" />
                  Scan Medicine
                </Button>
              </Link>
              <Button 
                variant="ghost"
                className="cursor-pointer hover:bg-primary/5"
                onClick={() => signOut({ redirectUrl: authRoutes.login })}
              >
                <LogOut className="h-4 w-4 mr-2 text-primary" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your medication verification history</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
            <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center font-bold">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Profile Information</span>
                  </CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={userProfile.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={userProfile.email} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input id="language" value={userProfile.language} />
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">Update Profile</Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Account Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold">{userProfile.name}</h3>
                    <p className="text-sm text-muted-foreground">Consumer Account</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">{userProfile.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Scans:</span>
                      <span className="font-medium">{userProfile.totalScans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified Medicines:</span>
                      <span className="font-medium text-primary">13</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Warnings:</span>
                      <span className="font-medium text-yellow-600">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Scan History
                </CardTitle>
                <CardDescription>All your medication verification records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Scan className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{scan.batchId}</p>
                          <p className="text-sm text-muted-foreground">{scan.drugName}</p>
                          <p className="text-xs text-muted-foreground">{scan.manufacturer}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {scan.scanDate}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {scan.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getResultColor(scan.result)}>
                          {scan.result === "Verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {scan.result === "Warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {scan.result}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Expires: {scan.expiryDate}</p>
                        {scan.warning && <p className="text-xs text-yellow-600 mt-1">{scan.warning}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Get personalized medication guidance and safety information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">AI Assistant:</p>
                    <p className="text-sm">Hello! I'm your medication AI assistant. I can help you with:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Medication usage instructions</li>
                      <li>• Side effects and safety information</li>
                      <li>• Drug interactions</li>
                      <li>• Dosage guidance</li>
                      <li>• Storage recommendations</li>
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Input placeholder="Ask me about your medications..." className="flex-1" />
                    <Button>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>

                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation to get personalized medication guidance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your notifications and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Expiry Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your medications are about to expire
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Counterfeit Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts about counterfeit medications you've scanned
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Recall Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified about medication recalls</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Enabled
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Share Anonymous Usage Data</p>
                        <p className="text-sm text-muted-foreground">
                          Help improve the platform by sharing anonymous usage statistics
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Location Tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Allow location tracking for enhanced verification
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4 text-destructive">Danger Zone</h3>
                  <div className="space-y-3">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
