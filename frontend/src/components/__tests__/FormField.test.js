// @flow

import React from 'react';
import { shallow } from 'enzyme';

import FormField from "../FormField";



test('should render correctly', async () => {

    const wrapper = shallow(<FormField name="myFieldName" label="myLabel">
        <input type="text" name="example" />
    </FormField>);

    expect(wrapper.find("[className~='field']").length).toBe(1);

    expect(wrapper.find("label").props().htmlFor).toBe("myFieldName");
    expect(wrapper.find("label").text()).toContain("myLabel");

    expect(wrapper.find("[className~='errorField']").length).toBe(0);

    expect(wrapper.find("input[name='example']").length).toBe(1);

});

test('should display error correctly', async () => {

    const errorFields = {
        'myFieldName': "Error 1",
        'myFieldName2': "Error 2"
    };

    const wrapper = shallow(<FormField name="myFieldName" label="myLabel" error_fields={errorFields}>
        <input type="text" name="example" />
    </FormField>);

    expect(wrapper.find("[className~='errorField']").length).toBe(1);

    expect(wrapper.find("[className~='errorField']").text()).toContain("Error 1");
    expect(wrapper.find("[className~='errorField']").text()).not.toContain("Error 2");

    expect(wrapper.find("input[name='example']").length).toBe(1);

});
