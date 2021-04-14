const express = require('express');
const app = express();
const csv = require('csvtojson');
const mongoose = require('mongoose');
const Forecast = require('./models/forecast');

mongoose.connect(
  'mongodb+srv://Torend:24882488tD@weather.pez8t.mongodb.net/weather',
  {
    useNewUrlParser: true,
  }
); // TODO check the url for mongodb on deployment
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const weatherRouter = require('./routes/weather');
app.use('/weather', weatherRouter);

async function initData() {
  const file1 = await csv().fromFile('file1.csv');
  await insertData(file1);
  console.log('file1 - Done');
  const file2 = await csv().fromFile('file2.csv');
  await insertData(file2);
  console.log('file2 - Done');
  const file3 = await csv().fromFile('file3.csv');
  await insertData(file3);
  console.log('file3 - Done');
}

async function insertData(data) {
  for (let i = 0; i < 3; i++) {
    const f = new Forecast({
      location:
        parseFloat(data[i].Longitude) + ',' + parseFloat(data[i].Latitude),
      forecastTime: data[i].forecast_time,
      Temperature: data[i]['Temperature Celsius'],
      Precipitation: data[i]['Precipitation Rate mm/hr'],
    });
    try {
      await f.save();
    } catch (err) {
      console.error(err);
    }
  }
}

initData();

app.listen(3000, () => console.log('Server Started'));

//   const f = new Forecast({
//     location: '25,30',
//     time: Date.now(),
//     temperature: 46,
//     precipitation: 30,
//   });

// app.get('/', async (req, res) => {
//   res.send('/');
// });

// app.get('/data', async (req, res) => {
//   res.send(getData);
// });

// {-100, 30: {
//     2013/20/04: {
//         precipation: 223,
//         temp: 30,
//     }

//     2013/20/04: {
//         precipation: 223,
//         temp: 30,
//     }
//     2013/20/04: {
//         precipation: 223,
//         temp: 30,
//     }
// }}
