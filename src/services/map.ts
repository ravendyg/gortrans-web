/// <reference path="../typings/index.d.ts" />
'use strict';

import * as request from 'superagent';

import {ActionCreators} from './action-creators';
import {Store} from './store';
import { config } from '../config';

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
    iconSize: L.point(25,25),
    iconAnchor: [15, 15]
  })
};

// display map
function _Map()
{
  this._state = {};
}


_Map.prototype.create =
function create()
{
  var mapParams = JSON.parse( localStorage.getItem('map-params') || '{"lat": 54.908593335436926, "lng": 83.0291748046875, "zoom": 12}' );
  this._coordsAvailableSubscribers = [];
  if ( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(
      (position: Position) =>
      { // watch position change
        this._userMarker = L.marker([position.coords.latitude, position.coords.longitude]);
        this._userMarker.bindPopup('Вы здесь');
        this._map.addLayer( this._userMarker );

        this._position = position.coords;
        navigator.geolocation.watchPosition(
          (position: Position) =>
          {
            var marker = <L.Marker> this._userMarker;
            marker.setLatLng([position.coords.latitude, position.coords.longitude]);

            this._position = position.coords;
          }
        );
        // notify listeners
        this.coordsAvailable = true;
        for ( var cb of this._coordsAvailableSubscribers)
        {
          cb(this.coordsAvailable);
        }
      },
      (err: PositionError) =>
      {
        this.coordsAvailable = false;
        for ( var cb of this._coordsAvailableSubscribers)
        {
          cb(this.coordsAvailable);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 3000
      }
    );
  }
  else
  {
    this.coordsAvailable = false;
    for ( var cb of this._coordsAvailableSubscribers)
    {
      cb(this.coordsAvailable);
    }
  }

  _initMap.call(this, mapParams.lat, mapParams.lng, mapParams.zoom);


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

            stopMarkers[stopId].bindPopup( createStopPopup(newStops[stopId]) );

            stopMarkers[stopId].on(
              'popupopen',
              onPopupopen.bind(stopMarkers[stopId], newStops[stopId], stopId)
            );
            stopMarkers[stopId].on(
              'popupclose',
              onPopupclose.bind(stopMarkers[stopId], newStops[stopId])
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

_Map.prototype.zoomToUser =
function zoomToUser()
{
  var map = <L.Map>this._map;
  var position = <Coordinates> this._position;
  map.setView({lat: position.latitude, lng: position.longitude}, map.getZoom());
}

_Map.prototype.subscribeForCoordsAvailable =
function subscribeForCoordsAvailable(cb: (available: boolean) => void)
{
  if ( this.coordsAvailable === true || this.coordsAvailable === false)
  { // if ready call immediately
    cb(this.coordsAvailable);
  }
  else
  {
    this._coordsAvailableSubscribers.push(cb);
  }
}

function _initMap(lat: number, lng: number, zoom: number)
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
    .setView({lat, lng}, zoom);

  var map: L.Map = this._map;

  // coords and zoom tracker
  map.on( 'moveend', rememberMapLocation.bind(this, map) );
  map.on( 'zomeend', rememberMapLocation.bind(this, map) );

  L.tileLayer['provider']('OpenStreetMap.Mapnik').addTo(map);
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

_Map.prototype.cleanBusMarkers =
function cleanBusMarkers()
{
  for (var busCode of Object.keys(this._state) )
  {
    for (var graph of Object.keys(this._state[busCode].vh) )
    {
      this._map.removeLayer( this._state[busCode].vh[graph].marker );
    }
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

_Map.prototype.zoomIn =
function zoomIn()
{
  var map = <L.Map> this._map;
  map.zoomIn();
}

_Map.prototype.zoomOut =
function zoomOut()
{
  var map = <L.Map> this._map;
  map.zoomOut();
}

const Map: iMap = new _Map();

export { Map };


function rememberMapLocation(map: L.Map)
{
  var center = map.getCenter();
  var toStore = {lat: center.lat, lng: center.lng, zoom: map.getZoom()};
  localStorage.setItem('map-params', JSON.stringify(toStore));
}


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
  var stops;
  var table

  if (data.rasp.match(/\|/))
  {
    stops = data.rasp.split('|').filter(entity);
    table = '<table><tbody>';

    for ( var stop of stops )
    {
      [stopTime, stopName] = stop.split('+');
      table += `<tr><td>${stopTime}</td><td class="popup-table-stop-name">${stopName}</td></tr>`;
    }
    table += '</tbody></table>';
  }
  else
  {
    table = '';
  }

  var text =
    `<p class="popup-header">${type} №${data.title} (график ${data.graph})</p>
    ${table}
    <p class="popup-footer">${data.time_nav.split(' ')[1]} Скорость: ${data.speed} км/ч</p>
    `;

  return text;
}

function onPopupopen(stop: Stop, stopId: string, event)
{
  getStopSchedule(this, stop, stopId);
}

function onPopupclose(stop: Stop, event)
{
  // clear request and interval
  this['_requestId'] = 0;
  clearInterval(this['_countDown']);
  (this as L.Marker).setPopupContent( createStopPopup(stop) );
}

function createStopPopup(stop: Stop): string
{
  var text =
  `<p class="popup-stop-header">${stop.n}</p>
  <div id="stop-${stop.id}">
  </div>
  <p class="popup-footer">
    <span id="stop-${stop.id}-status">Обновляю...</span>
    <span id="stop-${stop.id}-timer"></span>
  </p>
  `
  ;

  return text;
}

function createStopPopupTable(stop: Stop, forecasts: Forecast []): string
{
  var tbody =
    forecasts
    .sort(sortForecastsByNearestArrival)
    .map(createStopPopupTableLine)
    .join('\n')
    ;
  var text =
  `<p class="popup-stop-header">${stop.n}</p>
  <div id="stop-${stop.id}">
    <table class="popup-stop-table">
      <thead><th>Маршрут</th><th>Ближайший</th><th>Направление</th></thead>
      <tbody>
      ${tbody}
      </tbody>
    </table>
  </div>
  <p class="popup-footer">
    <span id="stop-${stop.id}-status">До обновления: </span>
    <span id="stop-${stop.id}-timer">60 сек</span>
  </p>`;

  return text;
}

function sortForecastsByNearestArrival(e1: Forecast, e2: Forecast): number
{
  return e1.markers[0].time > e2.markers[0].time
    ? 1
    : e1.markers[0].time < e2.markers[0].time
      ? -1
      : 0;
}

function createStopPopupTableLine(forecast: Forecast): string
{
  var name = forecast.title + ' ';
  switch (forecast.typetr)
  {
    case '1':
      name += '(а.)';
    break;

    case '2':
      name += '(тр.)';
    break;

    case '3':
      name += '(тм.)';
    break;

    case '8':
      name += '(м.т.)';
    break;
  }

  var text =
  `<tr>
    <td>${name}</td>
    <td>${forecast.markers[0].time ? forecast.markers[0].time : '< 1'} мин</td>
    <td>${forecast.stop_end}</td>
  </tr>`;

  return text;
}

function getStopSchedule(marker: L.Marker, stop: Stop, id: string)
{
  var _requestId = (Math.random() * 1000).toFixed();
  marker['_requestId'] = _requestId;

  request
  .get(`${location.href}${config.GET_STOP_SCHEDULE}?stopId=${id}`)
  .end(
    (err: Error, res: request.Response) =>
    {
      var forecasts: Forecast [];
      if (marker['_requestId'] === _requestId)
      { // this request is still valid
        try
        {
          forecasts = JSON.parse(res.text).routes;
          marker.setPopupContent( createStopPopupTable(stop, forecasts) );

          setTimeout(
            () =>
            { // wait for new popup to be rendered
              var targetStatus = <HTMLSpanElement> document.getElementById('stop-' + id + '-status');
              var targetTimer = <HTMLSpanElement> document.getElementById('stop-' + id + '-timer');

              var timeLeft = 60;
              marker['_countDown'] = setInterval(
                () =>
                {
                  if (targetTimer)
                  {
                    targetTimer.textContent = (--timeLeft) + ' сек';
                  }
                  if (timeLeft === 0)
                  {
                    clearInterval(marker['_countDown']);
                    targetStatus.textContent = 'Обновляю...';
                    targetTimer.textContent = '';
                    getStopSchedule(marker, stop, id);
                  }
                },
                1000
              );
            }
          );
        }
        catch (err)
        {
          var targetStatus = <HTMLSpanElement> document.getElementById('stop-' + id + '-status');
          var targetTimer = <HTMLSpanElement> document.getElementById('stop-' + id + '-timer');
          forecasts = [];
          if (targetStatus)
          {
            targetStatus.textContent = 'Ошибка обновления';
            targetTimer.textContent = '';
          }
        }
      }
    }
  );
}

function entity(e: any): any
{
  return e;
}