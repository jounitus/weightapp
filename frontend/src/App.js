// @flow

import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";

import './App.css';

import { getUser } from './Api'
import { setSessionInfo, getSessionInfo, removeSessionInfo as removeSessionInfoFunc } from './SessionManager'

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import NavBar from './components/NavBar';

import CreateUserView from './views/CreateUserView';
import LoginView from './views/LoginView';
import LogoutView from './views/LogoutView';
import UserPropertiesView from './views/UserPropertiesView';
import EntryListView from './views/EntryListView';
import EntryCreateView from './views/EntryCreateView';
import EntryEditView from './views/EntryEditView';

import type { SessionContext } from './models/SessionContext'
import type { SessionInfo } from './models/SessionInfo'
import type { User } from './models/User'
import type {ErrorResponse} from "./models/ErrorResponse";

type AppProps = {

};

type AppState = {
    redirect: ?Redirect
} & SessionContext;


class App extends Component<AppProps, AppState> {

    constructor(props: AppProps) {

        super(props);

        const sessionInfo:(SessionInfo | null) = getSessionInfo();

        this.state = {
            user_id: (sessionInfo) && sessionInfo.user_id,
            session_token: (sessionInfo) && sessionInfo.session_token,
            user: null,

            updateSessionInfo: this.updateSessionInfo.bind(this),
            removeSessionInfo: this.removeSessionInfo.bind(this),
            reloadUser: this.reloadUser.bind(this),

            redirect: null

        };

    }

    componentDidMount() {
        this.reloadUser();
    }

    updateSessionInfo(session_info: SessionInfo): void {

        console.info("App.updateSessionInfo", session_info);

        setSessionInfo(session_info);

        this.setState({
            user_id: session_info.user_id,
            session_token: session_info.session_token,
            user: null
        }, () => {console.info("callback called"); this.reloadUser(); });

        console.info("App.updateSessionInfo - finished");

    }

    removeSessionInfo(): void {

        console.info("App.removeSessionInfo");

        removeSessionInfoFunc();

        this.setState({
            user_id: null,
            session_token: null,
            user: null
        });

        console.info("App.removeSessionInfo - finished");

    }

    reloadUser(): void {

        if(!this.state.user_id || !this.state.session_token)
        {
            return;
        }

        this.setState({
            user: null,
        });

        getUser(this.state.user_id, this.state.session_token).then((resp: User) => {

            const newState = {
                user: resp
            };

            this.setState(newState);

        }).catch((error: ErrorResponse) => {

            if(error.code === 101) { // invalid token

                this.removeSessionInfo();

                this.setState({
                    redirect: <Redirect to="/user/login"/>
                });

            }

        });

    }


    render() {

        const EntryRoute = (props) => (

            <div>

                <Switch>
                    <PrivateRoute path="/entry" exact component={EntryListView} session_context={this.state} />
                    <PrivateRoute path="/entry/create" component={EntryCreateView} session_context={this.state} />
                    <PrivateRoute path="/entry/edit/:entry_id" component={EntryEditView} session_context={this.state} />
                </Switch>

            </div>

        );

        return (
            <div className="App">
                <Router>
                    <div>

                        {(this.state.redirect) && this.state.redirect }

                        <NavBar session_context={this.state} />

                        <Switch>

                            <Redirect from="/" to="/entry" exact />

                            <PrivateRoute path="/entry" component={EntryRoute} session_context={this.state} />

                            <PublicRoute path="/user/create" component={CreateUserView} session_context={this.state} />
                            <PublicRoute path="/user/login" component={LoginView} session_context={this.state} />
                            <PublicRoute path="/user/logout" component={LogoutView}  session_context={this.state} />
                            <PrivateRoute path="/user/properties" component={UserPropertiesView} session_context={this.state} />

                        </Switch>

                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
