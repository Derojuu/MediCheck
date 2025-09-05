# Mockaroo API Integration Guide

## 🎯 Overview

This guide explains how to use the Mockaroo API to generate realistic pharmaceutical data for your medical supply chain application, replacing hardcoded mock data with dynamic, realistic datasets.

## 🚀 Setup Instructions

### 1. Get Your Mockaroo API Key

1. Visit [Mockaroo.com](https://www.mockaroo.com/)
2. Sign up for a free account (200 records/day free)
3. Go to your account settings and copy your API key
4. Update your `.env` file with your actual API key:

```env
MOCKAROO_API_KEY=your_actual_mockaroo_api_key_here
```

### 2. Understanding the Schemas

The system uses predefined schemas for generating pharmaceutical data:

#### **Products Schema**
```typescript
{
  name: { type: 'Drug Name' },
  category: ['Analgesics', 'Antibiotics', 'Cardiovascular', ...],
  dosage_form: ['Tablet', 'Capsule', 'Syrup', 'Injection', ...],
  strength: ['5mg', '10mg', '25mg', '50mg', ...],
  nafdac_number: { type: 'Regex', value: 'A4-[0-9]{4}' },
  shelf_life_months: { min: 12, max: 60 }
}
```

#### **Batches Schema**
```typescript
{
  batch_id: { type: 'Regex', value: '[A-Z]{3}-[0-9]{4}-[0-9]{3}' },
  drug_name: { type: 'Drug Name' },
  batch_size: { min: 1000, max: 50000 },
  manufacturing_date: { min: '2024-01-01', max: '2024-12-31' },
  status: ['MANUFACTURING', 'READY_FOR_DISPATCH', 'IN_TRANSIT', ...],
  blockchain_hash: { type: 'Regex', value: '0x[a-f0-9]{64}' }
}
```

#### **Organizations Schema**
```typescript
{
  company_name: { type: 'Company' },
  organization_type: ['MANUFACTURER', 'PHARMACY', 'HOSPITAL', ...],
  contact_email: { type: 'Email Address' },
  license_number: { type: 'Regex', value: '[A-Z]{3}-[A-Z]{3}-[0-9]{4}-[0-9]{3}' }
}
```

## 🔧 Usage

### Method 1: Using the New Seed Script

```bash
# Seed with Mockaroo API (recommended)
npm run db:seed:mockaroo

# Or use the default seed (will auto-detect Mockaroo API key)
npm run db:seed
```

### Method 2: Programmatic Usage

```typescript
import MockarooService from '@/lib/mockaroo-service'

const mockaroo = new MockarooService(process.env.MOCKAROO_API_KEY!)

// Generate 10 pharmaceutical products
const products = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.products, 10)

// Generate 25 medication batches
const batches = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.batches, 25)

// Generate organizations
const organizations = await mockaroo.generateCustomData(PHARMACEUTICAL_SCHEMAS.organizations, 5)
```

## 📊 Data Generated

When you run the Mockaroo seeding, you'll get:

### **Realistic Pharmaceutical Products**
- Actual drug names (e.g., "Metformin", "Amoxicillin", "Lisinopril")
- Proper dosage forms and strengths
- Valid NAFDAC registration numbers
- Appropriate storage conditions
- Realistic shelf life ranges

### **Medication Batches**
- Unique batch IDs following pharmaceutical standards
- Realistic batch sizes (1,000 - 50,000 units)
- Proper manufacturing and expiry dates
- Valid blockchain hashes for verification
- Diverse status distribution

### **Healthcare Organizations**
- Company names that sound medical/pharmaceutical
- Proper Nigerian phone numbers and addresses
- Valid license numbers
- Appropriate organization types

### **Sample Generated Data**

```json
{
  "batch_id": "PTC-2024-157",
  "drug_name": "Amoxicillin Capsules",
  "batch_size": 25000,
  "manufacturing_date": "2024-03-15",
  "expiry_date": "2026-03-15",
  "status": "READY_FOR_DISPATCH",
  "qr_code_data": "QR_AMX240315_VERIFIED",
  "blockchain_hash": "0x7f9b8c2a1d4e6f3b9a8e7d2c5f1a4b9e6d3c8f2a1b7e4d9c6f3a8b2e5d1c4f7a"
}
```

## 🔄 Fallback System

If the Mockaroo API is unavailable or the key is invalid:
- The system automatically falls back to local mock data
- No interruption to your development workflow
- Clear logging of what's happening

## 🎛️ Customization

### Adding New Fields

Edit `PHARMACEUTICAL_SCHEMAS` in `lib/mockaroo-service.ts`:

```typescript
export const PHARMACEUTICAL_SCHEMAS = {
  batches: {
    // Existing fields...
    new_field: { 
      type: 'Custom List', 
      values: ['Value1', 'Value2', 'Value3']
    }
  }
}
```

### Creating Custom Schemas

```typescript
const customSchema = {
  field_name: { type: 'Data Type', options: 'configuration' }
}

const data = await mockaroo.generateCustomData(customSchema, 20)
```

## 📈 API Limits

### Free Tier
- **200 records per day**
- Perfect for development and testing
- Resets daily at midnight UTC

### Paid Plans
- **1,000+ records per day**
- Priority support
- Advanced features

## 🛠️ Available Commands

```bash
# Generate and seed with Mockaroo API
npm run db:seed:mockaroo

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset and reseed database
npm run db:push && npm run db:seed:mockaroo
```

## 🔍 Verification

After seeding with Mockaroo:

1. **Check the console output** for generation summaries
2. **Open Prisma Studio**: `npm run db:studio`
3. **Verify data quality** in your manufacturer dashboard
4. **Test QR code generation** with realistic batch IDs

## 🐛 Troubleshooting

### API Key Issues
```
Error: Mockaroo API error: 401 Unauthorized
```
**Solution**: Check your API key in `.env` file

### Rate Limit Exceeded
```
Error: Mockaroo API error: 403 Forbidden
```
**Solution**: Wait for daily reset or upgrade to paid plan

### Schema Errors
```
Error: Invalid schema field
```
**Solution**: Check field types in `PHARMACEUTICAL_SCHEMAS`

## 💡 Best Practices

1. **Use environment variables** for API keys
2. **Test with small datasets** first (5-10 records)
3. **Monitor your API usage** on Mockaroo dashboard
4. **Cache generated data** for development
5. **Use fallback data** for CI/CD pipelines

## 🎯 Benefits of Mockaroo Integration

✅ **Realistic Data**: Actual pharmaceutical names and formats  
✅ **Dynamic Generation**: Fresh data every time  
✅ **Scalable**: Generate hundreds of records  
✅ **Professional**: Data looks genuine for demos  
✅ **Customizable**: Adjust schemas for specific needs  
✅ **Reliable**: Fallback system ensures no downtime  

---

**Ready to generate realistic pharmaceutical data?** Just add your Mockaroo API key and run `npm run db:seed:mockaroo`!
