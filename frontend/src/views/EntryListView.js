// @flow

import React from 'react';
import { Link } from "react-router-dom";

import EntryList from '../components/EntryList';

import type { SessionContext } from '../models/SessionContext';
import type {StatusBarProps} from "../components/StatusBar";
import StatusBar from "../components/StatusBar";
import type {EntryListViewUrlState} from "../models/EntryListViewUrlState";


type EntryListViewProps = {
    match: any,
    location: any,
    session_context: SessionContext
}

type EntryListViewState = {
    statusBarProps: ?StatusBarProps,
    highlight_entry_id?: ?string
}

export default class EntryListView extends React.Component<EntryListViewProps, EntryListViewState> {

    constructor(props: EntryListViewProps) {

        super(props);

        let entryListViewUrlState: EntryListViewUrlState = props.location && props.location.state;

        this.state = {
            statusBarProps: entryListViewUrlState && entryListViewUrlState.statusBarProps,
            highlight_entry_id: entryListViewUrlState && entryListViewUrlState.highlight_entry_id
        }

    }

    render() {

        if(!this.props.session_context.user)
        {
            throw Error("user object or entry list is empty");
        }

        return (
            <div>

                <StatusBar {...this.state.statusBarProps} />
                <EntryList
                    entries={this.props.session_context.user.entry_list}
                    highlight_entry_id={this.state.highlight_entry_id}
                />
                <p><Link to="/entry/create">Add New Entry</Link></p>
            </div>
        );
    }
}
