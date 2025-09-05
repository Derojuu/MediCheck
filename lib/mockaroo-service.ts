// Mockaroo API integration for generating realistic pharmaceutical data using direct API calls
export interface MockarooProduct {
  drug_name: string
  generic_name: string
  dosage_form: string
  strength: string
  category: string
  nafdac_number: string
  shelf_life_months: number
}

export interface MockarooBatch {
  batch_id: string
  manufacturing_date: string
  expiry_date: string
  batch_size: number
  current_location: string
  status: string
  qr_code: string
}

export interface MockarooOrganization {
  company_name: string
  organization_type: string
  contact_email: string
  contact_phone: string
  contact_person: string
  address: string
  city: string
  state: string
  country: string
  license_number: string
}

export interface MockarooUser {
  first_name: string
  last_name: string
  email: string
  phone_number: string
}

// Pharmaceutical data schemas for direct API calls
const PHARMACEUTICAL_SCHEMAS = {
  organization: [
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
  ],
  
  product: [
    { name: 'drug_name', type: 'Custom List', values: ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin', 'Metformin', 'Aspirin', 'Omeprazole', 'Lisinopril', 'Atorvastatin', 'Amlodipine'] },
    { name: 'generic_name', type: 'Custom List', values: ['Acetaminophen', 'Ibuprofen', 'Amoxicillin', 'Ciprofloxacin HCl', 'Metformin HCl', 'Aspirin', 'Omeprazole', 'Lisinopril', 'Atorvastatin', 'Amlodipine'] },
    { name: 'dosage_form', type: 'Custom List', values: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'] },
    { name: 'strength', type: 'Custom List', values: ['500mg', '250mg', '100mg', '50mg', '25mg', '10mg', '5mg'] },
    { name: 'category', type: 'Custom List', values: ['Analgesic', 'Antibiotic', 'Antidiabetic', 'Cardiovascular', 'Gastrointestinal', 'Dermatological'] },
    { name: 'nafdac_number', type: 'Custom List', values: ['NAFDAC001', 'NAFDAC002', 'NAFDAC003', 'NAFDAC004', 'NAFDAC005'] },
    { name: 'shelf_life_months', type: 'Number', min: 12, max: 60 }
  ],
  
  batch: [
    { name: 'batch_id', type: 'Row Number', format: 'BATCH-%05d' },
    { name: 'manufacturing_date', type: 'Date', min: '2023-01-01', max: '2024-12-31', format: '%Y-%m-%d' },
    { name: 'expiry_date', type: 'Date', min: '2024-06-01', max: '2027-12-31', format: '%Y-%m-%d' },
    { name: 'batch_size', type: 'Number', min: 1000, max: 50000 },
    { name: 'current_location', type: 'City' },
    { name: 'status', type: 'Custom List', values: ['In Production', 'Quality Control', 'Released', 'In Transit', 'Delivered'] },
    { name: 'qr_code', type: 'Custom List', values: ['QR001', 'QR002', 'QR003', 'QR004', 'QR005'] }
  ],
  
  user: [
    { name: 'first_name', type: 'First Name' },
    { name: 'last_name', type: 'Last Name' },
    { name: 'email', type: 'Email Address' },
    { name: 'phone_number', type: 'Phone' }
  ]
}

class MockarooService {
  private apiKey: string
  private baseUrl = 'https://api.mockaroo.com/api/generate.json'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async fetchFromMockaroo<T>(fields: any[], count: number = 10): Promise<T[]> {
    const url = `${this.baseUrl}?count=${count}&key=${this.apiKey}&fields=${encodeURIComponent(JSON.stringify(fields))}`
    
    try {
      console.log(`🌐 Calling Mockaroo API for ${count} records...`)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Mockaroo API failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`✅ Successfully generated ${data.length} records from Mockaroo API`)
      return data as T[]
    } catch (error) {
      console.warn(`⚠️ Mockaroo API failed, using fallback data generation...`)
      return this.generateSampleData<T>(fields, count)
    }
  }

  async generateCustomData(schemaType: 'organization' | 'product' | 'batch' | 'user', count: number = 10) {
    const fields = PHARMACEUTICAL_SCHEMAS[schemaType]
    
    switch (schemaType) {
      case 'organization':
        return await this.fetchFromMockaroo<MockarooOrganization>(fields, count)
      case 'product':
        return await this.fetchFromMockaroo<MockarooProduct>(fields, count)
      case 'batch':
        return await this.fetchFromMockaroo<MockarooBatch>(fields, count)
      case 'user':
        return await this.fetchFromMockaroo<MockarooUser>(fields, count)
      default:
        throw new Error(`Unknown schema type: ${schemaType}`)
    }
  }

  private generateSampleData<T>(fields: any[], count: number): T[] {
    console.log('🔄 Generating realistic sample pharmaceutical data...')
    
    const sampleData = []
    for (let i = 0; i < count; i++) {
      const item: any = {}
      
      fields.forEach((field) => {
        switch (field.type) {
          case 'Company Name':
            item[field.name] = ['PharmaCorp Nigeria Ltd', 'MediSupply Industries', 'HealthTech Solutions', 'BioPharm Nigeria', 'Guardian Pharmaceuticals'][i % 5]
            break
          case 'Custom List':
            item[field.name] = field.values[Math.floor(Math.random() * field.values.length)]
            break
          case 'Email Address':
            item[field.name] = `${field.name.replace('_', '')}${i + 1}@pharma.ng`
            break
          case 'Phone':
            item[field.name] = `+234${Math.floor(Math.random() * 900000000) + 100000000}`
            break
          case 'Full Name':
          case 'First Name':
            item[field.name] = ['Adebayo', 'Fatima', 'Chidiebere', 'Aisha', 'Olumide', 'Kemi', 'Emeka', 'Zainab'][i % 8]
            break
          case 'Last Name':
            item[field.name] = ['Okonkwo', 'Ibrahim', 'Adebayo', 'Okafor', 'Bello', 'Okoro', 'Hassan', 'Eze'][i % 8]
            break
          case 'Street Address':
            item[field.name] = `${123 + i} ${['Pharmaceutical', 'Industrial', 'Medical', 'Healthcare'][i % 4]} Avenue`
            break
          case 'City':
            item[field.name] = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Kaduna', 'Enugu'][i % 7]
            break
          case 'State':
            item[field.name] = ['Lagos', 'FCT', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Enugu'][i % 7]
            break
          case 'Country':
            item[field.name] = 'Nigeria'
            break
          case 'Number':
            const min = field.min || 1
            const max = field.max || 100
            item[field.name] = Math.floor(Math.random() * (max - min + 1)) + min
            break
          case 'Date':
            const startDate = new Date(field.min || '2024-01-01')
            const endDate = new Date(field.max || '2024-12-31')
            const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
            item[field.name] = new Date(randomTime).toISOString().split('T')[0]
            break
          case 'Row Number':
            item[field.name] = field.format ? field.format.replace('%05d', String(i + 1).padStart(5, '0')) : `${field.name.toUpperCase()}${i + 1}`
            break
          default:
            item[field.name] = `${field.name}_sample_${i + 1}`
        }
      })
      
      sampleData.push(item)
    }
    
    return sampleData as T[]
  }

  // Legacy methods for backwards compatibility
  async generateProducts(count: number = 10): Promise<MockarooProduct[]> {
    return this.generateCustomData('product', count) as Promise<MockarooProduct[]>
  }

  async generateBatches(count: number = 20): Promise<MockarooBatch[]> {
    return this.generateCustomData('batch', count) as Promise<MockarooBatch[]>
  }

  async generateOrganizations(count: number = 5): Promise<MockarooOrganization[]> {
    return this.generateCustomData('organization', count) as Promise<MockarooOrganization[]>
  }

  async generateUsers(count: number = 10): Promise<MockarooUser[]> {
    return this.generateCustomData('user', count) as Promise<MockarooUser[]>
  }
}

export default MockarooService
