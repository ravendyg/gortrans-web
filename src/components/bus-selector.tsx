/// <reference path="../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { browserHistory } from 'react-router';

interface BusSelectorState
{}
interface BusSelectorProps
{}

export class BusSelector extends React.Component <BusSelectorState, BusSelectorProps>
{
  constructor () { super(); }

  render()
  {
    return(
      <div>
        {'Hello'}
        <button onClick={browserHistory.goBack}>back</button>
      </div>
    );
  }
}