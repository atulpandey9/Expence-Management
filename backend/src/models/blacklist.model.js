const mongoose=require('mongoose');

const blacklistschema=new mongoose.Schema({
    token:{
        type:String,
        require:true
    }
},{timestamps:true})

const blacklistmodel=mongoose.model("blacklsitmodel",blacklistschema);

module.exports=blacklistmodel;