import { Tracer } from "@fewlines/fwl-tracing";
import {
  HandlerPromise,
  HttpStatus,
  RejectFunction,
  ResolveFunction,
} from "@fewlines/fwl-web";
import { Request } from "express";

export interface QueryParams {
  userId: string;
}

export function userHandler() {
  return (
    tracer: Tracer,
    resolve: ResolveFunction,
    reject: RejectFunction,
    params: { userId: string },
    request: Request,
  ): HandlerPromise => {
    return tracer.span("user-handler", async () => {
      return tracer.span("get-user-by-id", async (span) => {
      span.setAttribute("user-id", params.userId);

      return resolve(HttpStatus.OK, "");
    });
  });
}


// try {
//   const {
//     rows,
//   } = await database.query("SELECT * FROM users WHERE id = $1", [
//     params.id,
//   ]);

//   if (rows.length === 0) {
//     return reject(UserNotFound());
//   }

//   const user = rows[0];

//   return resolve(HttpStatus.OK, user);
// } catch (error) {
//   span.setAttribute("pg-error", error.message);

//   if (error.code === "22P02") {
//     return reject(BadUuid());
//   }

//   return reject(UnmanagedError());
// }