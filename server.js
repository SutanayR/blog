require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const router =require('./Routes/route');
const app=express();
const cookieParser=require('cookie-parser');
const rsa=require('node-rsa');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const passportSetup=require('./Controllers/passport');
const passport=require('passport');
const cookieSession=require('cookie-session');
//db Connection and listening
mongoose.connect(process.env.dbURI).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('listening');
    });
})

//middleware
app.use(cookieParser());
app.set('view engine','ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(router);
//app.use(passport.initialize);
//app.use(passport.session());
//RSA
// const key=rsa({b:512});
//const encrypt=key.encrypt(process.env.SECRET,'base64');
// const privateKey=key.exportKey('private');
// const publicKey=key.exportKey('public');
// console.log(privateKey);
// console.log(publicKey);
//const privateKey=new rsa(process.env.privateKey,'pkcs1-private');
//const publicKey=new rsa(process.env.publicKey,'pkcs8-public');
//  const encrypt=publicKey.encrypt(process.env.SECRET,'ascii');
//  console.log(encrypt);
// const decrypt=privateKey.decrypt(encrypt,'utf8');
//  privateKey=fs.readFileSync('./private.pem','utf8');
//  publicKey=fs.readFileSync('./public.pem','utf8');
//  const tolkien=jwt.sign({abc:'abc'},privateKey,{expiresIn:60,algorithm:'RS512'});
//  const verify=jwt.verify(tolkien,publicKey,{algorithms:['RS512']});
//  console.log(verify);