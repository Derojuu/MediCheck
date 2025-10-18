export enum UserRoleEnum {
  ORGANIZATION_MEMBER = "ORGANIZATION_MEMBER",
  CONSUMER = "CONSUMER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum OrganizationTypeEnum {
  MANUFACTURER = "MANUFACTURER",
  DRUG_DISTRIBUTOR = "DRUG_DISTRIBUTOR",
  HOSPITAL = "HOSPITAL",
  PHARMACY = "PHARMACY",
  REGULATOR = "REGULATOR",
}

export enum BatchStatusEnum {
  CREATED = "CREATED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  FLAGGED = "FLAGGED",
  RECALLED = "RECALLED",
  EXPIRED = "EXPIRED",
}

export enum UnitStatusEnum {
  IN_STOCK = "IN_STOCK",
  DISPATCHED = "DISPATCHED",
  SOLD = "SOLD",
  RETURNED = "RETURNED",
  LOST = "LOST",
}

export enum TransferStatusEnum {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ScanResultEnum {
  GENUINE = "GENUINE",
  COUNTERFEIT = "COUNTERFEIT",
  SUSPICIOUS = "SUSPICIOUS",
  NOT_FOUND = "NOT_FOUND",
  EXPIRED = "EXPIRED",
}

export enum ReportTypeEnum {
  COUNTERFEIT_DETECTED = "COUNTERFEIT_DETECTED",
  PACKAGING_ISSUE = "PACKAGING_ISSUE",
  EXPIRY_MISMATCH = "EXPIRY_MISMATCH",
  MULTIPLE_SCANS = "MULTIPLE_SCANS",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum SeverityLevelEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ReportStatusEnum {
  PENDING = "PENDING",
  INVESTIGATING = "INVESTIGATING",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
  ESCALATED = "ESCALATED",
}

// ✅ Model Interfaces

export interface UserProp {
  id: string;
  userRole: UserRoleEnum;
  clerkUserId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsumerProp {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface OrganizationProp {
  id: string;
  adminId: string;
  organizationType: OrganizationTypeEnum;
  companyName: string;
  contactEmail: string;
  contactPhone?: string | null;
  contactPersonName?: string | null;
  address: string;
  country: string;
  state?: string | null;
  rcNumber?: string | null;
  nafdacNumber?: string | null;
  businessRegNumber?: string | null;
  licenseNumber?: string | null;
  pcnNumber?: string | null;
  agencyName?: string | null;
  officialId?: string | null;
  distributorType?: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberProp {
  id: string;
  userId: string;
  organizationId: string;
  isAdmin: boolean;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: Date;
  lastActive: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationBatchProp {
  id: string;
  batchId: string;
  organizationId: string;
  drugName: string;
  composition?: string | null;
  batchSize: number;
  manufacturingDate: Date;
  expiryDate: Date;
  storageInstructions?: string | null;
  currentLocation?: string | null;
  status: BatchStatusEnum;
  qrCodeData?: string | null;
  qrSignature?: string | null;
  blockchainHash?: string | null;
  registryTopicId?: string;
  createdAt: Date;
  updatedAt: Date;
  transportTracking?: {
    trackingNumber: string;
    estimatedDelivery: Date;
    currentGPS: string;
    transportMethod: string;
    route: string;
    lastUpdate: Date;
  };
}
export interface MedicationUnitProp {
  id: string;
  batchId: string;
  serialNumber: string;
  qrCode?: string | null;
  qrSignature?: string | null;
  currentLocation?: string | null;
  status: UnitStatusEnum;
  blockchainHash?: string | null;
  registrySequence?: number;
  currentOwner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnershipTransferProp {
  id: string;
  batchId: string;
  fromOrgId: string;
  toOrgId: string;
  transferDate: Date;
  status: TransferStatusEnum;
  blockchainHash?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanHistoryProp {
  id: string;
  batchId: string;
  consumerId?: string | null;
  scanLocation?: string | null;
  scanDate: Date;
  scanResult: ScanResultEnum;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
}

export interface CounterfeitReportProp {
  id: string;
  batchId?: string | null;
  reporterId: string;
  reportType: ReportTypeEnum;
  severity: SeverityLevelEnum;
  description: string;
  location?: string | null;
  evidence: string[];
  status: ReportStatusEnum;
  investigatorId?: string | null;
  resolution?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 🔒 Message Envelope Interface — standardized for all HCS-10 messages
 */
export interface HCS10Envelope {
  p: "hcs-10"; // Protocol identifier
  op:
    | "connection_request"
    | "connection_created"
    | "message"
    | "close_connection";
  data: string; // JSON-stringified payload
  payer: string; // Agent account ID sending message
  outbound_topic_id?: string;
  connection_topic_id?: string;
  created?: Date;
  sig?: string; // Signature of data
}

/**
 * 🧾 Agent registration payload
 */
export interface AgentRegistrationPayload {
  accountId: string;
  orgId: string;
  role: string; // "manufacturer" | "distributor" | "pharmacy" | "hospital" | "regulator" | "gateway"
  inboundTopic: string;
  outboundTopic: string;
  managedRegistry?: string;
  profileId?: string;
  publicKey: string;
}