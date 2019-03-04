// @flow

import React from 'react';
import { shallow } from 'enzyme';

import UserPropertiesForm from "../UserPropertiesForm";
import type {UserProperties} from "../../models/UserProperties";
import {simplifyWrapper} from "../../enzymeToJsonSimplifiers";


test('Empty form should render correctly', async () => {

    const userProperties: UserProperties = {
        dob: null,
        height_cm: null,
        gender: null
    };

    const wrapper = shallow(
        <UserPropertiesForm userProperties={userProperties} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='dob']"))).toMatchObject({
        props: { error_fields: {}, name: "dob" },
        children: [
            { type: "input", props: { name: "dob", type: "date", value: "" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='height_cm']"))).toMatchObject({
        props: { error_fields: {}, name: "height_cm" },
        children: [
            { type: "input", props: { name: "height_cm", value: "" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='gender']"))).toMatchObject( {
        props: { error_fields: {}, name: "gender" },
        children: [
            { type: "input", props: { name: "gender", value: "" } }
        ],
    });


});

test('Non -empty form should render correctly', async () => {

    const userProperties: UserProperties = {
        dob: "2010-10-30",
        height_cm: 100.123456,
        gender: "MALE"
    };

    const wrapper = shallow(
        <UserPropertiesForm userProperties={userProperties} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='dob']"))).toMatchObject({
        props: { error_fields: {}, name: "dob" },
        children: [
            { type: "input", props: { name: "dob", type: "date", value: "2010-10-30" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='height_cm']"))).toMatchObject({
        props: { error_fields: {}, name: "height_cm" },
        children: [
            { type: "input", props: { name: "height_cm", value: 100.123456 } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='gender']"))).toMatchObject({
        props: { error_fields: {}, name: "gender" },
        children: [
            { type: "input", props: { name: "gender", value: "MALE" } }
        ],
    });

});

test('errorField should be passed correctly', async () => {

    const userProperties: UserProperties = {
        dob: "2010-10-30",
        height_cm: 100.123456,
        gender: "MALE"
    };

    const errorFields = {
        dob: "dobError",
        height_cm: "heightError",
        gender: "genderError"
    };

    const wrapper = shallow(
        <UserPropertiesForm userProperties={userProperties} error_fields={errorFields} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='dob']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "dob"
        }
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='height_cm']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "height_cm"
        }
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='gender']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "gender"
        }
    });

});

test('onChange should change form state', async () => {

    const userProperties: UserProperties = {
        dob: null,
        height_cm: null,
        gender: null
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <UserPropertiesForm userProperties={userProperties} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    const userPropertiesForm: UserPropertiesForm = wrapper.instance();

    //
    // NOTE: simulate() doesnt handle event.currentTarget and event.target correctly, so just pass the values manually
    //

    userPropertiesForm.handleChange({currentTarget:{name:"dob",value:"2010-10-30"}});
    userPropertiesForm.handleChange({currentTarget:{name:"height_cm",value:"100.123456"}});
    userPropertiesForm.handleChange({currentTarget:{name:"gender",value:"MALE"}});

    wrapper.update();

    expect(wrapper.state()).toMatchObject({
        dob: "2010-10-30",
        height_cm: "100.123456",
        gender: "MALE"
    });

    wrapper.unmount();

});


test('onSubmit should pass correct data', async () => {

    const userProperties: UserProperties = {
        dob: "2010-10-30",
        height_cm: 100.123456,
        gender: "MALE"
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <UserPropertiesForm userProperties={userProperties} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    const userPropertiesForm: UserPropertiesForm = wrapper.instance();

    const event = {
        preventDefault: jest.fn()
    };

    userPropertiesForm.handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(onSubmitCallback).toHaveBeenCalledWith({
        dob: "2010-10-30",
        height_cm: 100.123456,
        gender: "MALE"
    });

    wrapper.unmount();

});
