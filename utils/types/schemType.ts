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
  MANUFACTURING = "MANUFACTURING",
  READY_FOR_DISPATCH = "READY_FOR_DISPATCH",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
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
  blockchainHash?: string | null;
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
  currentLocation?: string | null;
  status: UnitStatusEnum;
  blockchainHash?: string | null;
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
