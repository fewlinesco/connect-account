import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import * as models from '../models/all';
import { Configuration} from '../configuration'

import { InlineObject } from '../models/InlineObject';
import { InlineResponse401 } from '../models/InlineResponse401';
import { InlineResponse4011 } from '../models/InlineResponse4011';
import { InlineResponse404 } from '../models/InlineResponse404';
import { InlineResponse422 } from '../models/InlineResponse422';
import { UserResponse } from '../models/UserResponse';
import { UsersAddress } from '../models/UsersAddress';

import { ObservableUsersProfileApi } from "./ObservableAPI";
import { UsersProfileApiRequestFactory, UsersProfileApiResponseProcessor} from "../apis/UsersProfileApi";

export interface UsersProfileApiCreateUserRequest {
    /**
     * 
     * @type InlineObject
     * @memberof UsersProfileApicreateUser
     */
    inlineObject?: InlineObject
}

export interface UsersProfileApiGetUserRequest {
}

export interface UsersProfileApiGetUserBySubRequest {
    /**
     * the sub identifier of the requested User
     * @type string
     * @memberof UsersProfileApigetUserBySub
     */
    sub: string
}

export interface UsersProfileApiPatchUserRequest {
    /**
     * The sub identifier of the requested User
     * @type string
     * @memberof UsersProfileApipatchUser
     */
    sub: string
}


export class ObjectUsersProfileApi {
    private api: ObservableUsersProfileApi

    public constructor(configuration: Configuration, requestFactory?: UsersProfileApiRequestFactory, responseProcessor?: UsersProfileApiResponseProcessor) {
        this.api = new ObservableUsersProfileApi(configuration, requestFactory, responseProcessor);
	}

    /**
     * Register a user profile in the database.
     * @param param the request object
     */
    public createUser(param: UsersProfileApiCreateUserRequest, options?: Configuration): Promise<UserResponse> {
        return this.api.createUser(param.inlineObject,  options).toPromise();
    }
	
    /**
     * Retrieve a user based on the provided bearer token
     * @param param the request object
     */
    public getUser(param: UsersProfileApiGetUserRequest, options?: Configuration): Promise<UserResponse> {
        return this.api.getUser( options).toPromise();
    }
	
    /**
     * Retrieve a user based on the provided sub
     * @param param the request object
     */
    public getUserBySub(param: UsersProfileApiGetUserBySubRequest, options?: Configuration): Promise<UserResponse> {
        return this.api.getUserBySub(param.sub,  options).toPromise();
    }
	
    /**
     * Update a user based on the provided sub
     * @param param the request object
     */
    public patchUser(param: UsersProfileApiPatchUserRequest, options?: Configuration): Promise<UserResponse> {
        return this.api.patchUser(param.sub,  options).toPromise();
    }
	

}



