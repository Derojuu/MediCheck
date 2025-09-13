import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Get organization information
    const organization = await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      select: {
        id: true,
        companyName: true,
        organizationType: true,
        contactEmail: true,
        contactPhone: true,
        contactPersonName: true,
        address: true,
        country: true,
        state: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error fetching organization info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization information' },
      { status: 500 }
    );
  }
}
