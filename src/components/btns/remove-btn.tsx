/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

var notMobile: string = '';
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  notMobile = 'remove-btn-not-mobile';
}

interface RemoveBtnState
{}
interface RemoveBtnProps
{
  remove: any
}

export class RemoveBtn extends React.Component <RemoveBtnProps, RemoveBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className={'remove-btn ' + notMobile} onClick={this.props.remove}>
        <i className="fa fa-remove" aria-hidden="true"></i>
      </div>
    );
  }
}