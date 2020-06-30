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
import { IdentityTypes } from "src/@types/Identities";

import { fetchManagement } from "./fetchManagement";

export interface QueryParams {
  userId: string;
  type: IdentityTypes;
  value: string;
}

const ADD_IDENTITY_TO_USER = gql`
  mutation addIdentityToUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    addIdentityToUser(input: { userId: $userId, type: $type, value: $value }) {
      id
      primary
      status
      type
      value
      __typename
    }
  }
`;

export function handler() {
  return (
    tracer: Tracer,
    resolve: ResolveFunction,
    reject: RejectFunction,
    _params: QueryParams,
    body: QueryParams,
    _request: Request,
  ): HandlerPromise => {
    return tracer.span("add-identity-handler", async (span) => {
      const { userId, type, value } = body;

      span.setAttributes({
        "user-id": userId,
        "identity-value": value,
        "identity-type": type,
      });

      const operation = {
        query: ADD_IDENTITY_TO_USER,
        variables: { userId, type, value },
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
