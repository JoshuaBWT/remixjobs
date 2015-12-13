var express = require('express');
var path = require('path');
var jobs = require('./lib/jobs.js');
var scraper = require('./lib/scrap/remixScrap.js');

module.exports = function(router)
{
  router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
  });

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
  });

  router.route('/jobs')
    .post(function (req, res) {
      //later
      jobs.createOne(req, res);
    })
    .get(function (req, res) {
       jobs.findAll(req, res);
    });

    router.route('/jobs/:job_id')
    .get(function(req, res) {
        jobs.findById(req, res);
    })
    .put(function(req, res) {
        jobs.updateOne(req, res);
    })
    .delete(function(req, res) {
        jobs.deleteOne(req, res);
    });



    //Fill the mongodb with some good scraping
    router.route('/updateBase')
      .get(function(req, res)
      {
          scraper.fetchAllJobs(req, res);
      });
}