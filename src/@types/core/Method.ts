import { HttpVerbs } from "./http-verbs";

export type Method = Exclude<HttpVerbs, HttpVerbs.GET>;
