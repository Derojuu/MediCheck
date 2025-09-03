// Test script for pharmaceutical Mockaroo schemas
import MockarooService from './lib/mockaroo-service';

async function testPharmaceuticalSchemas() {
  console.log('🧪 Testing pharmaceutical data generation...');
  
  const apiKey = process.env.MOCKAROO_API_KEY || '5dc8f890'
  const mockaroo = new MockarooService(apiKey);
  
  try {
    // Test organization data
    console.log('\n📋 Testing organization schema...');
    const organizations = await mockaroo.generateCustomData('organization', 2);
    console.log('Organizations:', JSON.stringify(organizations, null, 2));
    
    // Test product data  
    console.log('\n💊 Testing product schema...');
    const products = await mockaroo.generateCustomData('product', 3);
    console.log('Products:', JSON.stringify(products, null, 2));
    
    // Test batch data
    console.log('\n📦 Testing batch schema...');
    const batches = await mockaroo.generateCustomData('batch', 2);
    console.log('Batches:', JSON.stringify(batches, null, 2));
    
    // Test user data
    console.log('\n👤 Testing user schema...');
    const users = await mockaroo.generateCustomData('user', 2);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    console.log('\n✅ All pharmaceutical schemas working correctly!');
    
  } catch (error) {
    console.error('❌ Schema test failed:', error);
  }
}

testPharmaceuticalSchemas().catch(console.error);
