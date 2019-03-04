// @flow

import React from 'react';
import FormField from './FormField'

import type { UsernamePassword } from '../models/UsernamePassword'


export type UserFormProps = {
    data: UsernamePassword,
    onSubmit: (UsernamePassword) => void,
    error_fields: {[string]: string}
}

type UserFormState = {

} & UsernamePassword;

export default class UserForm extends React.Component<UserFormProps, UserFormState> {

    constructor(props: UserFormProps) {

        super(props);

        this.state = props.data;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({[event.currentTarget.name]: event.currentTarget.value});
    };

    handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault();

        const usernamePassword: UsernamePassword = {
            username: this.state.username,
            password: this.state.password
        };

        this.props.onSubmit(usernamePassword);
    };

    render() {

        return (

            <form onSubmit={this.handleSubmit}>

                <FormField name="username" label="Username" error_fields={this.props.error_fields}>
                    <input type="text" name="username" value={this.state.username || ""}
                           onChange={this.handleChange} />
                </FormField>

                <FormField name="password" label="Password" error_fields={this.props.error_fields}>
                    <input type="password" name="password" value={this.state.password || ""}
                           onChange={this.handleChange} />
                </FormField>

                <input type="submit" />

            </form>

        );
    }
}
