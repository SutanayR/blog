const blog=require('../Model/blogshema');
const User = require('../Model/userschema');
const {validator} =require('./authValidator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const fs=require('fs');
//token create
const createToken=(id)=>{
    const privateKey=fs.readFileSync('private.pem','utf8');
    return jwt.sign({id},privateKey,{expiresIn:'1h',algorithm:'RS512'});
}
//password hashing
const hashPassword=async(password)=>
{
    const salt=await bcrypt.genSalt();
    password=await bcrypt.hash(password,salt);
    return password;
}

const get_home=(req,res)=>{
    res.render('homepage',{title:'Home'});
}
const get_blogs=async (req,res)=>{
    let skip=req.query.p||0;
    let lim =3;
    const blogs=await blog.find().sort({"createdAt":-1}).skip(skip*lim).limit(lim);
    res.render('blogs',{title:'Blogs',blogs:blogs});
}
const get_login=(req,res)=>{
    res.render('login',{title:'login'});
}
const post_blog=async(req,res)=>{
    const B=await blog.create(req.body);
    res.send(B); 
}
const get_details=async (req,res)=>{
    const B=await blog.findById(req.params.id)
    res.render('details',{title:'details page',blog:B});
}
const delete_blog=async(req,res)=>{
    const done =await blog.deleteOne({id:req.params.id});
    res.json({redirect:'/'});
}
const addBlog =(req,res)=>{
    res.render('postBlog',{title:'Add Blog'});
}
const get_signup =(req,res)=>{
    res.render('signup',{title:'Sign up'});
}
const post_signup =async (req,res)=>{
    const email=req.body.email;
    let password=req.body.password;
    const number=req.body.number;
    const authResult=await validator(email,password,number);
    if(authResult===true)
    {
        password=await hashPassword(password);let flag=true;
        const user=await User.create({email:email,password:password,number:number}).catch((err)=>{
            const resp={istrue:false,
                email:'This email exists!',
                password:'',
                number:''};
                res.json({resp});
                flag=false;
        });
        if(flag)
        {token= createToken(user._id);
        res.cookie('jwt',token,{maxAge: 1000*60*60,httpOnly:true});
        const resp={istrue:true,
        email:email,
        password:password,
        number:number};
        res.json({resp});
        }
    }
    else
    {
        const resp={istrue:false,
            email:authResult.email,
            password:authResult.password,
            number:authResult.number};
        res.json({resp});
    }
 //   res.send('done');
}
const post_login =async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const user=await User.findOne({email:email});
    let msg={email:'',password:''};
    if(user)
    {
        const auth=await bcrypt.compare(password,user.password);
        if(auth)
        {
            token=createToken(user._id);
            res.cookie('jwt',token,{maxAge: 1000*60*60, httpOnly:true})
        }
        else
        {
            msg.password="Wrong password";
        }
    }
    else
    {
        msg.email="wrong Email";
    }
        res.json({msg});
    }
const get_logout =(req,res)=>{

    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports ={get_home,get_blogs,get_login,post_blog,addBlog,delete_blog,get_details,get_signup,post_signup,post_login,get_logout};