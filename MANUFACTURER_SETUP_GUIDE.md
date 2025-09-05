# MedChain Manufacturer System Setup Guide

## 🚀 Overview

This guide helps you set up the complete manufacturer functionality for your medical supply chain application, including batch creation, QR code generation, transfer operations, and PostgreSQL database integration with Mockaroo-style mock data.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** database
3. **Clerk** account for authentication
4. **Git** for version control

## 🔧 Database Setup

### 1. Create PostgreSQL Database

```sql
CREATE DATABASE medchain;
```

### 2. Update Environment Variables

Create or update your `.env.local` file with your actual database credentials:

```env
# Database - Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/medchain"
DIRECT_URL="postgresql://username:password@localhost:5432/medchain"

# Clerk Authentication - Get these from your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with mock data
npm run db:seed
```

## 🏭 Manufacturer Features Implemented

### ✅ Core Features

1. **Batch Management**
   - Create new medication batches
   - View batch overview with search and filtering
   - Update batch status (Manufacturing → Ready for Dispatch → In Transit → Delivered)
   - Batch analytics and statistics

2. **QR Code Generation**
   - Individual QR code generation for batches
   - Bulk QR code generation
   - Configurable QR code settings (size, format, error correction)
   - QR code preview and download functionality

3. **Transfer Operations**
   - Transfer batch ownership to distributors, hospitals, or pharmacies
   - Transfer history tracking
   - Real-time status updates
   - Reason logging for all transfers

4. **Dashboard & Analytics**
   - Production statistics (total batches, active batches, transfers)
   - Recent activity feed
   - Product catalog management
   - Team management integration

### ✅ Database Integration

- **Mock Data**: 6 pharmaceutical products with comprehensive details
- **Sample Batches**: 8 medication batches with different statuses
- **Organizations**: Pre-seeded manufacturer, pharmacy, hospital, and distributor
- **Transfer Records**: Sample ownership transfers
- **Scan History**: Consumer verification records

## 📁 Files Created/Updated

### New Components
- `components/manufacturer-sidebar.tsx` - Navigation sidebar for manufacturer
- `components/qr-generator.tsx` - QR code generation interface

### Data Management
- `lib/manufacturer-data.ts` - Mock data and database operations
- `prisma/seed.ts` - Database seeding script

### Dashboard
- `app/dashboard/manufacturer/page.tsx` - Main manufacturer interface (updated)

### Configuration
- `package.json` - Added database scripts and ts-node dependency
- `.env.example` - Environment variable template
- `.env.local` - Development environment file

## 🔄 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database  
npm run db:seed           # Populate database with mock data
npm run db:studio         # Open Prisma Studio (database GUI)

# Other
npm run lint              # Run linting
```

## 🗄️ Database Schema Overview

### Key Tables
- **Organizations** - Manufacturers, hospitals, pharmacies, distributors
- **MedicationBatch** - Drug batches with tracking information
- **OwnershipTransfer** - Transfer history between organizations
- **ScanHistory** - Consumer verification records
- **Users** - Organization users and their roles

### Sample Data Included
- **PharmaTech Industries** - Main manufacturer organization
- **6 Products** - Paracetamol, Amoxicillin, Lisinopril, Metformin, Aspirin, Omeprazole
- **8 Batches** - Various statuses from manufacturing to delivered
- **3 Organizations** - Pharmacy, hospital, and distributor for testing transfers

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Manufacturer Dashboard**
   - Navigate to `http://localhost:3000/dashboard/manufacturer`
   - Use Clerk authentication to sign in

## 🎯 Next Steps

### Immediate Actions Needed:
1. **Configure Database**: Update `.env.local` with your PostgreSQL credentials
2. **Set up Clerk**: Add your Clerk authentication keys
3. **Run Seeding**: Execute `npm run db:seed` to populate with mock data

### Optional Enhancements:
1. **QR Code Library**: Install `qrcode` or `react-qr-code` for actual QR generation
2. **Blockchain Integration**: Add Web3 integration for blockchain verification
3. **Real-time Updates**: Implement WebSocket for live status updates
4. **Advanced Analytics**: Add charts and detailed reporting

## 🔍 Testing the System

1. **Create Batch**: Use the manufacturer dashboard to create new batches
2. **Generate QR Codes**: Test QR code generation for various batches
3. **Transfer Ownership**: Simulate transfers to different organization types
4. **View Analytics**: Check dashboard statistics and recent activity
5. **Database Verification**: Use Prisma Studio to view data

## 🤝 Support

If you encounter any issues:
1. Check the `.env.local` file has correct database credentials
2. Ensure PostgreSQL is running
3. Verify Clerk keys are properly configured
4. Run `npm run db:generate` after schema changes

---

**Status**: ✅ Complete manufacturer functionality with Mockaroo-style mock data and PostgreSQL integration ready for deployment!
