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
  dataStorage: dataStorageStore
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
  }
};

declare type VehicleMeta =
{
  title: string,
  code: string
};

interface FormControlEventTarget extends EventTarget
{
  value: string;
}

interface InputChangeEvent extends Event
{
  target: FormControlEventTarget;
}
