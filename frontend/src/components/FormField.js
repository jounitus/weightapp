// @flow

import * as React from 'react'

export default function FormField(
    props: {
        name: string,
        label: string,
        error_fields?: {[string]: string},
        children?: React.Node
    }) {

    return <div className="field">
        <label htmlFor={props.name}>{props.label}</label>

        {
            (props.error_fields && props.name in props.error_fields) &&

            (<div className="errorField">

                Error: {props.error_fields[props.name]}

            </div>)
        }

        {props.children}
    </div>

}
