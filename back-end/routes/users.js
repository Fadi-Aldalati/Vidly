const jwt= require('jsonwebtoken');
const auth =require('../middleware/auth');
const config=require('config');
const bcrypt=require('bcrypt-nodejs');
const _ = require('lodash');
const {User,validate} = require ('../models/user');
const mongoose=require('mongoose');
const express= require('express');
const router = express.Router();

router.get('/',auth, async (req, res) => {
  const user = await User.findById(req.body._id).select('-password');
  res.send(user);
});
router.get('/me',auth, async (req, res) => {
    const user = await User.findById(req.body._id).select('-password');
    res.send(user);
  });

router.post('/',async (req,res)=>{
    const { error } = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email : req.body.email});
    if (user) return res.status(400).send('user already registered');

    user = new User( _.pick(req.body,['name','email','password']));
    bcrypt.genSalt(10 , (err,salt)=>{
      bcrypt.hash(user.password,salt,null,(err,hash)=>{
        user.password = hash; 
      });
  }); 
     await user.save();

     const token = user.generateAuthToken();
    res.header('x-auth-token',token)
       .header('access-control-expose-headers','x-auth-token')
        .send(_.pick(user,['name','email']));

})
module.exports = router; 