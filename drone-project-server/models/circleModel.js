const mongoose = require("mongoose");

const circleSchema = new mongoose.Schema({
    code:String,
    name:String,
    coordinat:Object,
    radiusM:String,
    minalt:String,
    maxalt:String,
    permit:String,
    reason:String,
    note:String
});

exports.CircleModel = mongoose.model("circles" , circleSchema);