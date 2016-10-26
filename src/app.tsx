/// <reference path="../typings/index.d.ts" />

'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import { config } from './config';

import { BusSelector } from './components/bus-selector/bus-selector';
import { BusList } from './components/bus-list/bus-list';
import { SearchBtn } from './components/btns/search-btn';

import {Map} from './services/map';
import {Socket} from './services/data-provider';

import {ActionCreators} from './services/action-creators';
import {Store} from './services/store';

import * as request from 'superagent';
import * as localForage from 'localforage';

require('./app.less');

Socket.connect();
Map.create();

Promise.all([
  localForage.getItem('list-of-routes'),
  localForage.getItem('list-of-trasses'),
  localForage.getItem('list-of-stops')
])
.then(
  ([routes, trasses, stopsData]: any []) =>
  {
    makeRequestForBasicData(
      routes || {routes: [], timestamp: 0},
      trasses || {trasses: {}, timestamp: 0},
      stopsData || {stops: {}, busStops: {}, timestamp: 0 }
    );
  }
)
.catch(
  (err: Error) =>
  {
    console.error(err, 'get timestamp from localForage');
    makeRequestForBasicData(
      {routes: [], timestamp: 0},
      {trasses: {}, timestamp: 0},
      {stops: {}, busStops: {}, timestamp: 0}
    );
  }
);

function makeRequestForBasicData(
  routes: { routes: ListMarsh [], timestamp: number },
  trasses: { trasses: { [busCode: string]: string }, timestamp: number },
  stopsData: { stops: { [stopId: string]: Stop }, busStops: BusStops, timestamp: number }
)
{
  request
  .get(`${config.URL}${config.SYNC_ROUTE}?routestimestamp=${routes.timestamp}&trassestimestamp=${trasses.timestamp}`)
  .end(
    (err: Error, res: request.Response) =>
    {
      if ( err )
      {
        console.error(err);
      }
      else
      {
        if ( res.body.routes.timestamp > routes.timestamp )
        { // if not, don't need to update - it's the same
          localForage.setItem('list-of-routes', res.body.routes);
          Store.dispatch( ActionCreators.loadListOfRoutes(res.body.routes.routes) );
        }
        else
        {
          Store.dispatch( ActionCreators.loadListOfRoutes(routes.routes) );
        }

        if ( res.body.trasses.timestamp > trasses.timestamp )
        { // if not, don't need to update - it's the same
          Object['assign']( trasses.trasses, res.body.trasses.trasses );
          trasses.timestamp = res.body.trasses.timestamp;

          localForage.setItem('list-of-trasses', trasses);
          Store.dispatch( ActionCreators.loadListOfTrasses(trasses.trasses) );
        }
        else
        {
          Store.dispatch( ActionCreators.loadListOfTrasses(trasses.trasses) );
        }

        if ( res.body.stopsData.timestamp > stopsData.timestamp )
        { // if not, don't need to update - it's the same
          localForage.setItem('list-of-stops', res.body.stopsData);
          Store.dispatch( ActionCreators.loadListOfStops(res.body.stopsData) );
        }
        else
        {
          Store.dispatch( ActionCreators.loadListOfStops(res.body.stopsData) );
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