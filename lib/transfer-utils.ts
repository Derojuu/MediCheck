// /lib/transfer-utils.ts
import { prisma } from "@/lib/prisma";
import { OrganizationType } from "@/lib/generated/prisma";

export interface TransferValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TransferRule {
  fromType: OrganizationType;
  toType: OrganizationType;
  allowed: boolean;
  requiresApproval: boolean;
  description: string;
}

// Define allowed transfer rules between organization types
export const TRANSFER_RULES: TransferRule[] = [
  // Standard supply chain flow
  {
    fromType: "MANUFACTURER",
    toType: "DRUG_DISTRIBUTOR",
    allowed: true,
    requiresApproval: true,
    description: "Wholesale distribution"
  },
  {
    fromType: "DRUG_DISTRIBUTOR",
    toType: "PHARMACY",
    allowed: true,
    requiresApproval: true,
    description: "Retail distribution"
  },
  {
    fromType: "DRUG_DISTRIBUTOR",
    toType: "HOSPITAL",
    allowed: true,
    requiresApproval: true,
    description: "Hospital distribution"
  },
  
  // Direct sales
  {
    fromType: "MANUFACTURER",
    toType: "HOSPITAL",
    allowed: true,
    requiresApproval: true,
    description: "Direct hospital sales"
  },
  {
    fromType: "MANUFACTURER",
    toType: "PHARMACY",
    allowed: true,
    requiresApproval: true,
    description: "Direct pharmacy sales"
  },
  
  // Inter-facility transfers
  {
    fromType: "HOSPITAL",
    toType: "HOSPITAL",
    allowed: true,
    requiresApproval: true,
    description: "Inter-hospital transfer"
  },
  {
    fromType: "PHARMACY",
    toType: "PHARMACY",
    allowed: true,
    requiresApproval: true,
    description: "Inter-pharmacy transfer"
  },
  
  // Returns
  {
    fromType: "PHARMACY",
    toType: "DRUG_DISTRIBUTOR",
    allowed: true,
    requiresApproval: true,
    description: "Pharmacy return to distributor"
  },
  {
    fromType: "HOSPITAL",
    toType: "DRUG_DISTRIBUTOR",
    allowed: true,
    requiresApproval: true,
    description: "Hospital return to distributor"
  },
  {
    fromType: "DRUG_DISTRIBUTOR",
    toType: "MANUFACTURER",
    allowed: true,
    requiresApproval: true,
    description: "Distributor return to manufacturer"
  },
  
  // Regulatory oversight (view only, no transfers)
  {
    fromType: "REGULATOR",
    toType: "MANUFACTURER",
    allowed: false,
    requiresApproval: false,
    description: "Regulators cannot transfer ownership"
  }
];

export async function validateTransfer(
  batchId: string,
  fromOrgId: string,
  toOrgId: string,
  quantity?: number
): Promise<TransferValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate organizations exist and get their types
    const [fromOrg, toOrg, batch] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: fromOrgId },
        select: { id: true, organizationType: true, companyName: true, isVerified: true, isActive: true }
      }),
      prisma.organization.findUnique({
        where: { id: toOrgId },
        select: { id: true, organizationType: true, companyName: true, isVerified: true, isActive: true }
      }),
      prisma.medicationBatch.findUnique({
        where: { id: batchId },
        include: {
          medicationUnits: {
            where: { status: { in: ["IN_STOCK", "DISPATCHED"] } }
          }
        }
      })
    ]);

    // Validate organizations exist
    if (!fromOrg) {
      errors.push("Source organization not found");
    }
    if (!toOrg) {
      errors.push("Destination organization not found");
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    // Validate organization status
    if (!fromOrg!.isActive) {
      errors.push("Source organization is not active");
    }
    if (!toOrg!.isActive) {
      errors.push("Destination organization is not active");
    }

    // Check verification status
    if (!fromOrg!.isVerified) {
      warnings.push("Source organization is not verified");
    }
    if (!toOrg!.isVerified) {
      warnings.push("Destination organization is not verified");
    }

    // Validate batch
    if (!batch) {
      errors.push("Batch not found");
      return { isValid: false, errors, warnings };
    }

    // Check batch ownership
    if (batch.organizationId !== fromOrgId) {
      errors.push("Batch does not belong to source organization");
    }

    // Check batch status
    if (!["READY_FOR_DISPATCH", "IN_TRANSIT", "DELIVERED", "MANUFACTURING"].includes(batch.status)) {
      errors.push(`Batch cannot be transferred. Current status: ${batch.status}`);
    }

    // Check expiry
    const now = new Date();
    if (new Date(batch.expiryDate) <= now) {
      errors.push("Cannot transfer expired batch");
    }

    // Validate quantity
    const availableUnits = batch.medicationUnits?.length || batch.batchSize;
    if (quantity && quantity > availableUnits) {
      errors.push(`Insufficient units. Available: ${availableUnits}, Requested: ${quantity}`);
    }

    // Check transfer rules
    const transferRule = TRANSFER_RULES.find(
      rule => rule.fromType === fromOrg!.organizationType && rule.toType === toOrg!.organizationType
    );

    if (!transferRule) {
      errors.push(`Transfer not allowed between ${fromOrg!.organizationType} and ${toOrg!.organizationType}`);
    } else if (!transferRule.allowed) {
      errors.push(`Transfer type not permitted: ${transferRule.description}`);
    }

    // Check for pending transfers
    const pendingTransfers = await prisma.ownershipTransfer.findMany({
      where: {
        batchId,
        status: { in: ["PENDING", "IN_PROGRESS"] }
      }
    });

    if (pendingTransfers.length > 0) {
      errors.push("Batch has pending transfers that must be completed first");
    }

    // Warning for near expiry
    const daysToExpiry = Math.floor((new Date(batch.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry <= 30) {
      warnings.push(`Batch expires in ${daysToExpiry} days`);
    }

    // Warning for large quantity transfers
    if (quantity && quantity > 1000) {
      warnings.push("Large quantity transfer may require additional documentation");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };

  } catch (error) {
    console.error("Transfer validation error:", error);
    return {
      isValid: false,
      errors: ["Validation failed due to system error"],
      warnings
    };
  }
}

export function getTransferType(fromType: OrganizationType, toType: OrganizationType): string {
  if (fromType === "MANUFACTURER" && toType === "DRUG_DISTRIBUTOR") {
    return "WHOLESALE";
  }
  if (fromType === "DRUG_DISTRIBUTOR" && (toType === "PHARMACY" || toType === "HOSPITAL")) {
    return "DISTRIBUTION";
  }
  if (fromType === "MANUFACTURER" && (toType === "HOSPITAL" || toType === "PHARMACY")) {
    return "DIRECT_SALE";
  }
  if (fromType === toType) {
    return "INTER_FACILITY";
  }
  if (["PHARMACY", "HOSPITAL", "DRUG_DISTRIBUTOR"].includes(fromType) && 
      ["DRUG_DISTRIBUTOR", "MANUFACTURER"].includes(toType)) {
    return "RETURN";
  }
  return "OTHER";
}

export async function getTransferHistory(organizationId: string, limit: number = 10) {
  return await prisma.ownershipTransfer.findMany({
    where: {
      OR: [
        { fromOrgId: organizationId },
        { toOrgId: organizationId }
      ]
    },
    include: {
      batch: {
        select: {
          batchId: true,
          drugName: true,
          batchSize: true
        }
      },
      fromOrg: {
        select: {
          companyName: true,
          organizationType: true
        }
      },
      toOrg: {
        select: {
          companyName: true,
          organizationType: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}
