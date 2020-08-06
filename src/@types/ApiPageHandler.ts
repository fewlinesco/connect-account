import { NextApiRequest, NextApiResponse } from "next";

export type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<void>;
