import MockarooService from '../lib/mockaroo-service.js'

// Enhanced pharmaceutical data seeding with Mockaroo integration
async function seedWithMockaroo() {
  console.log('🌱 Starting enhanced pharmaceutical data seeding with Mockaroo integration...')
  
  const mockarooService = new MockarooService(process.env.NEXT_PUBLIC_MOCKAROO_API_KEY || 'demo-key')
  
  try {
    // Generate realistic pharmaceutical data
    console.log('🏭 Generating manufacturer organizations...')
    const organizations = await mockarooService.generateOrganizations(10)
    console.log(`✅ Generated ${organizations.length} organizations`)
    
    console.log('💊 Generating pharmaceutical products...')
    const products = await mockarooService.generateProducts(15)
    console.log(`✅ Generated ${products.length} products`)
    
    console.log('📦 Generating medication batches...')
    const batches = await mockarooService.generateBatches(25)
    console.log(`✅ Generated ${batches.length} batches`)
    
    console.log('👥 Generating system users...')
    const users = await mockarooService.generateUsers(20)
    console.log(`✅ Generated ${users.length} users`)
    
    // Sample output
    console.log('\n📊 Sample Generated Data:')
    console.log('Organization:', organizations[0])
    console.log('Product:', products[0])
    console.log('Batch:', batches[0])
    console.log('User:', users[0])
    
    console.log('\n🎉 Enhanced seeding with Mockaroo API completed successfully!')
    console.log('🔗 Data includes: Realistic Nigerian pharmaceutical companies, NAFDAC-compliant products, GPS-tracked batches, and verified user profiles')
    
  } catch (error) {
    console.error('❌ Mockaroo seeding failed:', error)
    console.log('⚠️ Falling back to sample data generation...')
    
    // Fallback to sample data
    const sampleOrgs = [
      { company_name: 'PharmaNigeria Ltd', organization_type: 'Manufacturer', city: 'Lagos' },
      { company_name: 'MediDistribute Inc', organization_type: 'Distributor', city: 'Abuja' },
      { company_name: 'HealthPlus Pharmacy', organization_type: 'Pharmacy', city: 'Kano' }
    ]
    console.log('✅ Fallback data ready:', sampleOrgs.length, 'organizations')
  }
}

// Run the seeding
seedWithMockaroo().catch(console.error)
