import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { USERNAME } from './util/cookies';
import Nav from './components/nav';
import Login from './components/login';
import Logout from './components/logout';
import PaintUI from './components/paintUI';
import Gallery from './components/gallery';
import GalleryImage from './components/galleryImage';

import './App.scss';

function App() {
  const [cookies] = useCookies([USERNAME]);

  return (
    <Router>
      <Nav username={cookies.username} />
      <div className="App">
        <Switch>
          <Route exact path="/">
            { cookies.username ? <Gallery /> : <Redirect to="/login" /> }
          </Route>
          <Route path="/gallery/:id">
            { cookies.username ? <GalleryImage /> : <Redirect to="/login" /> }
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/draw">
            { cookies.username ? <PaintUI /> : <Redirect to="/login" /> }
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
