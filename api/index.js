import mongodb from 'mongodb';
import md5 from 'md5';

const { MongoClient } = mongodb;

// Connection URL
const URL = 'mongodb://localhost:27017';

// Database Name
const DB_NAME = 'DaliApp';
const USER = 'User';
const ART = 'Art';

// cached db vars
let db;
const COLLECTIONS = {
  [USER]: null,
  [ART]: null
}

async function connect() {
  // Use connect method to connect to the server
  const client = await MongoClient.connect(URL);
  db = client.db(DB_NAME);
  COLLECTIONS[USER] = db.collection(USER);
  COLLECTIONS[ART] = db.collection(ART);

  console.log('Connection to DB Client established');
}

function ping(req, res) {
  // Use connect method to connect to the server
  res.send(`We're connected to ${db.databaseName}`);
}

async function createUser(req, res) {
  const { username } = req.params;
  const collection = COLLECTIONS[USER];

  // check if a user with that name already exists
  const userExists = await collection.find({ username }).toArray();
  console.log(userExists);
  if (!userExists.length) {
    const insertedUser = await COLLECTIONS[USER].insertOne({
      _id: md5(username),
      username,
    });
    res.json(insertedUser);
  } else {
    res.status(409);
    res.json({ error: 'user already exists' });
  }
}

export default {
  connect,
  ping,
  createUser,
}
