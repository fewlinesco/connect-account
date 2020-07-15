/**
 * Connect Profile
 * The application stores user profile information, it is meant to be compliant to OpenID Connect specification
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

/**
* An object representing the User's address
*/
export class UsersAddress {
    /**
    * the formatted User's address
    */
    'formatted'?: string;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "formatted",
            "baseName": "formatted",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return UsersAddress.attributeTypeMap;
    }
    
    public constructor() {
    }
}

