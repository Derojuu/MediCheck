// app/api/team-members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamMemberId = params.id
    const body = await request.json()
    const { name, role, department, isAdmin, isActive } = body

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organizations: true,
        teamMember: {
          include: {
            organization: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the team member to be updated
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      include: {
        organization: true
      }
    })

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Check if user has permission to update this team member
    const hasAccess = user.organizations?.id === teamMember.organizationId || 
                     (user.teamMember?.organizationId === teamMember.organizationId && user.teamMember?.isAdmin)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update team member
    const updatedMember = await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        name,
        role,
        department,
        isAdmin,
        isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Team member updated successfully',
      teamMember: updatedMember
    })

  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teamMemberId = params.id

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organizations: true,
        teamMember: {
          include: {
            organization: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the team member to be deleted
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      include: {
        organization: true,
        user: true
      }
    })

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    // Check if user has permission to delete this team member
    const hasAccess = user.organizations?.id === teamMember.organizationId || 
                     (user.teamMember?.organizationId === teamMember.organizationId && user.teamMember?.isAdmin)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete team member and associated user
    await prisma.$transaction(async (tx) => {
      // Delete team member
      await tx.teamMember.delete({
        where: { id: teamMemberId }
      })

      // Delete associated user if they only existed as a team member
      if (teamMember.user.userRole === 'ORGANIZATION_MEMBER') {
        await tx.user.delete({
          where: { id: teamMember.userId }
        })
      }
    })

    return NextResponse.json({ message: 'Team member removed successfully' })

  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}