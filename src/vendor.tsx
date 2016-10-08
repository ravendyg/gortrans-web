/// <reference path="../typings/index.d.ts" />

import { createStore, combineReducers } from 'redux';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as ReactRouter from 'react-router';

const Redux = { createStore, combineReducers };

export {
	React, ReactDom, ReactRouter,
	Redux
};