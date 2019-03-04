// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import * as testData from "./views/__tests__/testData"
import {getUser} from "./Api";
import App from "./App";
import type {SessionInfo} from "./models/SessionInfo";
import {setSessionInfo, getSessionInfo, removeSessionInfo} from "./SessionManager";
import NavBar from "./components/NavBar";


jest.mock("./Api");
jest.mock("./SessionManager");


beforeEach(() => {

    testData.sessionContext.session_token = null;
    testData.sessionContext.user = null;
    testData.sessionContext.user_id = null;

});


test('Default view should render correctly', async () => {

    const wrapper = shallow(

            <App />
        );

    expect(wrapper.find(Redirect).length).toBe(0);

});

test('App should load sessionInfo and user object in initialization if available', async () => {

    const sessionInfo: SessionInfo = {
        user_id: "myuserid",
        session_token: "mysessiontoken"
    };

    getSessionInfo.mockImplementation(() => sessionInfo);

    const getUserPromise = Promise.resolve(testData.user);

    getUser.mockImplementation(() => getUserPromise );

    const wrapper = shallow(

            <App />
        );

    await getUserPromise;

    wrapper.update();

    expect(getSessionInfo).toHaveBeenCalled();

    expect(getUser).toHaveBeenCalledWith("myuserid", "mysessiontoken");

    // use NavBar to see if App passes correct props

    expect(wrapper.find(NavBar).props().session_context).toMatchObject({
        user_id: "myuserid",
        session_token: "mysessiontoken",
        user: testData.user
    });

});

test('App.removeSessionInfo should remove session info correctly', async () => {

    const sessionInfo: SessionInfo = {
        user_id: "myuserid",
        session_token: "mysessiontoken"
    };

    getSessionInfo.mockImplementation(() => sessionInfo);

    const getUserPromise = Promise.resolve(testData.user);

    getUser.mockImplementation(() => getUserPromise );

    const wrapper = shallow(

            <App />
        );

    await getUserPromise;

    wrapper.update();

    // use NavBar to see if App passes correct props

    expect(wrapper.find(NavBar).props().session_context).toMatchObject({
        user_id: "myuserid",
        session_token: "mysessiontoken",
        user: testData.user
    });

    wrapper.instance().removeSessionInfo();

    wrapper.update();

    expect(removeSessionInfo).toHaveBeenCalled();

    expect(wrapper.find(NavBar).props().session_context).toMatchObject({
        user_id: null,
        session_token: null,
        user: null
    });

});

test('updateSession should call setSessionInfo', async () => {

    const wrapper = shallow(

            <App />
        );

    //expect(wrapper.find(Redirect).length).toBe(0);

    const getUserPromise = Promise.resolve(testData.user);

    getUser.mockImplementation(() => getUserPromise );

    const sessionInfo: SessionInfo = {
        user_id: "myuserid",
        session_token: "mysessiontoken"
    };

    // the actual call to updateSessionInfo
    wrapper.instance().updateSessionInfo(sessionInfo);

    await getUserPromise;

    wrapper.update();

    expect(setSessionInfo).toHaveBeenCalledWith({
        session_token: "mysessiontoken",
        user_id: "myuserid"
    });

    expect(getUser).toHaveBeenCalledWith("myuserid", "mysessiontoken");

    // use NavBar to see if App passes correct props

    expect(wrapper.find(NavBar).props().session_context).toMatchObject({
        user_id: "myuserid",
        session_token: "mysessiontoken",
        user: testData.user
    });

});

test('App should redirect to login page on invalid token', async () => {

    const wrapper = shallow(

            <App />
        );

    //expect(wrapper.find(Redirect).length).toBe(0);

    const getUserPromise = Promise.reject({code: 101});

    getUser.mockImplementation(() => getUserPromise );

    const sessionInfo: SessionInfo = {
        user_id: "myuserid",
        session_token: "mysessiontoken"
    };

    // the actual call to updateSessionInfo
    wrapper.instance().updateSessionInfo(sessionInfo);

    try {
        await getUserPromise;
    } catch(e) {
        // this is expected to happen
    }

    wrapper.update();

    expect(setSessionInfo).toHaveBeenCalledWith({
        session_token: "mysessiontoken",
        user_id: "myuserid"
    });

    expect(getUser).toHaveBeenCalledWith("myuserid", "mysessiontoken");

    // use NavBar to see if App passes correct props

    expect(wrapper.find(NavBar).props().session_context).toMatchObject({
        user_id: null,
        session_token: null,
        user: null
    });

    const redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps.to).toEqual("/user/login");

});