import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
//App Config
const app = express();
const port = process.env.PORT || 9000;
const connection_url =
  'mongodb+srv://admin:91944678Hugo@cluster0.048pwdo.mongodb.net/?retryWrites=true&w=majority';

const pusher = new Pusher({
  appId: '1717506',
  key: 'b56b184082dd650d6ad2',
  secret: 'b2ef58ee33ceed1b44c9',
  cluster: 'sa1',
  useTLS: true,
});
//Middleware
app.use(express.json());
app.use(Cors());
//DB Config
mongoose.connect(connection_url, {});
//API Endpoints
const db = mongoose.connection;
db.once('open', () => {
  console.log('DB Connected');
  const msgCollection = db.collection('messagingmessages');
  const changeStream = msgCollection.watch();
  changeStream.on('change', (change) => {
    console.log(change);
    if (change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted', {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log('Error trigerring Pusher');
    }
  });
});
app.get('/', (req, res) => res.status(200).send('Hello TheWebDev'));
app.post('/messages/new', async (req, res) => {
  try {
    const data = req.body;
    Messages.create(data);
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get('/messages/sync', async (req, res) => {
  try {
    const data = await Messages.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
