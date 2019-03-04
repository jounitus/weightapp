// @flow

import React from 'react';

import UserForm from '../components/UserForm';

import { createUser, createSessionToken } from '../Api'

import type { UsernamePassword } from '../models/UsernamePassword'
import type { CreateUserResponse } from '../models/CreateUserResponse'
import type { CreateSessionTokenResponse } from '../models/CreateSessionTokenResponse'
import type { SessionInfo } from '../models/SessionInfo'
import {Redirect} from "react-router-dom";
import type {StatusBarProps} from "../components/StatusBar";
import * as statusBarModule from "../components/StatusBar"
import type {ErrorResponse} from "../models/ErrorResponse";
import type {SessionContext} from "../models/SessionContext";
import StatusBar from "../components/StatusBar";
import type {EntryListViewUrlState} from "../models/EntryListViewUrlState";


type CreateUserViewProps = {
    session_context: SessionContext
}

type CreateUserViewState = {
    data: UsernamePassword,
    redirect: ?Redirect,
    error_fields: {[string]: string},
    statusBarProps: ?StatusBarProps
}

export default class CreateUserView extends React.Component<CreateUserViewProps, CreateUserViewState> {

    constructor(props: CreateUserViewProps) {

        super(props);

        this.state = {
            data: {
                username: "",
                password: ""
            },
            redirect: null,
            error_fields: {},
            statusBarProps: null
        };

        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit = async (data: UsernamePassword) => {

        const sessionContext: SessionContext = this.props.session_context;

        this.setState({
            statusBarProps: statusBarModule.getActiveProps()
        });

        try {

            const createUserResponse: CreateUserResponse = await createUser(data);

            console.info(createUserResponse);

            const createSessionTokenResponse: CreateSessionTokenResponse = await createSessionToken(data);

            console.info(createSessionTokenResponse);

            let sessionInfo: SessionInfo = {
                session_token: createSessionTokenResponse.session_token,
                user_id: createSessionTokenResponse.user_id
            };

            sessionContext.updateSessionInfo(sessionInfo);

            const entryListViewUrlState: EntryListViewUrlState = {
                statusBarProps: statusBarModule.getSuccessProps("New user successfully created!")
            };

            this.setState({redirect: <Redirect to={{pathname: "/", state: entryListViewUrlState}} />});

        } catch(e) {

            const error:ErrorResponse = e; // typecast for ide

            console.info("error2", error);

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

        return <div>
            <h1>New User</h1>
            <StatusBar {...this.state.statusBarProps} />
            <UserForm data={this.state.data} onSubmit={this.onSubmit} error_fields={this.state.error_fields} />
        </div>
    }
}
