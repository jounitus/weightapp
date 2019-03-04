import React from 'react';

import {makeRequest} from "./Api"
import type {CreateSessionTokenResponse} from "./models/CreateSessionTokenResponse";
import type {ErrorResponse} from "./models/ErrorResponse";


test('makeRequest should parse valid JSON responses correctly', async () => {

    const createSessionTokenResponse: CreateSessionTokenResponse = {
        user_id: "myuserid",
        session_token: "mysessiontoken"
    };

    const response = new Response(
        JSON.stringify(createSessionTokenResponse),
        { "status" : 200 , "statusText" : "OK" }
        );

    window.fetch = jest.fn(() => Promise.resolve(response));

    const resp = makeRequest("dummyurl", "POST", null, "mysessiontoken");

    await expect(resp).resolves.toMatchObject({session_token: "mysessiontoken", user_id: "myuserid"});

});

test('makeRequest should parse valid JSON error responses correctly', async () => {

    const errorResponse: ErrorResponse = {
        code: 100,
        description: "mydescription",
        message: "mymessage",
        fields: {field1: "field1error", field2: "field2error"}
    };

    const response = new Response(
        JSON.stringify(errorResponse),
        { "status" : 500 , "statusText" : "ERROR" }
        );

    window.fetch = jest.fn(() => Promise.resolve(response));

    const resp = makeRequest("dummyurl", "POST", null, "mysessiontoken");

    await expect(resp).rejects.toMatchObject({
        code: 100,
        description: "mydescription",
        message: "mymessage",
        fields: {field1: "field1error", field2: "field2error"}
    });

});

test('makeRequest should handle non-JSON responses correctly', async () => {

    const response = new Response(
        "this is not valid json",
        { "status" : 200 , "statusText" : "OK" }
        );

    window.fetch = jest.fn(() => Promise.resolve(response));

    const resp = makeRequest("dummyurl", "POST", null, "mysessiontoken");

    await expect(resp).rejects.toMatchObject({
        code: 0,
        description: "this is not valid json",
        message: null,
        fields: {}
    });

});

test('makeRequest should handle network errors etc when using fetch correctly', async () => {

    window.fetch = jest.fn(() => Promise.reject(new Error("myerror")));

    const resp = makeRequest("dummyurl", "POST", null, "mysessiontoken");

    await expect(resp).rejects.toMatchObject({
        code: 0,
        description: "Error: myerror",
        message: null,
        fields: {}
    });

});


test('authorization header should be passed correctly to fetch', async () => {

    const response = new Response(
        JSON.stringify({}),
        { "status" : 200 , "statusText" : "OK" }
        );

    window.fetch = jest.fn(() => Promise.resolve(response));

    await makeRequest("dummyurl", "POST", null, "mysessiontoken");

    await window.fetch;

    const url = window.fetch.mock.calls[0][0];
    const {headers} = window.fetch.mock.calls[0][1];

    expect(url).toBe("/api/dummyurl");
    expect(headers['Authentication']).toBe("mysessiontoken");

});

test('JSON should be correctly encoded for the request', async () => {

    const data = {
        example: true
    };

    const response = new Response(
        JSON.stringify({}),
        { "status" : 200 , "statusText" : "OK" }
        );

    window.fetch = jest.fn(() => Promise.resolve(response));

    await makeRequest("dummyurl", "POST", data, "mysessiontoken");

    await window.fetch;

    const url = window.fetch.mock.calls[0][0];
    const {body} = window.fetch.mock.calls[0][1];

    expect(body).toBe("{\"example\":true}");

});