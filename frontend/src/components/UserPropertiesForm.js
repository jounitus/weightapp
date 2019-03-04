// @flow

import React from 'react';

import type { UserProperties } from '../models/UserProperties'
import FormField from "./FormField";



export type UserPropertiesFormProps = {
    userProperties: UserProperties,
    onSubmit: (UserProperties) => void,
    error_fields: {[string]: string}
}

type UserPropertiesFormState = {

} & UserProperties;


export default class UserPropertiesForm extends React.Component<UserPropertiesFormProps, UserPropertiesFormState> {

    constructor(props: UserPropertiesFormProps) {

        super(props);

        this.state = {
            dob: props.userProperties.dob,
            gender: props.userProperties.gender,
            height_cm: props.userProperties.height_cm,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({[event.currentTarget.name]: event.currentTarget.value});
    };

    handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {

        event.preventDefault();

        const userProperties: UserProperties = {
            dob: this.state.dob,
            gender: this.state.gender,
            height_cm: this.state.height_cm,
        };

        this.props.onSubmit(userProperties);

    };

    render() {

        return <div>

            <form onSubmit={this.handleSubmit}>

                <FormField name="dob" label="Birth Date" error_fields={this.props.error_fields}>
                    <input type="date" name="dob" value={this.state.dob || ""}
                           onChange={this.handleChange} />
                </FormField>

                <FormField name="gender" label="Gender" error_fields={this.props.error_fields}>
                    <input type="text" name="gender" value={this.state.gender || ""}
                           onChange={this.handleChange} />
                </FormField>

                <FormField name="height_cm" label="Height" error_fields={this.props.error_fields}>
                    <input type="text" name="height_cm" value={this.state.height_cm || ""}
                           onChange={this.handleChange} />
                </FormField>

                <input type="submit" />

            </form>

        </div>;
    }
}
