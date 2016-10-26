/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

import {Store} from './../../services/store';

import { RemoveBtn } from '../btns/remove-btn';


var busImg = require('../../images/bus.png');
var troImg = require('../../images/trolley.png');
var traImg = require('../../images/tram.png');
var smaImg = require('../../images/minibus.png');

interface BusListItemState
{
}
interface BusListItemProps
{
  item: VehicleMeta,
  clickCb: any,
  removeCb: any
}

export class BusListItem extends React.Component <BusListItemProps, BusListItemState>
{
  constructor ()
  {
    super();

    this.state =
    {
    };
  }

  public componentDidMount()
  {

  }


  render()
  {
    let code = this.props.item.code.split('-')[0];
    let imgSrc;
    switch ( code )
    {
      case '1':
        imgSrc = busImg;
      break;

      case '2':
        imgSrc = troImg;
      break;

      case '3':
        imgSrc = traImg;
      break;

      case '8':
        imgSrc = smaImg;
      break;
    }
    // let color = 'color: ' + this.props.color
    return(
      <div className="item">
        <div className="number" onClick={this.props.clickCb} style={{color: this.props.item.color}}>
          <span>{this.props.item.title}</span>
        </div>
        <div className="image" onClick={this.props.clickCb}>
          <img src={imgSrc} />
        </div>
        <RemoveBtn remove={this.props.removeCb} />
      </div>
    );
  }
}