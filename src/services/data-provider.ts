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
function addBusListener(code: string)
{
  socket.emit( 'add bus listener', code );
};

_Socket.prototype.removeBusListener =
function removeBusListener(code: string)
{
  socket.emit( 'remove bus listener', code );
};

const Socket: SocketService = new _Socket();

export { Socket };

