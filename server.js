import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import api from './api/index.js';

const app = express();
const port = process.env.PORT || 3001;

// establish DB connection
api.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// allowing for CORS for everything, from localhost
// normally, there would be more restrictions here and would include the deployment server as well
app.use(cors({
  origin: /^https?:\/\/localhost/
}));

// set up CRUD routes for REST api

// read all
app.get('/api/art', (req, res) => {
  res.send([{ id: 1234, userId: 458430, thumb: '1234.png', points: [[]] }]);
});

// read one
app.get('/api/art/:id', (req, res) => {
  res.send({ id: +req.params.id, userId: 458430, thumb: '1234.png', points: [[]] });
});

// create
app.post('/api/art', (req, res) => {
  res.send('Created');
});

// remove
app.delete('/api/art/:id', (req, res) => {
  res.send('Deleted');
});

app.post('/api/user/create', api.userCreate);
app.post('/api/user/login', api.userLogin);

app.get('/api/ping', api.ping);

app.listen(port, () => console.log(`Listening on port ${port}`));
