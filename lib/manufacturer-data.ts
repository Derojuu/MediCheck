import { prisma } from '@/lib/prisma'
import { BatchStatus, OrganizationType } from './generated/prisma'

// Mock data generators based on Mockaroo structure
export interface MockBatch {
  dosageForm: any
  strength: any
  createdAt: Date
  updatedAt: Date
  genericName: any
  batchId: string
  drugName: string
  composition: string
  batchSize: number
  manufacturingDate: Date
  expiryDate: Date
  storageInstructions: string
  currentLocation: string
  status: BatchStatus
  qrCodeData?: string
  blockchainHash?: string
}

export interface MockProduct {
  name: string
  description: string
  category: string
  dosageForm: string
  strength: string
  activeIngredients: string[]
  nafdacNumber: string
  shelfLifeMonths: number
  storageConditions: string
}

export interface MockTransfer {
  batchId: string
  fromOrgName: string
  toOrgName: string
  quantity: number
  transferReason: string
  notes?: string
}

// Mock data arrays (generated using Mockaroo-style approach)
export const mockProducts: MockProduct[] = [
  {
    name: "Paracetamol 500mg",
    description: "Analgesic and antipyretic for pain relief and fever reduction",
    category: "Analgesics",
    dosageForm: "Tablet",
    strength: "500mg",
    activeIngredients: ["Paracetamol 500mg"],
    nafdacNumber: "A4-1234",
    shelfLifeMonths: 24,
    storageConditions: "Store at room temperature (15-25°C), protect from moisture"
  },
  {
    name: "Amoxicillin 250mg",
    description: "Broad-spectrum antibiotic for bacterial infections",
    category: "Antibiotics",
    dosageForm: "Capsule",
    strength: "250mg",
    activeIngredients: ["Amoxicillin 250mg"],
    nafdacNumber: "A4-1235",
    shelfLifeMonths: 18,
    storageConditions: "Store at room temperature (15-25°C), keep dry"
  },
  {
    name: "Lisinopril 10mg",
    description: "ACE inhibitor for hypertension and heart failure",
    category: "Cardiovascular",
    dosageForm: "Tablet",
    strength: "10mg",
    activeIngredients: ["Lisinopril 10mg"],
    nafdacNumber: "A4-1236",
    shelfLifeMonths: 36,
    storageConditions: "Store at room temperature (15-25°C), protect from light"
  },
  {
    name: "Metformin 500mg",
    description: "Anti-diabetic medication for type 2 diabetes",
    category: "Antidiabetic",
    dosageForm: "Tablet",
    strength: "500mg",
    activeIngredients: ["Metformin HCl 500mg"],
    nafdacNumber: "A4-1237",
    shelfLifeMonths: 24,
    storageConditions: "Store at room temperature (15-25°C), keep dry"
  },
  {
    name: "Aspirin 75mg",
    description: "Low-dose aspirin for cardiovascular protection",
    category: "Cardiovascular",
    dosageForm: "Tablet",
    strength: "75mg",
    activeIngredients: ["Acetylsalicylic Acid 75mg"],
    nafdacNumber: "A4-1238",
    shelfLifeMonths: 36,
    storageConditions: "Store at room temperature (15-25°C), protect from moisture"
  },
  {
    name: "Omeprazole 20mg",
    description: "Proton pump inhibitor for acid-related disorders",
    category: "Gastrointestinal",
    dosageForm: "Capsule",
    strength: "20mg",
    activeIngredients: ["Omeprazole 20mg"],
    nafdacNumber: "A4-1239",
    shelfLifeMonths: 24,
    storageConditions: "Store at room temperature (15-25°C), protect from moisture"
  }
]

export const mockBatches: MockBatch[] = [
  {
      batchId: "PTC-2024-001",
      drugName: "Paracetamol 500mg",
      composition: "Paracetamol 500mg, Microcrystalline Cellulose, Starch",
      batchSize: 10000,
      manufacturingDate: new Date("2024-08-15"),
      expiryDate: new Date("2026-08-15"),
      storageInstructions: "Store at 15-25°C, protect from moisture",
      currentLocation: "Production Facility - Line A",
      status: "READY_FOR_DISPATCH",
      qrCodeData: "QR_PTC_2024_001_VERIFIED",
      blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      dosageForm: "Tablet",
      strength: "500mg",
      genericName: "Paracetamol",
      createdAt: new Date("2024-08-15"),
      updatedAt: new Date("2024-08-15")
  },
  {
      batchId: "PTC-2024-002",
      drugName: "Amoxicillin 250mg",
      composition: "Amoxicillin 250mg, Lactose, Magnesium Stearate",
      batchSize: 5000,
      manufacturingDate: new Date("2024-08-20"),
      expiryDate: new Date("2026-02-20"),
      storageInstructions: "Store at 2-8°C, keep refrigerated",
      currentLocation: "Quality Control Lab",
      status: "MANUFACTURING",
      qrCodeData: "QR_PTC_2024_002_PENDING",
      blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      dosageForm: "Capsule",
      strength: "250mg",
      genericName: "Amoxicillin",
      createdAt: new Date("2024-08-20"),
      updatedAt: new Date("2024-08-20")
  },
  {
      batchId: "PTC-2024-003",
      drugName: "Lisinopril 10mg",
      composition: "Lisinopril 10mg, Mannitol, Starch",
      batchSize: 15000,
      manufacturingDate: new Date("2024-08-25"),
      expiryDate: new Date("2027-08-25"),
      storageInstructions: "Store at 15-25°C, protect from light",
      currentLocation: "MediDistrib Lagos",
      status: "IN_TRANSIT",
      qrCodeData: "QR_PTC_2024_003_VERIFIED",
      blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      dosageForm: "Tablet",
      strength: "10mg",
      genericName: "Lisinopril",
      createdAt: new Date("2024-08-25"),
      updatedAt: new Date("2024-08-25")
  },
  {
      batchId: "PTC-2024-004",
      drugName: "Metformin 500mg",
      composition: "Metformin HCl 500mg, Hypromellose, Magnesium Stearate",
      batchSize: 8000,
      manufacturingDate: new Date("2024-09-01"),
      expiryDate: new Date("2026-09-01"),
      storageInstructions: "Store at 15-25°C, keep dry",
      currentLocation: "Warehouse B - Section 3",
      status: "READY_FOR_DISPATCH",
      qrCodeData: "QR_PTC_2024_004_VERIFIED",
      blockchainHash: "0x4d5e6f7890abcdef1234567890abcdef12345678",
      dosageForm: "Tablet",
      strength: "500mg",
      genericName: "Metformin",
      createdAt: new Date("2024-09-01"),
      updatedAt: new Date("2024-09-01")
  },
  {
      batchId: "PTC-2024-005",
      drugName: "Aspirin 75mg",
      composition: "Acetylsalicylic Acid 75mg, Corn Starch, Talc",
      batchSize: 20000,
      manufacturingDate: new Date("2024-09-02"),
      expiryDate: new Date("2027-09-02"),
      storageInstructions: "Store at 15-25°C, protect from moisture",
      currentLocation: "HealthPlus Pharmacy Chain",
      status: "DELIVERED",
      qrCodeData: "QR_PTC_2024_005_VERIFIED",
      blockchainHash: "0x5e6f7890abcdef1234567890abcdef1234567890",
      dosageForm: "Tablet",
      strength: "75mg",
      genericName: "Aspirin",
      createdAt: new Date("2024-09-02"),
      updatedAt: new Date("2024-09-02")
  },
  {
      batchId: "PTC-2024-006",
      drugName: "Omeprazole 20mg",
      composition: "Omeprazole 20mg, Lactose, Sodium Starch Glycolate",
      batchSize: 12000,
      manufacturingDate: new Date("2024-09-05"),
      expiryDate: new Date("2026-09-05"),
      storageInstructions: "Store at 15-25°C, protect from moisture",
      currentLocation: "Production Facility - Line B",
      status: "MANUFACTURING",
      qrCodeData: "QR_PTC_2024_006_PENDING",
      blockchainHash: "0x6f7890abcdef1234567890abcdef12345678901a",
      dosageForm: "Capsule",
      strength: "20mg",
      genericName: "Omeprazole",
      createdAt: new Date("2024-09-05"),
      updatedAt: new Date("2024-09-05")
  },
  {
      batchId: "PTC-2024-007",
      drugName: "Paracetamol 500mg",
      composition: "Paracetamol 500mg, Microcrystalline Cellulose, Starch",
      batchSize: 25000,
      manufacturingDate: new Date("2024-09-10"),
      expiryDate: new Date("2026-09-10"),
      storageInstructions: "Store at 15-25°C, protect from moisture",
      currentLocation: "Central Warehouse",
      status: "READY_FOR_DISPATCH",
      qrCodeData: "QR_PTC_2024_007_VERIFIED",
      blockchainHash: "0x7890abcdef1234567890abcdef12345678901abc",
      dosageForm: "Tablet",
      strength: "500mg",
      genericName: "Paracetamol",
      createdAt: new Date("2024-09-10"),
      updatedAt: new Date("2024-09-10")
  },
  {
      batchId: "PTC-2024-008",
      drugName: "Lisinopril 10mg",
      composition: "Lisinopril 10mg, Mannitol, Starch",
      batchSize: 18000,
      manufacturingDate: new Date("2024-09-12"),
      expiryDate: new Date("2027-09-12"),
      storageInstructions: "Store at 15-25°C, protect from light",
      currentLocation: "City Hospital Network",
      status: "DELIVERED",
      qrCodeData: "QR_PTC_2024_008_VERIFIED",
      blockchainHash: "0x890abcdef1234567890abcdef12345678901abcd",
      dosageForm: "Tablet",
      strength: "10mg",
      genericName: "Lisinopril",
      createdAt: new Date("2024-09-12"),
      updatedAt: new Date("2024-09-12")
  }
]

// Database seeding functions
export async function seedManufacturerData(organizationId: string) {
  try {
    // Create batches
    const createdBatches = await Promise.all(
      mockBatches.map(async (batch) => {
        return await prisma.medicationBatch.create({
          data: {
            batchId: batch.batchId,
            organizationId: organizationId,
            drugName: batch.drugName,
            composition: batch.composition,
            batchSize: batch.batchSize,
            manufacturingDate: batch.manufacturingDate,
            expiryDate: batch.expiryDate,
            storageInstructions: batch.storageInstructions,
            currentLocation: batch.currentLocation,
            status: batch.status,
            qrCodeData: batch.qrCodeData,
            blockchainHash: batch.blockchainHash
          }
        })
      })
    )

    console.log(`Created ${createdBatches.length} batches for manufacturer`)
    return createdBatches
  } catch (error) {
    console.error("Error seeding manufacturer data:", error)
    throw error
  }
}

// Batch operations
export async function createBatch(data: {
  organizationId: string
  drugName: string
  composition: string
  batchSize: number
  manufacturingDate: Date
  expiryDate: Date
  storageInstructions: string
}) {
  try {
    // Generate unique batch ID
    const batchCount = await prisma.medicationBatch.count({
      where: { organizationId: data.organizationId }
    })
    const batchId = `PTC-2024-${String(batchCount + 1).padStart(3, '0')}`

    const batch = await prisma.medicationBatch.create({
      data: {
        batchId,
        organizationId: data.organizationId,
        drugName: data.drugName,
        composition: data.composition,
        batchSize: data.batchSize,
        manufacturingDate: data.manufacturingDate,
        expiryDate: data.expiryDate,
        storageInstructions: data.storageInstructions,
        currentLocation: "Production Facility",
        status: "MANUFACTURING",
        qrCodeData: `QR_${batchId.replace('-', '_')}_PENDING`
      }
    })

    return batch
  } catch (error) {
    console.error("Error creating batch:", error)
    throw error
  }
}

export async function getBatches(organizationId: string) {
  try {
    const batches = await prisma.medicationBatch.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: { companyName: true }
        }
      }
    })
    return batches
  } catch (error) {
    console.error("Error fetching batches:", error)
    throw error
  }
}

export async function updateBatchStatus(batchId: string, status: BatchStatus, location?: string) {
  try {
    const batch = await prisma.medicationBatch.update({
      where: { batchId },
      data: {
        status,
        ...(location && { currentLocation: location }),
        updatedAt: new Date()
      }
    })
    return batch
  } catch (error) {
    console.error("Error updating batch status:", error)
    throw error
  }
}

export async function transferBatch(data: {
  batchId: string
  fromOrgId: string
  toOrgId: string
  notes?: string
}) {
  try {
    // Create transfer record
    const transfer = await prisma.ownershipTransfer.create({
      data: {
        batchId: data.batchId,
        fromOrgId: data.fromOrgId,
        toOrgId: data.toOrgId,
        status: "PENDING",
        notes: data.notes,
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`
      }
    })

    // Update batch status
    await updateBatchStatus(data.batchId, "IN_TRANSIT")

    return transfer
  } catch (error) {
    console.error("Error transferring batch:", error)
    throw error
  }
}

export async function getTransferHistory(organizationId: string) {
  try {
    const transfers = await prisma.ownershipTransfer.findMany({
      where: {
        OR: [
          { fromOrgId: organizationId },
          { toOrgId: organizationId }
        ]
      },
      include: {
        batch: {
          select: { batchId: true, drugName: true }
        },
        fromOrg: {
          select: { companyName: true }
        },
        toOrg: {
          select: { companyName: true }
        }
      },
      orderBy: { transferDate: 'desc' }
    })
    return transfers
  } catch (error) {
    console.error("Error fetching transfer history:", error)
    throw error
  }
}

// Analytics functions
export async function getManufacturerStats(organizationId: string) {
  try {
    const [
      totalBatches,
      activeBatches,
      pendingQuality,
      recentTransfers
    ] = await Promise.all([
      prisma.medicationBatch.count({
        where: { organizationId }
      }),
      prisma.medicationBatch.count({
        where: {
          organizationId,
          status: { in: ["READY_FOR_DISPATCH", "IN_TRANSIT", "DELIVERED"] }
        }
      }),
      prisma.medicationBatch.count({
        where: {
          organizationId,
          status: "MANUFACTURING"
        }
      }),
      prisma.ownershipTransfer.count({
        where: {
          fromOrgId: organizationId,
          transferDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    return {
      totalBatches,
      activeBatches,
      pendingQuality,
      recentTransfers
    }
  } catch (error) {
    console.error("Error fetching manufacturer stats:", error)
    throw error
  }
}
