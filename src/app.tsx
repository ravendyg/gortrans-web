'use strict';

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import * as bb from 'bluebird';

import { config } from './config';

import { BusSelector } from './components/bus-selector/bus-selector';
import { BusList } from './components/bus-list/bus-list';
import { SearchBtn } from './components/btns/search-btn';
import { LocationBtn } from './components/btns/location-btn';
import { ZoomBtn } from './components/btns/zoom-btn';
import { ShareGroup } from './components/share-group/share-group';

import {Map} from './services/map';
import {Socket} from './services/data-provider';

import {ActionCreators} from './services/action-creators';
import { Store, loadInfoToStore } from './services/store';
import * as UserActions from './services/user-actions';

import * as request from 'superagent';
import * as localForage from 'localforage';

require('./app.less');
require('./components/btns/btns.less');


var key = localStorage.getItem('nskgortrans-api-key');
if (!key)
{
  key = Math.random().toString().slice(2);
  localStorage.setItem('nskgortrans-api-key', key);
}


Socket.connect(key);
Map.create();

bb.all([
  localForage.getItem('gortrans-info'),
  localForage.getItem('gortrans-info-trasses')
])
.then(
([data, trasses]: any []): void =>
  {
    if (data.stopsData && !data.stopsData.timestamp)
    {
      data.stopsData.timestamp = 0;
    }
    if (data.routes && !data.routes.timestamp)
    {
      data.routes.timestamp = 0;
    }
    makeRequestForBasicData(
      data.routes || {routes: [], routeCodes: [], timestamp: 0},
      trasses || {},
      data.stopsData || {stops: {}, busStops: {}, timestamp: 0 }
    );
  }
)
.catch(
  (err: Error) =>
  {
    console.error(err, 'get timestamp from localForage');
    makeRequestForBasicData(
      {routes: [], routeCodes: [], timestamp: 0},
      {},
      {stops: {}, busStops: {}, timestamp: 0}
    );
  }
);

function makeRequestForBasicData(
  routes: { routes: ListMarsh [], routeCodes: string [], timestamp: number },
  trasses: { [busCode: string]: {data: Point [], tsp: number}},
  stopsData: { stops: { [stopId: string]: Stop }, busStops: BusStops, timestamp: number }
)
{
  request
  .get(`${location.href}${config.SYNC_ROUTE}?routestimestamp=${routes.timestamp}&stopstimestamp=${stopsData.timestamp}&api_key=${key}`)
  .end(
    (err: Error, res: request.Response) =>
    {
      if ( err )
      {
        console.error(err);
      }
      else
      {
        var updated = false;

        if ( res.body.routes.timestamp > routes.timestamp )
        { // if not, don't need to update - it's the same
          updated = true;
        }
        else
        {
          res.body.routes = routes;
        }

        if ( res.body.stopsData.timestamp > stopsData.timestamp )
        { // if not, don't need to update - it's the same
          updated = true;
        }
        else
        {
          res.body.stopsData = stopsData;
        }

        if (updated)
        {
          localForage.setItem('gortrans-info', res.body);
        }

        loadInfoToStore({
          routes: res.body.routes.routes,
          routeCodes: res.body.routes.routeCodes,
          trasses: trasses,
          stops: res.body.stopsData.stops,
          busStops: res.body.stopsData.busStops,
        });

        Store.dispatch( ActionCreators.loadData() );


        // show buses from the previous visit
        var buses: VehicleMeta [];
        try
        {
          buses = JSON.parse( localStorage.getItem('bus-list') );
          for (var _bus of buses)
          {
            UserActions.addBus(_bus, false);
          }
        }
        catch (err) {}
      }
    }
  );
}


var appWrapperStyle =
{
  position: 'absolute',
  height: '100vh',
  width: '100vw'
};

interface AppState
{
  locationAvailable: boolean
}
interface AppProps
{}

class App extends React.Component <AppProps, AppState>
{
  private _itemsLoaded: boolean;

  constructor()
  {
    super();

    this.state =
    {
      locationAvailable: false
    };

    this._itemsLoaded = false;

    Map.subscribeForCoordsAvailable(
      (available: boolean) =>
      {
        if (available)
        {
          this.setState({
            locationAvailable: true
          });
        }
      }
    );
  }

  public componentDidMount()
  {
    if ( (Store.getState() as ReduxState).dataLoaded )
    {
      this._itemsLoaded = true;
    }
    else
    {
      var _unsubscribeFromBusList =
      Store.subscribe(
        () =>
        {
          if ( (Store.getState() as ReduxState).dataLoaded )
          {
            this._itemsLoaded = true;
            _unsubscribeFromBusList();
            this.setState(this.state);
          }
        }
      );
    }
  }

  render()
  {
    var location =
      this.state.locationAvailable
        ? <LocationBtn move={Map.zoomToUser.bind(Map)}/>
        : ''
        ;

    var searchBtn = this._itemsLoaded ? <SearchBtn/> : '';

    return (
    <div style={appWrapperStyle}>
      <BusList/>
      {searchBtn}
      {location}
      <ZoomBtn icon="plus"  zoom={Map.zoomIn.bind(Map)}/>
      <ZoomBtn icon="minus" zoom={Map.zoomOut.bind(Map)}/>
      <ShareGroup/>
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