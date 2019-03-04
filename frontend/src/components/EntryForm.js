// @flow

import React from 'react';

import type { Entry } from '../models/Entry'
import FormField from "./FormField";


type EntryFormProps = {
    data: Entry,
    onSubmit: (Entry) => void,
    error_fields: {[string]: string}
}

type EntryFormState = {

} & Entry;

export default class EntryForm extends React.Component<EntryFormProps, EntryFormState> {

    constructor(props: EntryFormProps) {

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

        const entry: Entry = {
            entry_id: this.state.entry_id,
            date: this.state.date,
            weight_kg: this.state.weight_kg,
            comment: this.state.comment
        };

        this.props.onSubmit(entry);
    };

    render() {

        return (

            <form onSubmit={this.handleSubmit}>

                <FormField name="date" label="Date" error_fields={this.props.error_fields}>
                    <input type="date" name="date" value={this.state.date || ""}
                           onChange={this.handleChange} />
                </FormField>

                <FormField name="weight_kg" label="Weight" error_fields={this.props.error_fields}>
                    <input type="text" name="weight_kg" value={this.state.weight_kg || ""}
                           pattern="[\d\.]+"
                           onChange={this.handleChange} />
                </FormField>

                <FormField name="comment" label="Comment" error_fields={this.props.error_fields}>
                    <textarea name="comment" value={this.state.comment || ""}
                           onChange={this.handleChange} />
                </FormField>

                <input type="submit" value="Save"/>

            </form>

        );
    }
}
