"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Save, X } from "lucide-react"

interface ProfileEditModalProps {
  userType: "organization" | "team-member" | "consumer"
  currentData?: any
}

export function ProfileEditModal({ userType, currentData }: ProfileEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState(currentData || {})

  const handleSave = () => {
    // Handle save logic here
    console.log("[v0] Saving profile data:", formData)
    setIsOpen(false)
  }

  const renderOrganizationFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={formData.companyName || ""}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registrationNumber">Registration Number</Label>
        <Input
          id="registrationNumber"
          value={formData.registrationNumber || ""}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson || ""}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="cursor-pointer"
        />
      </div>
    </>
  )

  const renderTeamMemberFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName || ""}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={formData.role || ""} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality-control">Quality Control Manager</SelectItem>
            <SelectItem value="pharmacist">Pharmacist</SelectItem>
            <SelectItem value="lab-technician">Lab Technician</SelectItem>
            <SelectItem value="logistics">Logistics Coordinator</SelectItem>
            <SelectItem value="compliance">Compliance Officer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department || ""}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="cursor-pointer"
        />
      </div>
    </>
  )

  const renderConsumerFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName || ""}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="cursor-pointer"
        />
      </div>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer bg-transparent">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {userType === "organization" && renderOrganizationFields()}
          {userType === "team-member" && renderTeamMemberFields()}
          {userType === "consumer" && renderConsumerFields()}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
