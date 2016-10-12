/// <reference path="./typings/index.d.ts" />
'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

import {BusSelector} from './components/bus-selector';

import {map} from './services/map';

require('./app.less');

map.create();

class App extends React.Component <AppState, AppProps>
{
  constructor () { super(); }

  render () {
    return (
    <div>
      <Link to={'/select-bus'}>forward</Link>
      {this.props.children}
    </div>
    )
  }
}

const routes =
{
  path: '/', component: App,
  childRoutes: [
    { path: 'select-bus', component: BusSelector },
    // { path: 'loggedin/all-photos', component: AllPhotos, data: 1, onEnter: redir },
    // { path: 'loggedin/my-photos', component: MyPhotos, onEnter: redir },
    // { path: 'loggedin/user-data', component: UserData, onEnter: redir },
    // { path: '*', onEnter: (nextState, replace) => {
    //             replace('/');
    //         }
    // },
  ]
}

render(
    <Router history={hashHistory} routes={routes} />,
    document.getElementById(`root`)
);