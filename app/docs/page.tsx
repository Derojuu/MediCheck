//here w e created the swagger ui page for api documentation
'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Shield, FileText, Code2, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

// Import Swagger UI dynamically (client-side only) to avoid SSR issues
const SwaggerUI = dynamic<any>(() => import('swagger-ui-react').then(mod => mod.default), { ssr: false })

// Import Swagger UI styles
import 'swagger-ui-react/swagger-ui.css'
import './swagger-ui.css'

export default function ApiDocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent p-2.5 sm:p-3 rounded-xl">
                  <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MediCheck API Documentation
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1 leading-snug">
                  AI + Blockchain Medication Verification & Traceability Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <ThemeToggle />
              <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">OpenAPI Version</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.0.0</div>
              <p className="text-xs text-muted-foreground mt-1">
                Industry standard API specification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50+</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across 14 feature categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">OpenAPI JSON</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Link 
                href="/api-docs" 
                target="_blank"
                className="text-sm text-primary hover:underline font-medium"
              >
                View Raw Specification →
              </Link>
              <p className="text-xs text-muted-foreground mt-1">
                Import into Postman or other tools
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Tags */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Categories</CardTitle>
            <CardDescription>
              Our API is organized into the following feature areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Authentication</Badge>
              <Badge variant="secondary">Organizations</Badge>
              <Badge variant="secondary">Team Members</Badge>
              <Badge variant="secondary">Batches</Badge>
              <Badge variant="secondary">Products</Badge>
              <Badge variant="secondary">Transfers</Badge>
              <Badge variant="secondary">Verification</Badge>
              <Badge variant="secondary">Hospital</Badge>
              <Badge variant="secondary">Regulator</Badge>
              <Badge variant="secondary">Consumer</Badge>
              <Badge variant="secondary">Dashboard</Badge>
              <Badge variant="secondary">Analytics</Badge>
              <Badge variant="secondary">AI Services</Badge>
              <Badge variant="secondary">Hotspots</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              How to use this interactive API documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Browse endpoints by category</p>
                <p className="text-xs text-muted-foreground">Click on any tag below to expand and see all endpoints in that category</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                2
              </div>
              <div>
                <p className="text-sm font-medium">View request/response schemas</p>
                <p className="text-xs text-muted-foreground">Each endpoint shows required parameters, request body format, and response structure</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Test endpoints directly</p>
                <p className="text-xs text-muted-foreground">Click "Try it out" on any endpoint, add authentication token (for protected routes), and execute requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swagger UI Container */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive API Reference</CardTitle>
            <CardDescription>
              Explore all endpoints, request/response schemas, and data models
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="swagger-ui-container">
              <SwaggerUI 
                url="/api-docs"
                docExpansion="list"
                defaultModelsExpandDepth={1}
                defaultModelExpandDepth={1}
                displayRequestDuration={true}
                filter={true}
                showExtensions={true}
                showCommonExtensions={true}
                tryItOutEnabled={true}
                persistAuthorization={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This documentation is auto-generated from our OpenAPI 3.0 specification. 
            For questions or support, contact{' '}
            <a href="mailto:support@medicheck.com" className="text-primary hover:underline">
              support@medicheck.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
