"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp, useUser, useClerk } from "@clerk/nextjs";

// components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";
// icons
import { Shield, Building2, User, ArrowLeft } from "lucide-react"
// 
import { toast } from "react-toastify";
import { ORG_TYPE_MAP, getRedirectPath } from "@/utils";
import { OrganizationType, UserRole } from "@/lib/generated/prisma";


export default function RegisterPage() {

  const [accountType, setAccountType] = useState<"organization" | "consumer" | null>(null)

  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Organization fields
    organizationType: "",
    companyName: "",
    rcNumber: "",
    nafdacNumber: "",
    businessRegNumber: "",
    licenseNumber: "",
    pcnNumber: "",
    agencyName: "",
    officialId: "",
    distributorType: "",
    address: "",
    country: "",
    state: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    // Consumer fields
    fullName: "",
    dateOfBirth: "",
    // Common fields
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const router = useRouter();

  const { signUp, setActive } = useSignUp();

  const { user } = useUser();

  const clerk = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setIsLoading(true);

    if (!signUp) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {

      // 1. Create user in Clerk
      const result = await signUp.create({
        emailAddress: formData.contactEmail,
        password: formData.password,
      });

      console.log(result)

      if (result.status === "complete") {

        // 2. Create user in your DB
        // Send all form data
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkUserId: result.createdUserId,
            accountType,
            organizationType: formData.organizationType,
            companyName: formData.companyName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            contactPersonName: formData.contactPersonName,
            address: formData.address,
            country: formData.country,
            state: formData.state,
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            name: formData.fullName,
            email: formData.contactEmail,
            role: "Admin",
            department: "Admin",
          }),
        });

        console.log("initiating api post reqest")

        const data = await res.json();
        
        console.log("API response:", data);

        if (!res.ok) throw new Error(data.error || "Registration failed");

        toast.success("Registration successful!");

        await setActive({ session: result.createdSessionId });

        // Force Clerk to update the active session token with new metadata
        await clerk.session?.reload();

        // Update frontend user state
        await user?.reload();

        const redirectPath = getRedirectPath(accountType === "organization" ? UserRole.ORGANIZATION_MEMBER : UserRole.CONSUMER, formData.organizationType.toUpperCase());

        console.log(redirectPath)
        
        router.push(redirectPath);
  
      }
      else {
        toast.error("Sign up failed. Please try again.");
      }

    }
    catch (err) {
      console.log(err)
      toast.error(err instanceof Error ? err.message : String(err));
    }
    finally {
      setIsLoading(false);
    }
  };  

  const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt"]

  const nigerianStates = ["Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Kaduna", "Oyo", "Delta"]

  const renderOrganizationSpecificFields = () => {

    switch (formData.organizationType.toUpperCase()) {

      case OrganizationType.MANUFACTURER:

        return (
          <>
            <div>
              <Label htmlFor="companyName" className="font-medium text-foreground">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
                className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="rcNumber" className="font-medium text-foreground">RC Number (Registration Certificate)</Label>
              <Input
                id="rcNumber"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="Enter RC number"
                className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>
            <div>
              <Label htmlFor="nafdacNumber">NAFDAC Registration Number</Label>
              <Input
                id="nafdacNumber"
                value={formData.nafdacNumber}
                onChange={(e) => setFormData({ ...formData, nafdacNumber: e.target.value })}
                placeholder="Enter NAFDAC registration number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Headquarters Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete headquarters address"
                rows={3}
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country of Origin</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case OrganizationType.DRUG_DISTRIBUTOR:
        return (
          <>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="businessRegNumber">Business Registration Number</Label>
              <Input
                id="businessRegNumber"
                value={formData.businessRegNumber}
                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                placeholder="Enter business registration number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="distributorType">Type of Distributor</Label>
              <Select
                value={formData.distributorType}
                onValueChange={(value) => setFormData({ ...formData, distributorType: value })}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select distributor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                  <SelectItem value="Retailer">Retailer</SelectItem>
                  <SelectItem value="Certified Distributor">Certified Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">Operating Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete operating address"
                rows={3}
                className="cursor-pointer"
                required
              />
            </div>
          </>
        )

      case OrganizationType.HOSPITAL:
        return (
          <>
            <div>
              <Label htmlFor="companyName">Hospital Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter hospital name"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="Enter hospital license number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete hospital address"
                rows={3}
                className="cursor-pointer"
                required
              />
            </div>
          </>
        )

      case OrganizationType.PHARMACY:
        return (
          <>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="pcnNumber">Pharmacist Council of Nigeria (PCN) Registration Number</Label>
              <Input
                id="pcnNumber"
                value={formData.pcnNumber}
                onChange={(e) => setFormData({ ...formData, pcnNumber: e.target.value })}
                placeholder="Enter PCN registration number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State of Practice</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companyName">Pharmacy/Hospital Affiliation (Optional)</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter pharmacy or hospital name"
                className="cursor-pointer"
              />
            </div>
          </>
        )

      case OrganizationType.REGULATOR:
        return (
          <>
            <div>
              <Label htmlFor="agencyName">Agency Name</Label>
              <Select
                value={formData.agencyName}
                onValueChange={(value) => setFormData({ ...formData, agencyName: value })}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NAFDAC">NAFDAC</SelectItem>
                  <SelectItem value="NDLEA">NDLEA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="businessRegNumber">Department/Unit</Label>
              <Input
                id="businessRegNumber"
                value={formData.businessRegNumber}
                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                placeholder="Enter department or unit"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="officialId">Official ID/Badge Number</Label>
              <Input
                id="officialId"
                value={formData.officialId}
                onChange={(e) => setFormData({ ...formData, officialId: e.target.value })}
                placeholder="Enter official ID or badge number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="cursor-pointer"
                required
              />
            </div>
          </>
        )

      default:
        return null
    }

  }

  return (

    <div className="min-h-screen bg-background">
      {/* Navigation - Updated to match landing page */}
      <nav className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-foreground">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono">Blockchain Verified</span>
              </div>
            </Link>
            <Link href="/">
              <Button 
                variant="outline"
                className="cursor-pointer bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 font-medium px-6 py-2.5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content with matching background effects */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-2xl mx-auto animate-slide-in-up">
          {!accountType ? (

            <Card className="glass-effect border-2 border-primary/20 shadow-2xl backdrop-blur-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="font-bold text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Choose Account Type
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2 text-lg">
                  Select the type of account that best describes your role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                <div
                  className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/60 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 cursor-pointer rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
                  onClick={() => setAccountType("organization")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-foreground">Organization</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Manufacturer, Drug Distributor, Hospital, Pharmacy, or Regulator
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/60 bg-gradient-to-r from-accent/5 to-primary/5 hover:from-accent/10 hover:to-primary/10 cursor-pointer rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
                  onClick={() => setAccountType("consumer")}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg flex items-center justify-center group-hover:from-accent/30 group-hover:to-primary/30 transition-all duration-300">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-foreground">Consumer/Patient</h3>
                      <p className="text-muted-foreground text-sm mt-1">Verify medications and access AI assistance</p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

          ) :
          (
            <Card className="glass-effect border-2 border-primary/20 shadow-2xl backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {accountType === "organization" ? "Organization Registration" : "Consumer Registration"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                      {accountType === "organization"
                        ? "Register your organization to start managing medication verification"
                        : "Create your consumer account for medication verification"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
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
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder="Select organization type" />
                              </SelectTrigger>
                              <SelectContent>                                  
                                {Object.entries(ORG_TYPE_MAP).map(([key, value]: [string, string]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {formData.organizationType && renderOrganizationSpecificFields()}

                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                            disabled={!formData.organizationType}
                          >
                            Continue
                          </Button>
                        </div>
                      )}
                        
                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="contactPersonName">Contact Person Name</Label>
                            <Input
                              id="contactPersonName"
                              value={formData.contactPersonName}
                              onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                              placeholder="Enter contact person name"
                              className="cursor-pointer"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactEmail">
                              {formData.organizationType === "Regulator"
                                ? "Official Email Address"
                                : "Contact Person Email"}{" "}
                            </Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                              placeholder="Enter email address"
                              className="cursor-pointer"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactPhone">
                              {formData.organizationType === "Regulator"
                                ? "Official Phone Number"
                                : "Contact Person Phone Number"}{" "}
                            </Label>
                            <Input
                              id="contactPhone"
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              placeholder="Enter phone number"
                              className="cursor-pointer"
                              required
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
                              className="cursor-pointer"
                              required
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
                              className="cursor-pointer"
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                              className="cursor-pointer"
                            />
                            <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                              I agree to the Terms and Conditions
                            </Label>
                          </div>
                          <div>
                            {/* CAPTCHA element for Clerk Smart CAPTCHA */}
                            <div id="clerk-captcha"></div>
                          </div>
                          <div className="flex space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1 bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 font-medium px-6 py-2.5"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                              disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Submit Application"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {accountType === "consumer" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="font-medium text-foreground">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail" className="font-medium text-foreground">Email Address</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="Enter your email"
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone" className="font-medium text-foreground">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="Enter your phone number"
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth" className="font-medium text-foreground">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="font-medium text-foreground">Address</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter your address"
                          rows={3}
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="font-medium text-foreground">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Create a password"
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="font-medium text-foreground">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                          className="glass-input bg-background/50 border-primary/20 focus:border-primary/50 transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                          className="cursor-pointer"
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer font-medium text-foreground">
                          I agree to the Terms and Condition
                        </Label>
                      </div>
                      <div>
                        {/* CAPTCHA element for Clerk Smart CAPTCHA */}
                        <div id="clerk-captcha"></div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  )}
                    
                </form>

                <div className="mt-8 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => setAccountType(null)} 
                    className="cursor-pointer bg-transparent hover:bg-primary/10 transition-all duration-300 border-2 border-primary/30 hover:border-primary/60 font-medium px-6 py-2.5"
                  >
                    Choose Different Account Type
                  </Button>
                </div>
                  
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
