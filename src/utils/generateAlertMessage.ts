import { AlertMessage } from "@fwl/web";
import { v4 as uuidv4 } from "uuid";

function generateAlertMessage(text: string, expiresAt?: number): AlertMessage {
  return {
    id: uuidv4(),
    text,
    expiresAt: expiresAt ? expiresAt : Date.now() + 300000,
  };
}

export { generateAlertMessage };
