// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import {sessionContext} from "./testData"
import LogoutView from "../LogoutView";


jest.mock("../../Api");


test('Should redirect correctly', async () => {

    const wrapper = shallow(
        <LogoutView session_context={sessionContext} />
    );

    let redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps).toEqual( {"push": false, "to": "/user/login"});

});

test('Should call SessionContext.removeSessionInfo', async () => {

    const wrapper = shallow(
        <LogoutView session_context={sessionContext} />
    );

    expect(sessionContext.removeSessionInfo).toHaveBeenCalled();

});
