// Simple test script for Mockaroo API
import MockarooService from './lib/mockaroo-service'

async function testMockarooAPI() {
  console.log('🧪 Testing Mockaroo API connection...')
  
  const apiKey = process.env.MOCKAROO_API_KEY || '5dc8f890'
  console.log(`Using API key: ${apiKey}`)
  
  const mockaroo = new MockarooService(apiKey)
  
  try {
    // Test simple API call first
    console.log('📞 Testing basic API call...')
    const testUrl = `https://api.mockaroo.com/api/generate.json?count=3&key=${apiKey}&fields=[{"name":"first_name","type":"First Name"},{"name":"last_name","type":"Last Name"},{"name":"email","type":"Email Address"}]`
    
    const response = await fetch(testUrl)
    console.log(`Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error response: ${errorText}`)
      return
    }
    
    const data = await response.json()
    console.log('✅ API call successful!')
    console.log('Sample data:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('❌ API call failed:', error)
    console.log('Possible causes:')
    console.log('1. Network connection issues')
    console.log('2. Invalid API key')
    console.log('3. API rate limit exceeded')
    console.log('4. Firewall/proxy blocking the request')
  }
}

testMockarooAPI().catch(console.error)
