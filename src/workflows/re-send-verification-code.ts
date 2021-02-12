import {
  sendIdentityValidationCode,
  SendIdentityValidationCodeResult,
} from "@fewlines/connect-management";

async function reSendValidationCode(): Promise<SendIdentityValidationCodeResult> {
  return await sendIdentityValidationCode();
}

export { reSendValidationCode };
