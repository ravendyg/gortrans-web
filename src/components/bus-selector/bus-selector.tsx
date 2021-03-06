/// <reference path="../../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';

import {getInfo} from './../../services/store';

import {BusGroup} from './bus-group';
import { BackBtn } from './../btns/back-btn';

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
  private _timer: number;
  private _typeKeys: string [];

  private _data:
  {
    routes:
    {
      [type: string]: VehicleMeta []
    },
    typeNames:
    {
      [type: string]:
      {
        id: number,
        name: string
      }
    }
  };

  constructor ()
  {
    super();

    this.state =
    {
      className: 'menu',
      items: []
    };

    this._data = getInfo();
    this._typeKeys = Object.keys( this._data.typeNames );

    for ( var type of this._typeKeys )
    {
      this.state.items.push({
        name: this._data.typeNames[type].name,
        vehicles: []
      });
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
    (findDOMNode(this.refs['search']) as HTMLInputElement).focus();
  }

  private _searchChange(input: InputChangeEvent)
  {
    clearTimeout(this._timer);
    this._timer =
      setTimeout(
        this._checkTimeToSearch.bind(this, input.target.value),
        250
      );
  }

  private _checkTimeToSearch(value: string)
  {
      let itemsCopy = this.state.items;
      for ( let i = 0; i < this._typeKeys.length; i++ )
      {
        itemsCopy[i].vehicles =
          this._data.routes[ this._typeKeys[i] ]
          .filter( e => value !== "" && e.title.match(value) )
          ;
      }
      let tempState =
      {
        className: this.state.className,
        items: itemsCopy
      };
      this.setState( tempState );
  }

  public closeMenu(event)
  {
    if (!event || event.target.id === 'bus-selector-wrapper')
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
  }

  render()
  {
    let backBtn = navigator.userAgent.toLowerCase().match(/(iphone|ipad)/)
      ? <BackBtn action={this.closeMenu.bind(this)} />
      : ''
      ;
    return(
      <div id="bus-selector-wrapper" onClick={this.closeMenu.bind(this)}>

        <div className={this.state.className}>
          {backBtn}
          <input
            className="search-input"
            type="number"
            placeholder="Номер маршрута"
            onChange={this._searchChange.bind(this)}
            ref="search"
          />

          <div className="bus-groups-wrapper">
            {this.state.items.map( e =>
              (e.vehicles && e.vehicles.length > 0)
                ? <BusGroup
                  key={e.name}
                  item={e}
                  closeCb={this.closeMenu.bind(this)}
                />
                : ''
            )}
          </div>
        </div>

      </div>
    );
  }
}