var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


mongoose.connect('mongodb://localhost:27017/remixjobs/', function(err) {
  if (err)
  {
    console.log("Mongo must be installed and running for the app to work! please try again");
    console.log("quitting...");
    process.exit();
  }
});

var router = express.Router();
app.use("/", router);

//gestion des formulaires dans le module routes
require("./routes")(router);

//allumage du serveur
var server = app.listen(3000, '0.0.0.0', function () {
var port = server.address().port;

  console.log('RemixJobs api listening at http://localhost:%s', port);
});
