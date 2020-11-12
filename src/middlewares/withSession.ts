// `withSession` is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions.
import { applySession, Handler } from "next-iron-session";

import { config } from "../config";

console.log("Session salt", config.connectAccountSessionSalt);

const options = {
  password: config.connectAccountSessionSalt,
  cookieName: "connect-account-session",
  cookieOptions: {
    // Allows the use of session in non-https environments like.
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
  ttl: 3600,
};

export function withSession(handler: Handler): Handler {
  return async (request, response) => {
    await applySession(request, response, options);
    return handler(request, response);
  };
}
