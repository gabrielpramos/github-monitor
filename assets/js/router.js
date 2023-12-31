import React, { createContext } from 'react';
import {
    Link, BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import CommitListContainer from './containers/CommitListContainer';
import RepoCreateContainer from './containers/RepoCreateContainer';

export const AppContext = createContext({});

const RouterComponent = () => {
    const { csrftoken, username } = document.getElementById('main').dataset;
    const personalToken = JSON.parse(document.getElementById('context-data').textContent).personalToken;

    return (
        <AppContext.Provider value={{ username, csrftoken, personalToken }}>
            <Router>
                <div id="wrapper" className="toggled">

                    <div id="sidebar-wrapper">
                        <ul className="sidebar-nav">
                            <li className="sidebar-brand">
                                <Link to="/">
                                    Github Monitor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <RepoCreateContainer />
                            <Switch>
                                <Route path="/" exact component={CommitListContainer} />
                            </Switch>
                        </div>
                    </div>

                </div>
            </Router>
        </AppContext.Provider>
    )
};

export default RouterComponent;