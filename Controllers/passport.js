const blog=require('../Model/blogshema');
const User = require('../Model/userschema');
const {validator} =require('./authValidator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const fs=require('fs');
const passport=require('passport');
const gooogleStrategy=require('passport-google-oauth20');

passport.use('login',new gooogleStrategy({
    callbackURL:'http://localhost:3000/',
    clientID:process.env.clientID,
    clientSecret:process.env.clientSecret
},async(accessToken,refreshToken,profile,done)=>{
    const user=await User.findOne({email:profile.emails.value});
    if(user)
    {
        return done(null,user);
    }
    else
    {
        console.log('here');
        return done(null,false);
    }
}))
passport.serializeUser((user,done)=>{
    
    done(null,user.id);
})
passport.deserializeUser((id,done)=>{
    User.findOne({id:id},(err,user)=>{
        done(err,user);
    })
})
const get_google =(req,res)=>{
    res.send('Hello there');
    }

module.exports={get_google};