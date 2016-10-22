/// <reference path="../../typings/index.d.ts" />

declare var vendor: any;

interface AppState
{
  name: string;
}

interface AppProps
{}

declare type ActionType =
{
  type: number,
  payload?: any
};

declare interface SocketService
{
  connect (): void;
  addBusListener (code: string): void;
  removeBusListener (code: string): void;
}

declare type ListMarsh =
{
  type: string,
  ways: Way []
};

declare type Way =
{
  marsh: string,
  name: string,
  stopb: string,
  stope: string
};

declare type ReduxState =
{
  dataStorage: dataStorageStore,
  busList: VehicleMeta [],
};

declare type dataStorageStore =
{
  routes:
  {
    [type: string]: VehicleMeta []
  },
  typeNames:
  {
    [type: string]:
    {
      id: number,
      name: string
    }
  },
  vehicles: StateWithMarkers,
  trasses: { [busCode: string]: Point []}
};

declare type VehicleMeta =
{
  title: string,
  code: string,
  color: string
};

interface FormControlEventTarget extends EventTarget
{
  value: string;
}

interface InputChangeEvent extends Event
{
  target: FormControlEventTarget;
}

declare type busData =
{
  title: string,
  id_typetr: string,
  marsh: string,
  graph: number,
  direction: string,
  lat: number,
  lng: number,
  time_nav: string,
  azimuth: number,
  rasp: string,
  speed: number,
  segment_order: string,
  ramp: string
};

declare type StateWithMarkers =
{
  [busCode: string]: MapStateUnit
};

declare type MapStateUnit =
{
  vh:
  {
    [graph: string]:
    {
      data: busData,
      marker: L.Marker
    },
  }
  line: L.Polyline,
  color: string
};

declare type State =
{
  [busCode: string]:
  {
    [graph: string]: busData
  }
};

declare type StateChanges =
{
  [busCode: string]:
  {
    update:
    {
      [graph: string]: busData
    }, // new data for existing buses
    add:
    {
      [graph: string]: busData
    }, // data for new buses
    remove: string []   // graph numbers to be removed
  }
};

interface iMap
{
  create(): void;
  addVehicle(state: State): void;
  updateVehicle(changes: StateChanges): void;
  removeVehicle(busCode: string): void;
  zoomToBusRote(busCode: string): void;
}

declare type Point =
{
  lat: number,
  lng: number
};

// declare type Trass =
// {

// }