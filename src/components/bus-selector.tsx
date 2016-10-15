/// <reference path="../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { browserHistory } from 'react-router';

require('./bus-selector.less');

interface BusSelectorState
{
  className: string;
}
interface BusSelectorProps
{}

export class BusSelector extends React.Component <BusSelectorState, BusSelectorProps>
{
  public state: { className: string };

  constructor ()
  {
    super();

    this.state =
    {
      className: 'bus-selector-wrapper'
    };
  }

  public componentDidMount()
  {
    setTimeout(
      () =>
      {
        this.setState({className: 'bus-selector-wrapper opened'});
      }
    );
  }

  private _closeMenu()
  {
    this.setState({className: 'bus-selector-wrapper'});
    setTimeout(
      () =>
      {
        browserHistory.goBack();
      },
      500
    );
  }

  render()
  {
    return(
      <div className={this.state.className}>
        {'Hello'}
        <button onClick={this._closeMenu.bind(this)}>back</button>
      </div>
    );
  }
}