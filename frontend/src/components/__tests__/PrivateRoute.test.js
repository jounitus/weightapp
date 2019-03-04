// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';

import * as testData from "../../views/__tests__/testData";
import PrivateRoute from "../PrivateRoute";
import {MemoryRouter, StaticRouter} from "react-router-dom";



test('should render correctly when user object loaded', async () => {

    let ExampleContent = () => <div>example content</div>;

    const wrapper = shallow(
    <MemoryRouter>
        <PrivateRoute session_context={testData.sessionContext} component={ExampleContent} />
    </MemoryRouter>);

    expect(wrapper.html()).toContain("example content");
    expect(wrapper.html()).not.toContain("Loading");
    expect(wrapper.find("Redirect").length).toBe(0);

});

test('should render correctly when user object not loaded, but session token exists', async () => {

    let ExampleContent = () => <div>example content</div>;

    testData.sessionContext.user = null;

    const wrapper = shallow(
        <MemoryRouter>
            <PrivateRoute session_context={testData.sessionContext} component={ExampleContent} />
        </MemoryRouter>);

    expect(wrapper.html()).not.toContain("example content");
    expect(wrapper.html()).toContain("Loading");
    expect(wrapper.find("Redirect").length).toBe(0);

});

test('should render correctly when session token does not exists', async () => {

    let ExampleContent = () => <div>example content</div>;

    testData.sessionContext.user_id = null;
    testData.sessionContext.session_token = null;
    testData.sessionContext.user = null;

    const wrapper = mount( // need to use mount instead of shallow, to get the Redirect component
        <StaticRouter context={{}}>
            <PrivateRoute session_context={testData.sessionContext} component={ExampleContent} />
        </StaticRouter>);

    expect(wrapper.find("Redirect").props()).toMatchObject({
        to: {
            pathname: "/user/login",
            state:  {
                from:  {
                    hash: "",
                    pathname: "/",
                    search: "",
                    state: undefined,
                },
            },
        }
    });

    wrapper.unmount();

});