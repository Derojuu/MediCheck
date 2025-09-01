
export enum UserRole {
  ORGANIZATION_MEMBER = "ORGANIZATION_MEMBER",
  CONSUMER = "CONSUMER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum OrganizationType {
  MANUFACTURER = "MANUFACTURER",
  DRUG_DISTRIBUTOR = "DRUG_DISTRIBUTOR",
  HOSPITAL = "HOSPITAL",
  PHARMACY = "PHARMACY",
  REGULATOR = "REGULATOR",
}

export enum BatchStatus {
  MANUFACTURING = "MANUFACTURING",
  READY_FOR_DISPATCH = "READY_FOR_DISPATCH",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RECALLED = "RECALLED",
  EXPIRED = "EXPIRED",
}

export enum UnitStatus {
  IN_STOCK = "IN_STOCK",
  DISPATCHED = "DISPATCHED",
  SOLD = "SOLD",
  RETURNED = "RETURNED",
  LOST = "LOST",
}

export enum TransferStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ScanResult {
  GENUINE = "GENUINE",
  COUNTERFEIT = "COUNTERFEIT",
  SUSPICIOUS = "SUSPICIOUS",
  NOT_FOUND = "NOT_FOUND",
  EXPIRED = "EXPIRED",
}

export enum ReportType {
  COUNTERFEIT_DETECTED = "COUNTERFEIT_DETECTED",
  PACKAGING_ISSUE = "PACKAGING_ISSUE",
  EXPIRY_MISMATCH = "EXPIRY_MISMATCH",
  MULTIPLE_SCANS = "MULTIPLE_SCANS",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum SeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ReportStatus {
  PENDING = "PENDING",
  INVESTIGATING = "INVESTIGATING",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
  ESCALATED = "ESCALATED",
}

// ✅ Model Interfaces

export interface User {
  id: string;
  userRole: UserRole;
  clerkUserId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consumer {
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

export interface Organization {
  id: string;
  adminId: string;
  organizationType: OrganizationType;
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

export interface TeamMember {
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

export interface MedicationBatch {
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
  status: BatchStatus;
  qrCodeData?: string | null;
  blockchainHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationUnit {
  id: string;
  batchId: string;
  serialNumber: string;
  qrCode?: string | null;
  currentLocation?: string | null;
  status: UnitStatus;
  blockchainHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnershipTransfer {
  id: string;
  batchId: string;
  fromOrgId: string;
  toOrgId: string;
  transferDate: Date;
  status: TransferStatus;
  blockchainHash?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanHistory {
  id: string;
  batchId: string;
  consumerId?: string | null;
  scanLocation?: string | null;
  scanDate: Date;
  scanResult: ScanResult;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
}

export interface CounterfeitReport {
  id: string;
  batchId?: string | null;
  reporterId: string;
  reportType: ReportType;
  severity: SeverityLevel;
  description: string;
  location?: string | null;
  evidence: string[];
  status: ReportStatus;
  investigatorId?: string | null;
  resolution?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


