import { prisma } from "./prisma";

interface HederaEvent {
  eventType: "BATCH_CREATED" | "BATCH_OWNERSHIP" | "BATCH_FLAG";
  timestamp: string;
  batchId: string;
  organizationId: string;
  drugName?: string;
  batchSize?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  transferFrom?: string;
  transferTo?: string;
  qrSignature?: string;
  // add any extra fields
}

// Check 1: Batch Flagged
export function checkFlagged(events: HederaEvent[]) {
  const flagged = events.some((e) => e.eventType === "BATCH_FLAG");
  return flagged
    ? { passed: false, reasonIfFail: "Batch flagged by regulator/system." }
    : { passed: true, reasonIfFail: "" };
}

// Check 2: Expiry Date
export function checkExpired(events: HederaEvent[]) {
  const created = events.find((e) => e.eventType === "BATCH_CREATED");
  if (created?.expiryDate && new Date(created.expiryDate) < new Date()) {
    return {
      passed: false,
      reasonIfFail: `Batch expired on ${created.expiryDate}.`,
    };
  }
  return { passed: true, reasonIfFail: "" };
}

// Check 3: Ownership Transfer Complete
export function checkOwnership(events: HederaEvent[]) {
  const ownershipTransfers = events.filter(
    (e) => e.eventType === "BATCH_OWNERSHIP"
  );
  const incomplete = ownershipTransfers.some(
    (t) => !t.transferFrom || !t.transferTo
  );
  return incomplete
    ? { passed: false, reasonIfFail: "Ownership transfer mismatch detected." }
    : { passed: true, reasonIfFail: "" };
}

// Check 4: Duplicate Scan (you’ll implement based on your DB)
export async function checkDuplicateScan(unitId: string) {
  // Example: fetch last scan record from your DB
//   const lastScan = await prisma.scanHistory.findFirst({ where: { unitId } });
//   if (lastScan) {
//     return {
//       passed: false,
//       reasonIfFail: `Unit scanned previously at ${lastScan.location} on ${lastScan.timestamp}.`,
//     };
//   }
  return { passed: true, reasonIfFail: "" };
}



export async function runAllChecks(events: HederaEvent[], unitId?: string) {
  const checks = [
    checkFlagged(events),
    checkExpired(events),
    checkOwnership(events),
  ];

  // duplicate scan check is async
  if (unitId) {
    checks.push(await checkDuplicateScan(unitId));
  }

  const failedChecks = checks.filter((c) => !c.passed);

  const status = failedChecks.length ? "NOT_SAFE" : "AUTHENTIC";
  const reasons = failedChecks.length
    ? failedChecks.map((c) => c.reasonIfFail)
    : ["All checks passed."];

  let recommendedAction = "";
  if (status === "NOT_SAFE") {
    recommendedAction =
      "Do not use this medicine. Contact your pharmacist or regulator immediately.";
  } else {
    recommendedAction =
      "This medicine is authentic and safe to use as prescribed.";
  }

  return {
    status,
    reasons,
    recommendedAction,
  };
}
