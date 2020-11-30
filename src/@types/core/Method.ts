import { HttpVerbs } from "./HttpVerbs";

export type Method = Exclude<HttpVerbs, HttpVerbs.GET>;
