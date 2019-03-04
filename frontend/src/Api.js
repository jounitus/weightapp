// @flow

import type { UsernamePassword } from './models/UsernamePassword'
import type { UserProperties } from './models/UserProperties'
import type { CreateUserResponse } from './models/CreateUserResponse'
import type { CreateSessionTokenResponse } from './models/CreateSessionTokenResponse'
import type { User } from './models/User'
import type { Entry } from './models/Entry'
import type {ErrorResponse} from "./models/ErrorResponse";

export function tryParseJson(value: string): {} | null {

    try {
        return JSON.parse(value);
    } catch (e) {
        //console.error(e);
    }

    return null;

}

export function makeRequest<T>(url: string, method: string, data: ({} | null), session_token?: ?string): Promise<T>
{

    let headers:any = {
        'Content-Type': 'application/json'
    };

    if(session_token) {
        headers['Authentication'] = session_token;
    }

    let parameters:any = {
        method: method,
        //body: JSON.stringify(data), // data can be `string` or {object}!
        headers: headers
    };

    if(data) {
        parameters['body'] = JSON.stringify(data);
    }

    const promise = new Promise(function(resolve, reject) {

        fetch("/api/" + url, parameters)
            .then(res => {

                //console.info("res", res);

                res.text().then(text => {

                    const json = tryParseJson(text);

                    console.info(text, json);

                    if(json && res.ok) {

                        const tValue:T = ((json: any) : T); // typecast {} to T

                        console.info(tValue);
                        resolve(tValue);

                    } else if(json && 'code' in json && 'description' in json && 'fields' in json) {

                        console.error(json);
                        reject(json);

                    } else {

                        // this either text or json, but not in a format we know

                        const errorResponse: ErrorResponse = {
                            code: 0,
                            description: text,
                            message: null,
                            fields: {}
                        };

                        console.error(errorResponse);
                        reject(errorResponse);

                    }

                }).catch(error => {
                    // we might rarely get here, since it just means the res.text() wouldn't finish
                    console.error("error A", error);
                    alert(error);
                })

            })
            .catch(error => {

                // we might get here with network connectivity issues etc

                console.error('Error B', error);

                const errorResponse: ErrorResponse = {
                    code: 0,
                    description: error.toString(),
                    message: null,
                    fields: {}
                };

                //callback(resp);
                reject(errorResponse);

            });

    });

    return promise;

}

export function createUser(data: UsernamePassword): Promise<CreateUserResponse> {

    return makeRequest("user", "POST", data);

}

export function getUser(user_id: ?string, session_token: ?string): Promise<User> {

    if(!user_id) throw Error("user_id is empty or null");

    return makeRequest("user/" + user_id, "GET", null, session_token);

}

export function updateUserProperties(user_id: ?string, data: UserProperties, session_token: ?string): Promise<{}> {

    if(!user_id) throw Error("user_id is empty or null");

    return makeRequest("user/" + user_id + "/properties", "PUT", data, session_token);

}

export function createSessionToken(data: UsernamePassword): Promise<CreateSessionTokenResponse> {

    return makeRequest("session-token", "POST", data);

}

export function createEntry(user_id: ?string, data: Entry, session_token: ?string): Promise<{}> {

    if(!user_id) throw Error("user_id is empty or null");

    return makeRequest("entry/" + user_id, "POST", data, session_token);

}

export function updateEntry(user_id: ?string, data: Entry, session_token: ?string): Promise<{}> {

    if(!user_id) throw Error("user_id is empty or null");

    return makeRequest("entry/" + user_id, "PUT", data, session_token);

}
