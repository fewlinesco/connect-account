/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";

export type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<any>;
