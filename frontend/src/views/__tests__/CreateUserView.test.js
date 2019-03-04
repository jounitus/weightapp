// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import * as testData from "./testData"
import {createSessionToken, createUser} from "../../Api";
import type {ErrorResponse} from "../../models/ErrorResponse";
import CreateUserView from "../CreateUserView";
import type {CreateUserResponse} from "../../models/CreateUserResponse";
import type {CreateSessionTokenResponse} from "../../models/CreateSessionTokenResponse";
import UserForm from "../../components/UserForm";
import StatusBar from "../../components/StatusBar";


jest.mock("../../Api");


beforeEach(() => {

    testData.sessionContext.session_token = null;
    testData.sessionContext.user = null;
    testData.sessionContext.user_id = null;

});


test('Should redirect when creating new user', async () => {

    const createUserResponse: CreateUserResponse  = {
        user_id: testData.user.user_id
    };

    const createSessionTokenResponse: CreateSessionTokenResponse = {
        user_id: testData.user.user_id,
        session_token: "mysessiontoken"
    };

    const createUserPromise = Promise.resolve(createUserResponse);
    const createSessionTokenPromise = Promise.resolve(createSessionTokenResponse);

    createUser.mockImplementation(() => createUserPromise );
    createSessionToken.mockImplementation(() => createSessionTokenPromise );

    const wrapper = shallow(

            <CreateUserView session_context={testData.sessionContext} />
        );

    expect(wrapper.find(Redirect).length).toBe(0);

    await wrapper.instance().onSubmit({

        username: testData.user.username,
        password: testData.user.password

    });

    expect(createUser).toHaveBeenCalledWith(
        {
            username: testData.user.username,
            password: testData.user.password
        });

    expect(createSessionToken).toHaveBeenCalledWith({
        username: testData.user.username,
        password: testData.user.password
    });

    expect(testData.sessionContext.updateSessionInfo).toHaveBeenCalledWith({
        session_token: "mysessiontoken",
        user_id: testData.user.user_id
    });

    wrapper.update();

    let redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps.to).toEqual({
        "pathname": "/",
        "state": {
            "statusBarProps": {
                "className": "success",
                "statusText": "New user successfully created!"
            }
        }
    });

});


test('Should display errors when Api.createUser fails', async () => {

    const error:ErrorResponse = {

        code: 0,
        description: "descriptiontext",
        fields: {
            'username': "errormsg",
            'password': "errormsg"
        }

    };

    const createUserPromise = Promise.reject(error);

    createUser.mockImplementation(() => createUserPromise );

    const wrapper = shallow(

            <CreateUserView session_context={testData.sessionContext} />
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
