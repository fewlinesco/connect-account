/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerResponse } from "http";

import { ExtendedRequest } from "./ExtendedRequest";

export type Handler = (
  request: ExtendedRequest,
  response: ServerResponse,
) => Promise<any>;
