import { PrismaClient } from '@prisma/client'
import MockarooService from '../lib/mockaroo-service'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seed with Mockaroo API...')
  
  const mockarooApiKey = process.env.MOCKAROO_API_KEY
  
  if (!mockarooApiKey) {
    console.log('❌ MOCKAROO_API_KEY not found, falling back to local mock data...')
    return await seedWithLocalData()
  }

  const mockaroo = new MockarooService(mockarooApiKey)

  try {
    // Create users first (they need to exist before organizations)
    console.log('📥 Generating users from Mockaroo...')
    const mockarooUsers = await mockaroo.generateCustomData('user', 5)
    
    const users = mockarooUsers.map((user: any, index: number) => ({
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      })
    }
    
    console.log(`✅ Created ${users.length} users`)

    // Generate organizations
    console.log('📥 Generating organizations from Mockaroo...')
    const mockarooOrgs = await mockaroo.generateCustomData('organization', 4)
    
    // Ensure we have a manufacturer
    if (mockarooOrgs.length > 0) {
      (mockarooOrgs[0] as any).organization_type = 'MANUFACTURER'
      ;(mockarooOrgs[0] as any).company_name = 'PharmaTech Industries'
    }

    const organizations = []
    for (let i = 0; i < mockarooOrgs.length; i++) {
      const org: any = mockarooOrgs[i]
      const organization = {
        id: `org-${i + 1}`,
        organizationType: org.organization_type as any,
        companyName: org.company_name,
        contactEmail: org.contact_email,
        contactPhone: org.contact_phone,
        contactPersonName: org.contact_person,
        address: org.address,
        country: org.country || 'Nigeria',
        state: org.state || 'Lagos',
        licenseNumber: org.license_number,
        adminUserId: users[i % users.length].id,
      }

      await prisma.organization.upsert({
        where: { id: organization.id },
        update: {},
        create: organization,
      })
      
      organizations.push(organization)
    }
    
    console.log(`✅ Created ${organizations.length} organizations`)

    // Generate products (from product schema)
    console.log('📥 Generating products from Mockaroo...')
    const mockarooProducts = await mockaroo.generateCustomData('product', 8)

    // Generate batches
    console.log('📥 Generating batches from Mockaroo...')
    const mockarooBatches = await mockaroo.generateCustomData('batch', 15)

    const batches = []
    const manufacturerOrg = organizations.find(o => o.organizationType === 'MANUFACTURER')
    
    if (manufacturerOrg) {
      for (let i = 0; i < mockarooBatches.length; i++) {
        const batch: any = mockarooBatches[i]
        const product: any = mockarooProducts[i % mockarooProducts.length]
        
        const batchData = {
          id: `batch-${i + 1}`,
          batchId: batch.batch_id || `BATCH-${String(i + 1).padStart(5, '0')}`,
          productId: `prod-${(i % mockarooProducts.length) + 1}`,
          drugName: product.drug_name,
          composition: `${product.drug_name}, Microcrystalline Cellulose, Other excipients`,
          batchSize: batch.batch_size || 10000,
          manufacturingDate: new Date(batch.manufacturing_date || '2024-01-01'),
          expiryDate: new Date(batch.expiry_date || '2026-01-01'),
          storageInstructions: 'Store in a cool, dry place',
          currentLocation: batch.current_location || 'Warehouse',
          status: (batch.status || 'READY_FOR_DISPATCH') as any,
          manufacturerId: manufacturerOrg.id,
          qrCodeData: batch.qr_code || `QR-${i + 1}`,
          blockchainHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          dosageForm: product.dosage_form || 'Tablet',
          strength: product.strength || '500mg'
        }

        await prisma.medicationBatch.upsert({
          where: { id: batchData.id },
          update: {},
          create: batchData,
        })
        
        batches.push(batchData)
      }
    }
    
    console.log(`✅ Created ${batches.length} medication batches`)

    // Generate some transfers
    console.log('📥 Creating transfer records...')
    let transferCount = 0
    const distributorOrgs = organizations.filter(o => o.organizationType !== 'MANUFACTURER')
    
    for (let i = 0; i < Math.min(3, batches.length); i++) {
      const batch = batches[i]
      const recipient = distributorOrgs[i % distributorOrgs.length] || organizations[1]
      
      await prisma.ownershipTransfer.create({
        data: {
          id: `transfer-${i + 1}`,
          batchId: batch.id,
          senderId: manufacturerOrg?.id || organizations[0].id,
          recipientId: recipient.id,
          transferDate: new Date(),
          status: 'COMPLETED',
          notes: `Transfer of ${batch.drugName} batch ${batch.batchId}`,
          quantity: Math.floor(batch.batchSize * 0.1)
        }
      })
      transferCount++
    }
    
    console.log(`✅ Created ${transferCount} transfer records`)

    // Generate some scan history
    console.log('📥 Creating scan history...')
    let scanCount = 0
    
    for (let i = 0; i < Math.min(2, batches.length); i++) {
      const batch = batches[i]
      
      await prisma.scanHistory.create({
        data: {
          id: `scan-${i + 1}`,
          batchId: batch.id,
          scannerId: users[i % users.length].id,
          scanDate: new Date(),
          location: batch.currentLocation,
          verificationStatus: 'VERIFIED'
        }
      })
      scanCount++
    }
    
    console.log(`✅ Created ${scanCount} scan records`)

    console.log('🎉 Database seeding with Mockaroo completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   Users: ${users.length}`)
    console.log(`   Organizations: ${organizations.length}`)
    console.log(`   Medication Batches: ${batches.length}`)
    console.log(`   Transfer Records: ${transferCount}`)
    console.log(`   Scan Records: ${scanCount}`)

  } catch (error) {
    console.error('❌ Error seeding database with Mockaroo:', error)
    console.log('⚠️  Falling back to local mock data...')
    return await seedWithLocalData()
  }
}

async function seedWithLocalData() {
  console.log('🔄 Using local mock data for seeding...')
  
  // Mock users
  const users = [
    { id: 'user-1', userRole: 'ORGANIZATION_MEMBER' as const, clerkUserId: 'clerk_user_1', firstName: 'Adebayo', lastName: 'Okonkwo', email: 'adebayo@pharmatech.ng' },
    { id: 'user-2', userRole: 'ORGANIZATION_MEMBER' as const, clerkUserId: 'clerk_user_2', firstName: 'Fatima', lastName: 'Ibrahim', email: 'fatima@medisupply.ng' },
    { id: 'user-3', userRole: 'ORGANIZATION_MEMBER' as const, clerkUserId: 'clerk_user_3', firstName: 'Chidiebere', lastName: 'Adebayo', email: 'chidi@healthtech.ng' },
    { id: 'user-4', userRole: 'ORGANIZATION_MEMBER' as const, clerkUserId: 'clerk_user_4', firstName: 'Aisha', lastName: 'Bello', email: 'aisha@biopharm.ng' },
    { id: 'user-5', userRole: 'ORGANIZATION_MEMBER' as const, clerkUserId: 'clerk_user_5', firstName: 'Olumide', lastName: 'Hassan', email: 'olumide@guardian.ng' }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    })
  }

  // Mock organizations
  const organizations = [
    {
      id: 'org-1',
      organizationType: 'MANUFACTURER' as const,
      companyName: 'PharmaTech Industries Nigeria Ltd',
      contactEmail: 'contact@pharmatech.ng',
      contactPhone: '+234-701-234-5678',
      contactPersonName: 'Dr. Adebayo Okonkwo',
      address: '123 Pharmaceutical Avenue, Ikeja',
      country: 'Nigeria',
      state: 'Lagos',
      licenseNumber: 'MFR-LAG-2024-001',
      adminUserId: 'user-1',
    },
    {
      id: 'org-2',
      organizationType: 'PHARMACY' as const,
      companyName: 'HealthPlus Pharmacy Chain',
      contactEmail: 'info@healthplus.ng',
      contactPhone: '+234-802-345-6789',
      contactPersonName: 'Pharm. Fatima Ibrahim',
      address: '456 Medical Street, Victoria Island',
      country: 'Nigeria',
      state: 'Lagos',
      licenseNumber: 'PHM-LAG-2024-002',
      adminUserId: 'user-2',
    },
    {
      id: 'org-3',
      organizationType: 'HOSPITAL' as const,
      companyName: 'Lagos University Teaching Hospital',
      contactEmail: 'admin@luth.ng',
      contactPhone: '+234-803-456-7890',
      contactPersonName: 'Dr. Chidiebere Adebayo',
      address: '789 University Road, Idi-Araba',
      country: 'Nigeria',
      state: 'Lagos',
      licenseNumber: 'HSP-LAG-2024-003',
      adminUserId: 'user-3',
    },
    {
      id: 'org-4',
      organizationType: 'DRUG_DISTRIBUTOR' as const,
      companyName: 'MediDistribute Nigeria',
      contactEmail: 'ops@medidistribute.ng',
      contactPhone: '+234-804-567-8901',
      contactPersonName: 'Alhaji Abubakar Bello',
      address: '321 Distribution Hub, Agege',
      country: 'Nigeria',
      state: 'Lagos',
      licenseNumber: 'DST-LAG-2024-004',
      adminUserId: 'user-4',
    }
  ]

  for (const org of organizations) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: {},
      create: org,
    })
  }

  // Mock medication batches
  const batches = [
    {
      id: 'batch-1',
      batchId: 'BATCH-00001',
      productId: 'prod-1',
      drugName: 'Paracetamol',
      composition: 'Paracetamol 500mg, Microcrystalline Cellulose, Magnesium Stearate',
      batchSize: 10000,
      manufacturingDate: new Date('2024-01-15'),
      expiryDate: new Date('2026-01-15'),
      storageInstructions: 'Store at room temperature (15-25°C), protect from moisture',
      currentLocation: 'Production Facility - Line A',
      status: 'READY_FOR_DISPATCH' as const,
      manufacturerId: 'org-1',
      qrCodeData: 'QR_PARACETAMOL_BATCH001_VERIFIED',
      blockchainHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      dosageForm: 'Tablet',
      strength: '500mg'
    },
    {
      id: 'batch-2',
      batchId: 'BATCH-00002',
      productId: 'prod-2',
      drugName: 'Amoxicillin',
      composition: 'Amoxicillin 250mg, Microcrystalline Cellulose, Croscarmellose Sodium',
      batchSize: 8000,
      manufacturingDate: new Date('2024-02-01'),
      expiryDate: new Date('2026-02-01'),
      storageInstructions: 'Store in a cool, dry place below 25°C',
      currentLocation: 'Quality Control Lab',
      status: 'IN_TRANSIT' as const,
      manufacturerId: 'org-1',
      qrCodeData: 'QR_AMOXICILLIN_BATCH002_VERIFIED',
      blockchainHash: '0xb2c3d4e5f6a789012345678901234567890abcdef1234567890abcdef123457',
      dosageForm: 'Capsule',
      strength: '250mg'
    }
  ]

  for (const batch of batches) {
    await prisma.medicationBatch.upsert({
      where: { id: batch.id },
      update: {},
      create: batch,
    })
  }

  // Mock transfers
  await prisma.ownershipTransfer.create({
    data: {
      id: 'transfer-1',
      batchId: 'batch-1',
      senderId: 'org-1',
      recipientId: 'org-2',
      transferDate: new Date('2024-03-01'),
      status: 'COMPLETED',
      notes: 'Transfer of Paracetamol batch to HealthPlus Pharmacy',
      quantity: 1000
    }
  })

  console.log('✅ Local mock data seeding completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
