import { HttpStatus } from "@fewlines/fwl-web";
import { NextApiRequest } from "next";

interface HandlerResponse {
  status: HttpStatus;
  data?: unknown;
  headers?: Record<string, string>;
}

export type Handler = (request: NextApiRequest) => Promise<HandlerResponse>;
