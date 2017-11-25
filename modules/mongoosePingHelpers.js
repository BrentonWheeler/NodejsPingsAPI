var Pings = require("../models/pingModel");

function GetPingsBetween(startEpochTime, endEpochTime) {
    return Pings.find({ epoch_time: { $gte: startEpochTime, $lt: endEpochTime } }).then(function(docs) {
        if (docs === undefined) {
            return Promise.resolve({ error: "No pings recorded during that time." });
        } else {
            // This can be optimised
            let pingsJSON = {};
            docs.map(doc => {
                pingsJSON[doc.device_id] = [];
            });
            docs.map(doc => {
                pingsJSON[doc.device_id].push(doc.epoch_time);
            });
            return Promise.resolve(pingsJSON);
        }
    });
}

function GetPingsBetweenByDevice(startEpochTime, endEpochTime, deviceID) {
    return Pings.find({
        $and: [{ device_id: deviceID }, { epoch_time: { $gte: startEpochTime, $lt: endEpochTime } }]
    }).then(function(docs) {
        if (docs === undefined) {
            return Promise.resolve({ error: "That device ID has no pings recorded during that time." });
        } else {
            let pingsArray = docs.map(doc => {
                return doc.epoch_time;
            });
            return Promise.resolve(pingsArray);
        }
    });
}

module.exports = { GetPingsBetween, GetPingsBetweenByDevice };
