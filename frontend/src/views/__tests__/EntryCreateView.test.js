// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from "react-router-dom";

import { createEntry } from "../../Api";
import type {ErrorResponse} from "../../models/ErrorResponse";
import EntryCreateView from "../EntryCreateView";
import * as testData from "./testData";
import type {Entry} from "../../models/Entry";
import StatusBar from "../../components/StatusBar";
import EntryForm from "../../components/EntryForm";


jest.mock("../../Api");


test('Should redirect when Api.createEntry gives valid response', async () => {

    const createEntryPromise = Promise.resolve({}); // valid empty response from createEntry

    createEntry.mockImplementation(() => createEntryPromise );

    const wrapper = shallow(
        <EntryCreateView session_context={testData.sessionContext} />
    );

    expect(wrapper.find(Redirect).length).toBe(0);

    const entry: Entry = {
        entry_id: null,
        date: "2018-10-22",
        weight_kg: 100.1234,
        comment: null
    };

    await wrapper.instance().onSubmit(entry);

    expect(createEntry).toHaveBeenCalledWith("myuserid", entry, "mysessiontoken");

    wrapper.update();

    let redirectProps = wrapper.find(Redirect).props();

    expect(redirectProps.to).toEqual({
        "pathname": "/",
        "state": {
            "highlight_entry_id": null,
            "statusBarProps": {
                "className": "success",
                "statusText": "Entry successfully created!"
            }
        }
    });

});


test('Should display errors when Api.createEntry fails', async () => {

    const error:ErrorResponse = {
        code: 0,
        description: "descriptiontext",
        fields: {
            'date': "errormsg",
            'weight_kg': "errormsg"
        }
    };

    const createEntryPromise = Promise.reject(error); // valid empty response from createEntry

    createEntry.mockImplementation(() => createEntryPromise );

    const wrapper = shallow(
        <EntryCreateView session_context={testData.sessionContext} />
    );

    //
    // test props before error should happen
    //

    let entryFormProps = wrapper.find(EntryForm).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(entryFormProps.error_fields).toEqual({});

    expect(statusBarProps).toEqual({});

    const entry: Entry = {
        entry_id: null,
        date: "2018-10-22",
        weight_kg: 100.1234,
        comment: null
    };

    await wrapper.instance().onSubmit(entry);

    wrapper.update();

    expect(createEntry).toHaveBeenCalled();

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
