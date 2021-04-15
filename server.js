const express = require('express');
const mongoose = require('mongoose');
const app = express();

// connect to DB (DATABASE_URL provided by environment properties)
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// use express
app.use(express.json());

// add weather routes
const weatherRouter = require('./routes/weather');
app.use('/weather', weatherRouter);

app.get('/', (req, res) => {
  res.send('Weather API');
});

const port = process.env.port || 3000;
app.listen(port, () => console.log('Server Started'));
