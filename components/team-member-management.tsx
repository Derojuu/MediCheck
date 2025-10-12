"use client"

import { useState, useEffect } from "react"
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
import { Users, Plus, Mail, UserCheck, UserX, CheckCircle, XCircle, Trash2, Edit } from "lucide-react"
import { toast } from "react-toastify"

interface TeamMember {
  id: string
  name: string
  email: string
  joinDate: string
  lastActive: string
  status: 'active' | 'inactive'
}



interface TeamMemberManagementProps {
  organizationId: string
  organizationType: string
  onTeamMemberUpdate?: () => void
}

export function TeamMemberManagement({ 
  organizationId, 
  organizationType, 
  onTeamMemberUpdate 
}: TeamMemberManagementProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
  })



  // Fetch team members
  useEffect(() => {
    fetchTeamData()
  }, [organizationId])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/team-members?organizationId=${organizationId}`)

      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers || [])
      } else {
        toast.error('Failed to load team members')
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
      toast.error('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteData.name || !inviteData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inviteData,
          organizationId
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Team member ${inviteData.name} added successfully!`)
        setIsInviteModalOpen(false)
        setInviteData({ name: "", email: "" })
        fetchTeamData()
        onTeamMemberUpdate?.()
      } else {
        toast.error(data.error || 'Failed to add team member')
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      toast.error('Failed to add team member')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMember = async () => {
    if (!editingMember) return

    try {
      setLoading(true)
      const response = await fetch(`/api/team-members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingMember.name
        })
      })

      if (response.ok) {
        toast.success('Team member updated successfully')
        setIsEditModalOpen(false)
        setEditingMember(null)
        fetchTeamData()
        onTeamMemberUpdate?.()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      toast.error('Failed to update team member')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/team-members/${memberId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Team member removed successfully')
        fetchTeamData()
        onTeamMemberUpdate?.()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove team member')
      }
    } catch (error) {
      console.error('Error removing team member:', error)
      toast.error('Failed to remove team member')
    } finally {
      setLoading(false)
      setShowConfirmModal(false)
      setConfirmAction(null)
    }
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div className="flex flex-col">
          <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Team Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your organization's team members and access permissions
          </p>
        </div>
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Members
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Team Members</DialogTitle>
              <DialogDescription>Add new team members to your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="h-11"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsInviteModalOpen(false)} 
                className="cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleInvite} className="cursor-pointer" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Adding...' : 'Add Member'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>



      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Members ({teamMembers.length})
          </CardTitle>
          <CardDescription>All active and inactive team members in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading team members...</span>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
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
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>{member.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMember(member)
                              setIsEditModalOpen(true)
                            }}
                            className="cursor-pointer"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setConfirmAction({ type: 'remove', id: member.id, name: member.name })
                              setShowConfirmModal(true)
                            }}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No team members yet. Start by inviting your first team member!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Member Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update team member information</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="editName"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditModalOpen(false)
                setEditingMember(null)
              }} 
              className="cursor-pointer"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} className="cursor-pointer" disabled={loading}>
              {loading ? 'Updating...' : 'Update Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Confirm Action
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {confirmAction && (
              <p>
                Are you sure you want to remove <strong>{confirmAction.name}</strong> from your team? 
                This action cannot be undone.
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConfirmModal(false)
                setConfirmAction(null)
              }} 
              className="cursor-pointer"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => confirmAction && handleRemoveMember(confirmAction.id)} 
              className="cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Removing...' : 'Remove Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}