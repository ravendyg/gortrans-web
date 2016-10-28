/// <reference path="../../typings/index.d.ts" />
/* global vendor */;
'use strict';

import * as React from 'react';
import * as Radium from 'radium';

require('./share-group.less');

var stylesVk: any = {};
var stylesTw: any = {};
var stylesFb: any = {};
if ( !navigator.userAgent.toLowerCase().match(/(android|iphone|ipad)/) )
{
  stylesVk[':hover'] =
  {
    backgroundColor: '#5074A4'
  };
  stylesTw[':hover'] =
  {
    backgroundColor: '#0085be'
  };
  stylesFb[':hover'] =
  {
    backgroundColor: '#2d4373'
  };
}

interface ShareGroupState
{}
interface ShareGroupProps
{}

@Radium
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
            <li id="vk-share" style={stylesVk} key="vk">
              <i className="fa fa-vk" aria-hidden="true"></i>
            </li>
          </a>
          <a href={fbLink} target="_blank">
            <li id="fb-share" style={stylesFb} key="fb">
              <i className="fa fa-facebook" aria-hidden="true"></i>
            </li>
          </a>
          <a href={twLink} target="_blank">
            <li id="tw-share" style={stylesTw} key="tw">
              <i className="fa fa-twitter" aria-hidden="true"></i>
            </li>
          </a>
        </ul>
      </div>
    );
  }
}