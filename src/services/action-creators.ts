/// <reference path="../typings/index.d.ts" />
'use strict';

export enum Actions
{
  ADD_BUS_TO_LIST = 1,
  REMOVE_BUS_FROM_LIST = 2,

  UPDATE_BUS_DATA = 3,

  CONNECTED = 4,
  DISCONNECTED = 5,

  LOAD_LIST_OF_ROUTE_CODES = 6
};

export const ActionCreators =
{
  loadListOfRouteCodes: (routeCodes: string []) =>
  {
    return {
      type: Actions.LOAD_LIST_OF_ROUTE_CODES,
      payload:
      {
        routeCodes
      }
    };
  }
};