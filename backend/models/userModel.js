const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    userCart:{
        type:Object,
        default:{}
    }
},{minimize:false})

const userModel=mongoose.model("user",userSchema);


module.exports=userModel;