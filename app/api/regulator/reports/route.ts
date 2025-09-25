import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create User record
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          userRole: "SUPER_ADMIN",
          isActive: true
        }
      });
    }

    // Find the regulator organization for this user
    let organization = await prisma.organization.findFirst({
      where: {
        organizationType: "REGULATOR",
        OR: [
          { adminId: user.id },
          { teamMembers: { some: { userId: user.id } } }
        ]
      }
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          adminId: user.id,
          organizationType: "REGULATOR",
          companyName: "Regulatory Authority",
          contactEmail: "regulator@authority.gov",
          address: "Regulatory Building",
          country: "Nigeria",
          agencyName: "NAFDAC",
          officialId: `REG-${Date.now()}`,
          isVerified: true,
          isActive: true
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type") || "summary";

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let reportData: any = {};

    switch (reportType) {
      case "investigations":
        reportData = await generateInvestigationsReport(startOfMonth);
        break;
      case "compliance":
        reportData = await generateComplianceReport(startOfMonth);
        break;
      case "entities":
        reportData = await generateEntitiesReport();
        break;
      case "violations":
        reportData = await generateViolationsReport(startOfMonth);
        break;
      case "summary":
      default:
        reportData = await generateSummaryReport(startOfMonth, startOfYear);
        break;
    }

    // Log report generation
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `REPORT_GENERATED`,
        entityType: "REPORT",
        details: {
          reportType,
          generatedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ 
      reportType,
      generatedAt: new Date().toISOString(),
      data: reportData 
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateInvestigationsReport(startDate: Date) {
  const investigations = await prisma.counterfeitReport.findMany({
    where: {
      createdAt: { gte: startDate }
    },
    include: {
      batch: {
        select: {
          batchId: true,
          drugName: true,
          organization: {
            select: {
              companyName: true,
              organizationType: true
            }
          }
        }
      },
      consumers: {
        select: {
          fullName: true,
          country: true,
          state: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const summary = {
    total: investigations.length,
    pending: investigations.filter(inv => inv.status === "PENDING").length,
    investigating: investigations.filter(inv => inv.status === "INVESTIGATING").length,
    resolved: investigations.filter(inv => inv.status === "RESOLVED").length,
    dismissed: investigations.filter(inv => inv.status === "DISMISSED").length,
    bySeverity: {
      critical: investigations.filter(inv => inv.severity === "CRITICAL").length,
      high: investigations.filter(inv => inv.severity === "HIGH").length,
      medium: investigations.filter(inv => inv.severity === "MEDIUM").length,
      low: investigations.filter(inv => inv.severity === "LOW").length
    }
  };

  return { investigations, summary };
}

async function generateComplianceReport(startDate: Date) {
  const transfers = await prisma.ownershipTransfer.findMany({
    where: {
      transferDate: { gte: startDate }
    },
    include: {
      batch: {
        select: {
          batchId: true,
          drugName: true,
          manufacturingDate: true,
          expiryDate: true
        }
      },
      fromOrg: {
        select: {
          companyName: true,
          organizationType: true,
          isVerified: true
        }
      },
      toOrg: {
        select: {
          companyName: true,
          organizationType: true,
          isVerified: true
        }
      }
    },
    orderBy: {
      transferDate: "desc"
    }
  });

  const summary = {
    total: transfers.length,
    pending: transfers.filter(t => t.status === "PENDING").length,
    completed: transfers.filter(t => t.status === "COMPLETED").length,
    failed: transfers.filter(t => t.status === "FAILED").length,
    complianceRate: transfers.length > 0 ? 
      Math.round((transfers.filter(t => t.status === "COMPLETED").length / transfers.length) * 100) : 0
  };

  return { transfers, summary };
}

async function generateEntitiesReport() {
  const organizations = await prisma.organization.findMany({
    where: {
      organizationType: { not: "REGULATOR" }
    },
    include: {
      medicationBatches: {
        select: {
          id: true,
          status: true
        }
      },
      transfersFrom: {
        select: {
          id: true,
          status: true
        }
      },
      transfersTo: {
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const summary = {
    total: organizations.length,
    verified: organizations.filter(org => org.isVerified).length,
    active: organizations.filter(org => org.isActive).length,
    byType: {
      manufacturers: organizations.filter(org => org.organizationType === "MANUFACTURER").length,
      distributors: organizations.filter(org => org.organizationType === "DRUG_DISTRIBUTOR").length,
      hospitals: organizations.filter(org => org.organizationType === "HOSPITAL").length,
      pharmacies: organizations.filter(org => org.organizationType === "PHARMACY").length
    }
  };

  return { organizations, summary };
}

async function generateViolationsReport(startDate: Date) {
  const violations = await prisma.counterfeitReport.findMany({
    where: {
      createdAt: { gte: startDate },
      severity: { in: ["HIGH", "CRITICAL"] }
    },
    include: {
      batch: {
        include: {
          organization: {
            select: {
              companyName: true,
              organizationType: true,
              contactEmail: true
            }
          }
        }
      },
      consumers: {
        select: {
          fullName: true,
          country: true,
          state: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const summary = {
    total: violations.length,
    critical: violations.filter(v => v.severity === "CRITICAL").length,
    high: violations.filter(v => v.severity === "HIGH").length,
    resolved: violations.filter(v => v.status === "RESOLVED").length,
    byType: violations.reduce((acc, violation) => {
      acc[violation.reportType] = (acc[violation.reportType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return { violations, summary };
}

async function generateSummaryReport(startOfMonth: Date, startOfYear: Date) {
  const [
    totalOrganizations,
    verifiedOrganizations,
    totalBatches,
    activeBatches,
    monthlyScans,
    yearlyScans,
    activeInvestigations,
    resolvedInvestigations,
    pendingTransfers,
    completedTransfers
  ] = await Promise.all([
    prisma.organization.count({ where: { organizationType: { not: "REGULATOR" } } }),
    prisma.organization.count({ where: { organizationType: { not: "REGULATOR" }, isVerified: true } }),
    prisma.medicationBatch.count(),
    prisma.medicationBatch.count({ where: { status: { in: ["CREATED", "IN_TRANSIT", "DELIVERED"] } } }),
    prisma.scanHistory.count({ where: { scanDate: { gte: startOfMonth } } }),
    prisma.scanHistory.count({ where: { scanDate: { gte: startOfYear } } }),
    prisma.counterfeitReport.count({ where: { status: { in: ["PENDING", "INVESTIGATING"] } } }),
    prisma.counterfeitReport.count({ where: { status: "RESOLVED" } }),
    prisma.ownershipTransfer.count({ where: { status: "PENDING" } }),
    prisma.ownershipTransfer.count({ where: { status: "COMPLETED", transferDate: { gte: startOfMonth } } })
  ]);

  return {
    overview: {
      totalOrganizations,
      verifiedOrganizations,
      verificationRate: totalOrganizations > 0 ? Math.round((verifiedOrganizations / totalOrganizations) * 100) : 0,
      totalBatches,
      activeBatches,
      monthlyScans,
      yearlyScans
    },
    compliance: {
      pendingTransfers,
      completedTransfers,
      complianceRate: (pendingTransfers + completedTransfers) > 0 ? 
        Math.round((completedTransfers / (pendingTransfers + completedTransfers)) * 100) : 0
    },
    investigations: {
      activeInvestigations,
      resolvedInvestigations,
      resolutionRate: (activeInvestigations + resolvedInvestigations) > 0 ? 
        Math.round((resolvedInvestigations / (activeInvestigations + resolvedInvestigations)) * 100) : 0
    }
  };
}