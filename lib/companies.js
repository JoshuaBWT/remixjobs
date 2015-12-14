var Job = require("./models/job");

exports.findAll = function(req, res) {
    Job.aggregate({ $group : { _id: "$company", count: {$sum : 1}}},
                  { $project : { _id : 0, company : "$_id", count: 1 }},
                  { $sort : { count : -1 }})
       .exec(function(err, items) {
          if(err)
            res.status(401).send(err);
          res.status(200).send(items);
       });
}
