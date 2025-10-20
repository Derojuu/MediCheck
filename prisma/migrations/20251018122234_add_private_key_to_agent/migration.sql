-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ORGANIZATION_MEMBER', 'CONSUMER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."OrganizationType" AS ENUM ('MANUFACTURER', 'DRUG_DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR');

-- CreateEnum
CREATE TYPE "public"."BatchStatus" AS ENUM ('CREATED', 'IN_TRANSIT', 'DELIVERED', 'FLAGGED', 'RECALLED', 'EXPIRED', 'BULLY');

-- CreateEnum
CREATE TYPE "public"."UnitStatus" AS ENUM ('IN_STOCK', 'DISPATCHED', 'SOLD', 'RETURNED', 'LOST');

-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ScanResult" AS ENUM ('GENUINE', 'SUSPICIOUS');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('COUNTERFEIT_DETECTED', 'PACKAGING_ISSUE', 'EXPIRY_MISMATCH', 'MULTIPLE_SCANS', 'SUSPICIOUS_ACTIVITY');

-- CreateEnum
CREATE TYPE "public"."SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "public"."ScanType" AS ENUM ('UNIT', 'BATCH');

-- CreateEnum
CREATE TYPE "public"."ScannedBy" AS ENUM ('CONSUMER', 'ORGANIZATION_MEMBER', 'ANONYMOUS_USER');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "userRole" "public"."UserRole" NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consumers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "address" TEXT,
    "country" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "organizationType" "public"."OrganizationType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "contactPersonName" TEXT,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "rcNumber" TEXT,
    "nafdacNumber" TEXT,
    "businessRegNumber" TEXT,
    "licenseNumber" TEXT,
    "pcnNumber" TEXT,
    "agencyName" TEXT,
    "officialId" TEXT,
    "distributorType" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "dosageForm" TEXT,
    "strength" TEXT,
    "activeIngredients" TEXT[],
    "nafdacNumber" TEXT,
    "shelfLifeMonths" INTEGER,
    "storageConditions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medication_batches" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "composition" TEXT,
    "batchSize" INTEGER NOT NULL,
    "manufacturingDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "storageInstructions" TEXT,
    "currentLocation" TEXT,
    "status" "public"."BatchStatus" NOT NULL DEFAULT 'CREATED',
    "qrCodeData" TEXT,
    "qrSignature" TEXT,
    "secretKey" TEXT,
    "blockchainHash" TEXT,
    "registryTopicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medication_units" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "qrCode" TEXT,
    "qrSignature" TEXT,
    "currentLocation" TEXT,
    "status" "public"."UnitStatus" NOT NULL DEFAULT 'IN_STOCK',
    "blockchainHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrySequence" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BatchEvent" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "hederaSeq" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "region" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ownership_transfers" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "fromOrgId" TEXT NOT NULL,
    "toOrgId" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."TransferStatus" NOT NULL DEFAULT 'PENDING',
    "blockchainHash" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ownership_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scan_history" (
    "id" TEXT NOT NULL,
    "batchId" TEXT,
    "teamMemberId" TEXT,
    "unitId" TEXT,
    "consumerId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL,
    "region" TEXT,
    "scanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scanResult" "public"."ScanResult" NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prediction_scores" (
    "id" TEXT NOT NULL,
    "scanHistoryId" TEXT NOT NULL,
    "predictedLabel" BOOLEAN NOT NULL,
    "predictedProbability" DOUBLE PRECISION NOT NULL,
    "predictedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region" TEXT,
    "scanType" "public"."ScanType",

    CONSTRAINT "prediction_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."counterfeit_reports" (
    "id" TEXT NOT NULL,
    "batchId" TEXT,
    "reporterId" TEXT NOT NULL,
    "reportType" "public"."ReportType" NOT NULL,
    "severity" "public"."SeverityLevel" NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "evidence" TEXT[],
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "investigatorId" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "counterfeit_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "inboundTopic" TEXT NOT NULL,
    "outboundTopic" TEXT NOT NULL,
    "connectionTopic" TEXT,
    "managedRegistry" TEXT,
    "profileId" TEXT,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentMessage" (
    "id" SERIAL NOT NULL,
    "topicId" TEXT NOT NULL,
    "message" JSONB NOT NULL,
    "sequence" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "public"."users"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "consumers_userId_key" ON "public"."consumers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_adminId_key" ON "public"."organizations"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_key" ON "public"."team_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "medication_batches_batchId_key" ON "public"."medication_batches"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "medication_units_serialNumber_key" ON "public"."medication_units"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_accountId_key" ON "public"."Agent"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_orgId_key" ON "public"."Agent"("orgId");

-- AddForeignKey
ALTER TABLE "public"."consumers" ADD CONSTRAINT "consumers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."organizations" ADD CONSTRAINT "organizations_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medication_batches" ADD CONSTRAINT "medication_batches_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medication_units" ADD CONSTRAINT "medication_units_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."medication_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BatchEvent" ADD CONSTRAINT "BatchEvent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."medication_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ownership_transfers" ADD CONSTRAINT "ownership_transfers_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."medication_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ownership_transfers" ADD CONSTRAINT "ownership_transfers_fromOrgId_fkey" FOREIGN KEY ("fromOrgId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ownership_transfers" ADD CONSTRAINT "ownership_transfers_toOrgId_fkey" FOREIGN KEY ("toOrgId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scan_history" ADD CONSTRAINT "scan_history_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."medication_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scan_history" ADD CONSTRAINT "scan_history_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scan_history" ADD CONSTRAINT "scan_history_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."medication_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scan_history" ADD CONSTRAINT "scan_history_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "public"."consumers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prediction_scores" ADD CONSTRAINT "prediction_scores_scanHistoryId_fkey" FOREIGN KEY ("scanHistoryId") REFERENCES "public"."scan_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."counterfeit_reports" ADD CONSTRAINT "counterfeit_reports_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."medication_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."counterfeit_reports" ADD CONSTRAINT "counterfeit_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."consumers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentMessage" ADD CONSTRAINT "AgentMessage_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
