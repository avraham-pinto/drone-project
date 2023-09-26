const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { validateUser, UserModel, validateLogin, createToken } = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", async (req,res)=> {
    res.json({msg: "users endpoint"});
})

router.get("/checkToken" , auth , async (req,res) => {
    res.json(req.tokenData);
})

router.post("/", async (req, res) => {
    const validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "*****";
      res.status(201).json(user);
    }
    catch (err) {
      if (err.code == 11000) {
        return res.status(401).json({code: 11000 , err: "Email or nickName already in system", value: err.keyValue })
      }
      res.status(502).json({ err })
    }
  })

  router.post("/login", async (req, res) => {
    const validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ err: "Email & password dont match"  });
      }
      const passwordValid = await bcrypt.compare(req.body.password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ err: "Email & password dont match" });
      }
      const token = createToken(user._id, user.role , user.nickName, user.drone);
      res.json({ token , role:user.role , nickName: user.nickName, drone: user.drone});
    }
    catch (err) {
      res.status(502).json({ err })
    }
  })

  router.get("/userInfo", auth, async (req, res) => {
    try {
  
      const user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
      res.json(user)
    }
    catch (err) {
      res.status(502).json({ err })
    }
  })

  router.get("/getOwn", auth, async(req, res) => {
    try{
      const userData = await UserModel.findOne({ _id : req.tokenData._id });
      res.json(userData.own);
    }
    catch(err){
      res.status(502).json({err})
    }
  })

  router.patch("/updateFavs/", auth, async(req,res) => {
    try{
      if(!Array.isArray(req.body.fav_ar)){
        return res.status(400).json({msg:"body must be array"});
      }
      const data = await UserModel.updateOne({_id:req.tokenData._id},{fav_ar:req.body.favs_ar})
      res.json(data);
    }
    catch(err){
      res.status(502).json({err})
    }
  })

  router.get("/usersList", authAdmin, async (req, res) => {
    try {
      const data = await UserModel.find({}, { password: 0 })
      res.json(data)
    }
    catch (err) {
      res.status(502).json({ err })
    }
  })

  router.patch("/changeRole/:id/:role", authAdmin, async (req, res) => {
    try {
      const {id,role} = req.params;
      if(req.tokenData.role != "superAdmin"){
        return res.status(401).json({err: "super admon required"})
      }
      if(role != "user" && role != "admin"){
        return res.status(401).json({err:"new role invalid"})
      }
      if(id == req.tokenData._id){
        return res.status(401).json({err:"cant change yourself"})
      }
      const data = await UserModel.updateOne({_id:id,role:{$not:new RegExp("superAdmin")}},{role});
      res.json(data);
    }
    catch (err) {
      res.status(502).json({ err })
    }
  })

  router.delete("/:id", authAdmin, async (req, res) => {
    try {
      const {id} = req.params;
      if(id == req.tokenData._id){
        return res.status(401).json({err:"cant delete yourself"})
      }
      const data = await UserModel.deleteOne({_id:id,role:{$not:new RegExp("superadmin")}});
      res.json(data);
    }
    catch (err) {
      res.status(502).json({ err })
    }
  })

module.exports = router;
