import { NextApiResponse } from "next";

import { ExtendedRequest } from "./ExtendedRequest";

export type Handler = (
  request: ExtendedRequest,
  response: NextApiResponse,
) => Promise<void> | void;
