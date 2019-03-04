// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import * as testData from "./testData"
import {createSessionToken} from "../../Api";
import type {ErrorResponse} from "../../models/ErrorResponse";
import type {CreateSessionTokenResponse} from "../../models/CreateSessionTokenResponse";
import UserForm from "../../components/UserForm";
import StatusBar from "../../components/StatusBar";
import LoginView from "../LoginView";


jest.mock("../../Api");


beforeEach(() => {

    testData.sessionContext.session_token = null;
    testData.sessionContext.user = null;
    testData.sessionContext.user_id = null;

});


test('Should redirect when successfully login in', async () => {

    const createSessionTokenResponse: CreateSessionTokenResponse = {
        user_id: testData.user.user_id,
        session_token: "mysessiontoken"
    };

    const createSessionTokenPromise = Promise.resolve(createSessionTokenResponse);

    createSessionToken.mockImplementation(() => createSessionTokenPromise );

    const wrapper = shallow(
        <LoginView session_context={testData.sessionContext} />
    );

    expect(wrapper.find(Redirect).length).toBe(0);

    await wrapper.instance().onSubmit({

        username: testData.user.username,
        password: testData.user.password

    });

    expect(createSessionToken).toHaveBeenCalledWith(
        {
            username: testData.user.username,
            password: testData.user.password
        });

    expect(testData.sessionContext.updateSessionInfo).toHaveBeenCalledWith({
        session_token: "mysessiontoken",
        user_id: "myuserid"
    });

    wrapper.update();

    let redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps.to).toEqual({
        "pathname": "/",
        "state": {
            "statusBarProps": {
                "className": "success",
                "statusText": "Successfully logged in!"
            }
        }
    });

});


test('Should display errors when Api.createSessionToken fails', async () => {

    const error:ErrorResponse = {

        code: 0,
        description: "descriptiontext",
        fields: {
            'username': "errormsg",
            'password': "errormsg"
        }
    };

    const createSessionTokenPromise = Promise.reject(error);

    createSessionToken.mockImplementation(() => createSessionTokenPromise );

    const wrapper = shallow(
        <LoginView session_context={testData.sessionContext} />
    );

    //
    // test props before error should happen
    //

    let userFormProps = wrapper.find(UserForm).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(userFormProps.error_fields).toEqual({});

    expect(statusBarProps).toEqual({});

    await wrapper.instance().onSubmit({

        username: testData.user.username,
        password: testData.user.password

    });

    wrapper.update();

    //
    // test errors after they should have happened
    //

    userFormProps = wrapper.find(UserForm).props();
    statusBarProps = wrapper.find(StatusBar).props();

    expect(userFormProps.error_fields).toEqual(error.fields);

    expect(statusBarProps).toEqual({
        'className': "failure",
        'statusText': "descriptiontext"
    });

});
