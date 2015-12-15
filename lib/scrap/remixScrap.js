var request = require('request');
var cheerio = require('cheerio');

var Job = require('../models/job');

module.exports = {
    fetchAllJobs : fetchAllJobs
}

/**
 * fetch all the jobs and insert them into the mongodb remixjobs collection
 * @param  {[type]}   req      request
 * @param  {[type]}   res      response
 * @param  {Function} callback callback when done
 * @param  {[bool]}   cleaned  boolean set to true if the mongodb collection has already been cleaned
 */
function fetchAllJobs(req, res, callback, cleaned)
{
  //If not clean, we clean then we call back the function with cleaned as true to add data
  //So there is no conflict between data being erased and data being added at the same time
  if(!cleaned)
  {
    //cleaning Job collection
    Job.remove({}, function(err)
    {
        console.log('collection job cleaned');
        fetchAllJobs(req, res, callback, true);
        return;
    });
    return;
  }
  var urls = [];
  var allJobs = [];
  var count = 50;
  //On récupère les 10 premieres pages
  for(var i = 1; i < count; i++)
    urls.push("https://remixjobs.com/?page=" + i + "&in=all");

  var index = 0;
  for(var i = 0; i < urls.length; i++) {
    fetchJobsOnPage(urls[i], req, res, function(jobs)
    {
        ++index;
        allJobs = allJobs.concat(jobs);
        if(index == urls.length - 1)
        {
          //console.log("fetching jobs done, now fetching descriptions");
          //fetchDescription(allJobs, function(allJobsWDesc)
          //{
          //  console.log("description fetching done, saving");

            //Save all jobs with moongoose create function
            Job.create(allJobs, function (err, docs)
            {
              if (err) {
                res.send(err);
                return;
              }
              console.log('All ' + allJobs.length + ' Jobs created successfully');
              callback(allJobs);
            });
            //  });
        }
    });
  }
}

/**
 * Fetch the descriptions of the given jobs (CURRENTLY NOT WORKING)
 * @param  {[Job]}   jobs     Array of jobs
 * @param  {Function} callback callback when done
 */
function fetchDescription(jobs, callback)
{
  var count = jobs.length;
  var index = 0;
  jobs.forEach(function(job, index, array) {
    request({url: job.url, timeout: 400000}, function(err, response, html) {
          if(err)
          {
            console.log(err, index);
          }
          else {
            var $ = cheerio.load(html);
            var node = $('.job-description');

            if(node != null)
              job.description = node.text();
            else
              job.description = "";
            if(job.description == "")
              console.log(index, " is null");
          }
          ++index;
          if(index == count)
            callback(jobs);
    });
  });
}

/**
 * Fetch the jobs on the current page
 * @param  {[string]}   url      the page url (ex: remixjobs.com/page=1)
 * @param  {[type]}   req      request
 * @param  {[type]}   res      response
 * @param  {Function} callback callback function
 * @return {[type]}            [description]
 */
function fetchJobsOnPage(url, req, res, callback) {
  request(url, function(err, response, html) {
      if(err)
        return;

      var $ = cheerio.load(html);
      var jobs = [];
      var countPage = $('.jobs-list').children().length;
      var count = 0;
        $('.jobs-list').children().each( function() {
            var job = new Job();
            job.jobId = Number($(this).attr('data-job-id'));
            //job._id = job.jobId;
            job.title = $(this).find('.job-title').text().trim();
            job.contract = $(this).find('.contract.clearfix').attr('data-contract-type');
            job.company = $(this).find('.company').text();
            job.localization = $(this).find('.workplace').attr('data-workplace-name');
            var date = $(this).find('.job-details-right').text();
            if(date.indexOf("minute") > -1 || date.indexOf("heure") > -1)
              job.date = new Date();
            else
            ["jan", "fev", "mars", "avr", "mai", "juin", "juil.", "août", "sept", "oct", "nov", "déc"]
            .forEach(function(element, index, array) {
                if(date.indexOf(element) > -1)
                {
                   var dateString = date.split(' ')[2]
                   + "-" + ((index < 10)? '0' + (index + 1) : (index + 1))
                   + "-" + ((date.split(' ')[0] < 10)? '0' + date.split(' ')[0] : date.split(' ')[0])

                  // format must be yyyy-MM-dd
                   job.date = Date.parse(dateString);
                }
            });
            job.date = $(this).find('.job-details-right').text();
            var tags = [];
            $(this).find('.job-tags').children().each(function ()
            {
                tags.push($(this).attr('data-tag-name'));
            });
            job.tags = tags;
            job.url = "https://remixjobs.com" +  $(this).find(".job-link").attr('href');
            job.category = job.url.split('/')[4];
            job.description = "";

            jobs.push(job);
        });
        callback(jobs);
    });
}
