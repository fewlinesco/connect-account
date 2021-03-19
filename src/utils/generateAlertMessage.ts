import { AlertMessage } from "@fwl/web";
import { v4 as uuidv4 } from "uuid";

function generateAlertMessage(text: string): AlertMessage {
  return {
    id: uuidv4(),
    text,
    expiresAt: Date.now() + 300000,
  };
}

export { generateAlertMessage };
