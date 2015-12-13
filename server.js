var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var router = express.Router();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use("/", router);

mongoose.createConnection('mongodb://localhost:27017/remixjobs');

//gestion des formulaires dans le module routes
require("./routes")(router);

//allumage du serveur
var server = app.listen(3000, '0.0.0.0', function () {
  var port = server.address().port;

  console.log('RemixJobs api listening at http://localhost:%s', port);
});
