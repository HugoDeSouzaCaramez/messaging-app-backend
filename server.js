import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import Messages from './dbMessages.js';
//App Config
const app = express();
const port = process.env.PORT || 9000;
const connection_url =
  'mongodb+srv://admin:91944678Hugo@cluster0.048pwdo.mongodb.net/?retryWrites=true&w=majority';
//Middleware
app.use(express.json());
app.use(Cors());
//DB Config
mongoose.connect(connection_url, {});
//API Endpoints
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
