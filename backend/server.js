var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require('cors')
// base

var mongoose = require("mongoose");
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://root:example@localhost:27017");

var contracts = require("./routes/contracts.js")
var publishers = require("./routes/publishers.js")
// config

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

var port = process.env.PORT || 8080;

// Routes

var router = express.Router();

router.get("/", function (req, res) {
  res.json({ message: "Working api!" });
});

// Middleware
router.use(function (req, res, next) {
  // do logging
  next(); // make sure we go to the next routes and don't stop here
});


// Register

app.use("/", router);
app.use("/contracts", contracts)
app.use("/publishers", publishers)

// Start

app.listen(port);
