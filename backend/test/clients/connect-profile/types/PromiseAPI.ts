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
import { ObservableUsersProfileApi } from './ObservableAPI';


import { UsersProfileApiRequestFactory, UsersProfileApiResponseProcessor} from "../apis/UsersProfileApi";
export class PromiseUsersProfileApi {
    private api: ObservableUsersProfileApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersProfileApiRequestFactory,
        responseProcessor?: UsersProfileApiResponseProcessor
    ) {
        this.api = new ObservableUsersProfileApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Register a user profile in the database.
     * @param inlineObject 
     */
    public createUser(inlineObject?: InlineObject, options?: Configuration): Promise<UserResponse> {
    	const result = this.api.createUser(inlineObject, options);
        return result.toPromise();
    }
	
    /**
     * Retrieve a user based on the provided bearer token
     */
    public getUser(options?: Configuration): Promise<UserResponse> {
    	const result = this.api.getUser(options);
        return result.toPromise();
    }
	
    /**
     * Retrieve a user based on the provided sub
     * @param sub the sub identifier of the requested User
     */
    public getUserBySub(sub: string, options?: Configuration): Promise<UserResponse> {
    	const result = this.api.getUserBySub(sub, options);
        return result.toPromise();
    }
	
    /**
     * Update a user based on the provided sub
     * @param sub The sub identifier of the requested User
     */
    public patchUser(sub: string, options?: Configuration): Promise<UserResponse> {
    	const result = this.api.patchUser(sub, options);
        return result.toPromise();
    }
	

}



