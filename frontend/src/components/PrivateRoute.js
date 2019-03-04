// @flow

import React from "react";
import { Route, Redirect } from "react-router-dom"

import type { SessionContext } from "../models/SessionContext"

export default function PrivateRoute(props: {component: any, session_context: SessionContext}) {

    const { component: Component, session_context, ...rest } = props;

    // https://reacttraining.com/react-router/web/example/auth-workflow

    return (
        <Route
            {...rest}
            render={function(props) {

                if(session_context.session_token) {

                    if(session_context.user) {

                        return <Component {...props} session_context={session_context} />

                    } else {

                        return <p>Loading... (private route)</p>

                    }

                } else {
                    console.info("Redirecting to login page");
                    return <Redirect to={{ pathname: "/user/login", state: { from: props.location } }} />
                }
            }}
        />
    );
}
