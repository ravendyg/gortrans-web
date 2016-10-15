/// <reference path="../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { Link, browserHistory } from 'react-router';

require('./search-btn.less');

interface SearchBtnState
{}
interface SearchBtnProps
{}

export class SearchBtn extends React.Component <SearchBtnState, SearchBtnProps>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className='search-btn'>
        <Link to={'/select-bus'}>
          <i className="fa fa-search" aria-hidden="true"></i>
        </Link>
      </div>
    );
  }
}