/// <reference path="../../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';

require('./btns.less');

interface BackBtnState
{}
interface BackBtnProps
{
  action: () => void;
}

export class BackBtn extends React.Component <BackBtnProps, BackBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className='back-btn' onClick={this.props.action}>
        <i className="fa fa-chevron-circle-left" aria-hidden="true"></i>
      </div>
    );
  }
}