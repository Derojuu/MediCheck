// Mockaroo API integration for generating realistic pharmaceutical data
export interface MockarooProduct {
  name: string
  generic_name: string
  description: string
  category: string
  dosage_form: string
  strength: string
  active_ingredients: string[]
  nafdac_number: string
  shelf_life_months: number
  storage_conditions: string
  manufacturer: string
}

export interface MockarooBatch {
  batch_id: string
  drug_name: string
  generic_name: string
  composition: string
  batch_size: number
  manufacturing_date: string
  expiry_date: string
  storage_instructions: string
  current_location: string
  status: string
  dosage_form: string
  strength: string
  qr_code_data: string
  blockchain_hash: string
}

export interface MockarooOrganization {
  company_name: string
  organization_type: string
  contact_email: string
  contact_phone: string
  contact_person_name: string
  address: string
  country: string
  state: string
  license_number: string
  nafdac_number?: string
  rc_number?: string
}

export interface MockarooUser {
  first_name: string
  last_name: string
  email: string
  role: string
  department: string
  phone_number: string
}

class MockarooService {
  private apiKey: string
  private baseUrl = 'https://api.mockaroo.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async fetchFromMockaroo<T>(schemaName: string, count: number = 10): Promise<T[]> {
    const url = `${this.baseUrl}/${schemaName}.json?count=${count}&key=${this.apiKey}`
    
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Mockaroo API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching from Mockaroo:', error)
      throw error
    }
  }

  // Generate pharmaceutical products
  async generateProducts(count: number = 10): Promise<MockarooProduct[]> {
    return this.fetchFromMockaroo<MockarooProduct>('pharmaceutical_products', count)
  }

  // Generate medication batches
  async generateBatches(count: number = 20): Promise<MockarooBatch[]> {
    return this.fetchFromMockaroo<MockarooBatch>('medication_batches', count)
  }

  // Generate organizations
  async generateOrganizations(count: number = 5): Promise<MockarooOrganization[]> {
    return this.fetchFromMockaroo<MockarooOrganization>('healthcare_organizations', count)
  }

  // Generate users
  async generateUsers(count: number = 10): Promise<MockarooUser[]> {
    return this.fetchFromMockaroo<MockarooUser>('healthcare_users', count)
  }

  // Create a custom schema request for complex data
  async generateCustomData(schema: any, count: number = 10): Promise<any[]> {
    try {
      // For now, let's use the sample data generator since the API has connection issues
      console.log('🔄 Generating sample data (API fallback)...')
      return this.generateSampleData(schema, count)
    } catch (error) {
      console.error('Error generating custom data:', error)
      return this.generateSampleData(schema, count)
    }
  }

  // Generate sample data when API is not available
  private generateSampleData(schema: any, count: number): any[] {
    const sampleData = []
    const drugNames = ['Paracetamol', 'Amoxicillin', 'Lisinopril', 'Metformin', 'Aspirin', 'Omeprazole', 'Ciprofloxacin', 'Amlodipine']
    const companies = ['PharmaTech Industries', 'MediCorp Nigeria', 'HealthPlus Pharmaceuticals', 'Zenith Medical', 'Guardian Pharmacy']
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Mary', 'James', 'Patricia']
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller']
    
    for (let i = 0; i < count; i++) {
      const record: any = {}
      
      for (const [key, config] of Object.entries(schema)) {
        const fieldConfig = config as any
        
        if (fieldConfig.type === 'Custom List' && fieldConfig.values) {
          record[key] = fieldConfig.values[Math.floor(Math.random() * fieldConfig.values.length)]
        } else if (fieldConfig.type === 'Drug Name') {
          record[key] = drugNames[Math.floor(Math.random() * drugNames.length)]
        } else if (fieldConfig.type === 'Company') {
          record[key] = companies[Math.floor(Math.random() * companies.length)]
        } else if (fieldConfig.type === 'First Name') {
          record[key] = firstNames[Math.floor(Math.random() * firstNames.length)]
        } else if (fieldConfig.type === 'Last Name') {
          record[key] = lastNames[Math.floor(Math.random() * lastNames.length)]
        } else if (fieldConfig.type === 'Full Name') {
          record[key] = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
        } else if (fieldConfig.type === 'Email Address') {
          record[key] = `user${i + 1}@pharmatech.ng`
        } else if (fieldConfig.type === 'Street Address') {
          record[key] = `${Math.floor(Math.random() * 999) + 1} ${['Medical', 'Pharma', 'Health', 'Industry'][Math.floor(Math.random() * 4)]} Street, Lagos`
        } else if (fieldConfig.type === 'Country') {
          record[key] = 'Nigeria'
        } else if (fieldConfig.type === 'State') {
          record[key] = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'][Math.floor(Math.random() * 5)]
        } else if (fieldConfig.type === 'Phone') {
          record[key] = `+234-80${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
        } else if (fieldConfig.type === 'Sentences') {
          const min = fieldConfig.min || 1
          const max = fieldConfig.max || 2
          const sentenceCount = Math.floor(Math.random() * (max - min + 1)) + min
          record[key] = Array.from({length: sentenceCount}, () => 'A pharmaceutical product for medical treatment.').join(' ')
        } else if (fieldConfig.type === 'Regex') {
          // Simple regex to sample data mapping
          if (fieldConfig.value === '[A-Z]{3}-[0-9]{4}-[0-9]{3}') {
            record[key] = `PTC-${2024}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          } else if (fieldConfig.value === '0x[a-f0-9]{64}') {
            record[key] = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
          } else if (fieldConfig.value === 'A4-[0-9]{4}') {
            record[key] = `A4-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
          } else if (fieldConfig.value === '[A-Z]{3}-[A-Z]{3}-[0-9]{4}-[0-9]{3}') {
            record[key] = `${['MFR', 'PHM', 'HSP', 'DST'][Math.floor(Math.random() * 4)]}-LAG-${2024}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
          } else if (fieldConfig.value === '\\+234-[0-9]{3}-[0-9]{3}-[0-9]{4}') {
            record[key] = `+234-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
          } else if (fieldConfig.value === 'QR_[A-Z0-9]{15}_VERIFIED') {
            record[key] = `QR_${Array.from({length: 15}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}_VERIFIED`
          } else {
            record[key] = `${key}_${i + 1}`
          }
        } else if (fieldConfig.type === 'Number') {
          const min = fieldConfig.min || 1
          const max = fieldConfig.max || 100
          record[key] = Math.floor(Math.random() * (max - min + 1)) + min
        } else if (fieldConfig.type === 'Date') {
          const start = new Date(fieldConfig.min || '2024-01-01')
          const end = new Date(fieldConfig.max || '2025-12-31')
          record[key] = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0]
        } else {
          record[key] = `${key}_sample_${i + 1}`
        }
      }
      
      sampleData.push(record)
    }
    
    return sampleData
  }
}

// Predefined schemas for pharmaceutical data
export const PHARMACEUTICAL_SCHEMAS = {
  products: {
    name: { type: 'Drug Name' },
    generic_name: { type: 'Drug Name', blank_percentage: 20 },
    description: { type: 'Sentences', min: 1, max: 2 },
    category: { 
      type: 'Custom List', 
      values: [
        'Analgesics', 'Antibiotics', 'Cardiovascular', 'Antidiabetic', 
        'Gastrointestinal', 'Respiratory', 'Neurological', 'Antimalarial',
        'Vitamins & Supplements', 'Dermatological'
      ]
    },
    dosage_form: { 
      type: 'Custom List', 
      values: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler']
    },
    strength: { type: 'Custom List', values: ['5mg', '10mg', '25mg', '50mg', '100mg', '250mg', '500mg', '1g'] },
    nafdac_number: { type: 'Regex', value: 'A4-[0-9]{4}' },
    shelf_life_months: { type: 'Number', min: 12, max: 60 },
    storage_conditions: { 
      type: 'Custom List',
      values: [
        'Store at room temperature (15-25°C), protect from moisture',
        'Store at 2-8°C, keep refrigerated',
        'Store at room temperature, protect from light',
        'Store in a cool, dry place below 25°C'
      ]
    },
    manufacturer: { type: 'Company' }
  },

  batches: {
    batch_id: { type: 'Regex', value: '[A-Z]{3}-[0-9]{4}-[0-9]{3}' },
    drug_name: { type: 'Drug Name' },
    generic_name: { type: 'Drug Name', blank_percentage: 30 },
    batch_size: { type: 'Number', min: 1000, max: 50000 },
    manufacturing_date: { type: 'Date', min: '2024-01-01', max: '2024-12-31' },
    expiry_date: { type: 'Date', min: '2025-01-01', max: '2027-12-31' },
    current_location: {
      type: 'Custom List',
      values: [
        'Production Facility - Line A', 'Production Facility - Line B',
        'Quality Control Lab', 'Warehouse A - Section 1', 'Warehouse B - Section 2',
        'Distribution Center Lagos', 'Distribution Center Abuja', 
        'HealthPlus Pharmacy Chain', 'MediCore Hospital Network'
      ]
    },
    status: {
      type: 'Custom List',
      values: ['MANUFACTURING', 'READY_FOR_DISPATCH', 'IN_TRANSIT', 'DELIVERED', 'RECALLED']
    },
    qr_code_data: { type: 'Regex', value: 'QR_[A-Z0-9]{15}_VERIFIED' },
    blockchain_hash: { type: 'Regex', value: '0x[a-f0-9]{64}' }
  },

  organizations: {
    company_name: { type: 'Company' },
    organization_type: {
      type: 'Custom List',
      values: ['MANUFACTURER', 'PHARMACY', 'HOSPITAL', 'DRUG_DISTRIBUTOR', 'REGULATOR']
    },
    contact_email: { type: 'Email Address' },
    contact_phone: { type: 'Regex', value: '\\+234-[0-9]{3}-[0-9]{3}-[0-9]{4}' },
    contact_person_name: { type: 'Full Name' },
    address: { type: 'Street Address' },
    country: { type: 'Country', blank_percentage: 0 },
    state: { type: 'State', blank_percentage: 20 },
    license_number: { type: 'Regex', value: '[A-Z]{3}-[A-Z]{3}-[0-9]{4}-[0-9]{3}' }
  },

  users: {
    first_name: { type: 'First Name' },
    last_name: { type: 'Last Name' },
    email: { type: 'Email Address' },
    role: {
      type: 'Custom List',
      values: ['ADMIN', 'MANAGER', 'STAFF', 'QUALITY_CONTROL', 'PRODUCTION', 'LOGISTICS']
    },
    department: {
      type: 'Custom List',
      values: ['Production', 'Quality Control', 'Logistics', 'Sales', 'Administration', 'Research']
    },
    phone_number: { type: 'Phone' }
  }
}

export default MockarooService
