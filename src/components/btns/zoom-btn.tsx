/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';


var notMobile: string = '';
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  notMobile = 'not-mobile';
}

interface ZoomBtnState
{}
interface ZoomBtnProps
{
  zoom: any,
  icon: string
}

export class ZoomBtn extends React.Component <ZoomBtnProps, ZoomBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="zoom-btn" onClick={this.props.zoom}>
        <div className={this.props.icon + ' ' + notMobile}>
          <i className={'fa fa-' + this.props.icon} aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}