/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

import {Store} from './../../services/store';

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
    Store.subscribe(
      () =>
      {
        let items = (Store.getState() as ReduxState).busList;
        if ( this.state.items !== items )
        {
          this.setState({ items });
        }
      }
    );
  }

  public zoomToRoot(busCode: string)
  {
    console.log(busCode);
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