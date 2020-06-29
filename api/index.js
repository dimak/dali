import mongodb from 'mongodb';
import md5 from 'md5';
import cookies from 'cookies';

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

/**
 * attempts to find a user based on any passed props; can't search by only password
 * @param {Object} props anything to use to find the user
 */
async function findUser(props) {
  if (props.password && !props.username) {
    return null;
  }

  const collection = COLLECTIONS[USER];
  const userExists = await collection.find(props).toArray();

  return userExists.length ? userExists[0] : null;
}

/**
 * attempt to log a user in
 */
async function userLogin(req, res) {
  const { username, password: rawPw } = req.body;
  const password = md5(rawPw);

  const user = await findUser({ username, password });

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(404);
    res.json({ error: 'Username or incorrect is password' });
  }
}

async function userCreate(req, res) {
  const { username, password: rawPw } = req.body;
  const password = md5(rawPw);

  console.log(username, password);

  const collection = COLLECTIONS[USER];

  // check if a user with that name already exists
  const userExists = await findUser({ username });

  if (!userExists) {
    const insertedUser = await COLLECTIONS[USER].insertOne({
      _id: md5(username),
      username,
      password,
    });

    res.status(201);
    res.json({
      _id: insertedUser._id,
      username: insertedUser.username,
    });
  } else {
    res.status(409);
    res.json({ error: 'User already exists' });
  }
}

export default {
  connect,
  ping,
  userCreate,
  userLogin,
}
