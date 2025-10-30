# MediCheck Code Structure Guide

## 🔑 Core Files & Their Purpose

### **Blockchain Integration**
- `lib/hedera.ts` - Hedera blockchain operations (batch registry creation, verification)
- `lib/hedera2Client.ts` - Hedera client configuration and initialization
- `lib/verifySignature.ts` - Digital signature verification for batches

### **Database**
- `lib/prisma.ts` - Prisma ORM client (singleton pattern)
- `prisma/schema.prisma` - Database schema (organizations, batches, transfers, team members)

### **Authentication & Authorization**
- `middleware.ts` - Route protection and role-based access control
- `utils/routes.ts` - Route definitions (public, auth, protected)
- `utils/getRedirectPath.ts` - Role-based dashboard routing

### **API Routes (Most Critical)**

#### Batch Management
- `app/api/batches/route.ts` - Create and list batches
- `app/api/batches/[orgId]/route.ts` - Get batches by organization
- `app/api/verify/batch/[batchId]/route.ts` - Verify batch on blockchain
- `app/api/verify/unit/[serialNumber]/route.ts` - Verify individual units

#### Transfer/Ownership
- `app/api/transfer/ownership/route.ts` - Initiate batch transfers
- `app/api/transfer/ownership/[transferId]/route.ts` - Accept/reject transfers
- `app/api/transfers/route.ts` - List all transfers

#### Organizations
- `app/api/organizations/me/route.ts` - Get current user's organization
- `app/api/organizations/info/route.ts` - Get organization details
- `app/api/organizations/[id]/route.ts` - Organization CRUD operations

#### Team Members
- `app/api/team-members/route.ts` - Team member management
- `app/api/register/team-member/route.ts` - Team member registration

### **Dashboard Pages**

#### Organization Dashboards
- `app/dashboard/manufacturer/page.tsx` - Manufacturer dashboard (batch creation, QR generation)
- `app/dashboard/hospital/page.tsx` - Hospital dashboard (inventory, receiving)
- `app/dashboard/drug-distributor/page.tsx` - Distributor dashboard (warehouse, shipments)
- `app/dashboard/pharmacy/page.tsx` - Pharmacy dashboard (dispensing)
- `app/dashboard/regulator/page.tsx` - Regulatory oversight dashboard

#### Dashboard Components
- `components/manufacturer-page-component/` - Manufacturer UI components
- `components/hospital-page-component/` - Hospital UI components
- `components/distributor-page-component/` - Distributor UI components

### **Key Utilities**

#### QR Code & Scanning
- `components/qr-scanner.tsx` - QR code scanner component
- `components/qr-generator.tsx` - QR code generation
- `lib/qrPayload.ts` - QR payload structure and validation

#### Data Management
- `lib/manufacturer-data.ts` - Sample manufacturer data
- `lib/mockaroo-service.ts` - Mock data generation service
- `lib/transfer-utils.ts` - Transfer helper functions

### **Public Pages**
- `app/page.tsx` - Landing page (hero, features, CTA)
- `app/scan/page.tsx` - Public scanning interface
- `app/verify/batch/[batchId]/page.tsx` - Batch verification page
- `app/privacy-policy/page.tsx` - Privacy policy
- `app/terms-of-service/page.tsx` - Terms of service
- `app/contact/page.tsx` - Contact form

### **Authentication Pages**
- `app/auth/login/page.tsx` - Organization login
- `app/auth/register/page.tsx` - Organization registration
- `app/auth/team-member-login/page.tsx` - Team member login

## 🔄 Data Flow

### Batch Creation Flow
1. Manufacturer creates batch → `POST /api/batches`
2. Hedera registry created → `lib/hedera.ts`
3. Batch saved to database → Prisma
4. QR codes generated → `components/QRGenerationComponent.tsx`

### Transfer Flow
1. Initiate transfer → `POST /api/transfer/ownership`
2. Blockchain event logged → Hedera
3. Recipient receives notification
4. Accept/reject → `PUT /api/transfer/ownership/[id]`
5. Ownership updated in database

### Verification Flow
1. User scans QR code → `app/scan/page.tsx`
2. Redirect to verification → `/verify/batch/[batchId]`
3. Fetch blockchain data → `GET /api/verify/batch/[batchId]`
4. Display verification results

## 🎨 UI Components

### Shared Components
- `components/ui/` - shadcn/ui base components (button, card, input, etc.)
- `components/theme-provider.tsx` - Dark/light mode
- `components/theme-toggle.tsx` - Theme switcher

### Feature Components
- `components/batch-management.tsx` - Batch CRUD operations
- `components/transfer-ownership.tsx` - Transfer interface
- `components/Transfers.tsx` - Transfer history
- `components/team-management.tsx` - Team member management
- `components/AnalyticsDashboard.tsx` - Analytics and charts

## 🔐 Security

### Protected Routes (middleware.ts)
- `/dashboard/*` - Requires authentication
- Role-based access control per route
- Automatic redirection for unauthorized access

### Blockchain Security
- Immutable records on Hedera
- Digital signatures for authenticity
- Public verification without authentication

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Adaptive layouts for all screen sizes
- Mobile-optimized QR scanner

## 🗄️ Database Schema (Prisma)

### Main Models
- `Organization` - Companies in supply chain
- `Batch` - Medication batches
- `BatchUnit` - Individual medication units
- `Transfer` - Ownership transfer records
- `TeamMember` - Organization team members
- `User` - Clerk authentication users

## 🚀 Deployment Considerations

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection
- `NEXT_PUBLIC_CLERK_*` - Clerk authentication
- `HEDERA_*` - Hedera network credentials
- `NEXT_PUBLIC_APP_URL` - Application URL

### Build Process
- TypeScript compilation
- Prisma client generation
- Next.js optimization
- Asset bundling

---

**Note:** This is a high-level overview. Each file contains specific implementation details. Refer to individual files for detailed logic and business rules.
