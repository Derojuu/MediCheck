# Simple Transfer Ownership API

## Overview
Simplified pharmaceutical supply chain transfer ownership API focused on status management and approval workflows. 

## Key Features
- Create transfers in OwnershipTransfer table with PENDING status
- Get transfers where organization is sender OR receiver
- Update transfer status (approval endpoint)
- Focus on status, approval, and basic CRUD operations

## Endpoints

### 1. Create Transfer (POST)
**Endpoint:** `/api/transfer/ownership`

**Request Body:**
```json
{
  "batchId": "batch-id",
  "fromOrgId": "sending-org-id", 
  "toOrgId": "receiving-org-id",
  "notes": "Optional transfer notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transfer created successfully",
  "transferId": "generated-id",
  "status": "PENDING"
}
```

### 2. Get Organization Transfers (GET)
**Endpoint:** `/api/transfer/ownership?organizationId=org-id`

**Response:**
```json
{
  "transfers": [
    {
      "id": "transfer-id",
      "batchId": "batch-id",
      "fromOrgId": "sender-id",
      "toOrgId": "receiver-id", 
      "status": "PENDING",
      "notes": "Transfer notes",
      "transferDate": "2024-01-01T00:00:00.000Z",
      "batch": {
        "batchId": "batch-123",
        "drugName": "Medication Name",
        "batchSize": 1000,
        "manufacturingDate": "2024-01-01T00:00:00.000Z",
        "expiryDate": "2025-01-01T00:00:00.000Z"
      },
      "fromOrg": {
        "companyName": "Sender Company",
        "organizationType": "MANUFACTURER",
        "contactEmail": "sender@company.com"
      },
      "toOrg": {
        "companyName": "Receiver Company", 
        "organizationType": "PHARMACY",
        "contactEmail": "receiver@company.com"
      }
    }
  ]
}
```

### 3. Update Transfer Status (PUT)
**Endpoint:** `/api/transfer/ownership/[transferId]`

**Request Body:**
```json
{
  "organizationId": "org-id",
  "status": "IN_PROGRESS", 
  "notes": "Status update notes"
}
```

**Valid Status Values:**
- `PENDING` - Initial status
- `IN_PROGRESS` - Transfer in progress
- `COMPLETED` - Transfer completed successfully
- `FAILED` - Transfer failed
- `CANCELLED` - Transfer cancelled

**Response:**
```json
{
  "success": true,
  "message": "Transfer status updated successfully",
  "transferId": "transfer-id",
  "previousStatus": "PENDING",
  "newStatus": "IN_PROGRESS"
}
```

### 4. Get Transfer Details (GET)
**Endpoint:** `/api/transfer/ownership/[transferId]`

**Response:**
```json
{
  "transfer": {
    "id": "transfer-id",
    "batchId": "batch-id",
    "fromOrgId": "sender-id",
    "toOrgId": "receiver-id",
    "status": "PENDING",
    "notes": "Transfer notes",
    "transferDate": "2024-01-01T00:00:00.000Z",
    "batch": {
      "batchId": "batch-123",
      "drugName": "Medication Name",
      "batchSize": 1000,
      "manufacturingDate": "2024-01-01T00:00:00.000Z",
      "expiryDate": "2025-01-01T00:00:00.000Z"
    },
    "fromOrg": {
      "companyName": "Sender Company",
      "organizationType": "MANUFACTURER",
      "contactEmail": "sender@company.com"
    },
    "toOrg": {
      "companyName": "Receiver Company",
      "organizationType": "PHARMACY", 
      "contactEmail": "receiver@company.com"
    }
  }
}
```

## Usage Examples

### Creating a Transfer
```bash
curl -X POST /api/transfer/ownership \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "batch-123",
    "fromOrgId": "manufacturer-1",
    "toOrgId": "pharmacy-1",
    "notes": "Regular supply transfer"
  }'
```

### Getting Organization Transfers
```bash
curl /api/transfer/ownership?organizationId=manufacturer-1
```

### Approving/Updating Transfer
```bash
curl -X PUT /api/transfer/ownership/transfer-id \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "pharmacy-1",
    "status": "COMPLETED",
    "notes": "Transfer received and verified"
  }'
```

## Status Workflow
1. **PENDING** → Initial status when transfer is created
2. **IN_PROGRESS** → Transfer is being processed
3. **COMPLETED** → Transfer successfully completed
4. **FAILED** → Transfer failed for some reason
5. **CANCELLED** → Transfer was cancelled

## Authentication & Authorization
- Organization must be either sender (fromOrgId) or receiver (toOrgId) to access/modify transfer
- Only involved organizations can update transfer status
- No complex validation - focuses on core CRUD operations

## Database Schema
Uses `OwnershipTransfer` table with:
- `id` - Unique transfer identifier
- `batchId` - Reference to medication batch
- `fromOrgId` - Sending organization
- `toOrgId` - Receiving organization  
- `status` - Transfer status (enum)
- `notes` - Optional transfer notes
- `transferDate` - Transfer creation timestamp
      "notes": "Transfer note",
      "transferDate": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      
      "direction": "OUTGOING", // or "INCOMING"
      "requiresApproval": true,
      "canApprove": true,
      
      "batch": { 
        "batchId": "BATCH-001", 
        "drugName": "Aspirin",
        "batchSize": 1000
      },
      "fromOrg": { 
        "companyName": "Manufacturer A",
        "organizationType": "MANUFACTURER"
      },
      "toOrg": { 
        "companyName": "Distributor B",
        "organizationType": "DRUG_DISTRIBUTOR"
      }
    }
  ],
  "total": 10
}
```

---

## ✅ **PUT** `/api/transfer/ownership/{transferId}`
**Updates transfer status (simplified approval)**

### Request Body
```json
{
  "organizationId": "string",
  "status": "PENDING|IN_PROGRESS|COMPLETED|FAILED|CANCELLED",
  "notes": "string" // Optional
}
```

### Response
```json
{
  "success": true,
  "message": "Transfer status updated",
  "transferId": "transfer_123",
  "previousStatus": "PENDING",
  "newStatus": "IN_PROGRESS"
}
```

---

## 🔍 **GET** `/api/transfer/ownership/{transferId}`
**Gets specific transfer details**

### Response
```json
{
  "transfer": {
    "id": "transfer_123",
    "batchId": "batch_456",
    "fromOrgId": "org_1",
    "toOrgId": "org_2",
    "status": "COMPLETED",
    "notes": "Transfer completed",
    "transferDate": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z",
    
    "batch": {
      "batchId": "BATCH-001",
      "drugName": "Aspirin",
      "batchSize": 1000
    },
    "fromOrg": {
      "companyName": "Manufacturer A",
      "organizationType": "MANUFACTURER"
    },
    "toOrg": {
      "companyName": "Distributor B",
      "organizationType": "DRUG_DISTRIBUTOR"
    }
  }
}
```

---

## 🔄 **Transfer Status Values**

- **PENDING** - Transfer created, awaiting action
- **IN_PROGRESS** - Transfer approved, in progress  
- **COMPLETED** - Transfer successfully completed
- **FAILED** - Transfer failed or rejected
- **CANCELLED** - Transfer cancelled

---

## 🎯 **Usage Examples**

### Create Transfer
```javascript
const response = await fetch('/api/transfer/ownership', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    batchId: 'batch_123',
    fromOrgId: 'manufacturer_1',
    toOrgId: 'distributor_1',
    notes: 'Wholesale order #12345'
  })
});
```

### Get Organization Transfers
```javascript
// Get all transfers for organization
const response = await fetch('/api/transfer/ownership?organizationId=org_123');

// Get only pending transfers
const pending = await fetch('/api/transfer/ownership?organizationId=org_123&status=PENDING');
```

### Update Transfer Status
```javascript
const response = await fetch('/api/transfer/ownership/transfer_123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    organizationId: 'org_123',
    status: 'IN_PROGRESS',
    notes: 'Approved for shipment'
  })
});
```

### Get Specific Transfer
```javascript
const response = await fetch('/api/transfer/ownership/transfer_123');
```

---

## ✨ **Key Features**

- ✅ **Simple CRUD** - Direct operations on OwnershipTransfer table
- ✅ **Status Focus** - Simple status management (PENDING → IN_PROGRESS → COMPLETED)
- ✅ **Bidirectional Query** - Shows transfers where org is sender OR receiver  
- ✅ **Direction Labels** - Clear INCOMING/OUTGOING identification
- ✅ **Approval Tracking** - Shows which transfers need approval
- ✅ **Basic Validation** - Organization authorization checks
- ✅ **Clean Responses** - Simple, focused JSON responses

---

## 🔒 **Security**

- Organizations can only view transfers they're involved in
- Only organizations involved in a transfer can update its status
- Basic validation on required fields and status values
