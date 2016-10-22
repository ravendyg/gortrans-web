/// <reference path="../typings/index.d.ts" />
'use strict';

import {combineReducers, createStore} from 'redux';
import {config} from '../config';
import {Actions} from './action-creators';

const allColors =
[
  '#B71C1C', '#039BE5', '#311B92', '#004D40', '#827717'
];

var availableColors = [];
for ( let color of allColors )
{
  availableColors.push( color );
}

const busList =
(state: VehicleMeta [] = [], action: ActionType) =>
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

const connection =
(state: boolean = false, action: ActionType) =>
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

const dataStorage =
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
   vehicles: {}
  },
  action: ActionType
) =>
{
  switch( action.type )
  {
    case Actions.LOAD_LIST_OF_ROUTES:
      var out: dataStorageStore =
      {
        routes: {},
        trasses: state.trasses,
        typeNames: state.typeNames,
        vehicles: {}
      };

      // create lists
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'bus', 0);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'trolley', 1);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'tram', 2);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'small', 7);

    return out;

    case Actions.LOAD_LIST_OF_TRASSES:
      var out: dataStorageStore =
      {
        routes: state.routes,
        trasses: {},
        typeNames: state.typeNames,
        vehicles: state.vehicles
      };

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
      var out: dataStorageStore =
      {
        routes: state.routes,
        trasses: state.trasses,
        typeNames: state.typeNames,
        vehicles: action.payload.state
       };

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



const app =
combineReducers({
  busList, connection, dataStorage
});

export const Store = createStore(app);

