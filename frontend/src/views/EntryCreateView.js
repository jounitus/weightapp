// @flow

import React from 'react';

import EntryForm from '../components/EntryForm';

import { createEntry } from '../Api'

import type { Entry } from '../models/Entry';
import type {StatusBarProps} from "../components/StatusBar";
import type {ErrorResponse} from "../models/ErrorResponse";
import StatusBar from "../components/StatusBar";
import {Redirect} from "react-router-dom";
import type {SessionContext} from "../models/SessionContext";
import * as statusBarModule from "../components/StatusBar";
import type {EntryListViewUrlState} from "../models/EntryListViewUrlState";


type EntryCreateViewProps = {
    session_context: SessionContext
}

type EntryCreateViewState = {
    redirect: ?Redirect,
    error_fields: {[string]: string},
    statusBarProps: ?StatusBarProps
}

export default class EntryCreateView extends React.Component<EntryCreateViewProps, EntryCreateViewState> {

    constructor(props: EntryCreateViewProps) {

        super(props);

        this.state = {
            redirect: null,
            error_fields: {},
            statusBarProps: null
        };

        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit = async (data: Entry) => {

        const sessionContext: SessionContext = this.props.session_context;

        this.setState({
            statusBarProps: statusBarModule.getActiveProps()
        });

        try {

            await createEntry(sessionContext.user_id, data, sessionContext.session_token);

            console.info("entry created");

            const entryListViewUrlState: EntryListViewUrlState = {
                highlight_entry_id: data.entry_id,
                statusBarProps: statusBarModule.getSuccessProps("Entry successfully created!")
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

        const data:Entry = {
            entry_id: null,
            date: null,
            weight_kg: null,
            comment: null
        };

        return (
          <div>
            <h1>Create Entry</h1>
            <StatusBar {...this.state.statusBarProps} />
            <EntryForm data={data} onSubmit={this.onSubmit} error_fields={this.state.error_fields} />
          </div>
        );

    }
}
