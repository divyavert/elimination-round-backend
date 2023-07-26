const express = require('express');

const app = express();
const stringify = require('csv-stringify').stringify;
const fs = require('fs');
const cors = require('cors');
const { parse } = require('csv-parse');
var crimeRows = [];
app.use(cors());

fs.createReadStream('./crime_data.csv')
  .pipe(parse({ delimiter: ',', from_line: 2 }))
  .on('data', function (row) {
    crimeRows.push(row);
  })
  .on('end', function () {
    // This will be called when all rows have been processed
    const array = [];

    const object = {};

    crimeRows.map((item) => {
      var data = item[9];

      if (data.length == 31) {
        var lat = data.slice(1, 13);
        var long = data.slice(16, data.length - 1);

        var laltitude = parseFloat(lat);
        var longitude = parseFloat(long);

        // console.log(laltitude);
        // console.log(longitude);
        var element = [laltitude, longitude];
        array.push(element);
      }
    });
    const elementCounts = {};
    for (const element of array) {
      const elementStr = element[0];

      if (elementCounts[elementStr]) {
        elementCounts[elementStr]++;
      } else {
        elementCounts[elementStr] = 1;
      }
    }
    console.log(elementCounts);

    app.get('/crime-data', function (req, res) {
      res.json({ array, count: elementCounts });
    });
  });

app.listen(4000);
