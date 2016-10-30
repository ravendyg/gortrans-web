/// <reference path="../../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { Link, browserHistory } from 'react-router';


var notMobile: string = '';
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  notMobile = 'not-mobile';
}


interface SearchBtnState
{}
interface SearchBtnProps
{}

export class SearchBtn extends React.Component <SearchBtnProps, SearchBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <Link to={'/select-bus'} className='search-btn'>
        <div className={notMobile}>
          <i className="fa fa-search" aria-hidden="true"></i>
        </div>
      </Link>
    );
  }
}