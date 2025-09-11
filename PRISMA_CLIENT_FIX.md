# Prisma Client Regeneration Guide

## Issue
The Prisma client is missing the `MedicationUnit` model and `UnitStatus` enum that are defined in the schema. This is causing import errors in the transfer API.

## Solution
You need to regenerate the Prisma client to sync it with your schema.

## Steps to Fix

### 1. Regenerate Prisma Client
```bash
npx prisma generate
```

### 2. If that doesn't work, try resetting and regenerating
```bash
npx prisma db push
npx prisma generate
```

### 3. Alternative - Reset the database and regenerate (WARNING: This will delete data)
```bash
npx prisma migrate reset
npx prisma generate
```

### 4. Install dependencies if needed
```bash
npm install
# or
pnpm install
```

## After Regeneration

Once the Prisma client is regenerated with the missing models, you can:

1. **Restore unit-level transfers** by uncommenting the medicationUnit queries
2. **Add back UnitStatus imports** in the transfer APIs
3. **Enable full unit tracking** functionality

## Current State

The transfer API is currently working with **batch-level transfers only** to avoid the missing model errors. All unit-level functionality has been temporarily disabled with placeholder comments.

## Files that need updates after Prisma regeneration:

- `/app/api/transfer/route.ts` - Restore medicationUnit queries
- `/app/api/transfer/approve/route.ts` - Restore unit status updates  
- `/lib/transfer-utils.ts` - Restore unit validation logic

## Expected after fix:
- ✅ `UnitStatus` enum available for import
- ✅ `MedicationUnit` model available in Prisma client
- ✅ Full unit-level transfer tracking
- ✅ Granular inventory management
