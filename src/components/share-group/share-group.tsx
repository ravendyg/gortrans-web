/// <reference path="../../typings/index.d.ts" />
/* global vendor */;
'use strict';

import * as React from 'react';

require('./share-group.less');

var notMobile: string = '';
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  notMobile = 'not-mobile';
}

interface ShareGroupState
{}
interface ShareGroupProps
{}

export class ShareGroup extends React.Component <ShareGroupProps, ShareGroupState>
{

  constructor ()
  {
    super();
  }


  render()
  {
    var twLink = encodeURI('https://twitter.com/intent/tweet?text=Общественный транспорт Новосибирска на карте&url=https://maps.nskgortrans.info/')
    var fbLink = encodeURI('https://www.facebook.com/sharer/sharer.php?u=https://maps.nskgortrans.info/&src=sdkpreparse');
    return(
      <div id="share-group">
        <ul>
          <a href="http://vk.com/share.php?url=https://maps.nskgortrans.info/" target="_blank">
            <li id="vk-share" className={notMobile} key="vk">
              <i className="fa fa-vk" aria-hidden="true"></i>
            </li>
          </a>
          <a href={fbLink} target="_blank">
            <li id="fb-share" className={notMobile} key="fb">
              <i className="fa fa-facebook" aria-hidden="true"></i>
            </li>
          </a>
          <a href={twLink} target="_blank">
            <li id="tw-share" className={notMobile} key="tw">
              <i className="fa fa-twitter" aria-hidden="true"></i>
            </li>
          </a>
        </ul>
      </div>
    );
  }
}