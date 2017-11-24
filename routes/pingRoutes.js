var express = require("express");
var pingRouter = new express.Router();
var Pings = require("../models/pingModel");

const SECONDS_IN_A_DAY = 86400;

// POST - route clear stored pings
pingRouter.route("/clear_data").post(function(req, res) {
    Pings.collection.drop().then(() => {
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
            res.status(200).json({
                device_id: req.params.deviceID,
                epoch_time: req.params.epochTime
            });
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

// GET - route to retrieve pings based on date
pingRouter.route("/devices").get(function(req, res) {
    Pings.find({}, function(err, docs) {
        if (docs === undefined) {
            res.json({
                error: "No devices are stored."
            });
        } else {
            let deviceArray = [];
            docs.map(doc => {
                if (!deviceArray.includes(doc.device_id)) {
                    deviceArray.push(doc.device_id);
                }
            });
            res.json(deviceArray);
        }
    });
});

// GET - route to retrieve pings based on date
pingRouter.route("/:deviceID/:date").get(function(req, res) {
    let startEpochTime = req.params.date;
    if (startEpochTime.includes("-")) {
        startEpochTime = parseInt(Date.parse(req.params.date)) / 1000;
    }
    let endEpochTime = startEpochTime + SECONDS_IN_A_DAY;

    if (req.params.deviceID === "all") {
        GetAllPingsBetween(startEpochTime, endEpochTime, res);
    } else {
        GetPingsBetweenByDevice(
            req.params.deviceID,
            startEpochTime,
            endEpochTime,
            res
        );
    }
});

// GET - route to retrieve pings from an epoch or date, to an epoch or date
pingRouter.route("/:deviceID/:from/:to").get(function(req, res) {
    let startEpochTime = req.params.from;
    let endEpochTime = req.params.to;

    if (startEpochTime.includes("-")) {
        startEpochTime = parseInt(Date.parse(req.params.from)) / 1000;
    }
    if (endEpochTime.includes("-")) {
        endEpochTime = parseInt(Date.parse(req.params.to)) / 1000;
    }

    if (req.params.deviceID === "all") {
        GetAllPingsBetween(startEpochTime, endEpochTime, res);
    } else {
        GetPingsBetweenByDevice(
            req.params.deviceID,
            startEpochTime,
            endEpochTime,
            res
        );
    }
});

// Helper functions //
function GetAllPingsBetween(startEpochTime, endEpochTime, response) {
    Pings.find(
        { epoch_time: { $gte: startEpochTime, $lt: endEpochTime } },
        function(err, docs) {
            if (docs === undefined) {
                response.json({
                    error: "That device ID has no pings recorded on that day."
                });
            } else {
                let pingsJSON = {};
                docs.map(doc => {
                    pingsJSON[doc.device_id] = [];
                });
                docs.map(doc => {
                    pingsJSON[doc.device_id].push(doc.epoch_time);
                });
                response.json(pingsJSON);
            }
        }
    );
}

function GetPingsBetweenByDevice(
    deviceID,
    startEpochTime,
    endEpochTime,
    response
) {
    Pings.find(
        {
            $and: [
                { device_id: deviceID },
                {
                    epoch_time: {
                        $gte: startEpochTime,
                        $lt: endEpochTime
                    }
                }
            ]
        },
        function(err, docs) {
            if (docs === undefined) {
                response.json({
                    error: "That device ID has no pings recorded on that day."
                });
            } else {
                let pingsArray = docs.map(doc => {
                    return doc.epoch_time;
                });
                response.json(pingsArray);
            }
        }
    );
}

module.exports = pingRouter;
