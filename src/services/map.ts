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
  if ( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(
      (position: Position) =>
      {
        _initMap.call(this,
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (err: PositionError) =>
      {
        console.error(err, 'getCurrentPosition');
        _initMap.call(this, 54.908593335436926, 83.0291748046875);
      },
      {
        enableHighAccuracy: false,
        timeout: 3000
      }
    );
  }
  else
  { // fallback
    _initMap.call(this, 54.908593335436926, 83.0291748046875);
  }
}

function _initMap(lat: number, lng: number)
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
    .setView({lat, lng}, 12);

  L.tileLayer['provider']('OpenStreetMap.HOT').addTo(this._map);
  document.querySelector('.leaflet-control-zoom').remove();
}

_Map.prototype.addVehicle =
function addVehicle(state: State)
{
  var busCode: string, graph: string;

  for ( busCode of Object.keys(state) )
  {
    if ( !this._state[busCode] )
    {
      this._state[busCode] = {};
    }
    for ( graph of Object.keys(state[busCode]) )
    {
      createMarker.call(
        this, state[busCode][graph],
        busCode, graph
      );
    }

    // draw path
    var trassPoints: Point [] = (Store.getState() as ReduxState).dataStorage.trasses[busCode];
    var latLng: [number, number] [] = trassPoints.map( e => <[number, number]>[e.lat, e.lng]);
    this._state[busCode].line = <L.Polyline> L.polyline( latLng );
    this._state[busCode].line.addTo( this._map );
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

  Store.dispatch( ActionCreators.updateState(this._state) );
}

_Map.prototype.removeVehicle =
function removeVehicle(busCode: string)
{
  if ( this._state[busCode] )
  {
    for ( var graph of Object.keys(this._state[busCode]) )
    {
      this._map.removeLayer( this._state[busCode][graph].marker );
    }
    try
    {
      delete this._state[busCode];
    }
    catch (err)
    {
      console.error(err, 'removing vehicle markers');
    }

    Store.dispatch( ActionCreators.updateState(this._state) );
  }
}

const Map: iMap = new _Map();

export { Map };


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