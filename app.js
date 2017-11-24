var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Route imports
var pingRoutes = require("./routes/pingRoutes");
//var todoListRoutes = require("./routes/todoListRoutes");

// Mongoose connection with mongodb
mongoose.Promise = require("bluebird");
mongoose
    .connect("localhost:27017")
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch(err => {
        console.error("App starting error:", err.stack);
        process.exit(1);
    });

var app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing
app.use("/", pingRoutes);

// Error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
});

app.listen((port = process.env.PORT || 4200), function () {
    console.log("running at localhost:" + port);
});

module.exports = app;
