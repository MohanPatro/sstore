const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    userId:{
        type:String
    },
    items:{
        type:Array
    },
    address:{
        type:Object
    },
    status:{
        type:String
    },
    amount:{
        type:Number
    },
    status:{
        type:String,
        default:"food processing"
    },
    date:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false}
})


const orderModel=mongoose.model("order",orderSchema);

module.exports=orderModel;