import { JWTPayload } from "@fewlines/connect-client";

import { configVariables } from "@src/configs/config-variables";
import { oauth2Client } from "@src/configs/oauth2-client";
import {
  EnvVar_IsJweSigned_MustBeABoolean,
  UnhandledTokenType,
} from "@src/errors/errors";

async function decryptVerifyAccessToken(
  accessToken: string,
): Promise<JWTPayload> {
  const tokenPartsCount = accessToken.split(".").length;

  if (tokenPartsCount === 3) {
    return oauth2Client.verifyJWT<JWTPayload>(
      accessToken,
      configVariables.connectJwtAlgorithm,
    );
  } else if (tokenPartsCount === 5) {
    const isAccessTokenSigned = JSON.parse(configVariables.isJweSigned);

    if (typeof isAccessTokenSigned !== "boolean") {
      throw new EnvVar_IsJweSigned_MustBeABoolean();
    }

    const decodedToken = await oauth2Client.decryptJWE<JWTPayload | string>(
      accessToken,
      configVariables.accountJwePrivateKey,
      isAccessTokenSigned,
    );
    console.log(decodedToken);

    if (isAccessTokenSigned && typeof decodedToken === "string") {
      return oauth2Client.verifyJWT<JWTPayload>(
        decodedToken,
        configVariables.connectJwtAlgorithm,
      );
    } else {
      return decodedToken as JWTPayload;
    }
  }

  throw new UnhandledTokenType();
}

export { decryptVerifyAccessToken };
