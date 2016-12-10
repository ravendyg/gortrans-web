/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

import {Store} from './../../services/store';
import { Map } from './../../services/map';

import { BusListItem } from './bus-list-item';

import { removeBus } from '../../services/user-actions';

require('./bus-list.less');

interface BusListState
{
  items: VehicleMeta [];
}
interface BusListProps
{}

export class BusList extends React.Component <BusListProps, BusListState>
{
  private currentItems: VehicleMeta [];

  private _unsubscribeFromBusList: any;

  constructor ()
  {
    super();

    this.state =
    {
      items: []
    };
  }

  public componentDidMount()
  {
    this._unsubscribeFromBusList =
      Store.subscribe(
        () =>
        {
          let items = (Store.getState() as ReduxState).busList.buses;
          if ( this.state.items !== items )
          {
            this.setState({ items });
          }
        }
      );
  }

  public componentWillUnmount()
  {
    this._unsubscribeFromBusList();
  }

  public zoomToRoot(busCode: string)
  {
    Map.zoomToBusRote(busCode);
  }

  render()
  {
    return(
      <div className="bus-list-wrapper">
        <div className="list">
          {this.state.items.map(
            e =>
            <BusListItem
              item={e}
              clickCb={this.zoomToRoot.bind(this, e.code)}
              removeCb={removeBus.bind(null, e)}
            />
          )}
        </div>
      </div>
    );
  }
}