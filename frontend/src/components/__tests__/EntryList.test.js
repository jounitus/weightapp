// @flow

import React from 'react';
import { shallow } from 'enzyme';

import * as testData from "../../views/__tests__/testData";
import EntryList from "../EntryList";
import EntryListItem from "../EntryListItem";
import {listifyWrapper} from "../../enzymeToJsonSimplifiers";



test('Empty list should render correctly', async () => {

    const wrapper = shallow(
        <EntryList entries={null} />
    );

    expect(wrapper.find(EntryListItem).length).toBe(0);

});

test('Non -empty list should render correctly', async () => {

    const wrapper = shallow(
        <EntryList entries={testData.entryList} />
    );

    expect(wrapper.find(EntryListItem).length).toBe(2);

    expect(listifyWrapper(wrapper.find(EntryListItem))).toMatchObject( [

        ["EntryListItem", {
            entry: { date: "2018-03-01", entry_id: "entry2", weight_kg: 110.12345678 },
            highlight: false,
            key: "entry2"
        }],
        ["EntryListItem", {
            entry: { date: "2018-01-13", entry_id: "entry1", weight_kg: 120.12345678 },
            highlight: false,
            key: "entry1"
        }]

    ]);

});

test('Non -empty list should render correctly with highlight', async () => {

    const wrapper = shallow(
        <EntryList entries={testData.entryList} highlight_entry_id="entry1" />
    );

    expect(wrapper.find(EntryListItem).length).toBe(2);

    expect(listifyWrapper(wrapper.find(EntryListItem))).toMatchObject( [

        ["EntryListItem", {
            entry: { date: "2018-03-01", entry_id: "entry2", weight_kg: 110.12345678 },
            highlight: false,
            key: "entry2"
        }],
        ["EntryListItem", {
            entry: { date: "2018-01-13", entry_id: "entry1", weight_kg: 120.12345678 },
            highlight: true,
            key: "entry1"
        }]

    ]);

});
