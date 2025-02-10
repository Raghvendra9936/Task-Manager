"use strict"

// Import React Components
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

// Import React-Router

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Import Redux Components
import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// Import reducer
import {eventReducer} from './reducers/eventReducer';

const middleware = applyMiddleware(thunk, logger);
const store = createStore(eventReducer, middleware);

// Import Components
import Main from './main';
import EventList from './components/pages/eventList';

//Routing through React
const Routes = (
    <Provider store = {store}>
    <Router>
    <Switch>
    {/* <Route path="/login" render={() => <Login />} /> */}
        <Route path = "/" render = { () => (<Main>
            <EventList />
            </Main>
            )} />
        </Switch>
    </Router>
    </Provider>
)


render(
    Routes, document.getElementById('app')
)