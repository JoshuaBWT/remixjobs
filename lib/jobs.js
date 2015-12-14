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
          res.status(201).json({ message: 'Job created!' });
    });
};

exports.findAll = function(req, res, latest) {
    var query = Job.find({});
    if(req.query.contract)
      query.where('contract', req.query.contract);
    if(req.query.category) {
      var regex = new RegExp(req.query.category, "i");
      query.where('category', regex);
    }
    if(req.query.localization) {
      var regex = new RegExp(req.query.localization, "i");
      query.where('localization', regex);
    }
    if(req.query.limit)
      query.limit(Number(req.query.limit));
    if(req.query.company)
      query.where('company', req.query.company);

    //triage
    if(req.query.sortDesc) {
        var sortObject = {};
        sortObject[req.query.sortDesc] = -1;
        query.sort(sortObject);
    }
    if(req.query.sortAsc) {
      var sortObject = {};
      sortObject[req.query.sortAsc] = 1;
      query.sort(sortObject);
    }

    //if call comes from jobs/lastest
    if(latest) {
      query.sort({date : -1});
      query.limit(latest);
    }

    query.exec(function(err, jobs) {
        if(err) {
          res.status(400).send(err);
          return;
        }

        if(jobs.length == 0 && Object.keys(req.query).length == 0)
          scraper.fetchAllJobs(req, res, function(allJobs) {
              res.status(202).json({message : "empty request : we updated the database. Now please try again (if note try the api call /updateBase)"});
          });
        else
          res.status(200).json(jobs);
    });
};

exports.findById = function(req, res) {
  Job.findById(req.params.job_id, function(err, job) {
      if (err)
          res.status(400).send(err);
      res.status(200).json(job);
  });
};


exports.updateOne = function(req, res) {
  Job.findById(req.params.job_id, function(err, job)
  {
      if (err) {
          res.status(400).send(err);
          return;
      }

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
          res.status(201).json({message : "job updated successfully!"});
      });
  });
};

exports.deleteOne = function(req, res) {
  Job.remove({ _id: req.params.job_id }, function(err, job) {
        if (err)
            res.status(400).send(err);
        res.status(200).json({ message: 'Successfully deleted' });
    });
};
