import React from 'react';
import * as Sentry from '@sentry/browser';
import { render } from 'react-dom';
import App from './App';

Sentry.init({dsn: "https://9bee09fb73c24ad6ac26c116b5ab9cd4@sentry.io/1547085"});

render(<App/>, document.getElementById('app'));