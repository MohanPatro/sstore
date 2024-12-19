const express=require('express');
require('dotenv').config()
const app=express();
const cors=require('cors')
const connection=require('./common/connection')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}));
const foodItemModel=require('./models/itemModel')

app.use('/images',express.static('./uploads'));

const foodRoutes=require('./routes/foodRoutes');

const userRouters=require('./routes/userRoutes');

const cartRoutes=require('./routes/cartRoutes')

const orderRoutes=require('./routes/orderRoutes')



app.use('/api/food',foodRoutes);
app.use('/api/user',userRouters);
app.use('/api/cart',cartRoutes);
app.use(orderRoutes);


app.listen(3000,async()=>{
    
    console.log("app is running on the port 300")
})