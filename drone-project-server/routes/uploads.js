const express = require("express");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const {config} = require("../config/secret")
const {auth , authAdmin} = require("../middlewares/auth")


cloudinary.config({
  cloud_name: config.CLOUD_NAME ,
  api_key: config.CLOUD_KEY ,
  api_secret: config.CLOUD_SECRET,
  secure: true,
});

router.get("/", async(req,res) => {
  res.json({msg:"uploads home"});
})

router.post("/no_temp", auth, async(req,res) => {
    try{
      const myFile = req.body.myFile;
      if(myFile){
        const data = await cloudinary.uploader.upload(myFile ,{ unique_filename:true})
        res.json(data)
      }
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

router.post("/" , auth, async(req,res) => {
    try{
        const myFile = req.files.myfile;
        if (myFile){
            const data = await cloudinary.uploader.upload(myFile.tempFilePath ,{unique_filename:true})
            res.json(data)
        }
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})


module.exports = router;