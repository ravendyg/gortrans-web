/// <reference path="../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { browserHistory } from 'react-router';

import {Store} from './../services/store';

import {BusGroup} from './bus-selector/bus-group';

require('./bus-selector.less');

interface BusSelectorState
{
  className: string;
  items:
  {
    name: string,
    vehicles: VehicleMeta []
  } [];
}
interface BusSelectorProps
{}

export class BusSelector extends React.Component <BusSelectorProps, BusSelectorState>
{
  // private _allItems:
  // {
  //   name: string,
  //   vehicles: VehicleMeta []
  // } [];

  constructor ()
  {
    super();

    this.state =
    {
      className: 'menu',
      items: []
    };

    var data = (Store.getState() as ReduxState).dataStorage;

    for ( var type of Object.keys( data.typeNames ) )
    {
      this.state.items.push({
        name: data.typeNames[type].name,
        vehicles: []
      });
      // this._allItems.push({
      //   name: data.typeNames[type].name,
      //   vehicles: data.routes[type]
      // });
    }
  }

  public componentDidMount()
  {
    setTimeout(
      () =>
      {
        this.setState({
          className: 'menu opened',
          items: this.state.items
        });
      }
    );
  }

  private _closeMenu()
  {
    this.setState({
      className: 'menu',
      items: this.state.items
    });
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
      <div className="bus-selector-wrapper">
        <div className={this.state.className}>
          <input className="search-input" type="number" placeholder="Номер маршрута"/>

          {this.state.items.map( e =>
            <BusGroup key={e.name} item={e} />
          )}
        </div>
        <div className="overlay" onClick={this._closeMenu.bind(this)}></div>
      </div>
    );
  }
}