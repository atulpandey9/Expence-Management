const mongoose=require('mongoose')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const usermodel=require('../models/user.model.js');

async function registeruserController(req,res) {
    const{username,email,password}=req.body;

    if(!username||!password||!email){
        return res.status(400).json({
            message:"plese provide username,email and password"
        })
    }

const useralreadyexisted=await usermodel.findOne({
    $or:[
        {username},{email}]
})

if(useralreadyexisted){
     return res.status(400).json({
            message: "Account already exists with this email address or username"
})}

const hash=await bcrypt.hash(password,10);

const user=await usermodel.create({
    username,
    email,
    password:hash
})

const token=jwt.sign({
    id:user._id,
    username:user.username
},
process.env.JWT_SECRET,
        { expiresIn: "1d" }
)

res.cookie("token",token);

res.status(201).json({
    message:"user created successfully",
      user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
})
}



async function loginuserController(req,res) {
    const {email,password}=req.body;

    const user=await usermodel.findOne({email});

      if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)


     if(!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
 const token=jwt.sign(
        {id:user._id,
        username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    
    res.status(200).json({
        message:"user loggedin successfully",
        user:{
              id:user._id,
              username:user.username,
              email:user.email
        },
        token:token
    })
}

async function logoutUserController(req,res) {
    const token=req.cookies.token

    if(token){
await tokenBlackListModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })
}


module.exports={
    registeruserController,
    loginuserController,
    logoutUserController
}
