/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';
import * as Radium from 'radium';

var styles: any = {};
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  styles[':hover'] =
  {
    color: 'red',
    textShadow: '2px 2px 1px black'
  };
}

interface RemoveBtnState
{}
interface RemoveBtnProps
{
  remove: any
}

@Radium
export class RemoveBtn extends React.Component <RemoveBtnProps, RemoveBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="remove-btn" onClick={this.props.remove} style={styles}>
        <i className="fa fa-remove" aria-hidden="true"></i>
      </div>
    );
  }
}