const userM = require('../models/user');
const express = require("express");
const app = express.Router();
const notifier = require("../src/notify");
const { body, validationResult } = require('express-validator');

/* 
if the number already exists in the database and is verified then say that the
number is already subscribed.
if the number exists and is not verified then generate an otp and change name; 
when verifying otp and is verified then set verified to true; 
*/
app.post("/register",
 body('name').isLength({max:80,min:3}).not().isEmpty().trim().escape(),
 body('number').isMobilePhone(),
async(req,res)=>{

    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw "Input Validation Error"
    }
    let user = await userM.findOne({number:req.body.number});
    if (user && user.verified){
        throw "Number Already Registered";
    }
    let otp = Math.floor(1000 + Math.random() * 9000);
 
    if(user){
    user.name = req.body.name;
    // if already exists then dont change the old otp. and resend it . 
    otp = user.otp;
    user.save();
    }else{
    let obj = {
        name : req.body.name,
        number : req.body.number,
        otp: otp
    }
     user = await userM.create(obj);
    }
    
    notifier.sendOtp(user.number,otp);
    res.status(200).send();
   
    }catch(errors){
        console.log(errors);
        res.status(400).json({error:errors});
    }

})

app.post("/resendotp",
body('number').isMobilePhone(),
async (req,res)=>{

    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw "Input Validation Error"
    }
    console.log(req.body);
    let user = await userM.findOne({number:req.body.number}).exec();
    if(!user){
        throw "Invalid request, Please Try Again!"
    }
    notifier.sendOtp(user.number,user.otp);
    res.status(200).send();

    }catch(errors){
        console.log(errors);
        res.status(400).json({error:errors});
    }

})

app.post("/verifyotp",
    body('otp').isNumeric().isLength({max:8,min:4}),
    body('number').isMobilePhone(),
    async(req,res)=>{
        try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw "Input Validation Error"
        }
        let user = await userM.findOne({number:req.body.number});
        if(!user){
            throw "Invalid request, Please Try Again!"
        }
        message = ""
        if(user.otp.toString() === req.body.otp.toString()){
            user.verified = true;
            message = "verified"
        }else{
            message = "Incorrect otp"
            throw "Incorrect OTP"
        }
        user.save();
        res.status(200).send({message});
        }catch(errors){
            console.log(errors);
            res.status(400).json({error:errors});
        }
    }
)

module.exports = app;

