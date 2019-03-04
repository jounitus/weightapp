// @flow

import React from 'react';
import { Redirect } from "react-router-dom";

import EntryForm from '../components/EntryForm';
import { updateEntry } from '../Api'
import type { Entry } from '../models/Entry';
import type { SessionContext } from '../models/SessionContext';
import type {StatusBarProps} from "../components/StatusBar";
import StatusBar from "../components/StatusBar";
import type {ErrorResponse} from "../models/ErrorResponse";
import * as statusBarModule from "../components/StatusBar";
import type {EntryListViewUrlState} from "../models/EntryListViewUrlState";


type EntryEditViewProps = {
    match: any,
    session_context: SessionContext
}

type EntryEditViewState = {
    redirect: ?Redirect,
    error_fields: {[string]: string},
    statusBarProps: ?StatusBarProps,
    entry: ?Entry
}

export default class EntryEditView extends React.Component<EntryEditViewProps, EntryEditViewState> {

    constructor(props: EntryEditViewProps) {

        super(props);

        if(!props.session_context.user || !props.session_context.user.entry_list)
        {
            throw Error("user object or entry list is empty");
        }

        const entry:(Entry|void) = props.session_context.user.entry_list.find(
            x => x.entry_id === props.match.params.entry_id);

        let statusBarProps: ?StatusBarProps = null;

        if(!entry) {
            statusBarProps = {
                className: "failure",
                statusText: "Entry not found"
            };
        }

        this.state = {
            redirect: null,
            error_fields: {},
            statusBarProps: statusBarProps,
            entry: entry
        };

        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit = async (data: Entry) => {

        const sessionContext: SessionContext = this.props.session_context;

        this.setState({
            statusBarProps: statusBarModule.getActiveProps()
        });

        try {

            await updateEntry(sessionContext.user_id, data, sessionContext.session_token);

            console.info("entry updated");

            const entryListViewUrlState: EntryListViewUrlState = {
                highlight_entry_id: data.entry_id,
                statusBarProps: statusBarModule.getSuccessProps("Entry successfully updated!")
            };

            this.setState({
                redirect: <Redirect to={{pathname: "/", state: entryListViewUrlState}}/>
            }, () => {
                sessionContext.reloadUser();
            });


        } catch(e) {

            const error: ErrorResponse = e;

            this.setState({
                error_fields: error.fields,
                statusBarProps: statusBarModule.getFailureProps(error.description)
            });
        }

    };

    render() {

        if(this.state.redirect) {
            return this.state.redirect;
        }

        return (
          <div>
            <h1>Edit Entry</h1>
            <StatusBar {...this.state.statusBarProps} />

            {this.state.entry &&
                <EntryForm
                    data={this.state.entry}
                    onSubmit={this.onSubmit}
                    error_fields={this.state.error_fields}
                    />}

          </div>
        );

    }
}
