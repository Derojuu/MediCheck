# Transfer Ownership API Documentation

## ✅ Status: FULLY OPERATIONAL
All APIs are working with complete functionality including unit-level transfers.

## Overview
The Transfer Ownership API manages the movement of pharmaceutical batches and units across the supply chain. It supports flexible, non-linear transfers between any organizations in the network.

## 🔧 Recent Updates
- **Prisma Client Regenerated**: All models and enums now available
- **TypeScript Errors Fixed**: Proper typing for all variables
- **Full Functionality Restored**: Unit-level transfers now working
- **Validation Enhanced**: Complete batch and unit validation

## API Endpoints

### 1. Initiate Transfer
**POST** `/api/transfer`

Initiates a transfer between two organizations. Supports both full and partial batch transfers.

#### Request Body
```json
{
  "batchId": "string",
  "fromOrgId": "string", 
  "toOrgId": "string",
  "transferType": "WHOLESALE|DISTRIBUTION|DIRECT_SALE|EMERGENCY|RETURN", // Optional - auto-detected
  "transferQuantity": 100, // Optional - defaults to full batch
  "notes": "string", // Optional
  "estimatedDelivery": "2024-01-01T00:00:00Z", // Optional
  "carrierInfo": { // Optional
    "name": "string",
    "trackingNumber": "string"
  }
}
```

#### Response
```json
{
  "message": "Transfer initiated successfully",
  "transfer": {
    "id": "transfer_id",
    "batchId": "batch_id", 
    "fromOrgId": "org_1",
    "toOrgId": "org_2",
    "status": "PENDING",
    "transferDate": "2024-01-01T00:00:00Z"
  },
  "transferType": "FULL_BATCH|PARTIAL_BATCH",
  "warnings": ["Optional warning messages"]
}
```

### 2. Approve/Reject Transfer
**PUT** `/api/transfer/approve`

Allows organizations to approve or reject pending transfers.

#### Request Body
```json
{
  "transferId": "string",
  "organizationId": "string",
  "action": "APPROVE|REJECT",
  "notes": "string" // Optional
}
```

### 3. Transfer Status & Tracking
**GET** `/api/transfer/status?transferId=xxx` or `/api/transfer/status?batchId=xxx`

Retrieves detailed transfer status and tracking information.

#### Response
```json
{
  "transfer": {
    "id": "transfer_id",
    "status": "PENDING|IN_PROGRESS|COMPLETED|FAILED",
    "batch": { "batchId": "BATCH-001", "drugName": "Aspirin" },
    "fromOrg": { "companyName": "Manufacturer A" },
    "toOrg": { "companyName": "Distributor B" }
  },
  "tracking": {
    "timeline": [
      {
        "status": "INITIATED",
        "timestamp": "2024-01-01T00:00:00Z",
        "description": "Transfer initiated",
        "location": "Manufacturer facility"
      }
    ],
    "currentStatus": "PENDING",
    "transferProgress": 25,
    "estimatedDelivery": "2024-01-03T00:00:00Z"
  }
}
```

### 4. Wholesale Transfer
**POST** `/api/transfer/wholesale`

Specialized endpoint for manufacturer to distributor bulk transfers.

#### Request Body
```json
{
  "batchIds": ["batch_1", "batch_2"],
  "manufacturerId": "string",
  "distributorId": "string", 
  "orderNumber": "string", // Optional
  "shippingDetails": {
    "carrier": "string",
    "trackingNumber": "string",
    "estimatedDelivery": "2024-01-01T00:00:00Z"
  },
  "notes": "string"
}
```

### 5. Transfer History
**GET** `/api/transfer?orgId=xxx&status=xxx&batchId=xxx`

Retrieves transfer history with optional filters.

## Transfer Flow Examples

### 1. Standard Supply Chain Flow
```
MANUFACTURER → DISTRIBUTOR → PHARMACY → CONSUMER
```

### 2. Direct Sales
```
MANUFACTURER → HOSPITAL
MANUFACTURER → PHARMACY
```

### 3. Inter-Facility Transfers
```
HOSPITAL_A → HOSPITAL_B
PHARMACY_A → PHARMACY_B
```

### 4. Returns
```
PHARMACY → DISTRIBUTOR → MANUFACTURER
HOSPITAL → DISTRIBUTOR
```

## Transfer Rules & Validation

### Allowed Transfer Types
- ✅ Manufacturer → Distributor (Wholesale)
- ✅ Distributor → Pharmacy (Distribution)
- ✅ Distributor → Hospital (Distribution)
- ✅ Manufacturer → Hospital (Direct Sale)
- ✅ Manufacturer → Pharmacy (Direct Sale)
- ✅ Hospital → Hospital (Inter-facility)
- ✅ Pharmacy → Pharmacy (Inter-facility)
- ✅ Any → Manufacturer/Distributor (Returns)
- ❌ Regulator → Any (No ownership transfers)

### Validation Checks
- Organization existence and verification status
- Batch ownership and availability
- Transfer rules compliance
- Expiry date validation
- Quantity availability
- No conflicting pending transfers

### Transfer States
1. **PENDING** - Awaiting approval from both parties
2. **IN_PROGRESS** - Approved and in transit
3. **COMPLETED** - Successfully received and confirmed
4. **FAILED** - Transfer rejected or failed
5. **CANCELLED** - Transfer cancelled by parties

## Sub-Batch Creation

When partial quantities are transferred, the system automatically:
1. Creates a new sub-batch for transferred units
2. Updates original batch quantity
3. Assigns units to the new sub-batch
4. Maintains parent-child relationship

## Error Handling

### Common Error Codes
- **400**: Bad Request - Validation errors
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Batch/Organization not found
- **409**: Conflict - Pending transfers exist
- **500**: Internal Server Error

### Example Error Response
```json
{
  "error": "Transfer validation failed",
  "details": [
    "Batch does not belong to source organization",
    "Insufficient units available"
  ],
  "warnings": [
    "Batch expires in 15 days"
  ]
}
```

## Integration Notes

1. **Blockchain Integration**: All transfers create immutable records on Hedera
2. **QR Code Updates**: Unit QR codes are updated with new ownership
3. **Audit Trail**: Complete transfer history maintained
4. **Real-time Updates**: Transfer status changes trigger notifications
5. **Compliance**: Regulatory reporting for all transfers

## Usage Examples

### Basic Transfer
```javascript
const response = await fetch('/api/transfer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    batchId: 'batch_123',
    fromOrgId: 'manufacturer_1',
    toOrgId: 'distributor_1'
  })
});
```

### Approve Transfer
```javascript
const response = await fetch('/api/transfer/approve', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transferId: 'transfer_123',
    organizationId: 'distributor_1',
    action: 'APPROVE'
  })
});
```
