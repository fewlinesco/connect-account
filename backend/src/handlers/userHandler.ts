import { Tracer } from "@fewlines/fwl-tracing";
import {
  HandlerPromise,
  HttpStatus,
  RejectFunction,
  ResolveFunction,
  UnmanagedError,
} from "@fewlines/fwl-web";
import { Request } from "express";
import gql from "graphql-tag";

import { fetchManagement } from "./fetchManagement";

export interface QueryParams {
  userId: string;
}

const GET_USER_QUERY = gql`
  query getUserQuery($userId: String!) {
    provider {
      id
      name
      user(filters: { userId: $userId }) {
        id
        identities {
          type
          value
          primary
          status
        }
      }
    }
  }
`;

export function userHandler() {
  return (
    tracer: Tracer,
    resolve: ResolveFunction,
    reject: RejectFunction,
    _params: QueryParams,
    body: QueryParams,
    _request: Request,
  ): HandlerPromise => {
    return tracer.span("user-handler", async (span) => {
      span.setAttribute("user-id", body.userId);

      const operation = {
        query: GET_USER_QUERY,
        variables: { userId: body.userId },
      };

      try {
        const fetchedData = await fetchManagement(operation);

        return resolve(HttpStatus.OK, fetchedData);
      } catch (error) {
        console.log(error);
        return reject(UnmanagedError());
      }
    });
  };
}
