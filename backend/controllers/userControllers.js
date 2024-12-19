const brcypt=require('bcrypt');
const userModel=require('../models/userModel')

const generateToken=async (userId)=>{
    try{
        const token= await jwt.sign({userId},process.env.JWT_SECRET)

        return token;
    }
    catch(error)
    {
        throw error;
    }
}

exports.userRegistration=async (req,res)=>{
    try{
        const userData= req.body;

        console.log(userData);
        const isExist=await userModel.findOne({email:userData.email});

        if(!userData.password)
        {
            return res.json({success:false,message:"password is required"});
        }

        if(userData.password.length<8)
        {
            return res.json({success:false,message:"password should >8 length"});
        }

        const salt=await brcypt.genSalt(10);

        const hashedPassword=await brcypt.hash(userData.password,salt);

        const newUser=new userModel({
            name:userData.name,
            email:userData.email,
            password:hashedPassword,

        })

        await newUser.save();

        const token=await generateToken(newUser._id);

        return res.json({success:true,data:newUser,token:token})

    }
    catch(error)
    {
        return res.json({success:false,message:"internal server error"})
    }
}



exports.userLogin=async (req,res)=>{
    try{
        const {email,password}=req.body;

        const isExist=await userModel.findOne({email:email})

        if(!isExist)
        {
            return res.json({success:false,message:"user doesn't exist"});

        }

        const passwordCheck=await brcypt.compare(password,isExist.password);

        if(!passwordCheck)
        {
            return res.json({success:false,message:"Invalid credentials"})
        }

        const token=await generateToken(isExist._id);

        return res.json({success:true,token:token});

    }
    catch(error)
    {
        return res.json({success:false,message:"Internal server error"})
    }
}


