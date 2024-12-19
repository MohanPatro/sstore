const express=require('express');

const router=express.Router();


const multer=require('multer');

const foodController=require('../controllers/food_delivery')


const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,file.originalname)
    }
})



const upload=multer({storage:storage})

router.get("/getAllItems",foodController.getAllItems)
router.get("/getAllItemsWithoutPagination",foodController.getAllItemsWithoutPagination)



router.post('/addFoodItem',upload.single("image"),foodController.addFoodItem)

router.delete('/removeItem/:item_id',foodController.removeItem)

module.exports=router