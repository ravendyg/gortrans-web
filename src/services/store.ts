/// <reference path="../typings/index.d.ts" />
'use strict';

import {combineReducers, createStore} from 'redux';
import {config} from '../config';
import {Actions} from './action-creators';

const busList =
(state: string [] = [], action: ActionType) =>
{
  switch( action.type )
  {
    case Actions.ADD_BUS_TO_LIST:
      let temp =
        state.length >= config.NUMBER_OF_BUSES_LIMIT
          ? state.slice(1)
          : state
          ;
      return state.concat( action.payload.bus );

    case Actions.REMOVE_BUS_FROM_LIST:
      let index = state.indexOf( action.payload.bus );
      return index !== -1
        ? state.slice(0, index).concat( state.slice(index+1) )
        : state
        ;

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
   typeNames:
   {
     'bus':     {id: 0, name: 'Автобусы'},
     'trolley': {id: 1, name: 'Троллейбусы'},
     'tram':    {id: 2, name: 'Трамваи'},
     'small':   {id: 7, name: 'Маршрутки'}
   }
  },
  action: ActionType
) =>
{
  switch( action.type )
  {
    case Actions.LOAD_LIST_OF_ROUTES:
      var out: dataStorageStore = { routes: {}, typeNames: state.typeNames };

      // create lists
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'bus', 0);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'trolley', 1);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'tram', 2);
      out = mapVehiclesIntoCodes(action.payload.routes, out, 'small', 7);

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

