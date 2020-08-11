import { HttpVerbs } from "../@types/HttpVerbs";

export type Method = Exclude<HttpVerbs, HttpVerbs.GET>;
