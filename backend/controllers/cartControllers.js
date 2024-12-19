const userModel=require('../models/userModel')


exports.addToCart=async (req,res)=>{
    try{
        const {itemId}=req.body;

        const user=await userModel.findOne({_id:req.body.userId});

        const cartData=user.userCart;

        if(!cartData[itemId])
        {
            cartData[itemId]=1;
        }
        else{
            cartData[itemId]+=1;
        }


        const updatedCart=await userModel.findByIdAndUpdate(req.body.userId,{userCart:cartData});

        return res.json({success:true,message:"Added to cart"})

    }
    catch(error)
    {
        return res.json({success:false,message:"Internal server error"})
    }
}


exports.removeFromCart=async (req,res)=>{
    try{
        const {itemId}=req.body;

        const user=await userModel.findOne({_id:req.body.userId});

        const cartData=user.userCart;

        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        console.log(cartData);

        const updatedCart=await userModel.findByIdAndUpdate(req.body.userId,{userCart:cartData});

        return res.json({success:true,message:"removed from cart"})

    }
    catch(error)
    {
        console.log(error);
        return res.json({success:false,message:"Internal server error"})
    }
}



exports.getCart=async (req,res)=>{
    try{
        

        const user=await userModel.findOne({_id:req.body.userId});
        console.log(user)

        return res.json({success:true,cartData:user.userCart})

    }
    catch(error)
    {
        console.log(error)
        return res.json({success:false,message:"Internal server error"})
    }
}