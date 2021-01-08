import type { AccessToken } from "@src/@types/oauth2/oauth2-tokens";
import { oauth2Client, config } from "@src/config";
import {
  EnvVar_IsJweSigned_MustBeABoolean,
  UnhandledTokenType,
} from "@src/errors";

export async function decryptVerifyAccessToken(
  accessToken: string,
): Promise<AccessToken> {
  const tokenPartsCount = accessToken.split(".").length;

  if (tokenPartsCount === 3) {
    return oauth2Client.verifyJWT<AccessToken>(
      accessToken,
      config.connectJwtAlgorithm,
    );
  } else if (tokenPartsCount === 5) {
    const isAccessTokenSigned = JSON.parse(config.isJweSigned);

    if (typeof isAccessTokenSigned !== "boolean") {
      throw new EnvVar_IsJweSigned_MustBeABoolean();
    }

    const decodedToken = await oauth2Client.decryptJWE<AccessToken | string>(
      accessToken,
      config.accountJwePrivateKey,
      isAccessTokenSigned,
    );

    if (isAccessTokenSigned && typeof decodedToken === "string") {
      return oauth2Client.verifyJWT<AccessToken>(
        decodedToken,
        config.connectJwtAlgorithm,
      );
    } else {
      return decodedToken as AccessToken;
    }
  }

  throw new UnhandledTokenType();
}
