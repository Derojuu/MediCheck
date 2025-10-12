import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Find the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        teamMember: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Determine role and organization type
    let role = dbUser.userRole;
    let organizationType = null;
    let organizationId = null;

    if (dbUser.teamMember?.organization) {
      organizationType = dbUser.teamMember.organization.organizationType;
      organizationId = dbUser.teamMember.organizationId;
    }

    console.log("Setting user session data:", { 
      userId: user.id, 
      role, 
      organizationType, 
      organizationId 
    });

    // Create response with cookie fallback
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        role,
        organizationType,
        organizationId
      }
    });

    // Set cookie as fallback for middleware (organizationId not needed in cookie since middleware only uses role/orgType)
    if (role && organizationType) {
      response.cookies.set('user_fallback', JSON.stringify({
        role,
        organizationType
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }

    return response;

  } catch (error) {
    console.error('Error in user session setup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}