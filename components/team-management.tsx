"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Mail, UserCheck, UserX, Clock, CheckCircle, XCircle } from "lucide-react"

export function TeamManagement() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "",
    department: "",
  })

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@pharmacorp.com",
      role: "Quality Control Manager",
      department: "Quality Assurance",
      status: "Active",
      joinDate: "2023-06-15",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@pharmacorp.com",
      role: "Logistics Officer",
      department: "Supply Chain",
      status: "Active",
      joinDate: "2023-08-20",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@pharmacorp.com",
      role: "Pharmacist",
      department: "Production",
      status: "Pending",
      joinDate: "2024-01-10",
      lastActive: "Never",
    },
  ]

  const pendingRequests = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      requestedRole: "Lab Technician",
      requestDate: "2024-01-16",
      status: "Pending Review",
    },
    {
      id: 2,
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      requestedRole: "Compliance Officer",
      requestDate: "2024-01-15",
      status: "Pending Review",
    },
  ]

  const roles = [
    "Quality Control Manager",
    "Pharmacist",
    "Lab Technician",
    "Logistics Officer",
    "Compliance Officer",
    "Production Manager",
    "Store Manager",
  ]

  const departments = [
    "Quality Assurance",
    "Production",
    "Supply Chain",
    "Compliance",
    "Research & Development",
    "Administration",
  ]

  const handleInvite = () => {
    console.log("[v0] Inviting team member:", inviteData)

    const isSuccess = Math.random() > 0.3

    if (isSuccess) {
      setModalMessage(`Invitation sent successfully to ${inviteData.email}`)
      setShowSuccessModal(true)
    } else {
      setModalMessage(`Failed to send invitation to ${inviteData.email}. Please try again.`)
      setShowErrorModal(true)
    }

    setIsInviteModalOpen(false)
    setInviteData({ email: "", role: "", department: "" })
  }

  const handleApproveRequest = (requestId: number) => {
    console.log("[v0] Approving request:", requestId)
    setModalMessage("Team member request approved successfully!")
    setShowSuccessModal(true)
  }

  const handleRejectRequest = (requestId: number) => {
    console.log("[v0] Rejecting request:", requestId)
    setModalMessage("Team member request rejected.")
    setShowErrorModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage your organization's team members and access permissions</p>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-montserrat">Invite Team Member</DialogTitle>
              <DialogDescription>Send an invitation to join your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="cursor-pointer"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select role" />
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
                <Label htmlFor="department">Department</Label>
                <Select
                  value={inviteData.department}
                  onValueChange={(value) => setInviteData({ ...inviteData, department: value })}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={() => setIsInviteModalOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleInvite} className="cursor-pointer">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Success
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{modalMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessModal(false)} className="cursor-pointer">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Error
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{modalMessage}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowErrorModal(false)} className="cursor-pointer">
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Requests
            </CardTitle>
            <CardDescription>Team member requests awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                    <p className="text-sm text-muted-foreground">Requested Role: {request.requestedRole}</p>
                    <p className="text-xs text-muted-foreground">Requested on: {request.requestDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="cursor-pointer">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectRequest(request.id)}
                      className="cursor-pointer"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Members
          </CardTitle>
          <CardDescription>All active and pending team members in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>{member.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
