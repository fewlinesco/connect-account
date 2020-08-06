import { HttpVerbs } from "src/@types/HttpVerbs";

export type Method = Exclude<HttpVerbs, HttpVerbs.GET>;
