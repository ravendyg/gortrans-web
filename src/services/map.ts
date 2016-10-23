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
{ // state contains only one bus - the one that has been added
  var busCode: string, graph: string;
  var color: string;
  var i: number;
  var selectedVehicle: VehicleMeta;

  var listOfSelectedVehicles = (Store.getState() as ReduxState).busList;

  for ( busCode of Object.keys(state) )
  {
    if ( !this._state[busCode] )
    {
      this._state[busCode] = { vh: {} };
      for ( graph of Object.keys(state[busCode]) )
      {
        createMarker.call(
          this, state[busCode][graph],
          busCode, graph
        );
      }

      // draw path
      var trassPoints: Point [] = (Store.getState() as ReduxState).dataStorage.trasses[busCode];
      var latLng: [number, number] [] =
        (trassPoints || [])
        .map( e => <[number, number]>[e.lat, e.lng]);
      // select color
      for ( selectedVehicle of listOfSelectedVehicles )
      {
        if ( selectedVehicle.code === busCode )
        {
          color = selectedVehicle.color;
          break;
        }
      }
      this._state[busCode].line = <L.Polyline> L.polyline( latLng, { color } );
      this._state[busCode].color = color;
      Store.dispatch( ActionCreators.updateState(this._state) );

      this._state[busCode].line.addTo( this._map );
    }

    setTimeout(
      () => { this.zoomToBusRote(busCode); },
      50
    );

  }
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
    var graphs = Object.keys(this._state[busCode].vh);
    for ( var graph of graphs )
    {
      this._map.removeLayer( this._state[busCode].vh[graph].marker );
    }
    try
    {
      this._map.removeLayer( this._state[busCode].line );
      // availableColors.push( this._state[busCode].color );
      delete this._state[busCode];
    }
    catch (err)
    {
      console.error(err, 'removing vehicle markers');
    }

    Store.dispatch( ActionCreators.updateState(this._state) );
  }
}

_Map.prototype.zoomToBusRote =
function zoomToBusRote(busCode: string)
{
  var buses = (Store.getState() as ReduxState).dataStorage.vehicles;
  if ( buses[busCode] && buses[busCode].line )
  {
    var bounds = buses[busCode].line.getBounds();
    (this._map as L.Map).fitBounds(bounds, {});
  }
}

const Map: iMap = new _Map();

export { Map };


function createMarker(data: busData, code: string, graph: string)
{
  var marker: L.Marker;
  // make better popup
  marker =
    L.marker([data.lat, data.lng])
    .bindPopup( createPopupCode(data) )
    .bindTooltip(data.title, {permanent: true})
    ;

  marker.addTo(this._map);
  marker.openTooltip();

  this._state[code].vh[graph] =
  {
    data,
    marker
  };
}

function updateMarker(data: busData, code: string, graph: string)
{
  this._state[code].vh[graph].marker.setLatLng([data.lat, data.lng]);
  this._state[code].vh[graph].marker.setPopupContent( createPopupCode(data) );
  this._state[code].vh[graph].data = data;
}

function removeMarker(code: string, graph: string)
{
  try
  {
    this._map.removeLayer( this._state[code].vh[graph].marker );
    delete this._state[code].vh[graph];
  }
  catch (err)
  {
    console.error(err, 'removing marker');
  }
}

function createPopupCode(data: busData): string
{
  var type, stopTime, stopName;
  switch (data.id_typetr)
  {
    case '2':
      type = 'Троллейбус';
    break;

    case '3':
      type = 'Трамвай';
    break;

    case '8':
      type = 'Маршрутное такси';
    break;

    default:
      type = 'Автобус';
  }
  var stops = data.rasp.split('|').filter(entity);
  var table = '<table><tbody>';

  for ( var stop of stops )
  {
    [stopTime, stopName] = stop.split('+');
    table += `<tr><td>${stopTime}</td><td class="popup-table-stop-name">${stopName}</td></tr>`;
  }
  table += '</tbody></table>';

  var text =
    `<p class="popup-header">${type} №${data.title} (график ${data.graph})</p>
    ${table}
    <p class="popup-footer">${data.time_nav.split(' ')[1]} Скорость: ${data.speed} км/ч</p>
    `;

  return text;
}

function entity(e: any): any
{
  return e;
}