var Pings = require("../models/pingModel");

// Helper functions //
function GetAllPingsBetween(startEpochTime, endEpochTime, response) {
    Pings.find({ epoch_time: { $gte: startEpochTime, $lt: endEpochTime } }, function(err, docs) {
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
    });
}

function GetPingsBetweenByDevice(deviceID, startEpochTime, endEpochTime, response) {
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

module.exports = { GetAllPingsBetween, GetPingsBetweenByDevice };
