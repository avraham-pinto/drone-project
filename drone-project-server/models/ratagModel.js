const mongoose = require("mongoose");

const ratagSchema = new mongoose.Schema({
    id:String,
    coordinates:Array,
    type:String,
    code:String,
    minAlt:String,
    maxAlt:String,
    reason:String,
    name:String,
    note:String,
});

exports.RatagMoedel = mongoose.model("ratags" , ratagSchema);