import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import GamePage from './containers/GamePage';
import ParticleStormPage from './containers/ParticleStormPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/home" component={HomePage} />
    <Route path="/game" component={GamePage} />
    <Route path="/particle-storm" component={ParticleStormPage} />
  </Route>
);
