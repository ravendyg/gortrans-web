/// <reference path="../typings/index.d.ts" />
'use strict';

import {combineReducers, createStore} from 'redux';
import {config} from '../config';
import {Actions} from './action-creators';
import * as localForage from 'localforage';

const app =
  combineReducers({
    busList, connection, dataLoaded, vehicles //dataStorage
  });

export const Store = createStore(app);


var info: Info =
{
  routes: {},
  typeNames:
   {
     'bus':     {id: 0, name: 'Автобусы'},
     'trolley': {id: 1, name: 'Троллейбусы'},
     'tram':    {id: 2, name: 'Трамваи'},
     'small':   {id: 7, name: 'Маршрутки'}
   },
  routeCodes: [],
  trasses: {},
  stops: {},
  busStops: {}
};

export function loadInfoToStore(rawInfo: RawInfo): void
{
  let temp = { routes: {} };
  temp = mapVehiclesIntoCodes(rawInfo.routes, temp, 'bus', 0);
  temp = mapVehiclesIntoCodes(rawInfo.routes, temp, 'trolley', 1);
  temp = mapVehiclesIntoCodes(rawInfo.routes, temp, 'tram', 2);
  temp = mapVehiclesIntoCodes(rawInfo.routes, temp, 'small', 7);

  info.routes = temp.routes;
  info.routeCodes = rawInfo.routeCodes;
  info.trasses = rawInfo.trasses;
  info.stops = rawInfo.stops;
  info.busStops = rawInfo.busStops;
};

export function getInfo(): Info
{
  return info;
}



const allColors =
[
  '#B71C1C', '#039BE5', '#311B92', '#004D40', '#827717'
];

var availableColors = [];
for ( let color of allColors )
{
  availableColors.push( color );
}

/**
 * select stops for given buses
 */
function getStopList(buses: VehicleMeta [])
{
    var out = {};
    var busStops = info.busStops;
    var stops = info.stops;
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
}

/**
 * select trasses for given buses
 */
function getTrassList(buses: VehicleMeta [])
{
  var out = {};
  for (var bus of buses)
  {
    out[bus.code] = info.trasses[bus.code] || {data: [], tsp: 0};
  }
  return out;
}

function busList(
  state: busList = {buses: [], stopsList: {}, trasses: {}, zoom: false},
  action: ActionType)
{
  var newState: busList = {buses: [], stopsList: {}, trasses: {}, zoom: false};
  var color;
  var i;

  switch( action.type )
  {
    case Actions.ADD_BUS_TO_LIST:
      if ( state.buses.length >= config.NUMBER_OF_BUSES_LIMIT )
      { // unshift and reuse color
        color = state[0].color;
        newState.buses = state.buses.slice(1);
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
        newState.buses = state.buses.slice(0);
      }
      newState.buses.push( Object['assign']({}, action.payload.bus, {color}) );
      newState.stopsList = getStopList(newState.buses);
      newState.trasses = getTrassList(newState.buses);
      newState.zoom = action.payload.zoom;
      localStorage.setItem('bus-list', JSON.stringify(newState.buses));
    return newState;

    case Actions.REMOVE_BUS_FROM_LIST:
      color = state.buses.find( e => e.code === action.payload.bus.code ).color;
      availableColors.push( color );
      newState.buses = state.buses.filter( e => e.code !== action.payload.bus.code );
      newState.stopsList = getStopList(newState.buses);
      newState.trasses = getTrassList(newState.buses);
      localStorage.setItem('bus-list', JSON.stringify(newState.buses));
    return newState;

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

function dataLoaded(state: boolean = false, action: ActionType)
{
  switch( action.type )
  {
    case Actions.UPDATE_BUS_DATA:
      return true;
    default:
      return state;
  }
}

function vehicles(state: {} = {}, action: ActionType)
{
  switch( action.type )
  {
    case Actions.UPDATE_VEHICLES:
    return action.payload.state;

    default:
    return state;
  }
}
function mapVehiclesIntoCodes(
  data: ListMarsh [],
  target:
  {
    routes:
    {
      [type: string]: VehicleMeta []
    }
  },
  vehicle: string,
  type: number
):{
    routes:
    {
      [type: string]: VehicleMeta []
    }
  }
{
  var list: ListMarsh = data.find( e => +e.type === type);
  target.routes[vehicle] = [];
  if (list)
  {
    for ( let way of list.ways )
    {
      target.routes[vehicle].push({
        code: [type+1, way.marsh, 'W', way.name].join('-'),
        title: way.name,
        color: 'black'
      });
    }
  }

  return target;
}

export function updateTrass(busCode: string, trassPoints: Point [])
{
  info.trasses[busCode] =
  {
    data: trassPoints,
    tsp: Date.now() - 1000 * 60 * 5
  };
  localForage.setItem('gortrans-info-trasses', info.trasses);
}

