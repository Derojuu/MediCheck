import { PrismaClient } from '../lib/generated/prisma'
import MockarooService, { PHARMACEUTICAL_SCHEMAS } from '../lib/mockaroo-service'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seed with Mockaroo API...')

  // Check if Mockaroo API key is provided
  const mockarooApiKey = process.env.MOCKAROO_API_KEY
  if (!mockarooApiKey || mockarooApiKey === 'your_mockaroo_api_key_here') {
    console.log('⚠️  Mockaroo API key not found, falling back to local mock data...')
    await seedWithLocalData()
    return
  }

  const mockaroo = new MockarooService(mockarooApiKey)

  try {
    // Create users first (they need to exist before organizations)
    console.log('📥 Generating users from Mockaroo...')
    const mockarooUsers = await mockaroo.generateCustomData('user', 5) as any[]
    
    const users = mockarooUsers.map((user, index) => ({
      id: `user-${index + 1}`,
      userRole: 'ORGANIZATION_MEMBER' as const,
      clerkUserId: `clerk_user_${index + 1}`,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    }))

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          userRole: user.userRole,
          clerkUserId: user.clerkUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
    console.log('✅ Users created from Mockaroo data')

    // Generate organizations
    console.log('📥 Generating organizations from Mockaroo...')
    const mockarooOrgs = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.organizations, 4)
    
    // Ensure we have a manufacturer as the first organization
    mockarooOrgs[0].organization_type = 'MANUFACTURER'
    mockarooOrgs[0].company_name = 'PharmaTech Industries'

    const organizations = []
    for (let i = 0; i < mockarooOrgs.length; i++) {
      const org = mockarooOrgs[i]
      const orgData = {
        id: `org-${i + 1}`,
        adminId: `user-${i + 1}`,
        organizationType: org.organization_type as any,
        companyName: org.company_name,
        contactEmail: org.contact_email,
        contactPhone: org.contact_phone,
        contactPersonName: org.contact_person_name,
        address: org.address,
        country: org.country || 'Nigeria',
        state: org.state || 'Lagos',
        licenseNumber: org.license_number,
        isVerified: true,
        createdAt: new Date()
      }
      organizations.push(orgData)

      await prisma.organization.upsert({
        where: { id: orgData.id },
        update: {},
        create: orgData
      })
    }
    console.log('✅ Organizations created from Mockaroo data')

    // Generate products
    console.log('📥 Generating products from Mockaroo...')
    const mockarooProducts = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.products, 8)
    console.log(`✅ Generated ${mockarooProducts.length} products from Mockaroo`)

    // Generate medication batches
    console.log('📥 Generating medication batches from Mockaroo...')
    const mockarooBatches = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.batches, 15)
    
    const manufacturer = organizations.find(org => org.organizationType === 'MANUFACTURER')
    if (!manufacturer) {
      throw new Error('No manufacturer organization found')
    }

    const createdBatches = []
    for (const batch of mockarooBatches) {
      const batchData = {
        batchId: batch.batch_id,
        organizationId: manufacturer.id,
        drugName: batch.drug_name,
        composition: `${batch.drug_name}, Microcrystalline Cellulose, Other excipients`,
        batchSize: batch.batch_size,
        manufacturingDate: new Date(batch.manufacturing_date),
        expiryDate: new Date(batch.expiry_date),
        storageInstructions: mockarooProducts[Math.floor(Math.random() * mockarooProducts.length)]?.storage_conditions || 'Store at room temperature',
        currentLocation: batch.current_location,
        status: batch.status as any,
        qrCodeData: batch.qr_code_data,
        blockchainHash: batch.blockchain_hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const createdBatch = await prisma.medicationBatch.upsert({
        where: { batchId: batchData.batchId },
        update: {},
        create: batchData
      })
      createdBatches.push(createdBatch)
    }
    console.log('✅ Medication batches created from Mockaroo data')

    // Create ownership transfers
    console.log('📥 Creating ownership transfers...')
    const distributorOrg = organizations.find(org => org.organizationType === 'DRUG_DISTRIBUTOR')
    const pharmacyOrg = organizations.find(org => org.organizationType === 'PHARMACY')
    const hospitalOrg = organizations.find(org => org.organizationType === 'HOSPITAL')

    if (distributorOrg && pharmacyOrg && hospitalOrg && createdBatches.length >= 3) {
      const transferRecords = [
        {
          batchId: createdBatches[0].id,
          fromOrgId: manufacturer.id,
          toOrgId: distributorOrg.id,
          transferDate: new Date('2024-08-15'),
          notes: 'Distribution to wholesaler',
          status: 'COMPLETED' as const
        },
        {
          batchId: createdBatches[1].id,
          fromOrgId: distributorOrg.id,
          toOrgId: pharmacyOrg.id,
          transferDate: new Date('2024-08-20'),
          notes: 'Pharmacy stock replenishment',
          status: 'COMPLETED' as const
        },
        {
          batchId: createdBatches[2].id,
          fromOrgId: manufacturer.id,
          toOrgId: hospitalOrg.id,
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
      console.log('✅ Ownership transfer records created')
    }

    // Create scan history
    console.log('📥 Creating scan history...')
    if (createdBatches.length >= 2) {
      const scanRecords = [
        {
          batchId: createdBatches[0].id,
          consumerId: null,
          scanLocation: 'Lagos, Nigeria',
          scanResult: 'GENUINE' as const,
          ipAddress: '197.149.90.123',
          deviceInfo: 'Mozilla/5.0 (Mobile)',
          scanDate: new Date('2024-08-30T10:15:00Z')
        },
        {
          batchId: createdBatches[1].id,
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
      console.log('✅ Scan history records created')
    }

    console.log('\n🎉 Database seeding with Mockaroo API completed successfully!')
    console.log('\nSeeded data summary:')
    console.log(`- Organizations: ${organizations.length}`)
    console.log(`- Products: ${mockarooProducts.length}`)
    console.log(`- Medication Batches: ${createdBatches.length}`)
    console.log(`- Transfer Records: 3`)
    console.log(`- Scan Records: 2`)
    console.log(`- User Accounts: ${users.length}`)

  } catch (error) {
    console.error('❌ Error seeding database with Mockaroo:', error)
    console.log('⚠️  Falling back to local mock data...')
    await seedWithLocalData()
  } finally {
    await prisma.$disconnect()
  }
}

// Fallback function with local mock data
async function seedWithLocalData() {
  console.log('🔄 Using local mock data for seeding...')
  
  try {
    // Create users first
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

    // Create organizations
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

    // Create a few sample batches
    const sampleBatches = [
      {
        batchId: 'PTC-2024-001',
        organizationId: manufacturer.id,
        drugName: 'Paracetamol 500mg',
        composition: 'Paracetamol 500mg, Microcrystalline Cellulose, Starch',
        batchSize: 10000,
        manufacturingDate: new Date('2024-08-15'),
        expiryDate: new Date('2026-08-15'),
        storageInstructions: 'Store at 15-25°C, protect from moisture',
        currentLocation: 'Production Facility - Line A',
        status: 'READY_FOR_DISPATCH' as any,
        qrCodeData: 'QR_PTC_2024_001_VERIFIED',
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'
      },
      {
        batchId: 'PTC-2024-002',
        organizationId: manufacturer.id,
        drugName: 'Amoxicillin 250mg',
        composition: 'Amoxicillin 250mg, Lactose, Magnesium Stearate',
        batchSize: 5000,
        manufacturingDate: new Date('2024-08-20'),
        expiryDate: new Date('2026-02-20'),
        storageInstructions: 'Store at 2-8°C, keep refrigerated',
        currentLocation: 'Quality Control Lab',
        status: 'MANUFACTURING' as any,
        qrCodeData: 'QR_PTC_2024_002_PENDING',
        blockchainHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234'
      }
    ]

    for (const batch of sampleBatches) {
      await prisma.medicationBatch.upsert({
        where: { batchId: batch.batchId },
        update: {},
        create: {
          ...batch,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    console.log('✅ Local mock data seeding completed')
    
  } catch (error) {
    console.error('❌ Error with local mock data seeding:', error)
    throw error
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
