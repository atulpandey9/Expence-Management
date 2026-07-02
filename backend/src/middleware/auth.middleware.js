const jwt =require('jsonwebtoken');
const tokenblacklist=require('../models/blacklist.model')


const authuser= async (req,res,next)=>{
const authHeader=req.headers.authorizationheader

if(!authHeader){
   return  res.status(401).json({message:"token not provided"})
}

const istokenblacklist=await tokenblacklist.findOne({token})

if(istokenblacklist){
    return res.status(401).json({message:"token is invalid"})
}

try{
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decode
    next();
}catch(err){
return res.status(401).json({
    message:"invalid token"
})
}
}
module.exports={authuser}