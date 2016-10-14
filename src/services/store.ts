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
(state: ListMarsh [] = [], action: ActionType ) =>
{
  switch( action.type )
  {
    case Actions.LOAD_LIST_OF_ROUTES:
      return action.payload.routes;
    default:
      return state;
  }
};



const app =
combineReducers({
  busList, connection, dataStorage
});

export const Store = createStore(app);

