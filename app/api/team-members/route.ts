// app/api/team-members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }

    // Verify user has access to this organization
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

    // Check if user is organization owner OR team member of this organization (any team member can view)
    const isOrgOwner = user.organizations?.id === organizationId
    const isTeamMember = user.teamMember?.organizationId === organizationId
    
    console.log('GET Team Members Access check:', {
      userId,
      organizationId,
      userOrgId: user.organizations?.id,
      teamMemberOrgId: user.teamMember?.organizationId,
      isOrgOwner,
      isTeamMember
    })

    if (!isOrgOwner && !isTeamMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch team members
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        organizationId: organizationId
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      isAdmin: member.isAdmin,
      isActive: member.isActive,
      joinDate: member.joinDate.toISOString(),
      lastActive: member.lastActive.toISOString(),
      status: member.isActive ? 'active' : 'inactive'
    }))

    return NextResponse.json({ teamMembers: formattedMembers })

  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}