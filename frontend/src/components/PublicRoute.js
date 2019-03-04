// @flow

import React from "react";

import { Route } from "react-router-dom"

import type { SessionContext } from "../models/SessionContext"

export default function PublicRoute(props: {component: any, session_context: SessionContext}) {

    const { component: Component, session_context, ...rest } = props;

    return (
        <Route
            {...rest}
            render={function(props) {

                return <Component {...props} session_context={session_context} />

            }}
        />
    );
}
