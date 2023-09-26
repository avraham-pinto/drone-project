const mongoose = require("mongoose");

const poligonSchema = new mongoose.Schema({
    code:String,
    name:String,
    coordinates:Array,
    minalt:String,
    maxalt:String,
    permit:String,
    reason:String,
    note:String
},{timestamps:true});

exports.PoligonModel = mongoose.model("poligons" , poligonSchema);