const express=require('express');

const router=express.Router();
const jwt=require('jsonwebtoken');

const cartControllers=require('../controllers/cartControllers')


const verifyToken = async (req, res, next) => {
    try {

        const decodedToken = await jwt.verify(req.headers.token, process.env.JWT_SECRET);
        console.log(decodedToken);
        req.body.userId =decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or missing token" });
    }
};


router.post("/addTocart",verifyToken,cartControllers.addToCart);

router.post("/removeFromCart",verifyToken,cartControllers.removeFromCart)

router.post("/getCart",verifyToken,cartControllers.getCart)


module.exports=router