import crypto from "crypto";

interface QRPayload {
  s: string; // serialNumber
  b: string; // batchId
  r: number; // registrySequence
  sig?: string; // optional signature
}

/**
 * Generate a QR payload for a unit.
 */
export function generateQRPayload(
  serialNumber: string,
  batchId: string,
  registrySequence: number,
  secret?: string
): QRPayload {
  const payload: QRPayload = { s: serialNumber, b: batchId, r: registrySequence };

  if (secret) {
    const data = `${serialNumber}|${batchId}|${registrySequence}`;
    payload.sig = crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  return payload;
}

/**
 * Verify a QR payload signature.
 */
export function verifyQRPayload(payload: QRPayload, secret: string): boolean {
  if (!payload.sig) return false;
  const data = `${payload.s}|${payload.b}|${payload.r}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return expectedSig === payload.sig;
}
