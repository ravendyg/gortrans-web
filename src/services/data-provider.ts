/// <reference path="../typings/index.d.ts" />
'use strict';

import * as io from 'socket.io-client';

import {config} from '../config';

import {Map} from './map';

import {Store} from './store';

var socket: SocketIOClient.Socket;

function _Socket()
{
};

_Socket.prototype.connect =
function connect(key: string)
{
  socket = io.connect(location.href, {query: `apiKey=${key}`});

  socket.on(
    'connect',
    () =>
    {
      var listOfSelectedVehicles = (Store.getState() as ReduxState).busList.buses;

      for ( var vehicle of listOfSelectedVehicles)
      {
        this.addBusListener(vehicle.code, false);
      }
    }
  );

  socket.on(
    'disconnect',
    () =>
    {
      Map.cleanBusMarkers();
    }
  );

  socket.on(
    'error',
    err =>
    {
      console.error( err );
    }
  );

  socket.on(
    'bus listener created',
    (state: State) =>
    {
      Map.addVehicle(state);
    }
  );

  socket.on(
    'bus update',
    (changes: StateChanges) =>
    {
      Map.updateVehicle(changes);
    }
  );
};

_Socket.prototype.addBusListener =
function addBusListener(busCode: string)
{
  socket.emit( 'add bus listener', busCode );
};

_Socket.prototype.removeBusListener =
function removeBusListener(busCode: string)
{
  socket.emit( 'remove bus listener', busCode );
};

const Socket: SocketService = new _Socket();

export { Socket };

