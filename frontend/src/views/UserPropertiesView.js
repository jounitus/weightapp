// @flow

import React from 'react';

import UserPropertiesForm from '../components/UserPropertiesForm';
import StatusBar from "../components/StatusBar";
import * as statusBarModule from "../components/StatusBar";

import { updateUserProperties } from '../Api'

import type { UserProperties } from '../models/UserProperties'
import type { SessionContext } from '../models/SessionContext'
import type {ErrorResponse} from "../models/ErrorResponse";
import type {StatusBarProps} from "../components/StatusBar";
import type {User} from "../models/User";


type UserPropertiesViewProps = {
    session_context: SessionContext,
}

type UserPropertiesViewState = {
    error_fields: {[string]: string},
    statusBarProps: ?StatusBarProps
}

export default class UserPropertiesView extends React.Component<UserPropertiesViewProps, UserPropertiesViewState> {

    constructor(props: UserPropertiesViewProps) {

        super(props);

        this.state = {
          error_fields: {},
            statusBarProps: null
        };

        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit = async (userProperties: UserProperties) => {

        this.setState({
            statusBarProps: statusBarModule.getActiveProps()
        });

        try {

            await updateUserProperties(
                this.props.session_context.user_id,
                userProperties,
                this.props.session_context.session_token);

            console.info("properties updated");

            this.setState({
                error_fields: {},
                statusBarProps: statusBarModule.getSuccessProps("Properties successfully updated!")
            });

        }
        catch(e) {

            const error: ErrorResponse = e;

            this.setState({
                error_fields: error.fields,
                statusBarProps: statusBarModule.getFailureProps(error.description)
            });
        }

    };

    render() {

        if(!this.props.session_context.user) {
            throw Error("user object is null");
        }

        const user: User = this.props.session_context.user;

        const userProperties: UserProperties = {
            dob: user.dob,
            gender: user.gender,
            height_cm: user.height_cm
        };

        return <div>
            <h1>User Properties</h1>
            <StatusBar {...this.state.statusBarProps} />
            <UserPropertiesForm
                userProperties={userProperties}
                onSubmit={this.onSubmit}
                error_fields={this.state.error_fields}
            />
        </div>

    }

}
