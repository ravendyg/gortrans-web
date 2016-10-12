/// <reference path="../typings/index.d.ts" />
'use strict';

require("./map.less");

// display map
function _Map()
{}

_Map.prototype.create = function create()
{
  var southWest = L.latLng(30, 10),
    northEast = L.latLng(80, 200),
    bounds = L.latLngBounds(southWest, northEast);
  var map =
    L.map(
      'map',
      {
        minZoom: 4,
        maxBounds: bounds
      })
    .setView({lat: 54.908593335436926, lng: 83.0291748046875}, 14);

    L.tileLayer['provider']('OpenStreetMap.HOT').addTo(map);
}

const Map = new _Map();

export { Map };
// document.querySelector('.leaflet-control-zoom').remove();