import crypto from "crypto";

export function verifySignature(
  data: string,
  signature: string,
  secret: string
) {
  const recomputed = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  // Convert hex strings to Uint8Array for TS compliance
  const sigBuf = Uint8Array.from(Buffer.from(signature, "hex"));
  const recomputedBuf = Uint8Array.from(Buffer.from(recomputed, "hex"));

  // Check lengths before safe compare
  if (sigBuf.length !== recomputedBuf.length) return false;

  // Safe compare
  return crypto.timingSafeEqual(sigBuf, recomputedBuf);
}
