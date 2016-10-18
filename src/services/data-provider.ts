/// <reference path="../typings/index.d.ts" />
'use strict';

import * as io from 'socket.io-client';

import {config} from '../config';

var socket: SocketIOClient.Socket;

function _Socket()
{
};

_Socket.prototype.connect =
function connect()
{
  socket = io(config.URL);

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
      console.log(state);
    }
  );

  socket.on(
    'bus update',
    (changes: StateChanges) =>
    {
      console.log(changes);
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

