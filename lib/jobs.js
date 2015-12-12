var Job = require("./models/job");

exports.createOne = function(req, res) {
  var Job = new Job();
  Job.name = req.body.name;
  Job.save(function(err) {
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
        res.json(jobs);
    });
};

exports.findById = function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
};
