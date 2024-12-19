const express=require('express');

const jwt=require('jsonwebtoken')

const router=express.Router();
const orderController=require('../controllers/orderControllers')

// Replace with your Razorpay key details


const verifyToken = async (req, res, next) => {
    try {

        console.log(" I am here");
        console.log(req.headers.token);
        
        const decodedToken = await jwt.verify(req.headers.token, process.env.JWT_SECRET);
        console.log("I am at proceed to payment")
        console.log(decodedToken);
        req.body.userId =decodedToken.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Invalid or missing token" });
    }
};

// API to create an order
router.post("/create-order",verifyToken,orderController.createOrder);



// API to verify payment
router.post("/verify-payment",orderController.verifyPayment);



router.post('/verify-order',orderController.verifyOrder)



//users orders for front end

router.post("/userOrders",verifyToken,orderController.getUserOrders)


router.get('/list',orderController.getListOfOrders)

router.post('/updateOrderStatus',orderController.updateOrderStatus)

module.exports=router