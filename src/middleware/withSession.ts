// `withSession` is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions.
import { withIronSession, Handler } from "next-iron-session";

import { config } from "../config";

export default function withSession<T>(
  handler: Handler,
): (...args: unknown[]) => Promise<T> {
  return withIronSession(handler, {
    password: config.connectAccountSessionSalt,
    cookieName: "connect-account-session",
    cookieOptions: {
      // Allows the use of session in non-https environments like.
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    ttl: 3600,
  });
}
