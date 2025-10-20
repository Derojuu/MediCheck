import { NextResponse } from 'next/server'
import { openApiDocument } from '@/lib/openapi'

// Force dynamic rendering to ensure fresh spec on each request
export const dynamic = 'force-dynamic'

/**
 * GET /api-docs
 * Serves the OpenAPI 3.0 specification as JSON
 * Used by Swagger UI and external API tools (Postman, Insomnia, etc.)
 */
export async function GET() {
  return NextResponse.json(openApiDocument, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow external tools to fetch
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

/**
 * OPTIONS /api-docs
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
