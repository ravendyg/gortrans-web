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
import * as localForage from 'localforage';

require('./app.less');

Socket.connect();
Map.create();

localForage.getItem('list-of-routes-timestamp')
.then(
  (listOfRoutesTimestamp: number) =>
  {
    makeRequestForBasicData(listOfRoutesTimestamp || 0);
  }
)
.catch(
  (err: Error) =>
  {
    console.error(err, 'get timestamp from localForage');
    makeRequestForBasicData(0);
  }
);

function makeRequestForBasicData(listOfRoutesTimestamp: number)
{
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
        if ( res.body.data.routes.length > 0 )
        {
          if ( res.body.data.timestamp > listOfRoutesTimestamp )
          { // if not, don't need to update - it's the same
            localForage.setItem('list-of-routes', res.body.data.routes);
            localForage.setItem('list-of-routes-timestamp', res.body.data.timestamp);
          }
          Store.dispatch( ActionCreators.loadListOfRoutes(res.body.data.routes) );
        }
        else
        {
          localForage.getItem('list-of-routes')
          .then(
            (routes: ListMarsh []) =>
            {
              Store.dispatch( ActionCreators.loadListOfRoutes(routes || []) );
            }
          )
          .catch(
            (err: Error) =>
            {
              console.error(err, 'reading list of routes from localForage');
              Store.dispatch( ActionCreators.loadListOfRoutes([]) );
            }
          );
        }
      }
    }
  );
}


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