var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/remixjobs');

var Job = new Schema({
  jobId: String,
  url: String,
  title: String,
  company: String,
  localization: String,
  category: String,
  description: String,
  contract: String,
  date: String,
  tags: [String]
});

module.exports = mongoose.model('Job', Job);
