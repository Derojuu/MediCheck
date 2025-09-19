import { prisma } from "./prisma";
import { autoFlagBatch } from "./autoFlagBatch";
interface HederaEvent {
  eventType: "BATCH_CREATED" | "BATCH_OWNERSHIP" | "BATCH_FLAG";
  timestamp: string;
  batchId: string;
  topicId: string;
  organizationId: string;
  drugName?: string;
  batchSize?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  transferFrom?: string;
  transferTo?: string;
  qrSignature?: string;
  flagReason?: string;
}


// Check 1: Batch Flagged
export function checkFlagged(events: HederaEvent[]) {
  // Collect all flag events
  const flaggedEvents = events.filter((e) => e.eventType === "BATCH_FLAG");

  if (flaggedEvents.length > 0) {
    // Map reasons with org
    const reasons = flaggedEvents.map((e) => {
      const org = e.organizationId || "Unknown Org";
      const reason = e.flagReason || "No reason provided";
      return `Flagged by ${org}: ${reason}`;
    });

    return {
      passed: false,
      reasonIfFail: reasons.join("; "), // combined string
      reasonsArray: reasons, // optional: raw array if needed
    };
  }

  // If no flags at all
  return {
    passed: true,
    reasonIfFail: "",
    reasonsArray: [],
  };
}

// Check 2: Check if this unit didgital footprint contains it's birth
export function checkBatchCreated(events: HederaEvent[]) {
  // Look for at least one BATCH_CREATED event
  const createdEvent = events.find((e) => e.eventType === "BATCH_CREATED");

  if (!createdEvent) {
    return {
      passed: false,
      reasonIfFail:
        "No BATCH_CREATED event found — this unit/batch may not originate from our system.",
    };
  }

  return {
    passed: true,
    reasonIfFail: "",
  };
}

// Check 3: Checks if one transfer ownership event has occured before it gets to the consumer
export function checkAtLeastOneTransfer(events: HederaEvent[]) {
  console.log("EVENTS", events)
  // Look for ownership transfers
  const transferEvents = events.filter(
    (e) => e.eventType === "BATCH_OWNERSHIP"
  );

  console.log("TRANSFER EVENTS", transferEvents)

  if (transferEvents.length === 0) {
    return {
      passed: false,
      reasonIfFail:
        "No ownership transfer found — this unit has not yet entered the supply chain from the manufacturer.",
    };
  }

  return {
    passed: true,
    reasonIfFail: "",
  };
}

// Check 4: Expiry Date
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

// Check 5: Ownership Transfer Complete
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

// Check 6: Duplicate Scan (you’ll implement based on your DB)
export async function checkDuplicateScan(
  unitId: string,
  batchId: string,
  organizationId: string,
  topicId: string
) {
  // Fetch the last scan record from your DB
  const lastScan = await prisma.scanHistory.findFirst({
    where: { unitId },
  });

  if (lastScan) {
    // Build reason for the failure
    const reason = `Duplicate scan detected. Unit previously scanned at lat: ${lastScan.latitude}, long: ${lastScan.longitude} on ${lastScan.timestamp}.`;

    // Auto-flag the batch immediately with reason
    await autoFlagBatch(batchId, topicId ?? "", organizationId, reason);

    return {
      passed: false,
      reasonIfFail: reason,
      flagged: true,
    };
  }

  // No previous scan found
  return {
    passed: true,
    reasonIfFail: "",
    flagged: false,
  };
}

export async function runAllUnitAuthenticityChecks(
  events: HederaEvent[],
  unitId: string,
  batchId: string,
  organizationId: string,
  topicId: string
) {
  // --- Sync checks first ---
  const syncChecks = [
    checkFlagged(events),
    checkBatchCreated(events),
    checkAtLeastOneTransfer(events),
    checkExpired(events),
    checkOwnership(events),
  ];

  console.log(syncChecks);

  // --- Async checks ---
  let duplicateCheckResult = null;
  if (unitId && batchId && organizationId && topicId) {
    duplicateCheckResult = await checkDuplicateScan(
      unitId,
      batchId,
      organizationId,
      topicId
    );
  }

  // Combine all checks
  const allChecks = duplicateCheckResult
    ? [...syncChecks, duplicateCheckResult]
    : syncChecks;

  // Gather failed checks
  const failedChecks = allChecks.filter((c) => !c.passed);

  // Status logic
  const status: string = failedChecks.length ? "NOT_SAFE" : "AUTHENTIC";

  // Collect reasons
  const reasons = failedChecks.length
    ? failedChecks.map((c) => c.reasonIfFail)
    : ["All checks passed."];

  // Recommended action
  const recommendedAction =
    status === "NOT_SAFE"
      ? "Do not use this medicine. Contact your pharmacist or regulator immediately."
      : "This medicine is authentic and safe to use as prescribed.";

  const restul = {
    status,
    reasons,
    recommendedAction,
  };
  return restul;
}

