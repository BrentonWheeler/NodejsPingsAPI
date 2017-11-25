var express = require("express");
var pingRouter = new express.Router();
var Pings = require("../models/pingModel");
var mongoosePingHelpers = require("../modules/mongoosePingHelpers");
const SECONDS_IN_A_DAY = 86400;

// POST - route clear stored pings
pingRouter.route("/clear_data").post(function(req, res) {
    Pings.remove({}, () => {
        res.sendStatus(200);
    });
});

// POST - route to recieve and store pings
pingRouter.route("/:deviceID/:epochTime").post(function(req, res) {
    Pings({
        device_id: req.params.deviceID,
        epoch_time: req.params.epochTime
    })
        .save()
        .then(entry => {
            res.status(200).json(entry);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database.");
        });
});

// GET - route to return all devices
pingRouter.route("/devices").get(function(req, res) {
    Pings.distinct("device_id", function(err, docs) {
        if (docs === undefined) {
            res.json({
                error: "No devices found."
            });
        } else {
            res.json(docs);
        }
    });
});

// GET - route to return pings on an ISO date from specified deviceID or "all" devices
pingRouter.route("/:deviceID/:date").get(function(req, res) {
    let startEpochTime = req.params.date;
    if (startEpochTime.includes("-")) {
        startEpochTime = Date.parse(req.params.date) / 1000;
    }
    let endEpochTime = startEpochTime + SECONDS_IN_A_DAY;

    if (req.params.deviceID === "all") {
        mongoosePingHelpers.GetPingsBetween(startEpochTime, endEpochTime).then(json => {
            res.json(json);
        });
    } else {
        mongoosePingHelpers.GetPingsBetweenByDevice(startEpochTime, endEpochTime, req.params.deviceID).then(json => {
            res.json(json);
        });
    }
});

// GET - route to return pings :from an epoch time or ISO date, :to an epoch time or ISO date
pingRouter.route("/:deviceID/:from/:to").get(function(req, res) {
    let startEpochTime = req.params.from;
    let endEpochTime = req.params.to;

    if (startEpochTime.includes("-")) {
        startEpochTime = Date.parse(req.params.from) / 1000;
    }
    if (endEpochTime.includes("-")) {
        endEpochTime = Date.parse(req.params.to) / 1000;
    }

    if (req.params.deviceID === "all") {
        mongoosePingHelpers.GetPingsBetween(startEpochTime, endEpochTime).then(json => {
            res.json(json);
        });
    } else {
        mongoosePingHelpers.GetPingsBetweenByDevice(startEpochTime, endEpochTime, req.params.deviceID).then(json => {
            res.json(json);
        });
    }
});

module.exports = pingRouter;
