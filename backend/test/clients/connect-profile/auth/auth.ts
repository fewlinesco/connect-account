// typings for btoa are incorrect
import { RequestContext } from "../http/http";

/**
 * Interface authentication schemes.
 */
export interface SecurityAuthentication {
    /*
     * @return returns the name of the security authentication as specified in OAI
     */
    getName(): string;

    /**
     * Applies the authentication scheme to the request context
     *
     * @params context the request context which should use this authentication scheme
     */
    applySecurityAuthentication(context: RequestContext): void | Promise<void>;
}

export interface TokenProvider {
  getToken(): Promise<string> | string;
}

/**
 * Applies apiKey authentication to the request context.
 */
export class ApiKeyAuthentication implements SecurityAuthentication {
    /**
     * Configures this api key authentication with the necessary properties
     *
     * @param apiKey: The api key to be used for every request
     */
    public constructor(private apiKey: string) {}

    public getName(): string {
        return "api_key";
    }

    public applySecurityAuthentication(context: RequestContext) {
        context.setHeaderParam("Authorization", this.apiKey);
    }
}

/**
 * Applies http authentication to the request context.
 */
export class BearerAuthentication implements SecurityAuthentication {
    /**
     * Configures the http authentication with the required details.
     *
     * @param tokenProvider service that can provide the up-to-date token when needed
     */
    public constructor(private tokenProvider: TokenProvider) {}

    public getName(): string {
        return "bearer";
    }

    public async applySecurityAuthentication(context: RequestContext) {
        context.setHeaderParam("Authorization", "Bearer " + await this.tokenProvider.getToken());
    }
}


export type AuthMethods = {
    "api_key"?: SecurityAuthentication,
    "bearer"?: SecurityAuthentication
}

export type ApiKeyConfiguration = string;
export type HttpBasicConfiguration = { "username": string, "password": string };
export type HttpBearerConfiguration = { tokenProvider: TokenProvider };
export type OAuth2Configuration = string;

export type AuthMethodsConfiguration = {
    "api_key"?: ApiKeyConfiguration,
    "bearer"?: HttpBearerConfiguration
}

/**
 * Creates the authentication methods from a swagger description.
 *
 */
export function configureAuthMethods(config: AuthMethodsConfiguration | undefined): AuthMethods {
    let authMethods: AuthMethods = {}

    if (!config) {
        return authMethods;
    }

    if (config["api_key"]) {
        authMethods["api_key"] = new ApiKeyAuthentication(
            config["api_key"]
        );
    }

    if (config["bearer"]) {
        authMethods["bearer"] = new BearerAuthentication(
            config["bearer"]["tokenProvider"]
        );
    }

    return authMethods;
}