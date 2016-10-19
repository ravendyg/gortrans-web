/// <reference path="../typings/index.d.ts" />
'use strict';

import {combineReducers, createStore} from 'redux';
import {config} from '../config';
import {Actions} from './action-creators';

const busList =
(state: VehicleMeta [] = [], action: ActionType) =>
{
  switch( action.type )
  {
    case Actions.ADD_BUS_TO_LIST:
      let temp =
        state.length >= config.NUMBER_OF_BUSES_LIMIT
          ? state.slice(1)
          : state
          ;
      return temp.concat( action.payload.bus );

    case Actions.REMOVE_BUS_FROM_LIST:
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
  var list: ListMarsh = data['find']( e => e.type === type);
  target.routes[vehicle] = [];
  for ( let way of list.ways )
  {
    target.routes[vehicle].push({
      code: [type+1, way.marsh, 'W', way.name].join('-'),
      title: way.name
    });
  }

  return target;
}



const app =
combineReducers({
  busList, connection, dataStorage
});

export const Store = createStore(app);

