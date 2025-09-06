
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
