/// <reference path="../typings/index.d.ts" />
'use strict';

import {combineReducers, createStore} from 'redux';
import {config} from '../config';
import {Actions} from './action-creators';

const app =
combineReducers({
  busList, connection, dataStorage, stopList
});

export const Store = createStore(app);



const allColors =
[
  '#B71C1C', '#039BE5', '#311B92', '#004D40', '#827717'
];

var availableColors = [];
for ( let color of allColors )
{
  availableColors.push( color );
}

function stopList(state: {[stopId: string]: Stop} = {}, action: ActionType)
{
  switch ( action.type )
  {
    case Actions.RELOAD_STOPS:
      var out = {};
      var buses = (Store.getState() as ReduxState).busList;
      var busStops = (Store.getState() as ReduxState).dataStorage.busStops;
      var stops = (Store.getState() as ReduxState).dataStorage.stops;
      var currentBusStops, bus, stopId;
      for ( bus of buses )
      {
        currentBusStops = busStops[bus.code];
        for (stopId of Object.keys(currentBusStops) )
        {
          if ( !out[stopId] )
          {
            out[stopId] = stops[stopId];
          }
        }
      }
    return out;

    default:
    return state;
  }
}

function busList(state: VehicleMeta [] = [], action: ActionType)
{
  var newState = [];
  var color;
  var i;

  switch( action.type )
  {
    case Actions.ADD_BUS_TO_LIST:
      if ( state.length >= config.NUMBER_OF_BUSES_LIMIT )
      { // unshift and reuse color
        color = state[0].color;
        newState = state.slice(1);
      }
      else
      {
        // select color
        for ( color of allColors )
        {
          i = availableColors.indexOf(color);
          if ( i !== -1 )
          {
            availableColors = availableColors.slice(0,i).concat( availableColors.slice(i+1) );
            break;
          }
        }
        newState = state.slice(0);
      }
      newState.push( Object['assign']({}, action.payload.bus, {color}) );
    return newState;

    case Actions.REMOVE_BUS_FROM_LIST:
      color = state['find']( e => e.code === action.payload.bus.code ).color;
      availableColors.push( color );
    return state.filter( e => e.code !== action.payload.bus.code );

    default:
      return state;
  }
};

function connection(state: boolean = false, action: ActionType)
{
  switch( action.type )
  {
    case Actions.CONNECTED:
      return true;
    case Actions.DISCONNECTED:
      return false;
    default:
      return state;
  }
};

function dataStorage
( state: dataStorageStore =
 {
   routes: {},
   trasses: {},
   typeNames:
   {
     'bus':     {id: 0, name: 'Автобусы'},
     'trolley': {id: 1, name: 'Троллейбусы'},
     'tram':    {id: 2, name: 'Трамваи'},
     'small':   {id: 7, name: 'Маршрутки'}
   },
   vehicles: {},
   stops: {},
   busStops: {}
  },
  action: ActionType
)
{
  var out: dataStorageStore = <dataStorageStore>{};
  Object['assign'](out, state);

  switch( action.type )
  {
    case Actions.LOAD_LIST_OF_ROUTES:
      Object['assign'](out, {routes: {}} );
      // create lists
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'bus', 0);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'trolley', 1);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'tram', 2);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'small', 7);
    return out;

    case Actions.LOAD_LIST_OF_TRASSES:
      Object['assign'](out, {trasses: {}} );

      for ( var busCode of Object.keys(action.payload.trasses) )
      {
        try
        {
          out.trasses[busCode] = JSON.parse( action.payload.trasses[busCode] ).trasses[0].r[0].u;
        }
        catch (err)
        {
          console.error(err, 'parsing trass');
          out.trasses[busCode] = [];
        }
      }
    return out;

    case Actions.UPDATE_STATE:
      Object['assign'](out, {vehicles: action.payload.state} );
    return out;

    case Actions.LOAD_LIST_OF_STOPS:
      Object['assign'](out, {stops: action.payload.stops, busStops: action.payload.busStops} );
    return out;

    default:
    return state;
  }
};

function mapVehiclesIntoCodes(
  data: ListMarsh [],
  target: dataStorageStore,
  vehicle: string,
  type: number
): dataStorageStore
{
  var list: ListMarsh = data['find']( e => e.type === type) || { ways: [] };
  target.routes[vehicle] = [];
  for ( let way of list.ways )
  {
    target.routes[vehicle].push({
      code: [type+1, way.marsh, 'W', way.name].join('-'),
      title: way.name,
      color: 'black'
    });
  }

  return target;
}



