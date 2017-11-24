var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Ping collection and schema
var ping = new Schema(
    {
        device_id: { type: String, required: true },
        epoch_time: { type: Number, required: true }
    },
    {
        collection: "pings"
    }
);

module.exports = mongoose.model("Ping", ping);
