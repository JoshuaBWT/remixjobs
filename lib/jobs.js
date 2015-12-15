var Job = require("./models/job");
var scraper = require('./scrap/remixScrap.js');

module.exports.createOne = function(req, res) {
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

/**
 * find all the jobs for the current request
 * @param  {[type]} latest parameters used to get the last 10 items
 */
module.exports.findAll = function(req, res, latest) {
    var query = Job.find({});
    if(req.query.contract)
    {
      var regex = new RegExp(req.query.contract, "i");
      query.where('contract', regex);
    }
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
    if(req.query.tags)
    {
      var tags = req.query.tags.split(',');
      var regex = [];
      tags.forEach(function (element, index, array) {
        var item = {};
        var reg = new RegExp(element, "i");
        item["tags"] = reg;
        regex.push(item);
      });
      query.and(regex);
      //query.where('tags', regex);
    }
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
        {
          if(req.query.filters)
          {
            var filters = req.query.filters.split(',');
            res.status(200).send(filtersFormatting(jobs, filters));
          }
          else
            res.status(200).json(jobs);
        }
    });
};

/**
 * Returning waterfall json object with filters
 * @param  {[type]} jobs    jobs array
 * @param  {[type]} filters filters array
 * @return {[type]}         waterfall jsonObject
 */
function filtersFormatting(jobs, filters)
{
  var curFilt = filters.slice();
  var result = {};
  jobs.forEach(function(job) {
      if(result[job[filters[0]]] == null) {
        result[job[filters[0]]] = [];
      }
      result[job[filters[0]]].push(job);
  });
  curFilt.shift();
  if(filters.length > 1)

  for (var key in result) {
    if (result.hasOwnProperty(key)) {
        //console.log(key, values);
        result[key] = filtersFormatting(result[key], curFilt);
    }
  }
  return result;
}

module.exports.findById = function(req, res) {
  Job.findById(req.params.job_id, function(err, job) {
      if (err)
          res.status(400).send(err);
      res.status(200).json(job);
  });
};


module.exports.updateOne = function(req, res) {
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
            res.status(400).send(err);
          res.status(201).json({message : "job updated successfully!"});
      });
  });
};

module.exports.deleteOne = function(req, res) {
  Job.remove({ _id: req.params.job_id }, function(err, job) {
        if (err)
            res.status(400).send(err);
        res.status(200).json({ message: 'Successfully deleted' });
    });
};
