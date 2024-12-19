// const orderModel=require('../models/orderModel');

// const usermodel=require('../models/userModel');

// const stripe=require('strip
const crypto = require("crypto");

const orderModel=require('../models/orderModel');
const userModel=require('../models/userModel')

const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
  
exports.createOrder= async (req, res) => {
    const { amount, currency, receipt } = req.body; 
  
    try {
  
      const newOrder=new orderModel({
          userId:req.body.userId,
          items:req.body.items,
          amount:req.body.amount,
          address:req.body.address
      })
  
      await userModel.findByIdAndUpdate(req.body.userId,{userCart:{}});
  
  
      await newOrder.save();
  
      const options = {
        amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
        currency: currency || "INR",
        receipt: receipt || `receipt_${new Date().getTime()}`,
      };
  
      const order = await razorpay.orders.create(options);
      res.status(201).json({
        success: true,
        order,
        cratedOrderId:newOrder._id
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while creating the order",
      });
    }
  }



exports.verifyPayment= (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    try {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
  
      // Validate the signature
      const expectedSignature = crypto
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(body.toString())
        .digest("hex");
  
      if (expectedSignature === razorpay_signature) {
          
        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid signature. Payment verification failed.",
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while verifying the payment",
      });
    }
  }


  exports.verifyOrder=async (req,res)=>{
    try{
        const {orderId,success}=req.body;

        console.log("here is the controller inside");
        console.log(orderId,success);

        if(success=="true")
        {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});

            res.json({success:true,message:"paid"});
        }

        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Paid"})
        }

    }
    catch(error)
    {
        console.log(error);
    res.json({success:false,message:"pament failed"})
    }
}



exports.getUserOrders=async (req,res)=>{
    try{
        const orders =await orderModel.find({userId:req.body.userId}).sort({date:-1});
        res.json({success:true,data:orders});
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Internal Server error"})
    }
}



exports.getListOfOrders=async (req,res)=>{
    try{
        try{
            const orders=await orderModel.find();

            res.json({success:true,data:orders})
        }
        catch(error)
        {
            console.log(error);
            res.json({success:false,message:"Internal server error"})
        }
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Internal server error"})
    }
}



exports.updateOrderStatus=async (req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});

        res.json({success:true,message:"Status updated"})
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Internal Server Error"})
    }
  
}