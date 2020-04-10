'use strict';

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: String,
  name: String,
  url: String
});

const Job = mongoose.model('Job', jobSchema);
module.exports = { Job };
