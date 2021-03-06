var express = require('express');
var path = require('path');
var jobs = require('./lib/jobs.js');
var companies = require('./lib/companies.js');
var scraper = require('./lib/scrap/remixScrap.js');

module.exports = function(router)
{
  router.use(function(req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
  });

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
  });

  router.route('/jobs')
  .post(function (req, res) { jobs.createOne(req, res); })
  .get(function (req, res) { jobs.findAll(req, res); });

  router.route('/jobs/:job_id')
  .get(function(req, res) {
      //si /jobs/latest
      if(req.params.job_id == "latest")
        jobs.findAll(req, res, 10);
      else
        jobs.findById(req, res);
  })
  .put(function(req, res) { jobs.updateOne(req, res); })
  .delete(function(req, res) { jobs.deleteOne(req, res); });

  router.route('/companies')
  .get(function(req, res) { companies.findAll(req, res); });

  router.route('/companies/:company_name')
  .get(function(req, res) { companies.findAllJobs(req, res); });


    //Fill the mongodb with some good scraping
  router.route('/updateBase')
    .get(function(req, res)
    {
        scraper.fetchAllJobs(req, res, function(allJobs) {
          res.send({message : 'All ' + allJobs.length + ' Jobs created successfully'});
        });
    });
}
