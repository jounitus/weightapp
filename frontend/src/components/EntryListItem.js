// @flow

import React from 'react';
import { Link } from "react-router-dom";

import type { Entry } from '../models/Entry'
import {formatDate, formatWeight} from '../Misc'


type EntryListItemProps = {
    entry: Entry,
    highlight?: boolean
}

export default function EntryListItem(props: EntryListItemProps) {

    const entry:Entry = props.entry;

    return <tr className={"entryListItem" + (props.highlight ? " highlight" : "")}>
        <td>{formatDate(entry.date)}</td>
        <td>{formatWeight(entry.weight_kg)}</td>
        <td><Link to={"/entry/edit/" + (entry.entry_id ? entry.entry_id : "")}>edit</Link></td>
    </tr>;

}
