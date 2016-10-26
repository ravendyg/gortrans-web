/// <reference path="../../typings/index.d.ts" />
'use strict';

import * as React from 'react';

require('./remove-btn.less');

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
      <div className="remove-btn" onClick={this.props.remove}>
        <i className="fa fa-remove" aria-hidden="true"></i>
      </div>
    );
  }
}