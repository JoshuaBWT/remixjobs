var Job = require("./models/job");
var scraper = require('./scrap/remixScrap.js');

exports.createOne = function(req, res) {
  var job = new Job();
  job.jobId = req.body.jobId;
  job.url = req.body.url;
  job.title = req.body.title;
  job.company = req.body.company;
  job.localization = req.body.localization;
  job.category = req.body.category;
  job.description = req.body.description;
  job.contract = req.body.contract;
  job.date = req.body.date;
  job.tags = req.body.tags;
  job.save(function(err) {
      if (err)
          res.send(err);
          res.json({ message: 'Job created!' });
    });
};

exports.findAll = function(req, res) {
    var q = req.query.q;
    var contract = req.query.contract;
    var category = req.query.category;
    var where = req.query.where;
    var limit = req.query.limit;
    Job.find(function(err, jobs) {
        if(err)
        {
          res.send(err);
          return;
        }
        if(jobs.length == 0)
          scraper.fetchAllJobs(req, res, function(allJobs) {
              res.json({message : "empty request : updated database please try again"});
          });
        else
        res.json(jobs);
    });
};

exports.findById = function(req, res) {
  Job.findById(req.params.job_id, function(err, job) {
      if (err)
          res.send(err);
      res.json(job);
  });
}


exports.updateOne = function(req, res) {
  Job.findById(req.params.job_id, function(err, job)
  {
      if (err)
          res.send(err);

      if(req.body.jobId)
        job.jobId = req.body.jobId;
      if(req.body.url)
        job.url = req.body.url;
      if(req.body.title)
        job.title = req.body.title;
      if(req.body.company)
        job.company = req.body.company;
      if(req.body.localization)
        job.localization = req.body.localization;
      if(req.body.category)
        job.category = req.body.category;
      if(req.body.description)
        job.description = req.body.description;
      if(req.body.contract)
        job.contract = req.body.contract;
      if(req.body.date)
        job.date = req.body.date;
      if(req.body.tags)
        job.tags = req.body.tags;

      job.save(function(err)
      {
          if (err)
            res.send(err);
          res.json({message : "job updated successfully!"});
      });
  });
};

exports.deleteOne = function(req, res) {
  Job.remove({ _id: req.params.job_id }, function(err, bear) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
};
