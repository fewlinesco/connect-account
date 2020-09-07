import {
  MissingJWKSURI,
  InvalidKeyIDRS256,
  MissingKeyIDHS256,
  AlgoNotSupported,
  InvalidAudience,
  ScopesNotSupported,
} from "@fwl/oauth2";

export type OAuth2Errors =
  | MissingJWKSURI
  | InvalidKeyIDRS256
  | MissingKeyIDHS256
  | AlgoNotSupported
  | InvalidAudience
  | ScopesNotSupported;
