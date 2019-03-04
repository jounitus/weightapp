// @flow

import React from "react";
import { NavLink } from "react-router-dom";
import type { SessionContext } from "../models/SessionContext"
import "./NavBar.css"

export default function NavBar(props: {session_context: SessionContext}) {

    return (
        <div className="navBar">

            {(props.session_context.user && props.session_context.user.username ) ? (

            <ul>
                <li>{ props.session_context.user.username }</li>
                <li><NavLink to="/entry">Main Page</NavLink></li>
                <li><NavLink to="/user/properties">Properties</NavLink></li>
                <li><NavLink to="/user/logout">Logout</NavLink></li>
            </ul>

        ) : (

            <ul>
                <li><NavLink to="/user/login">Login</NavLink></li>
                <li><NavLink to="/user/create">Create Account</NavLink></li>
            </ul>


        )}

        </div>

    );
}
