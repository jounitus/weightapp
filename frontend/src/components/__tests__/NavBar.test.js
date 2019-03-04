// @flow

import React from 'react';
import { shallow } from 'enzyme';

import * as testData from "../../views/__tests__/testData";
import NavBar from "../NavBar";



test('should render correctly when user logged in', async () => {

    const wrapper = shallow(<NavBar session_context={testData.sessionContext} />);

    expect(wrapper.text()).toContain(testData.sessionContext.user.username);
    expect(wrapper.find("[to='/']").length).toBe(1);
    expect(wrapper.find("[to='/user/properties']").length).toBe(1);
    expect(wrapper.find("[to='/user/logout']").length).toBe(1);

    expect(wrapper.find("[to='/user/login']").length).toBe(0);
    expect(wrapper.find("[to='/user/create']").length).toBe(0);

});

test('should render correctly when user object not loaded', async () => {

    testData.sessionContext.user = null;

    const wrapper = shallow(<NavBar session_context={testData.sessionContext} />);

    expect(wrapper.find("[to='/']").length).toBe(0);
    expect(wrapper.find("[to='/user/properties']").length).toBe(0);
    expect(wrapper.find("[to='/user/logout']").length).toBe(0);

    expect(wrapper.find("[to='/user/login']").length).toBe(1);
    expect(wrapper.find("[to='/user/create']").length).toBe(1);

});
