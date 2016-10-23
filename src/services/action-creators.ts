/// <reference path="../typings/index.d.ts" />
'use strict';

export enum Actions
{
  ADD_BUS_TO_LIST = 1,
  REMOVE_BUS_FROM_LIST = 2,

  UPDATE_BUS_DATA = 3,

  CONNECTED = 4,
  DISCONNECTED = 5,

  LOAD_LIST_OF_ROUTES = 6,
  LOAD_LIST_OF_TRASSES = 8,
  LOAD_LIST_OF_STOPS = 9,

  UPDATE_STATE = 7,

};

export const ActionCreators =
{
  loadListOfRoutes: (routes: ListMarsh []) =>
  {
    return {
      type: Actions.LOAD_LIST_OF_ROUTES,
      payload: { routes }
    };
  },

  loadListOfTrasses: (trasses: {[busCode: string]: string}) =>
  {
    return {
      type: Actions.LOAD_LIST_OF_TRASSES,
      payload: { trasses }
    };
  },

  loadListOfStops:
  (
    {stops, busStops}:
    { stops: { [stopId: string]: Stop }, busStops: BusStops}
  ) =>
  {
    return {
      type: Actions.LOAD_LIST_OF_STOPS,
      payload: { stops, busStops }
    }
  },

  addBusToList: (bus: VehicleMeta) =>
  {
    return {
      type: Actions.ADD_BUS_TO_LIST,
      payload: { bus }
    }
  },

  removeBusFromList: (bus: VehicleMeta) =>
  {
    return {
      type: Actions.REMOVE_BUS_FROM_LIST,
      payload: { bus }
    }
  },

  updateState: (state: StateWithMarkers) =>
  {
    return {
      type: Actions.UPDATE_STATE,
      payload: { state }
    }
  }
};