var express = require("express");
var pingRouter = new express.Router();
var Pings = require("../models/pingModel");
var moment = require("moment");

// POST - route to recieve and store pings //need to change to a post
pingRouter.route("/:deviceID/:epochTime").post(function (req, res) {
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
pingRouter.route("/:deviceID/:date").get(function (req, res) {
    let startEpochTime = moment(req.params.date).unix();
    let secondsInADay = 86400;
    let endEpochTime = startEpochTime + secondsInADay;

    if (req.params.deviceID === "all") {
        GetAllPingsBetween(startEpochTime, endEpochTime, res)
    } else {
        GetDevicesPingsBetween(req.params.deviceID, startEpochTime, endEpochTime, res)
    }
});


// Helper functions //
function GetAllPingsBetween(startEpochTime, endEpochTime, response) {
    Pings.find({ epoch_time: { $gte: startEpochTime, $lt: endEpochTime } }, function (err, docs) {
        if (docs === undefined) {
            response.json({
                error: "That device ID has no pings recorded on that day."
            });
        } else {
            let pingsJSON = {};
            docs.map((doc) => {
                pingsJSON[doc.device_id] = [];
            });
            docs.map((doc) => {
                pingsJSON[doc.device_id].push(doc.epoch_time);
            });
            response.json(pingsJSON);
        }
    });
}

function GetDevicesPingsBetween(deviceID, startEpochTime, endEpochTime, response) {
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
        function (err, docs) {
            if (docs === undefined) {
                response.json({
                    error: "That device ID has no pings recorded on that day."
                });
            } else {
                let pingsArray = docs.map((doc) => {
                    return doc.epoch_time;
                });
                response.json(pingsArray);
            }
        });
}
module.exports = pingRouter;
