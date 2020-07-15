// TODO: better import syntax?
import { BaseAPIRequestFactory, RequiredError } from './baseapi';
import {Configuration} from '../configuration';
import { RequestContext, HttpMethod, ResponseContext, HttpFile} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {isCodeInRange} from '../util';

import { InlineObject } from '../models/InlineObject';
import { InlineResponse401 } from '../models/InlineResponse401';
import { InlineResponse4011 } from '../models/InlineResponse4011';
import { InlineResponse404 } from '../models/InlineResponse404';
import { InlineResponse422 } from '../models/InlineResponse422';
import { UserResponse } from '../models/UserResponse';

/**
 * no description
 */
export class UsersProfileApiRequestFactory extends BaseAPIRequestFactory {
	
    /**
     * Register a user profile in the database.
     * @param inlineObject 
     */
    public async createUser(inlineObject?: InlineObject, options?: Configuration): Promise<RequestContext> {
		let config = options || this.configuration;
		
		
		// Path Params
    	const localVarPath = '/users';

		// Make Request Context
    	const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
	
		// Header Params
	
		// Form Params


		// Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(inlineObject, "InlineObject", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["api_key"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve a user based on the provided bearer token
     */
    public async getUser(options?: Configuration): Promise<RequestContext> {
		let config = options || this.configuration;
		
		// Path Params
    	const localVarPath = '/users/me';

		// Make Request Context
    	const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
	
		// Header Params
	
		// Form Params


		// Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["bearer"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Retrieve a user based on the provided sub
     * @param sub the sub identifier of the requested User
     */
    public async getUserBySub(sub: string, options?: Configuration): Promise<RequestContext> {
		let config = options || this.configuration;
		
        // verify required parameter 'sub' is not null or undefined
        if (sub === null || sub === undefined) {
            throw new RequiredError('Required parameter sub was null or undefined when calling getUserBySub.');
        }

		
		// Path Params
    	const localVarPath = '/users/{sub}'
            .replace('{' + 'sub' + '}', encodeURIComponent(String(sub)));

		// Make Request Context
    	const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
	
		// Header Params
	
		// Form Params


		// Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["api_key"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update a user based on the provided sub
     * @param sub The sub identifier of the requested User
     */
    public async patchUser(sub: string, options?: Configuration): Promise<RequestContext> {
		let config = options || this.configuration;
		
        // verify required parameter 'sub' is not null or undefined
        if (sub === null || sub === undefined) {
            throw new RequiredError('Required parameter sub was null or undefined when calling patchUser.');
        }

		
		// Path Params
    	const localVarPath = '/users/{sub}'
            .replace('{' + 'sub' + '}', encodeURIComponent(String(sub)));

		// Make Request Context
    	const requestContext = config.baseServer.makeRequestContext(localVarPath, HttpMethod.PATCH);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
	
		// Header Params
	
		// Form Params


		// Body Params

        let authMethod = null;
        // Apply auth methods
        authMethod = config.authMethods["api_key"]
        if (authMethod) {
            await authMethod.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}



export class UsersProfileApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createUser(response: ResponseContext): Promise<UserResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: InlineResponse401 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse401", ""
            ) as InlineResponse401;
            throw new ApiException<InlineResponse401>(401, body);
        }
        if (isCodeInRange("422", response.httpStatusCode)) {
            const body: InlineResponse422 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse422", ""
            ) as InlineResponse422;
            throw new ApiException<InlineResponse422>(422, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }

        let body = response.body || "";
    	throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }
			
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getUser(response: ResponseContext): Promise<UserResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: InlineResponse4011 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse4011", ""
            ) as InlineResponse4011;
            throw new ApiException<InlineResponse4011>(401, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: InlineResponse404 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse404", ""
            ) as InlineResponse404;
            throw new ApiException<InlineResponse404>(404, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }

        let body = response.body || "";
    	throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }
			
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getUserBySub
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getUserBySub(response: ResponseContext): Promise<UserResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: InlineResponse401 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse401", ""
            ) as InlineResponse401;
            throw new ApiException<InlineResponse401>(401, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: InlineResponse404 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse404", ""
            ) as InlineResponse404;
            throw new ApiException<InlineResponse404>(404, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }

        let body = response.body || "";
    	throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }
			
    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to patchUser
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async patchUser(response: ResponseContext): Promise<UserResponse > {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            const body: InlineResponse401 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse401", ""
            ) as InlineResponse401;
            throw new ApiException<InlineResponse401>(401, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: InlineResponse404 = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "InlineResponse404", ""
            ) as InlineResponse404;
            throw new ApiException<InlineResponse404>(404, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: UserResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "UserResponse", ""
            ) as UserResponse;
            return body;
        }

        let body = response.body || "";
    	throw new ApiException<string>(response.httpStatusCode, "Unknown API Status Code!\nBody: \"" + body + "\"");
    }
			
}
