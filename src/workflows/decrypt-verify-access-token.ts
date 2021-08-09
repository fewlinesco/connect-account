import { JWTPayload } from "@fewlines/connect-client";

import { CONFIG_VARIABLES } from "@src/configs/config-variables";
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
      CONFIG_VARIABLES.connectJwtAlgorithm,
    );
  } else if (tokenPartsCount === 5) {
    const isAccessTokenSigned = JSON.parse(CONFIG_VARIABLES.isJweSigned);

    if (typeof isAccessTokenSigned !== "boolean") {
      throw new EnvVar_IsJweSigned_MustBeABoolean();
    }

    const decodedToken = await oauth2Client.decryptJWE<JWTPayload | string>(
      accessToken,
      CONFIG_VARIABLES.accountJwePrivateKey,
      isAccessTokenSigned,
    );

    if (isAccessTokenSigned && typeof decodedToken === "string") {
      return oauth2Client.verifyJWT<JWTPayload>(
        decodedToken,
        CONFIG_VARIABLES.connectJwtAlgorithm,
      );
    } else {
      return decodedToken as JWTPayload;
    }
  }

  throw new UnhandledTokenType();
}

export { decryptVerifyAccessToken };
