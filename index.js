const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');

const { Job } = require('./model/job')

cron.schedule('*/5 * * * * *', async () => {

  await mongoose.connect('mongodb://localhost/scrapper', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('running a task every minute');
  const torre = await axios.post('https://search.torre.co/opportunities/_search/?currency=USD%24&page=0&periodicity=hourly&aggregate=true&offset=0&size=5', {
    "and": [
      {
        "location": {
          "term": "Colombia"
        }
      },
      {
        "remote": {
          "term": true
        }
      }
    ]
  });

  torre.data.results.forEach(async r => {
    console.log(`theId: ${r.id}, and the objective: ${r.objective}`)
    console.log(`the url: https://torre.co/api/opportunities/${r.id}`);

    const foundJob = await Job.find({ id: r.id });

    if (foundJob.length === 0) {
      await new Job({
        id: r.id,
        name: r.objective,
        url: `https://torre.co/api/opportunities/${r.id}`
      }).save();
    }
  });
});
