const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

const userSchema = new mongoose.Schema({
    nickName:String,
    email:String,
    password:String,
    drone:String,
    role:{type:String , default:"user"},
    fav_ar:{type:Array , default:[]},
    own:{type:Array , default:[]}
},{timestamps:true});

exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (user_id , role = "user" , nickName , drone) => {
    const token = jwt.sign({_id:user_id,role,nickName,drone}, config.TOKENSECRET,{expiresIn:"60000mins"})
    return token;
}

exports.validateUser = (_reqBody) =>{
    const joiSchema = joi.object({
        nickName:joi.string().min(3).max(20).required(),
        email:joi.string().min(2).max(200).email().required(),
        password:joi.string().min(3).max(150).required(),
        drone:joi.string().min(1).max(50).allow(null , '')
    })
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    const joiSchema = joi.object({
        email:joi.string().min(2).max(200).email().required(),
    password:joi.string().min(3).max(150).required()
    })
    return joiSchema.validate(_reqBody);
}