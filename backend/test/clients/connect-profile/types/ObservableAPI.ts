import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import * as models from '../models/all';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';

import { InlineObject } from '../models/InlineObject';
import { InlineResponse401 } from '../models/InlineResponse401';
import { InlineResponse4011 } from '../models/InlineResponse4011';
import { InlineResponse404 } from '../models/InlineResponse404';
import { InlineResponse422 } from '../models/InlineResponse422';
import { UserResponse } from '../models/UserResponse';
import { UsersAddress } from '../models/UsersAddress';

import { UsersProfileApiRequestFactory, UsersProfileApiResponseProcessor} from "../apis/UsersProfileApi";
export class ObservableUsersProfileApi {
    private requestFactory: UsersProfileApiRequestFactory;
    private responseProcessor: UsersProfileApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersProfileApiRequestFactory,
        responseProcessor?: UsersProfileApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UsersProfileApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UsersProfileApiResponseProcessor();
    }

    /**
     * Register a user profile in the database.
     * @param inlineObject 
     */
    public createUser(inlineObject?: InlineObject, options?: Configuration): Observable<UserResponse> {
    	const requestContextPromise = this.requestFactory.createUser(inlineObject, options);

		// build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    	for (let middleware of this.configuration.middleware) {
    		middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
    	}

    	return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
	    	pipe(mergeMap((response: ResponseContext) => {
	    		let middlewarePostObservable = of(response);
	    		for (let middleware of this.configuration.middleware) {
	    			middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
	    		}
	    		return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createUser(rsp)));
	    	}));
    }
	
    /**
     * Retrieve a user based on the provided bearer token
     */
    public getUser(options?: Configuration): Observable<UserResponse> {
    	const requestContextPromise = this.requestFactory.getUser(options);

		// build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    	for (let middleware of this.configuration.middleware) {
    		middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
    	}

    	return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
	    	pipe(mergeMap((response: ResponseContext) => {
	    		let middlewarePostObservable = of(response);
	    		for (let middleware of this.configuration.middleware) {
	    			middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
	    		}
	    		return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUser(rsp)));
	    	}));
    }
	
    /**
     * Retrieve a user based on the provided sub
     * @param sub the sub identifier of the requested User
     */
    public getUserBySub(sub: string, options?: Configuration): Observable<UserResponse> {
    	const requestContextPromise = this.requestFactory.getUserBySub(sub, options);

		// build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    	for (let middleware of this.configuration.middleware) {
    		middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
    	}

    	return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
	    	pipe(mergeMap((response: ResponseContext) => {
	    		let middlewarePostObservable = of(response);
	    		for (let middleware of this.configuration.middleware) {
	    			middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
	    		}
	    		return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUserBySub(rsp)));
	    	}));
    }
	
    /**
     * Update a user based on the provided sub
     * @param sub The sub identifier of the requested User
     */
    public patchUser(sub: string, options?: Configuration): Observable<UserResponse> {
    	const requestContextPromise = this.requestFactory.patchUser(sub, options);

		// build promise chain
    let middlewarePreObservable = from<RequestContext>(requestContextPromise);
    	for (let middleware of this.configuration.middleware) {
    		middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
    	}

    	return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
	    	pipe(mergeMap((response: ResponseContext) => {
	    		let middlewarePostObservable = of(response);
	    		for (let middleware of this.configuration.middleware) {
	    			middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
	    		}
	    		return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.patchUser(rsp)));
	    	}));
    }
	

}



