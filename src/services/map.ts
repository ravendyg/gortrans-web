/// <reference path="../typings/index.d.ts" />
'use strict';

import {ActionCreators} from './action-creators';
import {Store} from './store';

require("./map.less");

var icons =
{
  '1-0': L.icon({
    iconUrl: require('./../images/marker-icons/bus-0.png'),
    iconAnchor: [19, 17]
  }),
  '1-45': L.icon({
    iconUrl: require('./../images/marker-icons/bus-45.png'),
    iconAnchor: [19, 17]
  }),
  '1-90': L.icon({
    iconUrl: require('./../images/marker-icons/bus-90.png'),
    iconAnchor: [19, 17]
  }),
  '1-135': L.icon({
    iconUrl: require('./../images/marker-icons/bus-135.png'),
    iconAnchor: [19, 17]
  }),
  '1-180': L.icon({
    iconUrl: require('./../images/marker-icons/bus-180.png'),
    iconAnchor: [19, 17]
  }),
  '1-225': L.icon({
    iconUrl: require('./../images/marker-icons/bus-225.png'),
    iconAnchor: [19, 17]
  }),
  '1-270': L.icon({
    iconUrl: require('./../images/marker-icons/bus-270.png'),
    iconAnchor: [19, 17]
  }),
  '1-315': L.icon({
    iconUrl: require('./../images/marker-icons/bus-315.png'),
    iconAnchor: [19, 17]
  }),

  '2-0': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-0.png'),
    iconAnchor: [19, 17]
  }),
  '2-45': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-45.png'),
    iconAnchor: [19, 17]
  }),
  '2-90': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-90.png'),
    iconAnchor: [19, 17]
  }),
  '2-135': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-135.png'),
    iconAnchor: [19, 17]
  }),
  '2-180': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-180.png'),
    iconAnchor: [19, 17]
  }),
  '2-225': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-225.png'),
    iconAnchor: [19, 17]
  }),
  '2-270': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-270.png'),
    iconAnchor: [19, 17]
  }),
  '2-315': L.icon({
    iconUrl: require('./../images/marker-icons/trolley-315.png'),
    iconAnchor: [19, 17]
  }),

  '3-0': L.icon({
    iconUrl: require('./../images/marker-icons/tram-0.png'),
    iconAnchor: [19, 17]
  }),
  '3-45': L.icon({
    iconUrl: require('./../images/marker-icons/tram-45.png'),
    iconAnchor: [19, 17]
  }),
  '3-90': L.icon({
    iconUrl: require('./../images/marker-icons/tram-90.png'),
    iconAnchor: [19, 17]
  }),
  '3-135': L.icon({
    iconUrl: require('./../images/marker-icons/tram-135.png'),
    iconAnchor: [19, 17]
  }),
  '3-180': L.icon({
    iconUrl: require('./../images/marker-icons/tram-180.png'),
    iconAnchor: [19, 17]
  }),
  '3-225': L.icon({
    iconUrl: require('./../images/marker-icons/tram-225.png'),
    iconAnchor: [19, 17]
  }),
  '3-270': L.icon({
    iconUrl: require('./../images/marker-icons/tram-270.png'),
    iconAnchor: [19, 17]
  }),
  '3-315': L.icon({
    iconUrl: require('./../images/marker-icons/tram-315.png'),
    iconAnchor: [19, 17]
  }),

  '8-0': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-0.png'),
    iconAnchor: [19, 17]
  }),
  '8-45': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-45.png'),
    iconAnchor: [19, 17]
  }),
  '8-90': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-90.png'),
    iconAnchor: [19, 17]
  }),
  '8-135': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-135.png'),
    iconAnchor: [19, 17]
  }),
  '8-180': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-180.png'),
    iconAnchor: [19, 17]
  }),
  '8-225': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-225.png'),
    iconAnchor: [19, 17]
  }),
  '8-270': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-270.png'),
    iconAnchor: [19, 17]
  }),
  '8-315': L.icon({
    iconUrl: require('./../images/marker-icons/minibus-315.png'),
    iconAnchor: [19, 17]
  }),

  'stop': L.icon({
    iconUrl: require('./../images/bus-stop.png'),
    iconSize: L.point(30,30),
    iconAnchor: [15, 15]
  })
};

// display map
function _Map()
{
  this._state = {};
  var oldStops: {[stopId: string]: Stop} = {};
  var stopMarkers: {[stopId: string]: L.Marker } = {};

  Store.subscribe(
    () =>
    {
      var map = <L.Map> this._map;

      var stopId: string;
      var newStops = (Store.getState() as ReduxState).stopList;
      if (newStops !== oldStops)
      {
        // first remove those that missing on the new list
        // and there is a corresponding marker (it should be)
        for ( stopId of Object.keys(oldStops) )
        {
          if ( !newStops[stopId] && stopMarkers[stopId] )
          {
            map.removeLayer( stopMarkers[stopId] );
            delete stopMarkers[stopId];
          }
        }
        // then add new stops
        for ( stopId of Object.keys(newStops) )
        {
          if ( !oldStops[stopId] && !stopMarkers[stopId] )
          {
            stopMarkers[stopId] =
              L.marker(
                [newStops[stopId].lat, newStops[stopId].lng],
                {icon: icons.stop }
              );

            map.addLayer( stopMarkers[stopId] );
          }
        }
        // finaly replace
        oldStops = newStops;
      }
    }
  );
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

  var azimuth = Math.floor( (Math.abs(+data.azimuth+22.5)) / 45 )*45 % 360;
  marker =
    L.marker([data.lat, data.lng], {icon: icons[data.id_typetr+'-'+azimuth]})
    .bindPopup( createPopupCode(data) )
    .bindTooltip(data.title, {permanent: true, direction: 'left'})
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
  var azimuth = Math.floor( (Math.abs(+data.azimuth+22.5)) / 45 )*45 % 360;

  this._state[code].vh[graph].marker.setLatLng([data.lat, data.lng]);
  this._state[code].vh[graph].marker.setIcon(icons[data.id_typetr+'-'+azimuth]);
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