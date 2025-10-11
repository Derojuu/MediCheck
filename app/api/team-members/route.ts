// app/api/team-members/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'

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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, organizationId } = body

    if (!name || !email || !organizationId) {
      return NextResponse.json({ error: 'Name, email, and organizationId are required' }, { status: 400 })
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get organization details for proper metadata
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Check if team member already exists with this email
    const existingTeamMember = await prisma.teamMember.findFirst({
      where: {
        email: email,
        organizationId: organizationId
      }
    })

    if (existingTeamMember) {
      return NextResponse.json({ error: 'Team member with this email already exists in this organization' }, { status: 400 })
    }

    // Check if user already exists in Clerk
    const clerk = await clerkClient()
    try {
      const existingClerkUsers = await clerk.users.getUserList({
        emailAddress: [email]
      })

      if (existingClerkUsers.data.length > 0) {
        return NextResponse.json({ error: 'A user with this email already exists in the system' }, { status: 400 })
      }
    } catch (clerkError) {
      console.error('Error checking existing Clerk users:', clerkError)
    }

    // Create user in Clerk with magic link authentication
    let clerkUser
    try {
      clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        publicMetadata: {
          organizationId: organizationId,
          organizationType: organization.organizationType,
          role: 'ORGANIZATION_MEMBER'
        },
        skipPasswordRequirement: true // This enables magic link authentication
      })
    } catch (clerkError: any) {
      console.error('Clerk user creation error:', {
        error: clerkError,
        errors: clerkError.errors,
        status: clerkError.status,
        clerkTraceId: clerkError.clerkTraceId
      })
      
      if (clerkError.status === 422) {
        return NextResponse.json({ 
          error: 'Unable to create user account. The email may already be in use or invalid.', 
          details: clerkError.errors 
        }, { status: 400 })
      }
      
      throw clerkError
    }

    // Create team member in database
    const dbUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        userRole: 'ORGANIZATION_MEMBER',
        isActive: true
      }
    })

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: dbUser.id,
        name,
        email,
        organizationId,
        isAdmin: false,
        role: '',
        department: '',
        isActive: true
      }
    })

    return NextResponse.json({ 
      message: 'Team member added successfully! They can now login with their email to receive a magic link.',
      teamMember: {
        id: teamMember.id,
        name: teamMember.name,
        email: teamMember.email,
        status: 'active'
      }
    })

  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}