// @flow

import React from 'react';
import { shallow } from 'enzyme';

import UserForm from "../UserForm";
import type {UsernamePassword} from "../../models/UsernamePassword";
import {simplifyWrapper} from "../../enzymeToJsonSimplifiers";


test('Empty form should render correctly', async () => {

    const usernamePassword: UsernamePassword = {
        username: null,
        password: null
    };

    const wrapper = shallow(
        <UserForm data={usernamePassword} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(2);

    expect(simplifyWrapper(wrapper.find("FormField[name='username']"))).toMatchObject({
        props: { error_fields: {}, name: "username" },
        children: [
            { type: "input", props: { name: "username", value: "" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='password']"))).toMatchObject({
        props: { error_fields: {}, name: "password" },
        children: [
            { type: "input", props: { type: "password", name: "password", value: "" } }
        ],
    });

});

test('Non -empty form should render correctly', async () => {

    const usernamePassword: UsernamePassword = {
        username: "my_username",
        password: "my_password"
    };

    const wrapper = shallow(
        <UserForm data={usernamePassword} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(2);

    expect(simplifyWrapper(wrapper.find("FormField[name='username']"))).toMatchObject({
        props: { error_fields: {}, name: "username" },
        children: [
            { type: "input", props: { name: "username", value: "my_username" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='password']"))).toMatchObject({
        props: { error_fields: {}, name: "password" },
        children: [
            { type: "input", props: { type: "password", name: "password", value: "my_password" } }
        ],
    });

});

test('errorField should be passed correctly', async () => {

    const usernamePassword: UsernamePassword = {
        username: "my_username",
        password: "my_password"
    };

    const errorFields = {
        username: "usernameError",
        password: "passwordError"
    };

    const wrapper = shallow(
        <UserForm data={usernamePassword} error_fields={errorFields} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(2);

    expect(simplifyWrapper(wrapper.find("FormField[name='username']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "username"
        }
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='password']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "password"
        }
    });

});

test('onChange should change form state', async () => {

    const usernamePassword: UsernamePassword = {
        username: null,
        password: null
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <UserForm data={usernamePassword} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    expect(wrapper.find("FormField").length).toBe(2);

    const userForm: UserForm = wrapper.instance();

    //
    // NOTE: simulate() doesnt handle event.currentTarget and event.target correctly, so just pass the values manually
    //

    userForm.handleChange({currentTarget:{name:"username",value:"my_username"}});
    userForm.handleChange({currentTarget:{name:"password",value:"my_password"}});

    wrapper.update();

    expect(wrapper.state()).toMatchObject({
        username: "my_username",
        password: "my_password"
    });

});


test('onSubmit should pass correct data', async () => {

    const usernamePassword: UsernamePassword = {
        username: "my_username",
        password: "my_password"
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <UserForm data={usernamePassword} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    const userForm: UserForm = wrapper.instance();

    const event = {
        preventDefault: jest.fn()
    };

    userForm.handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(onSubmitCallback).toHaveBeenCalledWith({
        username: "my_username",
        password: "my_password"
    });

});
