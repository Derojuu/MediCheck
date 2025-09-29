import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
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

    // --- PDF GENERATION ---
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    // Register and use your custom font
    const fontPath = process.cwd() + "/public/fonts/OpenSans-VariableFont_wdth,wght.ttf";
    console.log("FONT PATH:", fontPath);
    doc.registerFont("custom", fontPath);
    doc.font("custom");

    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Header
    doc.font("custom").fontSize(22).text("Regulatory Report", { align: "center" }).moveDown(0.5);
    doc.font("custom").fontSize(14).text(`Type: ${capitalize(reportType)}`, { align: "center" }).moveDown(0.5);
    doc.font("custom").fontSize(10).text(`Generated at: ${new Date().toLocaleString()}`, { align: "center" }).moveDown(1.5);

    // Organization Info
    doc.font("custom").fontSize(11).text("Regulator:", { continued: true });
    doc.font("custom").fontSize(11).text(` ${organization.companyName} (${organization.agencyName})`).moveDown(0.5);
    doc.font("custom").fontSize(11).text("Contact:", { continued: true });
    doc.font("custom").fontSize(11).text(` ${organization.contactEmail}`).moveDown(1);

    // Section: Report Data
    doc.font("custom").fontSize(14).text("Report Details", { underline: true }).moveDown(0.5);

    // Render report data in a readable format
    renderReportSection(doc, reportType, reportData);

    doc.end();

    // Wait for PDF to finish
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportType}-report.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper to capitalize first letter
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Render report data in a readable format
function renderReportSection(doc: PDFKit.PDFDocument, reportType: string, data: any) {
  switch (reportType) {
    case "compliance":
      renderComplianceReport(doc, data);
      break;
    case "investigations":
      renderInvestigationsReport(doc, data);
      break;
    case "entities":
      renderEntitiesReport(doc, data);
      break;
    case "violations":
      renderViolationsReport(doc, data);
      break;
    case "summary":
    default:
      renderSummaryReport(doc, data);
      break;
  }
}

// --- Individual Renderers ---

function renderComplianceReport(doc: PDFKit.PDFDocument, data: any) {
  doc.font('custom').fontSize(12).text("Compliance Summary:");
  doc.font('custom').fontSize(11).list([
    `Total Transfers: ${data.summary.total}`,
    `Pending: ${data.summary.pending}`,
    `Completed: ${data.summary.completed}`,
    `Failed: ${data.summary.failed}`,
    `Compliance Rate: ${data.summary.complianceRate}%`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Recent Transfers:");
  doc.moveDown(0.2);

  if (data.transfers.length === 0) {
    doc.font('custom').fontSize(10).text("No transfers found.");
    return;
  }

  data.transfers.slice(0, 10).forEach((t: any, idx: number) => {
    doc.font('custom').fontSize(10).text(`${idx + 1}. ${t.batch.drugName} (Batch: ${t.batch.batchId})`);
    doc.font('custom').fontSize(10).text(
      `From: ${t.fromOrg.companyName} (${t.fromOrg.organizationType})  →  To: ${t.toOrg.companyName} (${t.toOrg.organizationType})`
    );
    doc.font('custom').fontSize(10).text(
      `Date: ${formatDate(t.transferDate)} | Status: ${t.status}`
    );
    doc.moveDown(0.5);
  });
}

function renderInvestigationsReport(doc: PDFKit.PDFDocument, data: any) {
  doc.font('custom').fontSize(12).text("Investigation Summary:");
  doc.font('custom').fontSize(11).list([
    `Total: ${data.summary.total}`,
    `Pending: ${data.summary.pending}`,
    `Investigating: ${data.summary.investigating}`,
    `Resolved: ${data.summary.resolved}`,
    `Dismissed: ${data.summary.dismissed}`,
    `Severity: Critical(${data.summary.bySeverity.critical}), High(${data.summary.bySeverity.high}), Medium(${data.summary.bySeverity.medium}), Low(${data.summary.bySeverity.low})`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Recent Investigations:");
  doc.moveDown(0.2);

  if (data.investigations.length === 0) {
    doc.font('custom').fontSize(10).text("No investigations found.");
    return;
  }

  data.investigations.slice(0, 10).forEach((inv: any, idx: number) => {
    doc.font('custom').fontSize(10).text(`${idx + 1}. ${inv.batch.drugName} (Batch: ${inv.batch.batchId})`);
    doc.font('custom').fontSize(10).text(
      `Reported by: ${inv.consumers.map((c: any) => c.fullName).join(", ") || "N/A"}`
    );
    doc.font('custom').fontSize(10).text(
      `Status: ${inv.status} | Severity: ${inv.severity} | Date: ${formatDate(inv.createdAt)}`
    );
    doc.moveDown(0.5);
  });
}

function renderEntitiesReport(doc: PDFKit.PDFDocument, data: any) {
  doc.font('custom').fontSize(12).text("Entity Summary:");
  doc.font('custom').fontSize(11).list([
    `Total: ${data.summary.total}`,
    `Verified: ${data.summary.verified}`,
    `Active: ${data.summary.active}`,
    `Manufacturers: ${data.summary.byType.manufacturers}`,
    `Distributors: ${data.summary.byType.distributors}`,
    `Hospitals: ${data.summary.byType.hospitals}`,
    `Pharmacies: ${data.summary.byType.pharmacies}`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Recent Organizations:");
  doc.moveDown(0.2);

  if (data.organizations.length === 0) {
    doc.font('custom').fontSize(10).text("No organizations found.");
    return;
  }

  data.organizations.slice(0, 10).forEach((org: any, idx: number) => {
    doc.font('custom').fontSize(10).text(`${idx + 1}. ${org.companyName} (${org.organizationType})`);
    doc.font('custom').fontSize(10).text(
      `Verified: ${org.isVerified ? "Yes" : "No"} | Active: ${org.isActive ? "Yes" : "No"}`
    );
    doc.moveDown(0.5);
  });
}

function renderViolationsReport(doc: PDFKit.PDFDocument, data: any) {
  doc.font('custom').fontSize(12).text("Violation Summary:");
  doc.font('custom').fontSize(11).list([
    `Total: ${data.summary.total}`,
    `Critical: ${data.summary.critical}`,
    `High: ${data.summary.high}`,
    `Resolved: ${data.summary.resolved}`,
    `By Type: ${Object.entries(data.summary.byType).map(([type, count]) => `${type}: ${count}`).join(", ")}`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Recent Violations:");
  doc.moveDown(0.2);

  if (data.violations.length === 0) {
    doc.font('custom').fontSize(10).text("No violations found.");
    return;
  }

  data.violations.slice(0, 10).forEach((v: any, idx: number) => {
    doc.font('custom').fontSize(10).text(`${idx + 1}. ${v.batch.drugName} (Batch: ${v.batch.batchId})`);
    doc.font('custom').fontSize(10).text(
      `Severity: ${v.severity} | Status: ${v.status} | Date: ${formatDate(v.createdAt)}`
    );
    doc.font('custom').fontSize(10).text(
      `Reported by: ${v.consumers.map((c: any) => c.fullName).join(", ") || "N/A"}`
    );
    doc.moveDown(0.5);
  });
}

function renderSummaryReport(doc: PDFKit.PDFDocument, data: any) {
  doc.font('custom').fontSize(12).text("Overview:");
  doc.font('custom').fontSize(11).list([
    `Total Organizations: ${data.overview.totalOrganizations}`,
    `Verified Organizations: ${data.overview.verifiedOrganizations}`,
    `Verification Rate: ${data.overview.verificationRate}%`,
    `Total Batches: ${data.overview.totalBatches}`,
    `Active Batches: ${data.overview.activeBatches}`,
    `Monthly Scans: ${data.overview.monthlyScans}`,
    `Yearly Scans: ${data.overview.yearlyScans}`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Compliance:");
  doc.font('custom').fontSize(11).list([
    `Pending Transfers: ${data.compliance.pendingTransfers}`,
    `Completed Transfers: ${data.compliance.completedTransfers}`,
    `Compliance Rate: ${data.compliance.complianceRate}%`
  ]);
  doc.moveDown();

  doc.font('custom').fontSize(12).text("Investigations:");
  doc.font('custom').fontSize(11).list([
    `Active Investigations: ${data.investigations.activeInvestigations}`,
    `Resolved Investigations: ${data.investigations.resolvedInvestigations}`,
    `Resolution Rate: ${data.investigations.resolutionRate}%`
  ]);
  doc.moveDown();
}

// Helper to format date
function formatDate(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// --- Existing report data generators below (unchanged) ---
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