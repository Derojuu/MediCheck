
import { MedicationBatchProp } from "./schemType"
export interface ProductProps {
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


export type ManufacturerTab =
  | "dashboard"
  | "batches"
  | "products"
  | "transfers"
  | "quality"
  | "transport"
  | "qr-generator"
  | "team"
  | "reports"
  | "inventory"
  | "alerts"
  | "qr-scanner"
  | "settings";


export interface ProductProps {
  name: string;
  description: string;
  category: string;
  dosageForm: string;
  strength: string;
  activeIngredients: string[];
  nafdacNumber: string;
  shelfLifeMonths: number;
  storageConditions: string;
}

export interface MedicationBatchInfoProps extends MedicationBatchProp {
  _count: {
    medicationUnits: number;
  };
}


export interface TransferProps {
  id: string;
  batchId: string;
  fromOrgId: string;
  toOrgId: string;
  status: string;
  notes?: string;
  transferDate: string;
  createdAt: string;
  direction: "OUTGOING" | "INCOMING";
  requiresApproval: boolean;
  canApprove: boolean;
  batch: {
    batchId: string;
    drugName: string;
    batchSize: number;
    manufacturingDate: string;
    expiryDate: string;
  };
  fromOrg: {
    companyName: string;
    organizationType: string;
    contactEmail: string;
  };
  toOrg: {
    companyName: string;
    organizationType: string;
    contactEmail: string;
  };
}

export interface HederaLogPayload {
  batchId: string;
  organizationId: string;
  // region: string;
  drugName?: string;
  batchSize?: string;
  // specific to batch creation
  manufacturingDate?: string;
  expiryDate?: string;
  // specific to transfer
  transferFrom?: string; // for transfer
  transferTo?: string; // for transfer
  qrSignature?: string;
  // flag
  flagReason?: string

}