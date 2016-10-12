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
