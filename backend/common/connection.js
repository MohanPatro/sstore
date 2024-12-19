const mongoose=require('mongoose');

const connection=mongoose.connect("mongodb+srv://mohanpatro982:hG9oPI7n7L2sVC3B@cluster0.tuf6l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("conneted to database");
})



module.exports=connection;
