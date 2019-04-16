import React, { Component } from 'react';

import { Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';

import Home from './pages/home';
import Dashboard from './pages/dashboard';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/dashboard" component={Dashboard}/>
          <Redirect from="*" to="/"/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
