import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user and their consumer profile
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        consumer: true,
      },
    });

    if (!user || !user.consumer) {
      return NextResponse.json({ error: 'Consumer profile not found' }, { status: 404 });
    }

    // Get total scans count
    const totalScans = await prisma.scanHistory.count({
      where: {
        consumerId: user.consumer.id,
      },
    });

    // Format the response
    const profile = {
      name: user.consumer.fullName,
      email: user.consumer.phoneNumber || 'N/A', // You might want to get email from Clerk
      joinDate: user.createdAt.toISOString().split('T')[0],
      totalScans,
      dateOfBirth: user.consumer.dateOfBirth?.toISOString().split('T')[0] || null,
      phoneNumber: user.consumer.phoneNumber,
      address: user.consumer.address,
      country: user.consumer.country,
      state: user.consumer.state,
      language: 'English', // Default for now, we'll add this field later
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching consumer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consumer profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { language, fullName, phoneNumber, address, country, state, dateOfBirth } = body;

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        consumer: true,
      },
    });

    if (!user || !user.consumer) {
      return NextResponse.json({ error: 'Consumer profile not found' }, { status: 404 });
    }

    // Update consumer profile
    const updatedConsumer = await prisma.consumer.update({
      where: {
        id: user.consumer.id,
      },
      data: {
        fullName: fullName || user.consumer.fullName,
        phoneNumber: phoneNumber || user.consumer.phoneNumber,
        address: address || user.consumer.address,
        country: country || user.consumer.country,
        state: state || user.consumer.state,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.consumer.dateOfBirth,
      },
    });

    // For now, we'll store language preference in localStorage on frontend
    // In a real app, you'd want to add a language field to the Consumer model

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      consumer: updatedConsumer 
    });
  } catch (error) {
    console.error('Error updating consumer profile:', error);
    return NextResponse.json(
      { error: 'Failed to update consumer profile' },
      { status: 500 }
    );
  }
}