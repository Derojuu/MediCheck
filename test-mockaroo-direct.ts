// Direct Mockaroo API test with inline schemas
async function testDirectMockarooAPI() {
  console.log('🧪 Testing direct Mockaroo API with inline schemas...');
  
  const apiKey = '5dc8f890';
  
  try {
    // Test pharmaceutical company data
    console.log('\n🏢 Testing pharmaceutical company schema...');
    const companyFields = [
      { name: 'company_name', type: 'Company Name' },
      { name: 'organization_type', type: 'Custom List', values: ['Manufacturer', 'Distributor', 'Pharmacy', 'Hospital'] },
      { name: 'contact_email', type: 'Email Address' },
      { name: 'contact_phone', type: 'Phone' },
      { name: 'contact_person', type: 'Full Name' },
      { name: 'address', type: 'Street Address' },
      { name: 'city', type: 'City' },
      { name: 'state', type: 'State' },
      { name: 'country', type: 'Country' },
      { name: 'license_number', type: 'Custom List', values: ['LIC001', 'LIC002', 'LIC003', 'LIC004', 'LIC005'] }
    ];
    
    const companyUrl = `https://api.mockaroo.com/api/generate.json?count=2&key=${apiKey}&fields=${encodeURIComponent(JSON.stringify(companyFields))}`;
    
    const companyResponse = await fetch(companyUrl);
    if (!companyResponse.ok) {
      throw new Error(`Company API failed: ${companyResponse.status}`);
    }
    
    const companies = await companyResponse.json();
    console.log('✅ Pharmaceutical companies:');
    console.log(JSON.stringify(companies, null, 2));
    
    // Test drug product data
    console.log('\n💊 Testing drug product schema...');
    const drugFields = [
      { name: 'drug_name', type: 'Custom List', values: ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin', 'Metformin', 'Aspirin', 'Omeprazole'] },
      { name: 'generic_name', type: 'Custom List', values: ['Acetaminophen', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin HCl', 'Metformin HCl', 'Aspirin', 'Omeprazole'] },
      { name: 'dosage_form', type: 'Custom List', values: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'] },
      { name: 'strength', type: 'Custom List', values: ['500mg', '250mg', '100mg', '50mg', '10mg', '5mg'] },
      { name: 'category', type: 'Custom List', values: ['Analgesic', 'Antibiotic', 'Antidiabetic', 'Cardiovascular', 'Gastrointestinal'] },
      { name: 'nafdac_number', type: 'Custom List', values: ['NAFDAC001', 'NAFDAC002', 'NAFDAC003', 'NAFDAC004'] },
      { name: 'shelf_life_months', type: 'Number', min: 12, max: 60 }
    ];
    
    const drugUrl = `https://api.mockaroo.com/api/generate.json?count=3&key=${apiKey}&fields=${encodeURIComponent(JSON.stringify(drugFields))}`;
    
    const drugResponse = await fetch(drugUrl);
    if (!drugResponse.ok) {
      throw new Error(`Drug API failed: ${drugResponse.status}`);
    }
    
    const drugs = await drugResponse.json();
    console.log('✅ Drug products:');
    console.log(JSON.stringify(drugs, null, 2));
    
    // Test batch data
    console.log('\n📦 Testing batch schema...');
    const batchFields = [
      { name: 'batch_id', type: 'Row Number', format: 'BATCH-%05d' },
      { name: 'manufacturing_date', type: 'Date', min: '2023-01-01', max: '2024-12-31', format: '%Y-%m-%d' },
      { name: 'expiry_date', type: 'Date', min: '2024-01-01', max: '2027-12-31', format: '%Y-%m-%d' },
      { name: 'batch_size', type: 'Number', min: 1000, max: 50000 },
      { name: 'current_location', type: 'City' },
      { name: 'status', type: 'Custom List', values: ['In Production', 'Quality Control', 'Released', 'In Transit', 'Delivered'] },
      { name: 'qr_code', type: 'Custom List', values: ['QR001', 'QR002', 'QR003', 'QR004', 'QR005'] }
    ];
    
    const batchUrl = `https://api.mockaroo.com/api/generate.json?count=3&key=${apiKey}&fields=${encodeURIComponent(JSON.stringify(batchFields))}`;
    
    const batchResponse = await fetch(batchUrl);
    if (!batchResponse.ok) {
      throw new Error(`Batch API failed: ${batchResponse.status}`);
    }
    
    const batches = await batchResponse.json();
    console.log('✅ Drug batches:');
    console.log(JSON.stringify(batches, null, 2));
    
    console.log('\n🎉 All direct API calls successful!');
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error);
  }
}

testDirectMockarooAPI().catch(console.error);
