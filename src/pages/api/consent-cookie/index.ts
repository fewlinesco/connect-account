import { Endpoint, HttpStatus, setServerSideCookies } from "@fwl/web";
import { wrapMiddlewares, Middleware } from "@fwl/web/dist/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

import { Handler } from "@src/@types/handler";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
import { ERRORS_DATA, webErrorFactory } from "@src/errors/web-errors";
import { noAuthBasicMiddlewares } from "@src/middlewares/basic-middlewares";

const getHandler: Handler = (request, response): Promise<void> => {
  return getTracer().span("get-consent-cookie handler", async (_span) => {
    const consentCookie = request.cookies["user-consent"];
    const consentCookieResponse = {
      isSet: consentCookie ? true : false,
      content: consentCookie ? consentCookie : null,
    };
    response.statusCode = HttpStatus.OK;
    response.setHeader("Content-Type", "application/json");
    return response.end(JSON.stringify(consentCookieResponse));
  });
};

const patchHandler: Handler = (request, response): Promise<void> => {
  const webErrors = {
    badRequest: ERRORS_DATA.BAD_REQUEST,
  };

  return getTracer().span("set-consent-cookie handler", async (span) => {
    if (!request.body) {
      throw webErrorFactory(webErrors.badRequest);
    }

    setServerSideCookies(response, "user-consent", request.body, {
      shouldCookieBeSealed: false,
      maxAge: 2147483647,
      path: "/",
    });

    span.setDisclosedAttribute("consent cookie set", true);
    response.statusCode = HttpStatus.OK;
    response.setHeader("Content-Type", "application/json");
    return response.end();
  });
};

const middlewares: Middleware<NextApiRequest, NextApiResponse>[] =
  noAuthBasicMiddlewares(getTracer(), logger);

export default new Endpoint<NextApiRequest, NextApiResponse>()
  .get(wrapMiddlewares(middlewares, getHandler, "GET /api/consent-cookie/"))
  .patch(
    wrapMiddlewares(middlewares, patchHandler, "PATCH /api/consent-cookie/"),
  )
  .getHandler();
