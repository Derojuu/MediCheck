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
import { ThemeToggle } from "@/components/theme-toggle";
// icons
import { Shield, Building2, User, ArrowLeft, Eye, EyeOff } from "lucide-react"
// 
import { toast } from "react-toastify";
import { ORG_TYPE_MAP, getRedirectPath } from "@/utils";
import { OrganizationType, UserRole } from "@/lib/generated/prisma";


export default function RegisterPage() {

  const [accountType, setAccountType] = useState<"organization" | "consumer" | null>(null)

  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    agreeToTerms: true,
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
            // formData Values
            organizationType: formData.organizationType,
            companyName: formData.companyName,
            rcNumber: formData.rcNumber,
            nafdacNumber: formData.nafdacNumber,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            contactPersonName: formData.contactPersonName,
            address: formData.address,
            country: formData.country,
            state: formData.state,
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            businessRegNumber: formData.businessRegNumber,
            licenseNumber: formData.licenseNumber,
            pcnNumber: formData.pcnNumber,
            agencyName: formData.agencyName,
            officialId: formData.officialId,
            distributorType: formData.distributorType,
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

  const countries = ["Nigeria"]

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
  ];

  const renderOrganizationSpecificFields = () => {

    switch (formData.organizationType.toUpperCase()) {

      case OrganizationType.MANUFACTURER:

        return (
          <>
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground mb-2 block">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="rcNumber" className="text-sm font-medium text-foreground mb-2 block">
                RC Number (Registration Certificate) *
              </Label>
              <Input
                id="rcNumber"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="Enter RC number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="nafdacNumber" className="text-sm font-medium text-foreground mb-2 block">
                NAFDAC Registration Number *
              </Label>
              <Input
                id="nafdacNumber"
                value={formData.nafdacNumber}
                onChange={(e) => setFormData({ ...formData, nafdacNumber: e.target.value })}
                placeholder="Enter NAFDAC registration number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                Country of Origin *
              </Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="h-11">
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
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Headquarters Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete headquarters address"
                rows={3}
                className="resize-none"
                required
              />
            </div>
          </>
        )

      case OrganizationType.DRUG_DISTRIBUTOR:
        return (
          <>
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground mb-2 block">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="businessRegNumber" className="text-sm font-medium text-foreground mb-2 block">
                Business Registration Number *
              </Label>
              <Input
                id="businessRegNumber"
                value={formData.businessRegNumber}
                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                placeholder="Enter business registration number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="distributorType" className="text-sm font-medium text-foreground mb-2 block">
                Type of Distributor *
              </Label>
              <Select
                value={formData.distributorType}
                onValueChange={(value) => setFormData({ ...formData, distributorType: value })}
              >
                <SelectTrigger className="h-11">
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
              <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                Country of Origin *
              </Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="h-11">
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
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Operating Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete operating address"
                rows={3}
                className="resize-none"
                required
              />
            </div>
          </>
        )

      case OrganizationType.HOSPITAL:
        return (
          <>
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground mb-2 block">
                Hospital Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter hospital name"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber" className="text-sm font-medium text-foreground mb-2 block">
                License Number *
              </Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="Enter hospital license number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                Country of Origin *
              </Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="h-11">
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
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Hospital Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete hospital address"
                rows={3}
                className="resize-none"
                required
              />
            </div>
          </>
        )

      case OrganizationType.PHARMACY:
        return (
          <>
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="pcnNumber" className="text-sm font-medium text-foreground mb-2 block">
                Pharmacist Council of Nigeria (PCN) Registration Number *
              </Label>
              <Input
                id="pcnNumber"
                value={formData.pcnNumber}
                onChange={(e) => setFormData({ ...formData, pcnNumber: e.target.value })}
                placeholder="Enter PCN registration number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground mb-2 block">
                Pharmacy/Hospital Affiliation (Optional)
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter pharmacy or hospital name"
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
                className="resize-none"
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                Country of Origin *
              </Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="h-11">
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
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
          </>
        )

      case OrganizationType.REGULATOR:
        return (
          <>
            <div>
              <Label htmlFor="agencyName" className="text-sm font-medium text-foreground mb-2 block">
                Agency Name *
              </Label>
              <Select
                value={formData.agencyName}
                onValueChange={(value) => setFormData({ ...formData, agencyName: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NAFDAC">NAFDAC</SelectItem>
                  <SelectItem value="NDLEA">NDLEA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="businessRegNumber" className="text-sm font-medium text-foreground mb-2 block">
                Department/Unit *
              </Label>
              <Input
                id="businessRegNumber"
                value={formData.businessRegNumber}
                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                placeholder="Enter department or unit"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="officialId" className="text-sm font-medium text-foreground mb-2 block">
                Official ID/Badge Number *
              </Label>
              <Input
                id="officialId"
                value={formData.officialId}
                onChange={(e) => setFormData({ ...formData, officialId: e.target.value })}
                placeholder="Enter official ID or badge number"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                Country of Origin *
              </Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger className="h-11">
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
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
              <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Address *
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
                className="resize-none"
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

    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 -left-40 w-80 h-80 bg-accent/6 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-2/3 left-1/4 w-40 h-40 bg-accent/8 rounded-full blur-xl"></div>
      </div>
      
      {/* Navigation - Updated to match landing page */}
      <nav className="border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-lg glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">MedChain</span>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">Blockchain Verified</span>
              </div>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link href="/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="cursor-pointer font-medium text-xs sm:text-sm px-3 sm:px-6"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="relative max-w-4xl mx-auto">
          {!accountType ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Create Your Account
                </h1>
                <p className="text-lg text-muted-foreground">
                  Choose the account type that best fits your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 group"
                  onClick={() => setAccountType("organization")}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-200">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Organization</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      For manufacturers, distributors, hospitals, pharmacies, and regulatory agencies
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 group"
                  onClick={() => setAccountType("consumer")}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors duration-200">
                      <User className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Consumer</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      For patients and consumers who want to verify medications
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {accountType === "organization" ? "Organization Registration" : "Create Account"}
                </h1>
                <p className="text-muted-foreground">
                  {accountType === "organization"
                    ? "Register your organization to start managing medication verification"
                    : "Create your consumer account for medication verification"}
                </p>
                {accountType === "organization" && (
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      Step {step} of 2
                    </Badge>
                  </div>
                )}
              </div>

              <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                  {accountType === "organization" && (
                    <>
                      {step === 1 && (
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="organizationType" className="text-sm font-medium text-foreground mb-2 block">
                              Organization Type *
                            </Label>
                            <Select
                              value={formData.organizationType}
                              onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                            >
                              <SelectTrigger className="h-11">
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

                          {formData.organizationType && (
                            <div className="space-y-6">
                              <div className="border-t border-border/50 pt-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                  Organization Details
                                </h3>
                                <div className="grid gap-6">
                                  {renderOrganizationSpecificFields()}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="pt-4">
                            <Button
                              type="button"
                              variant="default"
                              size="lg"
                              onClick={() => setStep(2)}
                              className="w-full h-12 font-semibold cursor-pointer"
                              disabled={!formData.organizationType}
                            >
                              Continue to Contact Information
                            </Button>
                          </div>
                        </div>
                      )}
                        
                      {step === 2 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                              Contact Information
                            </h3>
                            <div className="grid gap-6">
                              <div>
                                <Label htmlFor="contactPersonName" className="text-sm font-medium text-foreground mb-2 block">
                                  Contact Person Name *
                                </Label>
                                <Input
                                  id="contactPersonName"
                                  value={formData.contactPersonName}
                                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                                  placeholder="Enter contact person name"
                                  className="h-11"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="contactEmail" className="text-sm font-medium text-foreground mb-2 block">
                                  {formData.organizationType === "Regulator"
                                    ? "Official Email Address *"
                                    : "Contact Person Email *"}
                                </Label>
                                <Input
                                  id="contactEmail"
                                  type="email"
                                  value={formData.contactEmail}
                                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                  placeholder="Enter email address"
                                  className="h-11"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="contactPhone" className="text-sm font-medium text-foreground mb-2 block">
                                  {formData.organizationType === "Regulator"
                                    ? "Official Phone Number *"
                                    : "Contact Person Phone Number *"}
                                </Label>
                                <Input
                                  id="contactPhone"
                                  type="tel"
                                  value={formData.contactPhone}
                                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                  placeholder="Enter phone number"
                                  className="h-11"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/50 pt-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                              Account Security
                            </h3>
                            <div className="grid gap-6">
                              <div>
                                <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                                  Password *
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a secure password"
                                    className="h-11 pr-10"
                                    required
                                  />
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                  >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-2 block">
                                  Confirm Password *
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Confirm your password"
                                    className="h-11 pr-10"
                                    required
                                  />
                                  <button
                                    type="button"
                                    tabIndex={-1}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-border/50 pt-6">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                                className="mt-1"
                              />
                              <Label htmlFor="agreeToTerms" className="text-sm text-foreground leading-relaxed">
                                I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                              </Label>
                            </div>
                            <div className="mt-4">
                              <div id="clerk-captcha"></div>
                            </div>
                          </div>

                          <div className="flex space-x-4 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1 h-12 cursor-pointer"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              variant="default"
                              size="lg"
                              className="flex-1 h-12 font-semibold cursor-pointer"
                              disabled={isLoading}
                            >
                              {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {accountType === "consumer" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Personal Information
                        </h3>
                        <div className="grid gap-6">
                          <div>
                            <Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
                              Full Name *
                            </Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Enter your full name"
                              className="h-11"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactEmail" className="text-sm font-medium text-foreground mb-2 block">
                              Email Address *
                            </Label>
                            <Input
                              id="contactEmail"
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                              placeholder="Enter your email"
                              className="h-11"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactPhone" className="text-sm font-medium text-foreground mb-2 block">
                              Phone Number *
                            </Label>
                            <Input
                              id="contactPhone"
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              placeholder="Enter your phone number"
                              className="h-11"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground mb-2 block">
                              Date of Birth *
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                              className="h-11"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Location Information
                        </h3>
                        <div className="grid gap-6">
                          <div>
                            <Label htmlFor="country" className="text-sm font-medium text-foreground mb-2 block">
                              Country *
                            </Label>
                            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                              <SelectTrigger className="h-11">
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
                          <div>
                            <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                              State *
                            </Label>
                            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                              <SelectTrigger className="h-11">
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
                            <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                              Address *
                            </Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Enter your complete address"
                              rows={3}
                              className="resize-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Account Security
                        </h3>
                        <div className="grid gap-6">
                          <div>
                            <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                              Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Create a secure password"
                                className="h-11 pr-10"
                                required
                              />
                              <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-2 block">
                              Confirm Password *
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm your password"
                                className="h-11 pr-10"
                                required
                              />
                              <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border/50 pt-6">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                            className="mt-1"
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm text-foreground leading-relaxed">
                            I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </Label>
                        </div>
                        <div className="mt-4">
                          <div id="clerk-captcha"></div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          variant="default"
                          size="lg"
                          className="w-full h-12 font-semibold"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </div>
                    </div>
                  )}
                    
                </form>

                <div className="mt-8 text-center">
                  <Button 
                    variant="outline"
                    onClick={() => setAccountType(null)} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Choose Different Account Type
                  </Button>
                </div>
                  
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
