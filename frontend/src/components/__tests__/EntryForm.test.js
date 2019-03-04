// @flow

import React from 'react';
import { shallow } from 'enzyme';

import EntryForm from "../EntryForm";
import type {Entry} from "../../models/Entry";
import {simplifyWrapper} from "../../enzymeToJsonSimplifiers";


test('Empty form should render correctly', async () => {

    const entry: Entry = {
        entry_id: null,
        date: null,
        weight_kg: null,
        comment: null
    };

    const wrapper = shallow(
        <EntryForm data={entry} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='date']"))).toMatchObject({
        props: { error_fields: {}, name: "date" },
        children: [
            { type: "input", props: { name: "date", type: "date", value: "" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='weight_kg']"))).toMatchObject({
        props: { error_fields: {}, name: "weight_kg" },
        children: [
            { type: "input", props: { name: "weight_kg", value: "" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='comment']"))).toMatchObject( {
        props: { error_fields: {}, name: "comment" },
        children: [
            { type: "textarea", props: { name: "comment", value: "" } }
        ],
    });


});

test('Non -empty form should render correctly', async () => {

    const entry: Entry = {
        entry_id: "my_entry_id",
        date: "2010-10-30",
        weight_kg: 100.123456,
        comment: "my comment"
    };

    const wrapper = shallow(
        <EntryForm data={entry} error_fields={{}} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='date']"))).toMatchObject({
        props: { error_fields: {}, name: "date" },
        children: [
            { type: "input", props: { name: "date", type: "date", value: "2010-10-30" } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='weight_kg']"))).toMatchObject({
        props: { error_fields: {}, name: "weight_kg" },
        children: [
            { type: "input", props: { name: "weight_kg", value: 100.123456 } }
        ],
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='comment']"))).toMatchObject({
        props: { error_fields: {}, name: "comment" },
        children: [
            { type: "textarea", props: { name: "comment", value: "my comment" } }
        ],
    });

});

test('errorField should be passed correctly', async () => {

    const entry: Entry = {
        entry_id: "my_entry_id",
        date: "2010-10-30",
        weight_kg: 100.123456,
        comment: "my comment"
    };

    const errorFields = {
        date: "dateError",
        weight_kg: "weightError",
        comment: "commentError"
    };

    const wrapper = shallow(
        <EntryForm data={entry} error_fields={errorFields} onSubmit={jest.fn()}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    expect(simplifyWrapper(wrapper.find("FormField[name='date']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "date"
        }
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='weight_kg']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "weight_kg"
        }
    });

    expect(simplifyWrapper(wrapper.find("FormField[name='comment']"))).toMatchObject({
        props: {
            error_fields: errorFields,
            name: "comment"
        }
    });

});

test('onChange should change form state', async () => {

    const entry: Entry = {
        entry_id: "my_entry_id",
        date: null,
        weight_kg: null,
        comment: null
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <EntryForm data={entry} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    expect(wrapper.find("FormField").length).toBe(3);

    const entryForm: EntryForm = wrapper.instance();

    //
    // NOTE: simulate() doesnt handle event.currentTarget and event.target correctly, so just pass the values manually
    //

    entryForm.handleChange({currentTarget:{name:"date",value:"2010-10-30"}});
    entryForm.handleChange({currentTarget:{name:"weight_kg",value:"100.123456"}});
    entryForm.handleChange({currentTarget:{name:"comment",value:"my comment"}});

    wrapper.update();

    expect(wrapper.state()).toMatchObject({
        entry_id: "my_entry_id",
        date: "2010-10-30",
        weight_kg: "100.123456",
        comment: "my comment"
    });

    wrapper.unmount();

});


test('onSubmit should pass correct data', async () => {

    const entry: Entry = {
        entry_id: "my_entry_id",
        date: "2010-10-30",
        weight_kg: 100.123456,
        comment: "my comment"
    };

    const onSubmitCallback = jest.fn();

    const wrapper = shallow(
        <EntryForm data={entry} error_fields={{}} onSubmit={onSubmitCallback}/>
    );

    const entryForm: EntryForm = wrapper.instance();

    const event = {
        preventDefault: jest.fn()
    };

    entryForm.handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();

    expect(onSubmitCallback).toHaveBeenCalledWith({
        entry_id: "my_entry_id",
        date: "2010-10-30",
        weight_kg: 100.123456,
        comment: "my comment"
    });

    wrapper.unmount();

});
