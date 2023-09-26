const express = require("express");
const { PoligonModel } = require("../models/poligonModel");
const { CircleModel } = require("../models/circleModel");
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    const poligons = await PoligonModel.find();
    const circles = await CircleModel.find();
    const data = {poligons,circles};
    res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err});
  }
})

module.exports = router;
