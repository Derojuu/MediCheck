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
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Building2, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {

  const [accountType, setAccountType] = useState<"organization" | "consumer" | null>(null)

  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

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

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // setErrorMessage("");
    // setIsLoading(true);
    // try {
      
    // }
    // catch (err) {
      
    // }
    // finally {
      
    // }
    if (accountType === "organization") {
      switch (formData.organizationType) {
        case "Hospital":
          router.push("/dashboard/hospital")
          break
        case "Pharmacy":
          router.push("/dashboard/pharmacy")
          break
        case "Regulator":
          router.push("/dashboard/regulator")
          break
        case "Drug Distributor":
          router.push("/dashboard/drug-distributor")
          break
        default:
          router.push("/dashboard/organization")
      }
    } else {
      router.push("/consumer/profile")
    }
  }

  const organizationTypes = ["Manufacturer", "Drug Distributor", "Hospital", "Pharmacy", "Regulator"]

  const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt"]

  const nigerianStates = ["Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Kaduna", "Oyo", "Delta"]

  const renderOrganizationSpecificFields = () => {
    switch (formData.organizationType) {

      case "Manufacturer":
        return (
          <>
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
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
              <Label htmlFor="rcNumber">RC Number (Registration Certificate) *</Label>
              <Input
                id="rcNumber"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="Enter RC number"
                className="cursor-pointer"
                required
              />
            </div>
            <div>
              <Label htmlFor="nafdacNumber">NAFDAC Registration Number *</Label>
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
              <Label htmlFor="address">Headquarters Address *</Label>
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
              <Label htmlFor="country">Country of Origin *</Label>
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

      case "Drug Distributor":
        return (
          <>
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
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
              <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
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
              <Label htmlFor="distributorType">Type of Distributor *</Label>
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
              <Label htmlFor="address">Operating Address *</Label>
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

      case "Hospital":
        return (
          <>
            <div>
              <Label htmlFor="companyName">Hospital Name *</Label>
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
              <Label htmlFor="licenseNumber">License Number *</Label>
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
              <Label htmlFor="address">Address *</Label>
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

      case "Pharmacy":
        return (
          <>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
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
              <Label htmlFor="pcnNumber">Pharmacist Council of Nigeria (PCN) Registration Number *</Label>
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
              <Label htmlFor="state">State of Practice *</Label>
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

      case "Regulator":
        return (
          <>
            <div>
              <Label htmlFor="agencyName">Agency Name *</Label>
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
              <Label htmlFor="businessRegNumber">Department/Unit *</Label>
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
              <Label htmlFor="officialId">Official ID/Badge Number *</Label>
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
              <Label htmlFor="fullName">Full Name *</Label>
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
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-montserrat font-bold text-xl text-foreground">MedChain</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="cursor-pointer">
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
                        Manufacturer, Drug Distributor, Hospital, Pharmacy, or Regulator
                      </p>
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

          ) :
          (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-montserrat font-bold text-2xl">
                      {accountType === "organization" ? "Organization Registration" : "Consumer Registration"}
                    </CardTitle>
                    <CardDescription>
                      {accountType === "organization"
                        ? "Register your organization to start managing medication verification"
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
                            <Label htmlFor="organizationType">Organization Type *</Label>
                            <Select
                              value={formData.organizationType}
                              onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                            >
                              <SelectTrigger className="cursor-pointer">
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

                          {formData.organizationType && renderOrganizationSpecificFields()}

                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full cursor-pointer"
                            disabled={!formData.organizationType}
                          >
                            Continue
                          </Button>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="contactPersonName">Contact Person Name *</Label>
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
                              *
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
                              *
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
                            <Label htmlFor="password">Password *</Label>
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
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
                              I agree to the Terms and Conditions *
                            </Label>
                          </div>
                          <div className="flex space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1 cursor-pointer"
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 cursor-pointer"
                              disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword}
                            >
                              Submit Application
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
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
                          className="cursor-pointer"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="Enter your email"
                          className="cursor-pointer"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="Enter your phone number"
                          className="cursor-pointer"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
                          placeholder="Enter your address"
                          rows={3}
                          className="cursor-pointer"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
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
                          I agree to the Terms and Conditions *
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword}
                      >
                        Create Account
                      </Button>
                    </div>
                  )}
                    
                </form>

                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={() => setAccountType(null)} className="cursor-pointer">
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
