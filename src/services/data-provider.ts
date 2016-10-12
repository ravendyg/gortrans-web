/// <reference path="../typings/index.d.ts" />
'use strict';

import * as io from 'socket.io-client';

import {config} from '../config';

function _Socket()
{

};

_Socket.prototype.connect = function connect()
{
  let socket = io(config.URL);

  socket.on(
    'error',
    err =>
    {
      console.error( err );
    }
  );
}

const Socket: SocketService = new _Socket();

export { Socket };

