const foodItemModel=require('../models/itemModel');


exports.getAllItems=async (req,res)=>{
    try{
        let page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit)  || 10;
        const result=await foodItemModel.aggregate([
            {
              $facet: {
                data: [
                  { $skip: (page - 1) * limit },
                  { $limit: limit },
                ],
                totalCount: [{ $count: "total" }],
              },
            },
          ]);

        // console.log(data);

        const rows = result[0].data;
        const count = result[0].totalCount[0] ? result[0].totalCount[0].total : 0;



        res.json({success:true,data:rows,totalCount:count});
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,error:error});
    }
}




exports.getAllItemsWithoutPagination=async (req,res)=>{
    try{
       const data=await foodItemModel.find();



        res.json({success:true,data:data});
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,error:error});
    }
}


exports.addFoodItem=async (req,res)=>{
    try{
        const data=req.body;
        if(req.file)
        {
        data.image=req.file.filename;

        }
        else{
            data.image="no image given"
        }
        const foodItem=new foodItemModel({
            name:data.name,
            image:data.image,
            price:data.price,
            description:data.description,
            category:data.category
        })

        await foodItem.save();

        console.log(foodItem);

        return res.json({success:true,data:foodItem});
    }
    catch(error)
    {
        console.log(error);

        res.json({success:false,error:error})
    }
}


exports.removeItem=async (req,res)=>{
    try{
        const id=req.params.item_id;


        const data=await foodItemModel.findOneAndDelete({_id:id});

        if(data)
        {
            return res.json({success:true,data:data,message:"sucessfully deleted data"});

        }
        else{
            return res.json({success:true,message:"no data to delete"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,error:error})
    }
}


