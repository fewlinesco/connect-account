import crypto from "crypto";

function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

export { generateNonce };
