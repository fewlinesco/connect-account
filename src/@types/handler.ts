/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<any>;

export type { Handler };
