const express = require("express");
const { RatagMoedel } = require("../models/ratagModel");
const router = express.Router();


router.get("/", async(req,res) =>{
    try{
        const data = await RatagMoedel.find();
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err});
    }
})

module.exports = router;