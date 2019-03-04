// @flow

import React from 'react';
import { shallow } from 'enzyme';

import UserPropertiesView from "../UserPropertiesView";
import {sessionContext} from "./testData"
import {updateUserProperties} from "../../Api";
import type {ErrorResponse} from "../../models/ErrorResponse";
import StatusBar from "../../components/StatusBar";
import UserPropertiesForm from "../../components/UserPropertiesForm";
import type {UserProperties} from "../../models/UserProperties";


jest.mock("../../Api");


test('Default view should have correct props', async () => {

    const wrapper = shallow(
        <UserPropertiesView session_context={sessionContext} />
    );

    let statusBarProps = wrapper.find(StatusBar).props();
    let userPropertiesFormProps = wrapper.find(UserPropertiesForm).props();

    expect(statusBarProps).toEqual({});
    expect(userPropertiesFormProps).toEqual({
        "error_fields": {},
        "onSubmit": expect.any(Function),
        "userProperties": {
            "dob": "1980-05-22",
            "gender": "MALE",
            "height_cm": 170.123456
        }
    });

});

test('Successful Api.updateUserProperties should result in correct status bar message', async () => {

    const updateUserPropertiesPromise = Promise.resolve({}); // valid empty response from updateEntry

    updateUserProperties.mockImplementation(() => updateUserPropertiesPromise );

    const wrapper = shallow(
        <UserPropertiesView session_context={sessionContext} />
    );

    const userProperties: UserProperties = {
        dob: "1980-05-22",
        gender: "MALE",
        height_cm: 170.123456
    };

    await wrapper.instance().onSubmit(userProperties);

    expect(updateUserProperties).toHaveBeenCalledWith("myuserid", userProperties, "mysessiontoken");

    wrapper.update();

    let statusBarProps = wrapper.find(StatusBar).props();

    expect(statusBarProps).toEqual({
        "className": "success",
        "statusText": "Properties successfully updated!"
    });

});


test('Should display errors when Api.updateUserProperties fails', async () => {

    const error:ErrorResponse = {
        code: 0,
        description: "descriptiontext",
        fields: {
            'dob': "errormsg",
            'gender': "errormsg",
            'height_cm': "errormsg"
        }
    };

    const updateUserPropertiesPromise = Promise.reject(error); // valid empty response from updateEntry

    updateUserProperties.mockImplementation(() => updateUserPropertiesPromise );

    const wrapper = shallow(
        <UserPropertiesView session_context={sessionContext}  />
    );

    //
    // test props before error should happen
    //

    const userProperties: UserProperties = {
        dob: "1980-05-22",
        gender: "MALE",
        height_cm: 170.123456
    };

    await wrapper.instance().onSubmit(userProperties);

    expect(updateUserProperties).toHaveBeenCalledWith("myuserid", userProperties, "mysessiontoken");

    wrapper.update();

    //
    // test errors after they should have happened
    //

    let userPropertiesFormProps = wrapper.find(UserPropertiesForm).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(statusBarProps).toEqual({"className": "failure", "statusText": "descriptiontext"});
    expect(userPropertiesFormProps.error_fields).toEqual(error.fields);

});
