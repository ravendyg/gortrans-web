'use strict';

import * as React from 'react';

var notMobile: string = '';
if (!navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/))
{
  notMobile = 'not-mobile';
}


interface AndroidBtnState
{}
interface AndroidBtnProps
{
}

export class AndroidBtn extends React.Component <AndroidBtnProps, AndroidBtnState>
{
  constructor () { super(); }

  render()
  {
    return(
      <div className="android-btn">
        <a href="https://play.google.com/store/apps/details?id=info.nskgortrans.maps" target="_blank">
          <div className={notMobile}>
            <i className="fa fa-android" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    );
  }
}