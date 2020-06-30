import { Tracer } from "@fewlines/fwl-tracing";
import {
  HandlerPromise,
  HttpStatus,
  RejectFunction,
  ResolveFunction,
  UnmanagedError,
} from "@fewlines/fwl-web";
import { GraphQLRequest } from "apollo-link";
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

const REMOVE_IDENTITY_FROM_USER = gql`
  mutation removeIdentityFromUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    removeIdentityFromUser(
      input: { userId: $userId, type: $type, value: $value }
    ) {
      id
      identities {
        id
        primary
        value
        type
        status
      }
    }
  }
`;

export function identityHandler() {
  return (
    tracer: Tracer,
    resolve: ResolveFunction,
    reject: RejectFunction,
    _params: QueryParams,
    body: QueryParams,
    request: Request,
  ): HandlerPromise => {
    return tracer.span("identity-handler", async (span) => {
      const { userId, type, value } = body;

      span.setAttributes({
        "user-id": userId,
        "identity-value": value,
        "identity-type": type,
        method: request.method,
      });

      let operation: GraphQLRequest;

      if (request.method === "POST") {
        operation = {
          query: ADD_IDENTITY_TO_USER,
          variables: { userId, type, value },
        };
      } else if (request.method === "DELETE") {
        operation = {
          query: REMOVE_IDENTITY_FROM_USER,
          variables: { userId, type, value },
        };
      } else {
        return reject(UnmanagedError());
      }

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
