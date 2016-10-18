/// <reference path="../typings/index.d.ts" />
'use strict';

import { Socket } from './data-provider';
import { ActionCreators } from './action-creators';
import { Store } from './store';

import {Map} from './map';

export function addBus(bus: VehicleMeta)
{
  Store.dispatch( ActionCreators.addBusToList(bus) );
  Socket.addBusListener(bus.code);
};

export function removeBus(bus: VehicleMeta)
{
  Store.dispatch( ActionCreators.removeBusFromList(bus) );
  Socket.removeBusListener(bus.code);
  Map.removeVehicle(bus.code);
};