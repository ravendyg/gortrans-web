/// <reference path="../typings/index.d.ts" />
'use strict';

import { config } from '../config';
import { Socket } from './data-provider';
import { ActionCreators } from './action-creators';
import { Store } from './store';

import {Map} from './map';

export function addBus(bus: VehicleMeta)
{
  var currentBusList: VehicleMeta [] = (Store.getState() as ReduxState).busList;
  if ( !currentBusList['find'](e => e.code === bus.code) )
  { // not yet there
    Store.dispatch( ActionCreators.addBusToList(bus) );
    Socket.addBusListener(bus.code);
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