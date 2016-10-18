/// <reference path="../typings/index.d.ts" />

'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import { config } from './config';

import { BusSelector } from './components/bus-selector/bus-selector';
import { BusList } from './components/bus-list/bus-list';
import { SearchBtn } from './components/search-btn';

import {Map} from './services/map';
import {Socket} from './services/data-provider';

import {ActionCreators} from './services/action-creators';
import {Store} from './services/store';

import * as request from 'superagent';

require('./app.less');

Socket.connect();
Map.create();

let listOfRoutesTimestamp;
try
{
  listOfRoutesTimestamp = JSON.parse( localStorage.getItem('list-of-routes-timestamp') ) || 0;
}
catch (err)
{
  console.error(err);
  listOfRoutesTimestamp = 0;
}

request
.get(`${config.URL}${config.GET_LIST_OF_ROUTES}?timestamp=${listOfRoutesTimestamp}`)
.end(
  (err: Error, res: request.Response) =>
  {
    if ( err )
    {
      console.error(err);
    }
    else
    {
      try
      {
        if ( res.body.data.routes.length > 0 )
        {
          localStorage.setItem('list-of-routes', JSON.stringify(res.body.data.routes));
          localStorage.setItem('list-of-routes-timestamp', JSON.stringify(res.body.data.timestamp));
        }
        else
        {
          res.body.data.routes = JSON.parse( localStorage.getItem('list-of-routes') || '[]');
        }
        Store.dispatch( ActionCreators.loadListOfRoutes(res.body.data.routes) );
      }
      catch (err)
      {
        console.error(err);
      }
    }
  }
);


var appWrapperStyle =
{
  position: 'relative',
  height: 0,
  width: 0
};

class App extends React.Component <AppState, AppProps>
{
  constructor () { super(); }

  render () {
    return (
    <div style={appWrapperStyle}>
      <BusList/>
      <SearchBtn/>
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
    <Router history={browserHistory} routes={routes} />,
    document.getElementById(`root`)
);