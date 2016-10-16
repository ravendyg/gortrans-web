/// <reference path="./../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

require('./bus-group.less');

interface BusGroupState
{
  expanded: boolean;
}
interface BusGroupProps
{
  item:
  {
    name: string,
    vehicles: VehicleMeta []
  }
}

export class BusGroup extends React.Component <BusGroupProps, BusGroupState>
{
  constructor ()
  {
    super();
    this.state =
    {
      expanded: true
    };
  }

  public componentDidMount()
  {
  }

  private _hideList()
  {
    this.setState({ expanded: !this.state.expanded });
  }


  render()
  {
    return(
      <div className='bus-selector-group'>
        <div className='header' onClick={this._hideList.bind(this)}>
          <div className='text'>{this.props.item.name}</div>
          <div className='arrow'>
            <i className={this.state.expanded ? 'fa fa-arrow-down' : 'fa fa-arrow-right'} aria-hidden="true"></i>
          </div>
        </div>
        {this.state.expanded
          ? this.props.item.vehicles.map(
            e => <div key={e.code} className="item">{e.title}</div>
          )
          : ''
        }
      </div>
    );
  }
}

// <button onClick={this._closeMenu.bind(this)}>back</button>