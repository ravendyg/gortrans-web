/// <reference path="../typings/index.d.ts" />
'use strict';

import {ActionCreators} from './action-creators';
import {Store} from './store';

require("./map.less");

// display map
function _Map()
{
  this._state = <StateWithMarkers> {};
}

_Map.prototype.create =
function create()
{
  var southWest = L.latLng(30, 10),
    northEast = L.latLng(80, 200),
    bounds = L.latLngBounds(southWest, northEast);
  this._map =
    L.map(
      'map',
      {
        minZoom: 4,
        maxBounds: bounds
      })
    .setView({lat: 54.908593335436926, lng: 83.0291748046875}, 14);

  L.tileLayer['provider']('OpenStreetMap.HOT').addTo(this._map);
}

_Map.prototype.addVehicle =
function addVehicle(state: State)
{
  var code: string, graph: string;

  for ( code of Object.keys(state) )
  {
    if ( !this._state[code] )
    {
      this._state[code] = {};
    }
    for ( graph of Object.keys(state[code]) )
    {
      createMarker.call(
        this, state[code][graph],
        code, graph
      );
    }
  }
  // send new state to the store
  Store.dispatch( ActionCreators.updateState(this._state) );
}

_Map.prototype.updateVehicle =
function updateVehicle(changes: StateChanges)
{
  var code: string, graph: string;

  for ( code of Object.keys(changes) )
  {
    for ( graph of Object.keys(changes[code].add) )
    {
      createMarker.call(
        this, changes[code].add[graph],
        code, graph
      );
    }

    for ( graph of Object.keys(changes[code].update) )
    {
      updateMarker.call(
        this, changes[code].update[graph],
        code, graph
      );
    }

    for ( graph of changes[code].remove )
    {
      removeMarker.call( this, code, graph );
    }
  }
}

_Map.prototype.removeVehicle =
function removeVehicle(busCode: string)
{
  console.log(busCode);
}

const Map: iMap = new _Map();

export { Map };
// document.querySelector('.leaflet-control-zoom').remove();


function createMarker(data: busData, code: string, graph: string)
{
  var marker: L.Marker;
  // make better popup
  marker = L.marker([data.lat, data.lng]).bindPopup(data.graph + ': ' + data.title);
  marker.addTo(this._map);

  this._state[code][graph] =
  {
    data,
    marker
  };
}

function updateMarker(data: busData, code: string, graph: string)
{
  this._state[code][graph].marker.setLatLng([data.lat, data.lng]);
  this._state[code][graph].data = data;
}

function removeMarker(data: busData, code: string, graph: string)
{
  try
  {
    this._map.removeLayer( this._state[code][graph].marker );
    delete this._state[code][graph];
  }
  catch (err)
  {
    console.error(err, 'removing marker');
  }
}