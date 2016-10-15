/// <reference path="./typings/index.d.ts" />
'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

import { config } from './config';

import {BusSelector} from './components/bus-selector';

import {Map} from './services/map';
import {Socket} from './services/data-provider';

import {ActionCreators} from './services/action-creators';
import {Store} from './services/store';

import * as request from 'superagent';

require('./app.less');

Socket.connect();
Map.create();

let listOfRouteCodesTimestamp;
try
{
  listOfRouteCodesTimestamp = JSON.parse( localStorage.getItem('list-of-route-codes-timestamp') ) || 0;
}
catch (err)
{
  console.error(err);
  listOfRouteCodesTimestamp = 0;
}

request
.get(`${config.URL}${config.GET_LIST_OF_ROUTE_CODES}?timestamp=${listOfRouteCodesTimestamp}`)
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
        if ( res.body.data.routeCodes.length > 0 )
        {
          localStorage.setItem('list-of-route-codes', JSON.stringify(res.body.data.routeCodes));
          localStorage.setItem('list-of-route-codes-timestamp', JSON.stringify(res.body.data.timestamp));
        }
        else
        {
          res.body.data.routeCodes = JSON.parse( localStorage.getItem('list-of-route-codes') || '[]');
        }
        Store.dispatch( ActionCreators.loadListOfRouteCodes(res.body.data.routeCodes) );
      }
      catch (err)
      {
        console.error(err);
      }
    }
  }
);

Store.subscribe(
  () =>
  {
    console.log(

    (Store.getState() as ReduxState).dataStorage
    );
  }
);

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