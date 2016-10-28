/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';
import * as Radium from 'radium';


var styles: any = {};
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  styles[':hover'] =
  {
    backgroundColor: '#01579B'
  };
}


interface LocationBtnState
{}
interface LocationBtnProps
{
  move: any
}

@Radium
export class LocationBtn extends React.Component <LocationBtnProps, LocationBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="location-btn" onClick={this.props.move}>
        <div style={styles}>
          <i className="fa fa-location-arrow" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}