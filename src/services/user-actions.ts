/// <reference path="../typings/index.d.ts" />
'use strict';

import { config } from '../config';
import { Socket } from './data-provider';
import { ActionCreators } from './action-creators';
import { Store, getInfo } from './store';

import {Map} from './map';

export function addBus(bus: VehicleMeta, zoom: boolean)
{
  var busList = (Store.getState() as ReduxState).busList;
  var currentBusList: VehicleMeta [] = busList.buses;
  if ( !currentBusList['find'](e => e.code === bus.code) )
  { // not yet there
    Store.dispatch( ActionCreators.addBusToList(bus, zoom) );
    Socket.addBusListener(bus.code, (getInfo().trasses[bus.code] || {tsp: 0}).tsp);
    if ( currentBusList.length >= config.NUMBER_OF_BUSES_LIMIT )
    { // limit number of routes on the map at the same time
      Socket.removeBusListener( currentBusList[0].code );
      Map.removeVehicle( currentBusList[0].code );
    }
  }
  else
  {
    Map.zoomToBusRote(bus.code);
  }
};

export function removeBus(bus: VehicleMeta)
{
  Store.dispatch( ActionCreators.removeBusFromList(bus) );
  Socket.removeBusListener(bus.code);
  Map.removeVehicle(bus.code);
};