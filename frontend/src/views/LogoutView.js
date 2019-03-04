import React from "react";
import { Redirect } from "react-router-dom";
import type SessionContext from "../models/SessionContext"

export default function LogoutView(props: {session_context: SessionContext}) {

    props.session_context.removeSessionInfo();

    //removeSessionInfo();

    //return null;
    return (
        <Redirect to="/user/login" />
    );

}
