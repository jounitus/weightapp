// @flow

import React from 'react';
import { shallow } from 'enzyme';

import EntryListItem from "../EntryListItem";
import type {Entry} from "../../models/Entry";
import {formatDate, formatWeight} from "../../Misc";


const entry: Entry = {
    entry_id: "entry2",
    date: "2018-03-01",
    weight_kg: 110.12345678,
    comment: "my comment"
};

test('EntryListItem should render correctly', async () => {

    const wrapper = shallow(<EntryListItem entry={entry}/>);

    expect(wrapper.find("[className~='entryListItem']").length).toBe(1);
    expect(wrapper.find("[className~='highlight']").length).toBe(0);

    expect(wrapper.text()).toContain(formatDate(entry.date));
    expect(wrapper.text()).toContain(formatWeight(entry.weight_kg));

    expect(wrapper.find("Link").props()).toMatchObject({
        to: "/entry/edit/entry2"
    })

});

test('EntryListItem should have highlight css class if highlighted', async () => {

    const wrapper = shallow(
        <EntryListItem entry={entry} highlight={true}/>
    );

    expect(wrapper.find("[className~='highlight']").length).toBe(1);

});