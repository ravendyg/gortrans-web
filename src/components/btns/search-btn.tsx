/// <reference path="../../typings/index.d.ts" />

/* global vendor */;
'use strict';

import * as React from 'react';
import { Link, browserHistory } from 'react-router';

require('./btns.less');

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
        <div>
          <i className="fa fa-search" aria-hidden="true"></i>
        </div>
      </Link>
    );
  }
}