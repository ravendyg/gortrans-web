/// <reference path="../typings/index.d.ts" />
'use strict';

export enum Actions
{
  ADD_BUS_TO_LIST = 1,
  REMOVE_BUS_FROM_LIST = 2,

  UPDATE_BUS_DATA = 3,



  CONNECTED = 4,
  DISCONNECTED = 5,

  UPDATE_VEHICLES = 7,

};

export const ActionCreators =
{

  loadData: () =>
  {
    return {
      type: Actions.UPDATE_BUS_DATA,
      payload: true
    };
  },

  addBusToList: (bus: VehicleMeta, zoom: boolean) =>
  {
    return {
      type: Actions.ADD_BUS_TO_LIST,
      payload: { bus, zoom }
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
      type: Actions.UPDATE_VEHICLES,
      payload: { state }
    }
  },


};