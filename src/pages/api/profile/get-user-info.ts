import { getServerSideCookies, Endpoint, HttpStatus } from "@fwl/web";
import {
  loggingMiddleware,
  wrapMiddlewares,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { Address, Profile } from "@src/@types/profile";
import { UserCookie } from "@src/@types/user-cookie";
import { configVariables } from "@src/configs/config-variables";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const handler: Handler = async (request, response) => {
  return getTracer().span("get-user-info handler", async (span) => {
    const userCookie = await getServerSideCookies<UserCookie>(request, {
      cookieName: "user-cookie",
      isCookieSealed: true,
      cookieSalt: configVariables.cookieSalt,
    });

    if (!userCookie) {
      response.statusCode = HttpStatus.TEMPORARY_REDIRECT;
      response.setHeader("location", "/");
      response.end();
      return;
    }
    const mockedUserInfo: {
      profile: Profile;
      addresses: Address[];
    } = {
      profile: {
        sub: "edc29cc7-35d5-4409-850a-dab5e19beb58",
        name: "Luz",
        family_name: "Reinger",
        given_name: "Sim",
        middle_name: "Nikolas",
        nickname: "Kaleb",
        preferred_username: "Jovani",
        profile: "https://danielle.biz",
        picture: "http://placeimg.com/640/480",
        website: "https://eileen.biz",
        gender: "female",
        birthdate: "2020-10-19",
        zoneinfo: "FAKE/zone_info",
        locale: "ro",
        updated_at: "2021-04-15T07:30:49.924Z",
      },
      addresses: [
        {
          id: "0087969e-9a0e-4e24-b38c-45a7e89f2bc1",
          sub: "edc29cc7-35d5-4409-850a-dab5e19beb58",
          street_address: "905 Macejkovic Prairie",
          locality: "Kautzerbury",
          region: "Massachusetts",
          postal_code: "76369-4333",
          country: "Gambia",
          kind: "nemo",
          created_at: "2021-04-15T07:35:28.614Z",
          updated_at: "2021-04-15T07:35:28.614Z",
          street_address_2: "Suite 309",
          primary: false,
        },
        {
          id: "3bb53df5-3cfb-480b-8667-7e0f092c6ac1",
          sub: "edc29cc7-35d5-4409-850a-dab5e19beb58",
          street_address: "46974 Price Drives",
          locality: "Port Jasminshire",
          region: "Washington",
          postal_code: "35501-1717",
          country: "Western Sahara",
          kind: "labore",
          created_at: "2021-04-15T07:35:28.599Z",
          updated_at: "2021-04-15T07:35:28.599Z",
          street_address_2: "Apt. 098",
          primary: true,
        },
      ],
    };

    span.setDisclosedAttribute("is user info fetched", true);
    response.statusCode = HttpStatus.OK;
    response.json({ userInfo: mockedUserInfo });
  });
};

const wrappedHandler = wrapMiddlewares(
  [
    tracingMiddleware(getTracer()),
    rateLimitingMiddleware(getTracer(), logger, {
      windowMs: 300000,
      requestsUntilBlock: 200,
    }),
    recoveryMiddleware(getTracer()),
    sentryMiddleware(getTracer()),
    errorMiddleware(getTracer()),
    loggingMiddleware(getTracer(), logger),
    authMiddleware(getTracer()),
  ],
  handler,
  "/api/profile/get-user-info",
);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrappedHandler)
  .getHandler();
