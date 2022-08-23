const {isEmail}=require('validator');
const mongoose=require('mongoose');
const bcrypt =require('bcrypt');
const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    number:{
        type: String,
        required: true,
        minlength: 10
    }
})
//userSchema.pre('save',async function(next)
// {
//     const salt=await bcrypt.genSalt();
    
// })
const User=new mongoose.model('user',userSchema);
module.exports =User;