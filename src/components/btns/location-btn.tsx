/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

var notMobile: string = '';
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  notMobile = 'not-mobile';
}


interface LocationBtnState
{}
interface LocationBtnProps
{
  move: any
}

export class LocationBtn extends React.Component <LocationBtnProps, LocationBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="location-btn" onClick={this.props.move}>
        <div className={notMobile}>
          <i className="fa fa-location-arrow" aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}