const mongoose = require("mongoose");
const joi = require("joi")

const markerSchema = new mongoose.Schema({
    name: String,
    routs: String,
    info: String,
    coordinates: Object,
    img_url: String,
    user_id : String,
},{timestamps:true})
exports.MarkerModel = mongoose.model("markers" , markerSchema);

exports.validateMarker = (_reqBody) => {
    let joiSchema = joi.object({
        name: joi.string().min(3).max(20).required(),
        routs: joi.string().min(5).max(75).allow(null , ""),
        info: joi.string().min(5).max(150).allow(null , ""),
        coordinates: joi.object().max(500).required(),
        img_url: joi.string().min(2).max(400).required(),
    })
    return joiSchema.validate(_reqBody);
}