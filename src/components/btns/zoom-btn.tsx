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

interface ZoomBtnState
{}
interface ZoomBtnProps
{
  zoom: any,
  icon: string
}

@Radium
export class ZoomBtn extends React.Component <ZoomBtnProps, ZoomBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="zoom-btn" onClick={this.props.zoom}>
        <div className={this.props.icon} style={styles}>
          <i className={'fa fa-' + this.props.icon} aria-hidden="true"></i>
        </div>
      </div>
    );
  }
}