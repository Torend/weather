const express = require('express');
const router = express.Router();
const Forecast = require('../models/forecast');

router.get('/data:location', async (req, res) => {
  try {
    result = await Forecast.find({ location: req.params.location }).select([
      'forecastTime',
      'Temperature',
      'Precipitation',
      '-_id',
    ]);

    if (result == null)
      return res.status(404).json({ message: 'Cannot find location' });
    else res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/summarize:location', async (req, res) => {
  try {
    forecastArray = await Forecast.find({
      location: req.params.location,
    }).select(['Temperature', 'Precipitation', '-_id']);

    if (forecastArray == null)
      return res.status(404).json({ message: 'Cannot find location' });
    else {
      let min = {
        Temperature: forecastArray[0].Temperature,
        Precipitation: forecastArray[0].Precipitation,
      };
      let sum = {
        Temperature: forecastArray[0].Temperature,
        Precipitation: forecastArray[0].Precipitation,
      };
      let max = {
        Temperature: forecastArray[0].Temperature,
        Precipitation: forecastArray[0].Precipitation,
      };

      for (let i = 1; i < forecastArray.length; i++) {
        sum.Temperature += forecastArray[i].Temperature;
        sum.Precipitation += forecastArray[i].Precipitation;

        if (forecastArray[i].Temperature > max.Temperature)
          max.Temperature = forecastArray[i].Temperature;

        if (forecastArray[i].Precipitation > max.Precipitation)
          max.Precipitation = forecastArray[i].Precipitation;

        if (forecastArray[i].Temperature < min.Temperature)
          min.Temperature = forecastArray[i].Temperature;

        if (forecastArray[i].Precipitation < min.Precipitation)
          min.Precipitation = forecastArray[i].Precipitation;
      }
      let avg = {
        Temperature: (sum.Temperature / forecastArray.length).toFixed(2),
        Precipitation: (sum.Precipitation / forecastArray.length).toFixed(2),
      };
      res.json({ max, min, avg });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ---------------------------------

// const f = new Forecast({
//     location: '25,30',
//     time: Date.now(),
//     temperature: 46,
//     precipitation: 30,
//   });

//   try {
//     const newForecast = await f.save();
//     res.status(201).json(newForecast);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }

module.exports = router;
