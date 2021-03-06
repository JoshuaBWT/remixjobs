var Job = require("./models/job");
var jobs = require("./jobs");

/**
 * find all the companies
 * @param  {[type]} req [request]
 * @param  {[type]} res [response]
 */
module.exports.findAll = function(req, res) {
    Job.aggregate({ $group : { _id: "$company", count: {$sum : 1}, jobs: { $push : {id : "$_id", title: "$title"}}}},
                  { $project : { _id : 0, company : "$_id", count: 1, jobs: 1 }},
                  { $sort : { count : -1 }})
     .exec(function(err, items) {
      if(err)
        res.status(401).send(err);
      res.status(200).send(items);
   });
};

/**
 * find all the jobs for a given company
 * @param  {[type]} req request
 * @param  {[type]} res response
 */
module.exports.findAllJobs = function(req, res) {
    req.query.company = req.params.company_name;
    jobs.findAll(req, res);
};
