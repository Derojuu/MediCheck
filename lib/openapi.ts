import type { OpenAPIV3 } from 'openapi-types'

export const openApiDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'MediCheck API',
    version: '1.0.0',
    description: `
# MediCheck API Documentation

AI + Blockchain powered medication verification and traceability platform.

## Features
- 🔐 Secure authentication with Clerk
- 🏢 Multi-organization support
- 💊 Batch and product management
- 🔄 Ownership transfer tracking
- ✅ Real-time verification
- 📊 Advanced analytics and reporting
- 🤖 AI-powered insights and predictions
- 🌐 Counterfeit hotspot detection

## Authentication
Most endpoints require authentication using Clerk JWT tokens. Include your token in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_CLERK_TOKEN
\`\`\`

## Base URL
Development: \`http://localhost:3000\`
Production: \`https://your-production-url.com\`
    `,
    contact: {
      name: 'MediCheck Support',
      email: 'support@medicheck.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Authentication', description: 'User registration and team member authentication' },
    { name: 'Organizations', description: 'Organization management and information' },
    { name: 'Team Members', description: 'Team member invitation and management' },
    { name: 'Batches', description: 'Medication batch creation and management' },
    { name: 'Products', description: 'Product registration and catalog' },
    { name: 'Transfers', description: 'Batch ownership transfers and tracking' },
    { name: 'Verification', description: 'Batch and unit authenticity verification' },
    { name: 'Hospital', description: 'Hospital-specific endpoints and inventory' },
    { name: 'Regulator', description: 'Regulatory authority management and oversight' },
    { name: 'Consumer', description: 'Consumer profile and scan history' },
    { name: 'Dashboard', description: 'Dashboard statistics and analytics' },
    { name: 'Analytics', description: 'Advanced analytics and reporting' },
    { name: 'AI Services', description: 'AI-powered chat, translation, and predictions' },
    { name: 'Hotspots', description: 'Counterfeit hotspot detection and prediction' }
  ],
  paths: {
    '/api/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new organization',
        description: 'Register a new organization with team member details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['organizationName', 'organizationType', 'clerkUserId', 'email', 'firstName', 'lastName'],
                properties: {
                  organizationName: { type: 'string', example: 'MediCorp Pharmaceuticals' },
                  organizationType: { 
                    type: 'string', 
                    enum: ['MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY', 'HOSPITAL', 'REGULATOR'],
                    example: 'MANUFACTURER'
                  },
                  clerkUserId: { type: 'string', example: 'user_2abc123def456' },
                  email: { type: 'string', format: 'email', example: 'admin@medicorp.com' },
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  phoneNumber: { type: 'string', example: '+1234567890' },
                  address: { type: 'string', example: '123 Pharma Street' },
                  licenseNumber: { type: 'string', example: 'LIC-12345' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Organization registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/verify': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify team member credentials',
        description: 'Authenticate team member and return organization details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clerkUserId'],
                properties: {
                  clerkUserId: { type: 'string', example: 'user_2abc123def456' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Team member verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    teamMember: { $ref: '#/components/schemas/TeamMember' },
                    organization: { $ref: '#/components/schemas/Organization' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/organizations': {
      get: {
        tags: ['Organizations'],
        summary: 'Get all organizations',
        description: 'Retrieve a list of all registered organizations',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'List of organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Organization' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Organizations'],
        summary: 'Create organization',
        description: 'Create a new organization',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type'],
                properties: {
                  name: { type: 'string', example: 'Central Hospital' },
                  type: { 
                    type: 'string',
                    enum: ['MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY', 'HOSPITAL', 'REGULATOR'],
                    example: 'HOSPITAL'
                  },
                  address: { type: 'string', example: '456 Health Ave' },
                  phoneNumber: { type: 'string', example: '+1987654321' },
                  licenseNumber: { type: 'string', example: 'HOSP-789' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Organization created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/organizations/{id}': {
      get: {
        tags: ['Organizations'],
        summary: 'Get organization by ID',
        description: 'Retrieve detailed information about a specific organization',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Organization ID'
          }
        ],
        responses: {
          '200': {
            description: 'Organization details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      put: {
        tags: ['Organizations'],
        summary: 'Update organization',
        description: 'Update organization details',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Organization ID'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  address: { type: 'string' },
                  phoneNumber: { type: 'string' },
                  licenseNumber: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Organization updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Organization' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/organizations/{organizationId}/team-members': {
      get: {
        tags: ['Team Members'],
        summary: 'Get team members',
        description: 'Get all team members for an organization',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Organization ID'
          }
        ],
        responses: {
          '200': {
            description: 'List of team members',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TeamMember' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Team Members'],
        summary: 'Invite team member',
        description: 'Send invitation to join organization',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'role'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'newmember@medicorp.com' },
                  role: { 
                    type: 'string',
                    enum: ['ADMIN', 'MANAGER', 'STAFF'],
                    example: 'STAFF'
                  },
                  firstName: { type: 'string', example: 'Jane' },
                  lastName: { type: 'string', example: 'Smith' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Invitation sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    invitation: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/organizations/{organizationId}/team-members/{memberId}': {
      delete: {
        tags: ['Team Members'],
        summary: 'Remove team member',
        description: 'Remove a team member from the organization',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'memberId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Team member removed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/batches': {
      get: {
        tags: ['Batches'],
        summary: 'Get all batches',
        description: 'Retrieve all batches with optional filtering',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by organization ID'
          },
          {
            name: 'status',
            in: 'query',
            schema: { 
              type: 'string',
              enum: ['ACTIVE', 'RECALLED', 'EXPIRED']
            },
            description: 'Filter by batch status'
          }
        ],
        responses: {
          '200': {
            description: 'List of batches',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Batch' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Batches'],
        summary: 'Create new batch',
        description: 'Create a new medication batch with QR codes',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'batchNumber', 'manufacturingDate', 'expiryDate', 'quantity'],
                properties: {
                  productId: { type: 'string', example: 'prod_123' },
                  batchNumber: { type: 'string', example: 'BATCH-2025-001' },
                  manufacturingDate: { type: 'string', format: 'date', example: '2025-01-15' },
                  expiryDate: { type: 'string', format: 'date', example: '2027-01-15' },
                  quantity: { type: 'integer', example: 1000, minimum: 1 },
                  notes: { type: 'string', example: 'Quality checked and approved' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Batch created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Batch' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/batches/{id}': {
      get: {
        tags: ['Batches'],
        summary: 'Get batch details',
        description: 'Get detailed information about a specific batch',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Batch ID'
          }
        ],
        responses: {
          '200': {
            description: 'Batch details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Batch' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Retrieve product catalog',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Register new product',
        description: 'Register a new medication product',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'dosage', 'form'],
                properties: {
                  name: { type: 'string', example: 'Amoxicillin' },
                  dosage: { type: 'string', example: '500mg' },
                  form: { 
                    type: 'string',
                    enum: ['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'OTHER'],
                    example: 'CAPSULE'
                  },
                  description: { type: 'string', example: 'Antibiotic for bacterial infections' },
                  manufacturer: { type: 'string', example: 'MediCorp Pharmaceuticals' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Product registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/transfer': {
      post: {
        tags: ['Transfers'],
        summary: 'Create transfer',
        description: 'Initiate a batch ownership transfer',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['batchId', 'fromOrganizationId', 'toOrganizationId'],
                properties: {
                  batchId: { type: 'string', example: 'batch_123' },
                  fromOrganizationId: { type: 'string', example: 'org_456' },
                  toOrganizationId: { type: 'string', example: 'org_789' },
                  quantity: { type: 'integer', example: 100 },
                  notes: { type: 'string', example: 'Regular supply delivery' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Transfer created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transfer' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      },
      get: {
        tags: ['Transfers'],
        summary: 'Get transfers',
        description: 'Get transfer history with optional filtering',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by organization'
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED']
            }
          }
        ],
        responses: {
          '200': {
            description: 'List of transfers',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Transfer' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/transfer/{id}/status': {
      put: {
        tags: ['Transfers'],
        summary: 'Update transfer status',
        description: 'Update the status of a transfer',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['ACCEPTED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED']
                  },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Transfer status updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Transfer' }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/verify/batch/{batchId}': {
      get: {
        tags: ['Verification'],
        summary: 'Verify batch authenticity',
        description: 'Verify if a batch is authentic and get its details',
        parameters: [
          {
            name: 'batchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Batch ID to verify'
          }
        ],
        responses: {
          '200': {
            description: 'Batch verification result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isAuthentic: { type: 'boolean' },
                    batch: { $ref: '#/components/schemas/Batch' },
                    product: { $ref: '#/components/schemas/Product' },
                    manufacturer: { $ref: '#/components/schemas/Organization' },
                    transferHistory: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Transfer' }
                    }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/verify/batchUnit/{unitId}': {
      get: {
        tags: ['Verification'],
        summary: 'Verify batch unit',
        description: 'Verify individual batch unit and track scan',
        parameters: [
          {
            name: 'unitId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Unit verification result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isAuthentic: { type: 'boolean' },
                    unit: { $ref: '#/components/schemas/BatchUnit' },
                    batch: { $ref: '#/components/schemas/Batch' },
                    product: { $ref: '#/components/schemas/Product' },
                    scanCount: { type: 'integer' }
                  }
                }
              }
            }
          },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/hospital/stats': {
      get: {
        tags: ['Hospital', 'Dashboard'],
        summary: 'Get hospital statistics',
        description: 'Get dashboard statistics for hospital',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Hospital statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalInventory: { type: 'integer' },
                    lowStockItems: { type: 'integer' },
                    expiringItems: { type: 'integer' },
                    recentScans: { type: 'integer' },
                    alerts: { type: 'integer' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/hospital/inventory': {
      get: {
        tags: ['Hospital'],
        summary: 'Get hospital inventory',
        description: 'Get current inventory for hospital',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Hospital inventory',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Batch' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/hospital/alerts': {
      get: {
        tags: ['Hospital'],
        summary: 'Get hospital alerts',
        description: 'Get active alerts for hospital',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Hospital alerts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string', enum: ['LOW_STOCK', 'EXPIRING', 'EXPIRED', 'RECALLED'] },
                      severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                      message: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/regulator/stats': {
      get: {
        tags: ['Regulator', 'Dashboard'],
        summary: 'Get regulator statistics',
        description: 'Get dashboard statistics for regulatory authority',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'Regulator statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalOrganizations: { type: 'integer' },
                    totalBatches: { type: 'integer' },
                    totalTransfers: { type: 'integer' },
                    recentVerifications: { type: 'integer' },
                    suspiciousActivities: { type: 'integer' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/regulator/organizations': {
      get: {
        tags: ['Regulator'],
        summary: 'Get all organizations (regulator)',
        description: 'Get all registered organizations for regulatory oversight',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'List of organizations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Organization' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/regulator/batches': {
      get: {
        tags: ['Regulator'],
        summary: 'Get all batches (regulator)',
        description: 'Get all batches across all organizations',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'List of batches',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Batch' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/regulator/transfers': {
      get: {
        tags: ['Regulator'],
        summary: 'Get all transfers (regulator)',
        description: 'Get all transfers across the supply chain',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'List of transfers',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Transfer' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/dashboard/regulator/suspicious-activities': {
      get: {
        tags: ['Regulator'],
        summary: 'Get suspicious activities',
        description: 'Get flagged suspicious activities for investigation',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'Suspicious activities',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: { type: 'string' },
                      description: { type: 'string' },
                      severity: { type: 'string' },
                      relatedEntity: { type: 'string' },
                      detectedAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/consumer/profile': {
      get: {
        tags: ['Consumer'],
        summary: 'Get consumer profile',
        description: 'Get consumer profile and scan history',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'consumerId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Consumer profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Consumer' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/consumer/scan-history': {
      get: {
        tags: ['Consumer'],
        summary: 'Get scan history',
        description: 'Get consumer scan history',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'consumerId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 }
          }
        ],
        responses: {
          '200': {
            description: 'Scan history',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ScanHistory' }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/analytics/reports': {
      get: {
        tags: ['Analytics'],
        summary: 'Get analytics reports',
        description: 'Get comprehensive analytics reports',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'organizationId',
            in: 'query',
            schema: { type: 'string' }
          },
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date' }
          }
        ],
        responses: {
          '200': {
            description: 'Analytics reports',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    summary: { type: 'object' },
                    trends: { type: 'array', items: { type: 'object' } },
                    insights: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/analytics/batch/{batchId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get batch analytics',
        description: 'Get detailed analytics for a specific batch',
        security: [{ clerkAuth: [] }],
        parameters: [
          {
            name: 'batchId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Batch analytics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    batchId: { type: 'string' },
                    totalScans: { type: 'integer' },
                    uniqueConsumers: { type: 'integer' },
                    geographicDistribution: { type: 'object' },
                    transferChain: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/chat': {
      post: {
        tags: ['AI Services'],
        summary: 'AI chat assistant',
        description: 'Interact with AI assistant for medication information',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', example: 'What are the side effects of this medication?' },
                  context: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'AI response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: { type: 'string' },
                    suggestions: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/ai/translate': {
      post: {
        tags: ['AI Services'],
        summary: 'Translate medication info',
        description: 'Translate medication information to different languages',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text', 'targetLanguage'],
                properties: {
                  text: { type: 'string' },
                  targetLanguage: { 
                    type: 'string',
                    example: 'es',
                    description: 'ISO 639-1 language code'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Translated text',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    translatedText: { type: 'string' },
                    sourceLanguage: { type: 'string' },
                    targetLanguage: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/ai/predict-demand': {
      post: {
        tags: ['AI Services'],
        summary: 'Predict medication demand',
        description: 'Predict future medication demand using ML',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'string' },
                  historicalData: { type: 'object' },
                  timeframe: { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Demand prediction',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    productId: { type: 'string' },
                    predictions: { 
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          date: { type: 'string', format: 'date' },
                          predictedDemand: { type: 'integer' },
                          confidence: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/hotspots': {
      get: {
        tags: ['Hotspots'],
        summary: 'Get counterfeit hotspots',
        description: 'Get detected counterfeit hotspot locations',
        security: [{ clerkAuth: [] }],
        responses: {
          '200': {
            description: 'Hotspot locations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      location: {
                        type: 'object',
                        properties: {
                          latitude: { type: 'number' },
                          longitude: { type: 'number' },
                          city: { type: 'string' },
                          country: { type: 'string' }
                        }
                      },
                      severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                      incidentCount: { type: 'integer' },
                      lastUpdated: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    },
    '/api/hotspots/predict': {
      post: {
        tags: ['Hotspots'],
        summary: 'Predict potential hotspots',
        description: 'Use ML to predict potential counterfeit hotspots',
        security: [{ clerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  region: { type: 'string' },
                  timeframe: { type: 'string', enum: ['7d', '30d', '90d'] }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Hotspot predictions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    predictions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          location: { type: 'object' },
                          riskScore: { type: 'number' },
                          factors: { type: 'array', items: { type: 'string' } }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '500': { $ref: '#/components/responses/InternalError' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      clerkAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk JWT authentication token'
      }
    },
    schemas: {
      Organization: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'org_abc123' },
          name: { type: 'string', example: 'MediCorp Pharmaceuticals' },
          type: { 
            type: 'string',
            enum: ['MANUFACTURER', 'DISTRIBUTOR', 'PHARMACY', 'HOSPITAL', 'REGULATOR'],
            example: 'MANUFACTURER'
          },
          address: { type: 'string', example: '123 Pharma Street, Medical City' },
          phoneNumber: { type: 'string', example: '+1234567890' },
          licenseNumber: { type: 'string', example: 'LIC-12345' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TeamMember: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          clerkUserId: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { 
            type: 'string',
            enum: ['ADMIN', 'MANAGER', 'STAFF'],
            example: 'STAFF'
          },
          organizationId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod_xyz789' },
          name: { type: 'string', example: 'Amoxicillin' },
          dosage: { type: 'string', example: '500mg' },
          form: { 
            type: 'string',
            enum: ['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'OTHER'],
            example: 'CAPSULE'
          },
          description: { type: 'string', example: 'Antibiotic for bacterial infections' },
          manufacturer: { type: 'string', example: 'MediCorp Pharmaceuticals' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Batch: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'batch_123abc' },
          batchNumber: { type: 'string', example: 'BATCH-2025-001' },
          productId: { type: 'string' },
          product: { $ref: '#/components/schemas/Product' },
          organizationId: { type: 'string' },
          organization: { $ref: '#/components/schemas/Organization' },
          manufacturingDate: { type: 'string', format: 'date' },
          expiryDate: { type: 'string', format: 'date' },
          quantity: { type: 'integer', example: 1000 },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'RECALLED', 'EXPIRED'],
            example: 'ACTIVE'
          },
          hederaTopicId: { type: 'string', description: 'Hedera blockchain topic ID' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      BatchUnit: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          batchId: { type: 'string' },
          unitNumber: { type: 'integer' },
          qrCode: { type: 'string', description: 'QR code data' },
          status: { type: 'string', enum: ['AVAILABLE', 'DISPENSED', 'EXPIRED'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Transfer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          batchId: { type: 'string' },
          batch: { $ref: '#/components/schemas/Batch' },
          fromOrganizationId: { type: 'string' },
          fromOrganization: { $ref: '#/components/schemas/Organization' },
          toOrganizationId: { type: 'string' },
          toOrganization: { $ref: '#/components/schemas/Organization' },
          quantity: { type: 'integer' },
          status: {
            type: 'string',
            enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'IN_TRANSIT', 'COMPLETED'],
            example: 'PENDING'
          },
          notes: { type: 'string' },
          hederaTransactionId: { type: 'string', description: 'Hedera blockchain transaction ID' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Consumer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          clerkUserId: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phoneNumber: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      ScanHistory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          consumerId: { type: 'string' },
          batchUnitId: { type: 'string' },
          batchUnit: { $ref: '#/components/schemas/BatchUnit' },
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' }
            }
          },
          scannedAt: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad request - Invalid input',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: 'Bad Request',
              message: 'Invalid input data',
              statusCode: 400
            }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized - Authentication required',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: 'Unauthorized',
              message: 'Authentication token required',
              statusCode: 401
            }
          }
        }
      },
      NotFound: {
        description: 'Not found - Resource does not exist',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: 'Not Found',
              message: 'Resource not found',
              statusCode: 404
            }
          }
        }
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: 'Internal Server Error',
              message: 'An unexpected error occurred',
              statusCode: 500
            }
          }
        }
      }
    }
  }
}

// Also export as default for compatibility
export default openApiDocument
