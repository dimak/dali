import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Nav from './components/nav';
import Login from './components/login';
import PaintUI from './components/paintUI';
import Gallery from './components/gallery';

import './App.scss';

function App() {
  return (
    <Router>
      <Nav />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Gallery />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/draw">
            <PaintUI />
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
