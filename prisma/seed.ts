import { PrismaClient } from '../lib/generated/prisma'
import { mockProducts, mockBatches } from '../lib/manufacturer-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  try {
    // Create users first (they need to exist before organizations)
    const users = [
      {
        id: 'user-manufacturer-001',
        userRole: 'ORGANIZATION_MEMBER' as const,
        clerkUserId: 'clerk_manufacturer_001',
      },
      {
        id: 'user-pharmacy-001',
        userRole: 'ORGANIZATION_MEMBER' as const,
        clerkUserId: 'clerk_pharmacy_001',
      },
      {
        id: 'user-hospital-001',
        userRole: 'ORGANIZATION_MEMBER' as const,
        clerkUserId: 'clerk_hospital_001',
      },
      {
        id: 'user-distributor-001',
        userRole: 'ORGANIZATION_MEMBER' as const,
        clerkUserId: 'clerk_distributor_001',
      }
    ]

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          ...user,
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25')
        }
      })
    }
    console.log('✅ User accounts created')

    // Create a manufacturer organization
    const manufacturer = await prisma.organization.upsert({
      where: { id: 'pharmatech-industries' },
      update: {},
      create: {
        id: 'pharmatech-industries',
        adminId: 'user-manufacturer-001',
        organizationType: 'MANUFACTURER',
        companyName: 'PharmaTech Industries',
        contactEmail: 'contact@pharmatechindustries.ng',
        contactPhone: '+234-801-234-5678',
        contactPersonName: 'John Doe',
        address: '123 Pharma Plaza, Medical District, Lagos, Nigeria',
        country: 'Nigeria',
        state: 'Lagos',
        licenseNumber: 'MFR-LAG-2024-001',
        isVerified: true,
        createdAt: new Date('2024-01-15')
      }
    })
    console.log('✅ Manufacturer organization created/updated')

    // Create additional organizations for the supply chain
    const organizations = [
      {
        id: 'healthplus-pharmacy',
        adminId: 'user-pharmacy-001',
        organizationType: 'PHARMACY' as const,
        companyName: 'HealthPlus Pharmacy',
        contactEmail: 'info@healthplus.ng',
        contactPhone: '+234-802-345-6789',
        contactPersonName: 'Jane Smith',
        address: '456 Health Street, Victoria Island, Lagos',
        country: 'Nigeria',
        state: 'Lagos',
        licenseNumber: 'PHM-LAG-2024-002'
      },
      {
        id: 'medicore-hospital',
        adminId: 'user-hospital-001',
        organizationType: 'HOSPITAL' as const,
        companyName: 'MediCore General Hospital',
        contactEmail: 'admin@medicore.ng',
        contactPhone: '+234-803-456-7890',
        contactPersonName: 'Dr. Michael Johnson',
        address: '789 Medical Avenue, Ikeja, Lagos',
        country: 'Nigeria',
        state: 'Lagos',
        licenseNumber: 'HSP-LAG-2024-003'
      },
      {
        id: 'globalmed-distributors',
        adminId: 'user-distributor-001',
        organizationType: 'DRUG_DISTRIBUTOR' as const,
        companyName: 'GlobalMed Distributors',
        contactEmail: 'operations@globalmed.ng',
        contactPhone: '+234-804-567-8901',
        contactPersonName: 'Sarah Wilson',
        address: '321 Distribution Center, Apapa, Lagos',
        country: 'Nigeria',
        state: 'Lagos',
        licenseNumber: 'DST-LAG-2024-004'
      }
    ]

    for (const org of organizations) {
      await prisma.organization.upsert({
        where: { id: org.id },
        update: {},
        create: {
          ...org,
          isVerified: true,
          createdAt: new Date('2024-01-20')
        }
      })
    }
    console.log('✅ Additional organizations created/updated')

    // Seed medication batches
    console.log('Seeding medication batches...')
    const createdBatches = []
    for (const batch of mockBatches) {
      const createdBatch = await prisma.medicationBatch.upsert({
        where: { batchId: batch.batchId },
        update: {},
        create: {
          batchId: batch.batchId,
          organizationId: manufacturer.id,
          drugName: batch.drugName,
          composition: batch.composition,
          batchSize: batch.batchSize,
          manufacturingDate: batch.manufacturingDate,
          expiryDate: batch.expiryDate,
          storageInstructions: batch.storageInstructions,
          currentLocation: batch.currentLocation,
          status: batch.status as any,
          qrCodeData: batch.qrCodeData,
          blockchainHash: batch.blockchainHash,
          createdAt: batch.createdAt || new Date(),
          updatedAt: batch.updatedAt || new Date()
        }
      })
      createdBatches.push(createdBatch)
    }
    console.log('✅ Medication batches seeded successfully')

    // Create some ownership transfer records
    console.log('Creating ownership transfer records...')
    const batch1 = createdBatches.find(b => b.batchId === 'PTC-2024-001')
    const batch2 = createdBatches.find(b => b.batchId === 'PTC-2024-002')
    const batch3 = createdBatches.find(b => b.batchId === 'PTC-2024-003')

    if (batch1 && batch2 && batch3) {
      const transferRecords = [
        {
          batchId: batch1.id,
          fromOrgId: manufacturer.id,
          toOrgId: 'globalmed-distributors',
          transferDate: new Date('2024-08-15'),
          notes: 'Distribution to wholesaler',
          status: 'COMPLETED' as const
        },
        {
          batchId: batch2.id,
          fromOrgId: 'globalmed-distributors',
          toOrgId: 'healthplus-pharmacy',
          transferDate: new Date('2024-08-20'),
          notes: 'Pharmacy stock replenishment',
          status: 'COMPLETED' as const
        },
        {
          batchId: batch3.id,
          fromOrgId: manufacturer.id,
          toOrgId: 'medicore-hospital',
          transferDate: new Date('2024-08-25'),
          notes: 'Direct hospital supply',
          status: 'PENDING' as const
        }
      ]

      for (const transfer of transferRecords) {
        await prisma.ownershipTransfer.create({
          data: {
            ...transfer,
            createdAt: transfer.transferDate
          }
        })
      }
    }
    console.log('✅ Ownership transfer records created')

    // Create some scan history records for verification
    const scanBatch1 = createdBatches.find(b => b.batchId === 'PTC-2024-001')
    const scanBatch2 = createdBatches.find(b => b.batchId === 'PTC-2024-002')

    if (scanBatch1 && scanBatch2) {
      const scanRecords = [
        {
          batchId: scanBatch1.id,
          consumerId: null,
          scanLocation: 'Lagos, Nigeria',
          scanResult: 'GENUINE' as const,
          ipAddress: '197.149.90.123',
          deviceInfo: 'Mozilla/5.0 (Mobile)',
          scanDate: new Date('2024-08-30T10:15:00Z')
        },
        {
          batchId: scanBatch2.id,
          consumerId: null,
          scanLocation: 'Abuja, Nigeria',
          scanResult: 'GENUINE' as const,
          ipAddress: '197.149.90.124',
          deviceInfo: 'Mozilla/5.0 (iPhone)',
          scanDate: new Date('2024-08-31T14:30:00Z')
        }
      ]

      for (const scan of scanRecords) {
        await prisma.scanHistory.create({
          data: scan
        })
      }
    }
    console.log('✅ Scan history records created')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\nSeeded data summary:')
    console.log(`- Organizations: ${organizations.length + 1}`)
    console.log(`- Medication Batches: ${mockBatches.length}`)
    console.log(`- Transfer Records: 3`)
    console.log(`- Scan Records: 2`)
    console.log(`- User Accounts: ${users.length}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
