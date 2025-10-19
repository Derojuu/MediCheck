
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
  | "settings"
  | "investigations"
  | "analytics"
  | "entities"
  | "compliance";

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

export interface MyPublicMetadata {
  role?: string;
  organizationType?: string;
}


export interface HCSMessage {
  p: "hcs-10"; // Protocol identifier
  op:
    | "connection_request" // Operation type
    | "connection_created"
    | "message"
    | "close_connection";
  data: string; // Message content
  created?: Date; // Creation timestamp
  consensus_timestamp?: string; // Hedera consensus timestamp
  m?: string; // Optional memo
  payer: string; // Transaction payer account
  outbound_topic_id?: string; // Related outbound topic
  connection_request_id?: number; // For connection requests
  confirmed_request_id?: number; // For confirmations
  connection_topic_id?: string; // Shared connection topic
  connected_account_id?: string; // Connected account
  requesting_account_id?: string; // Requesting account
  connection_id?: number; // Unique connection ID
  sequence_number: number; // Message sequence
  operator_id?: string; // Operator ID (format: topicId@accountId)
  reason?: string; // Optional reason (for close)
  close_method?: string; // Close method
}



export enum Hcs10MemoType {
  INBOUND = "inbound", // For inbound topic memos
  OUTBOUND = "outbound", // For outbound topic memos
  CONNECTION = "connection", // For connection topic memos
}