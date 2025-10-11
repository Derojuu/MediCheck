import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in Clerk
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList({
      emailAddress: [email]
    });

    if (users.data.length === 0) {
      return NextResponse.json(
        { error: "No team member account found with this email address. Please contact your administrator." },
        { status: 404 }
      );
    }

    // The user exists, but we can't directly send magic links via the backend API
    // Clerk's magic links are sent through their sign-in flow on the frontend
    // So we need to tell the frontend to redirect to Clerk's sign-in page
    
    return NextResponse.json({
      success: true,
      message: "Account found. Redirecting to sign-in...",
      userExists: true,
      email: email
    });

  } catch (error) {
    console.error("Team member login error:", error);
    
    // Handle specific Clerk errors
    if (error instanceof Error) {
      if (error.message.includes('email_address_not_found')) {
        return NextResponse.json(
          { error: "No team member account found with this email address. Please contact your administrator." },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to send login email. Please try again." },
      { status: 500 }
    );
  }
}