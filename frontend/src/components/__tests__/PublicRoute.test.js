// @flow

import React from 'react';
import { shallow } from 'enzyme';

import * as testData from "../../views/__tests__/testData";
import {MemoryRouter} from "react-router-dom";
import PublicRoute from "../PublicRoute";



test('should render correctly', async () => {

    let ExampleContent = () => <div>example content</div>;

    const wrapper = shallow(
    <MemoryRouter>
        <PublicRoute session_context={testData.sessionContext} component={ExampleContent} />
    </MemoryRouter>);

    expect(wrapper.html()).toContain("example content");
    expect(wrapper.html()).not.toContain("Loading");
    expect(wrapper.find("Redirect").length).toBe(0);

});

