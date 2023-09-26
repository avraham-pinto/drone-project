const express = require("express");
const { MarkerModel, validateMarker } = require("../models/markerModel");
const { auth } = require("../middlewares/auth");
const { UserModel } = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const cloudinary = require('cloudinary').v2;
const router = express.Router();

router.get("/" , async(req,res) => {
    try{
        const perPage = req.query.perPage || Infinity;
        const page = req.query.page -1 || 0;
        const search = req.query.s;
        const user_id = req.query.user_id;

        let filterFind = {};
        if(search) {
            const searchEXP = new RegExp(search,"i")
            filterFind = {$or:[{name:searchEXP},{info:searchEXP},{routs:searchEXP}]};
        }
        if(user_id) filterFind = {user_id};

        const data = await MarkerModel
        .find(filterFind)
        .limit(perPage)
        .skip(page * perPage)
        .sort({updatedAt:-1})
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
});

router.get("/count", async(req,res) => {
    try{
        const perPage = req.query.perPage || Infinity;
        const search = req.query.s;
        const user_id = req.query.user_id;
        let filterFind= {};
        if(search){
            const searchEXP = new RegExp(search,"i")
            filterFind = {$or:[{name:searchEXP},{info:searchEXP},{routs:searchEXP}]};
        }
        if(user_id) filterFind = {user_id};

        const count = await MarkerModel.countDocuments(filterFind);
        res.json({count,pages:Math.ceil(count/perPage)})

    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.get("/single/:id" , async(req,res) => {
    try{
      const id = req.params.id;
      const data = await MarkerModel.findOne({_id:id});
      res.json(data); 
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.post("/", auth, async(req,res) => {
    const validBody = validateMarker(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details)
    }
    try{
        const marker = new MarkerModel(req.body);
        marker.user_id = req.tokenData._id;
        await marker.save();
        const userData = await UserModel.findOne({ _id: req.tokenData._id });
        userData.own.push(marker._id);
        userData.save();
        res.json(marker);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
  })

  router.post("/groupIds", async(req,res) => {
    try{
      if(!Array.isArray(req.body.ids)){
        return res.status(400).json({msg:"'ids' is not provided or not a array"});
       }
      const data = await MarkerModel.find({_id:{$in:req.body.ids}}).limit(100)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })



  router.delete("/:id",auth, async(req,res) => {
    try{
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({msg:"no such id"})
      }
      if(req.tokenData.role === "admin" || req.tokenData.role === "superadmin"){
        const marker = await MarkerModel.findOne({_id : id})
        cloudinary.uploader.destroy(marker.img_url, (error , result) => {
            if(error){console.log(error)}
            else{console.log(result);}
        })
        const data = await MarkerModel.deleteOne({_id:id});
        res.json(data);
      }
      else{
        const data = await MarkerModel.deleteOne({_id:id,user_id:req.tokenData._id});
        res.json(data);
      }
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  


module.exports = router;