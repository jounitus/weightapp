// @flow

import React from 'react';
import { shallow } from 'enzyme';

import {sessionContext} from "./testData"
import StatusBar from "../../components/StatusBar";
import * as statusBarModule from "../../components/StatusBar";
import EntryListView from "../EntryListView";
import EntryList from "../../components/EntryList";
import type {EntryListViewUrlState} from "../../models/EntryListViewUrlState";


test('Should render correctly with default parameters', async () => {

    const wrapper = shallow(
        <EntryListView session_context={sessionContext} />
    );

    let entryListProps = wrapper.find(EntryList).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(entryListProps).toEqual({entries: sessionContext.user.entry_list});
    expect(statusBarProps).toEqual({});

});

test('StatusBar should have correct props according to the url state', async () => {

    const entryListViewUrlState: EntryListViewUrlState = {
        statusBarProps: statusBarModule.getSuccessProps("Entry successfully updated!")
    };

    const location = {
        state: entryListViewUrlState
    };

    const wrapper = shallow(
        <EntryListView session_context={sessionContext} location={location} />
    );

    let entryListProps = wrapper.find(EntryList).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(entryListProps).toEqual({entries: sessionContext.user.entry_list});
    expect(statusBarProps).toEqual({"className": "success", "statusText": "Entry successfully updated!"});

});

test('EntryList should have correct props according to the url state', async () => {

    const entryListViewUrlState: EntryListViewUrlState = {
        highlight_entry_id: "my_entry_id"
    };

    const location = {
        state: entryListViewUrlState
    };

    const wrapper = shallow(
        <EntryListView session_context={sessionContext} location={location} />
    );

    let entryListProps = wrapper.find(EntryList).props();
    let statusBarProps = wrapper.find(StatusBar).props();

    expect(entryListProps).toEqual({entries: sessionContext.user.entry_list, highlight_entry_id: "my_entry_id"});
    expect(statusBarProps).toEqual({});

});

