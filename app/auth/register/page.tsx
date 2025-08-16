"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Shield, Building2, Users, User, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<"organization" | "individual" | "consumer" | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    organizationType: "",
    organizationName: "",
    businessRegNumber: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    fullName: "",
    role: "",
    selectedOrganization: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate registration process
    if (accountType === "organization") {
      router.push("/dashboard/organization")
    } else if (accountType === "individual") {
      router.push("/dashboard/team-member")
    } else {
      router.push("/consumer/profile")
    }
  }

  const organizationTypes = ["Manufacturer", "Distributor", "Wholesaler", "Hospital", "Pharmacy/Retailer", "Regulator"]

  const roles = [
    "Pharmacist",
    "Store Manager",
    "Logistics Officer",
    "Quality Control",
    "Lab Technician",
    "Compliance Officer",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-montserrat font-bold text-xl text-foreground">MedChain</span>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {!accountType ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-montserrat font-bold text-2xl">Choose Account Type</CardTitle>
                <CardDescription>Select the type of account that best describes your role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="p-6 border-2 border-dashed border-border hover:border-primary cursor-pointer rounded-lg transition-colors"
                  onClick={() => setAccountType("organization")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg">Organization</h3>
                      <p className="text-muted-foreground">
                        Manufacturer, Distributor, Hospital, Pharmacy, or Regulator
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 border-2 border-dashed border-border hover:border-primary cursor-pointer rounded-lg transition-colors"
                  onClick={() => setAccountType("individual")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg">Team Member</h3>
                      <p className="text-muted-foreground">Work under an existing organization</p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-6 border-2 border-dashed border-border hover:border-primary cursor-pointer rounded-lg transition-colors"
                  onClick={() => setAccountType("consumer")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg">Consumer/Patient</h3>
                      <p className="text-muted-foreground">Verify medications and access AI assistance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-montserrat font-bold text-2xl">
                      {accountType === "organization"
                        ? "Organization Registration"
                        : accountType === "individual"
                          ? "Team Member Registration"
                          : "Consumer Registration"}
                    </CardTitle>
                    <CardDescription>
                      {accountType === "organization"
                        ? "Register your organization to start managing medication verification"
                        : accountType === "individual"
                          ? "Join an existing organization as a team member"
                          : "Create your consumer account for medication verification"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    Step {step} of {accountType === "organization" ? "2" : "1"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {accountType === "organization" && (
                    <>
                      {step === 1 && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="organizationType">Organization Type</Label>
                            <Select
                              value={formData.organizationType}
                              onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                              <SelectContent>
                                {organizationTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="organizationName">Organization Name</Label>
                            <Input
                              id="organizationName"
                              value={formData.organizationName}
                              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                              placeholder="Enter organization name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                            <Input
                              id="businessRegNumber"
                              value={formData.businessRegNumber}
                              onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                              placeholder="Enter business registration number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Enter complete address"
                              rows={3}
                            />
                          </div>
                          <Button type="button" onClick={() => setStep(2)} className="w-full">
                            Continue
                          </Button>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                              placeholder="Enter contact email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input
                              id="contactPhone"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              placeholder="Enter contact phone"
                            />
                          </div>
                          <div>
                            <Label>License Certificate</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload license certificate</p>
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                              Back
                            </Button>
                            <Button type="submit" className="flex-1">
                              Submit Application
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {accountType === "individual" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="selectedOrganization">Select Organization</Label>
                        <Select
                          value={formData.selectedOrganization}
                          onValueChange={(value) => setFormData({ ...formData, selectedOrganization: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Search and select organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pharma-corp">Pharma Corp Ltd.</SelectItem>
                            <SelectItem value="med-distributors">Med Distributors Inc.</SelectItem>
                            <SelectItem value="city-hospital">City General Hospital</SelectItem>
                            <SelectItem value="health-pharmacy">Health Plus Pharmacy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => setFormData({ ...formData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Request
                      </Button>
                    </div>
                  )}

                  {accountType === "consumer" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Create a password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </div>
                  )}
                </form>

                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={() => setAccountType(null)}>
                    Choose Different Account Type
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
