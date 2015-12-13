var request = require('request');
var cheerio = require('cheerio');

var Job = require('../models/job');

module.exports = {
    fetchAllJobs : fetchAllJobs
}

function fetchAllJobs(req, res, cleaned)
{
  //If not clean, we clean then we call back the function with cleaned as true to add data
  //So there is no conflict between data being erased and data being added at the same time
  if(!cleaned)
  {
    //cleaning Job collection
    Job.remove({}, function(err)
    {
        console.log('collection job cleaned');
        fetchAllJobs(req, res, true);
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
          Job.create(allJobs, function (err, docs)
          {
            if (err) {
              res.send(err);
              return;
            }
            console.log('All ' + allJobs.length + ' Jobs created successfully');
            res.send({message : 'All ' + allJobs.length + ' Jobs created successfully'});
          });
        }
    });
  }
}

function fetchJobsOnPage(url, req, res, callback) {
  request(url, function(err, response, html) {
      if(err)
        return;

      var $ = cheerio.load(html);
      var jobs = [];
        $('.jobs-list').children().each( function() {
            var job = new Job();
            job.jobId = Number($(this).attr('data-job-id'));
            //job._id = job.jobId;
            job.title = $(this).find('.job-title').text().trim();
            job.contract = $(this).find('.contract.clearfix').attr('data-contract-type');
            job.company = $(this).find('.company').text();
            job.localization = $(this).find('.workplace').attr('data-workplace-name');
            job.date = $(this).find('.job-details-right').text();
            var tags = [];
            $(this).find('.job-tags').children().each(function ()
            {
                tags.push($(this).attr('data-tag-name'));
            });
            job.tags = tags;
            job.url = "https://remixjobs.com" +  $(this).find(".job-link").attr('href');
            ["Developpement", "Reseau", "Design", "Seo", "Sem", "Marketing", "Projets", "Autres"]
              .forEach( function(element, index, array) {
                if(job.url.indexOf(element) > -1)
                  job.category = element;
            });
            job.description = "";
            jobs.push(job);
            /*
            request(job.url, function(err, response, html) {
                var $ = cheerio.load(html);
                var node = $('.job-wrapper > .job-description');
                if(node != null)
                  job.description = node.html();
                //console.log(job.description);
                jobs.push(job);
                callback(jobs);
            });
            */
        });
        callback(jobs);
    });
}
