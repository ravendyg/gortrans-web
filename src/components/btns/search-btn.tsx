/// <reference path="../../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { Link, browserHistory } from 'react-router';
import * as Radium from 'radium';


var styles: any = {};
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  styles[':hover'] =
  {
    backgroundColor: '#01579B'
  };
}


interface SearchBtnState
{}
interface SearchBtnProps
{}

@Radium
export class SearchBtn extends React.Component <SearchBtnProps, SearchBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <Link to={'/select-bus'} className='search-btn'>
        <div style={styles}>
          <i className="fa fa-search" aria-hidden="true"></i>
        </div>
      </Link>
    );
  }
}