// Enhanced Mockaroo integration for pharmaceutical mock data
import MockarooService from '../lib/mockaroo-service'
import { PrismaClient, BatchStatus, OrganizationType } from '../lib/generated/prisma'

const prisma = new PrismaClient()

export async function populateMockarooData() {
  console.log('🚀 Populating database with Mockaroo mock data...')
  
  const mockarooApiKey = process.env.MOCKAROO_API_KEY || '5dc8f890'
  const mockaroo = new MockarooService(mockarooApiKey)

  try {
    // Generate additional mock batches using Mockaroo
    console.log('📦 Generating additional batches from Mockaroo...')
    const mockBatches = await mockaroo.generateCustomData('batch', 15)
    
    // Get existing organizations
    const organizations = await prisma.organization.findMany({
      where: { organizationType: 'MANUFACTURER' }
    })
    
    const manufacturerOrg = organizations[0]
    
    if (manufacturerOrg) {
      for (let i = 0; i < mockBatches.length; i++) {
        const mockBatch: any = mockBatches[i]
        
        const batchData = {
          batchId: mockBatch.batch_id || `MOCK-BATCH-${String(i + 1).padStart(3, '0')}`,
          organizationId: manufacturerOrg.id,
          drugName: mockBatch.drug_name || `MockDrug${i + 1}`,
          composition: `${mockBatch.drug_name || 'Active ingredient'}, Excipients, Other compounds`,
          batchSize: mockBatch.batch_size || Math.floor(Math.random() * 10000) + 1000,
          manufacturingDate: new Date(mockBatch.manufacturing_date || '2024-01-01'),
          expiryDate: new Date(mockBatch.expiry_date || '2026-01-01'),
          storageInstructions: 'Store in cool, dry place',
          currentLocation: mockBatch.current_location || 'Production Facility',
          status: (mockBatch.status === 'Quality Control' ? 'MANUFACTURING' : 
                  mockBatch.status === 'Released' ? 'READY_FOR_DISPATCH' :
                  mockBatch.status === 'In Transit' ? 'IN_TRANSIT' : 'READY_FOR_DISPATCH') as BatchStatus,
          qrCodeData: mockBatch.qr_code || `QR-${i + 1}`,
          blockchainHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
        }

        await prisma.medicationBatch.create({
          data: batchData
        })
      }
      
      console.log(`✅ Created ${mockBatches.length} additional mock batches`)
    }

    // Generate additional organizations using Mockaroo
    console.log('🏢 Generating additional organizations from Mockaroo...')
    const mockOrgs = await mockaroo.generateCustomData('organization', 3)
    
    // Get existing users to assign as admins
    const users = await prisma.user.findMany()
    
    for (let i = 0; i < mockOrgs.length; i++) {
      const mockOrg: any = mockOrgs[i]
      const adminUser = users[i % users.length]
      
      const orgData = {
        adminId: adminUser.id,
        organizationType: (mockOrg.organization_type === 'Manufacturer' ? 'MANUFACTURER' :
                         mockOrg.organization_type === 'Pharmacy' ? 'PHARMACY' :
                         mockOrg.organization_type === 'Hospital' ? 'HOSPITAL' : 'DRUG_DISTRIBUTOR') as OrganizationType,
        companyName: mockOrg.company_name || `Mock Company ${i + 1}`,
        contactEmail: mockOrg.contact_email || `mock${i + 1}@pharma.com`,
        contactPhone: mockOrg.contact_phone || `+234-800-000-${String(i + 1).padStart(4, '0')}`,
        contactPersonName: mockOrg.contact_person || `Contact Person ${i + 1}`,
        address: mockOrg.address || `${i + 1} Mock Street, Lagos`,
        country: 'Nigeria',
        state: mockOrg.state || 'Lagos',
        licenseNumber: mockOrg.license_number || `LIC-MOCK-${String(i + 1).padStart(3, '0')}`
      }

      try {
        await prisma.organization.create({
          data: orgData
        })
      } catch (error) {
        console.log(`Skipping duplicate organization: ${orgData.companyName}`)
      }
    }
    
    console.log(`✅ Created additional mock organizations`)
    
    return {
      batches: mockBatches.length,
      organizations: mockOrgs.length
    }
    
  } catch (error) {
    console.error('❌ Error populating Mockaroo data:', error)
    throw error
  }
}

// Export for use in components
export default populateMockarooData
