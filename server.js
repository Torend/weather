const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const weatherRouter = require('./routes/weather');
app.use('/weather', weatherRouter);

const port = process.env.port || 3000;
app.listen(port, () => console.log('Server Started'));
