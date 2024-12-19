const express=require('express')
const router=express.Router();

const userController=require('../controllers/userControllers')
const jwt=require('jsonwebtoken')




router.post('/registerUser',userController.userRegistration)

router.post('/login',userController.userLogin)

module.exports=router;