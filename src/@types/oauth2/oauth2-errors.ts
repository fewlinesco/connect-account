import {
  MissingJWKSURI,
  InvalidKeyIDRS256,
  MissingKeyIDHS256,
  AlgoNotSupported,
  InvalidAudience,
  ScopesNotSupported,
} from "@fewlines/connect-client";

export type OAuth2Errors =
  | MissingJWKSURI
  | InvalidKeyIDRS256
  | MissingKeyIDHS256
  | AlgoNotSupported
  | InvalidAudience
  | ScopesNotSupported;
