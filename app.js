require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

// Route imports
var pingRoutes = require("./routes/pingRoutes");

// Mongoose connection for MongoDB
mongoose.Promise = require("bluebird");
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch(err => {
        console.error("App starting error:", err.stack);
        process.exit(1);
    });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routing
app.use("/", pingRoutes);

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

app.listen((port = process.env.PORT || 3000), function() {
    console.log("running at localhost:" + port);
});

module.exports = app;
