import { ProductProps } from "@/utils"

export const dummyProducts: ProductProps[] = [
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

export const dummyTransfers = [
    {
        id: "T001",
        batchNumber: "PTC-2024-001",
        productName: "Paracetamol 500mg",
        fromEntity: "PharmaTech Industries",
        toEntity: "MediDistrib Lagos",
        quantity: 1500,
        transferDate: "2024-09-01",
        status: "Completed",
    },
    {
        id: "T002",
        batchNumber: "PTC-2024-003",
        productName: "Lisinopril 10mg",
        fromEntity: "PharmaTech Industries",
        toEntity: "City Hospital Pharmacy",
        quantity: 3000,
        transferDate: "2024-08-30",
        status: "Completed",
    },
    {
        id: "T003",
        batchNumber: "PTC-2024-005",
        productName: "Aspirin 75mg",
        fromEntity: "PharmaTech Industries",
        toEntity: "HealthPlus Pharmacy",
        quantity: 5000,
        transferDate: "2024-09-02",
        status: "Pending",
    },
];