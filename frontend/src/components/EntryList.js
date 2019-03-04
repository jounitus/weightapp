// @flow

import React from 'react';

import type { Entry } from '../models/Entry'
import EntryListItem from './EntryListItem'


import './EntryList.css';


type EntryListProps = {
    entries: Array<Entry>,
    highlight_entry_id?: ?string
}


export default function EntryList(props: EntryListProps) {

    const entries:Array<Entry> = props.entries;

    const listItems = (entries) ? entries.map((entry) => {
        const highlight:boolean = (props.highlight_entry_id === entry.entry_id);
        return <EntryListItem key={entry.entry_id} entry={entry} highlight={highlight} />
    }) : [];

    return <table className="entryList">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{listItems}</tbody>
        </table>;

}
