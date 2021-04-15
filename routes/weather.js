const express = require('express');
const router = express.Router();
const Forecast = require('../models/forecast');

router.get('/', (req, res) => {
  return res.json({ message: weather });
});

router.get('/data', async (req, res) => {
  try {
    forecastArray = await Forecast.find({
      Longitude: req.query.lon,
      Latitude: req.query.lat,
    }).select(['forecastTime', 'Temperature', 'Precipitation', '-_id']);

    if (forecastArray.length == 0)
      return res.status(404).json({ message: 'Cannot find the location' });
    else res.json(forecastArray);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/summarize', async (req, res) => {
  try {
    forecastArray = await Forecast.find({
      Latitude: req.query.lat,
      Longitude: req.query.lon,
    }).select(['Temperature', 'Precipitation', '-_id']);

    if (forecastArray.length == 0)
      return res.status(404).json({ message: 'Cannot find the location' });
    else {
      const min = {
        Temperature: forecastArray[0].Temperature,
        Precipitation: forecastArray[0].Precipitation,
      };

      const max = {
        Temperature: forecastArray[0].Temperature,
        Precipitation: forecastArray[0].Precipitation,
      };

      for (let i = 1; i < forecastArray.length; i++) {
        if (forecastArray[i].Temperature > max.Temperature)
          max.Temperature = forecastArray[i].Temperature;

        if (forecastArray[i].Precipitation > max.Precipitation)
          max.Precipitation = forecastArray[i].Precipitation;

        if (forecastArray[i].Temperature < min.Temperature)
          min.Temperature = forecastArray[i].Temperature;

        if (forecastArray[i].Precipitation < min.Precipitation)
          min.Precipitation = forecastArray[i].Precipitation;
      }

      const sum = forecastArray.reduce(
        (sum, { Temperature, Precipitation }) => {
          return {
            Temperature: (sum.Temperature += Temperature),
            Precipitation: (sum.Precipitation += Precipitation),
          };
        },
        { Temperature: 0, Precipitation: 0 }
      );

      const avg = {
        Temperature: (sum.Temperature / forecastArray.length).toFixed(2),
        Precipitation: (sum.Precipitation / forecastArray.length).toFixed(2),
      };

      res.json({ max, min, avg });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
