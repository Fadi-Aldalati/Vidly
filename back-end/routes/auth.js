const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt-nodejs');
const Joi=require('joi');
const _ = require('lodash');
const {User} = require ('../models/user');

const mongoose =require('mongoose');
const express= require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
  });

router.post('/',async (req,res)=>{
    const { error } = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email : req.body.email});
    if (!user) return res.status(400).send('invalid email or password');
    
    bcrypt.compare(req.body.password,user.password,(err,valid)=>{
         if(valid){
            const token = user.generateAuthToken();
            res.send(token);
         }
         else{
            res.status(400).send('invalid email or password');
         }
     });
  

    
  });
function validate(req){
    const schema= {
        email: Joi.string().min(3).max(255).required().email(),
        password:Joi.string().min(8).max(1000).required()
    }
    return Joi.validate(req, schema);
}
module.exports = router; 