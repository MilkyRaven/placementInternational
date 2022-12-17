const PORT = 3000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require("fs");
const { stringify } = require("csv-stringify");

const app = express();

const url = "https://www.hosco.com/en/jobs";

//document
const filename = "saved_jobs.csv";
const savedData = fs.createWriteStream(filename);

const columns = [
    "jobTitle",
    "location",
    "duration"
];

const savedJobs = [];
async function scrap() {
    try {
        const response = await axios(url, {
            headers: { "Accept-Encoding": "gzip,deflate,compress" }
        });
        const html = response.data;
        const $ = cheerio.load(html)
        $('.JobTileContent__TextWrapper-sc-byt6e7-1, .dOJPvm', html).each(function () {
            const location = $(this).find(".JobTileContent__Location-sc-byt6e7-5").text()
            const duration = $(this).find(".cYMzwf").text()
            const jobTitle = $(this).find('a').text()
            savedJobs.push({
                jobTitle,
                location,
                duration
            })
        })
        const stringifier = stringify({ header: true, columns: columns });
        savedJobs.forEach((row) => {
            stringifier.write(row)
        })
          stringifier.pipe(savedData);
          console.log("Finished writing data");

    } catch (error) {
        console.log(error)
    }
}
scrap();



app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));