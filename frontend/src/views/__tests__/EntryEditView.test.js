// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import EntryEditView from "../EntryEditView";
import {sessionContext} from "./testData"
import {updateEntry} from "../../Api";
import type {ErrorResponse} from "../../models/ErrorResponse";
import type {Entry} from "../../models/Entry";
import EntryForm from "../../components/EntryForm";
import StatusBar from "../../components/StatusBar";


jest.mock("../../Api");


test('Should redirect when Api.updateEntry gives valid response', async () => {

    const match = {
        params: {
            entry_id: "entry2"
        }
    };

    const updateEntryPromise = Promise.resolve({}); // valid empty response from updateEntry

    updateEntry.mockImplementation(() => updateEntryPromise );

    const wrapper = shallow(
        <EntryEditView session_context={sessionContext} match={match} />
    );

    expect(wrapper.find(Redirect).length).toBe(0);

    const entry: Entry = {
        entry_id: "myentryid",
        date: "2018-10-22",
        weight_kg: 100.1234,
        comment: null
    };

    await wrapper.instance().onSubmit(entry);

    expect(updateEntry).toHaveBeenCalledWith("myuserid", entry, "mysessiontoken");

    wrapper.update();

    let redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps.to).toEqual({
        "pathname": "/",
        "state": {
            "highlight_entry_id": "myentryid",
            "statusBarProps": {
                "className": "success",
                "statusText": "Entry successfully updated!"
            }
        }
    });

});


test('Should display errors when Api.updateEntry fails', async () => {

    const match = {
        params: {
            entry_id: "entry2"
        }
    };

    const error:ErrorResponse = {
        code: 0,
        description: "descriptiontext",
        fields: {
            'date': "errormsg",
            'weight_kg': "errormsg"
        }
    };

    const updateEntryPromise = Promise.reject(error); // valid empty response from updateEntry

    updateEntry.mockImplementation(() => updateEntryPromise );

    const wrapper = shallow(
        <EntryEditView session_context={sessionContext} match={match} />
    );

    //
    // test props before error should happen
    //

    let entryFormProps = wrapper.find(EntryForm).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(entryFormProps.error_fields).toEqual({});

    expect(statusBarProps).toEqual({});

    const entry: Entry = {
        entry_id: "myentryid",
        date: "2018-10-22",
        weight_kg: 100.1234,
        comment: null
    };

    await wrapper.instance().onSubmit(entry);

    wrapper.update();

    expect(updateEntry).toHaveBeenCalledWith("myuserid", entry, "mysessiontoken");

    //
    // test errors after they should have happened
    //

    entryFormProps = wrapper.find(EntryForm).props();
    statusBarProps = wrapper.find(StatusBar).props();

    expect(entryFormProps.error_fields).toEqual(error.fields);

    expect(statusBarProps).toEqual({
        'className': "failure",
        'statusText': "descriptiontext"
    });

});

test('Should not throw error when entry is missing', async () => {

    const match = {
        params: {
            entry_id: "missingentry"
        }
    };

    const wrapper = shallow(
        <EntryEditView session_context={sessionContext} match={match} />
    );

    let statusBarProps = wrapper.find(StatusBar).props();

    expect(statusBarProps).toEqual({
        'className': "failure",
        'statusText': "Entry not found"
    });
});
