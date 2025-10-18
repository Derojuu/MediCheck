import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128-bit IV

const SECRET = process.env.AGENT_ENCRYPTION_SECRET;
if (!SECRET) {
  throw new Error("Missing AGENT_ENCRYPTION_SECRET in environment");
}

const keyBuffer = Buffer.from(SECRET, "base64");
if (keyBuffer.length !== 32) {
  throw new Error("AGENT_ENCRYPTION_SECRET must decode to 32 bytes");
}

export function encryptKey(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);

  // ✅ Use Buffer (Node treats Buffer as Uint8Array at runtime)
  // Cast it once to satisfy TypeScript
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    keyBuffer as unknown as crypto.CipherKey,
    iv as unknown as crypto.BinaryLike
  );

  // Encrypt the data
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(plainText, "utf8")),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Return iv:authTag:encrypted — all base64
  return `${iv.toString("base64")}:${authTag.toString(
    "base64"
  )}:${encrypted.toString("base64")}`;
}

export function decryptKey(encryptedText: string): string {
  const [ivB64, authTagB64, encryptedB64] = encryptedText.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    keyBuffer as unknown as crypto.CipherKey,
    iv as unknown as crypto.BinaryLike
  );
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
