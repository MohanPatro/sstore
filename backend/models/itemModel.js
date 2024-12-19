const mongoose=require('mongoose');

const foodItemSchema=mongoose.Schema({
    name:{
        type:String
    },
    image:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    category:{
        type:String
    }

})

const foodItemModel=new mongoose.model("foodItemModel",foodItemSchema)


module.exports=foodItemModel;