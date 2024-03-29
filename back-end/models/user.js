const jwt = require('jsonwebtoken');
const config=require('config');
const Joi=require ("joi");
const mongoose= require("mongoose");

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 3,
        maxlength : 255
    },
    email:{
        type:String,
        unique:true,
        required:true,
        minlength: 5,
        maxlength : 255
    },
    isAdmin : Boolean
    ,
    password:{
        type:String,
        required:true,
        minlength: 8,
        maxlength :1000
    }
});
userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({ _id:this._id,name: this.name,
      email: this.email,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
};
const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema= {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password:Joi.string().min(8).max(1000).required(),
    }
    return Joi.validate(user, schema)
}
exports.validate = validateUser;
exports.User=User;