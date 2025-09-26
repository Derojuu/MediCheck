import crypto from "crypto";


export interface QRPayload {
  s: string; // serialNumber
  b: string; // batchId
  r: number; // registrySequence
  url: string; // URL to verification page
  sig?: string;
}


export function generateQRPayload(
  serialNumber: string,
  batchId: string,
  registrySequence: number,
  secret: string,
  baseUrl: string
) {
  // 1️⃣ Create a signed hash

  const data = `${serialNumber}|${batchId}|${registrySequence}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  // 2️⃣ Create a URL with query params
  const url = `${baseUrl}/verify/batchUnit/${serialNumber}?sig=${signature}`;

  return {
    url,
    serialNumber,
    batchId,
    registrySequence,
    signature,
  };
}


// batch QR payload generation
export function generateBatchQRPayload(
  batchId: string,
  secret: string,
  baseUrl: string,
  registryTopicId: string,
) {

  const data = `BATCH|${batchId}|${registryTopicId}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  const url = `${baseUrl}/verify/batch/${batchId}?sig=${signature}`;

  return {
    url,
    batchId,
    signature,
  };
}

