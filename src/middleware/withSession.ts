// `withSession` is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions.
import { withIronSession, Handler } from "next-iron-session";

export default function withSession(
  handler: Handler,
): (...args: any[]) => Promise<any> {
  return withIronSession(handler, {
    password: "",
    cookieName: "oauth-jwt",
    cookieOptions: {
      // Allows the use of session in non-https environments like.
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    ttl: 3600,
  });
}
