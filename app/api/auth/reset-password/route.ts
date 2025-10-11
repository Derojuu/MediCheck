// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'

// For Clerk password reset, we don't need a backend API
// Clerk handles password reset entirely on the frontend
// This endpoint exists just for consistency but redirects to frontend handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Return success - the frontend will handle the actual Clerk reset
    return NextResponse.json({ 
      message: 'Please use the form to reset your password',
      email: email
    })

  } catch (error) {
    console.error('Password reset API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}