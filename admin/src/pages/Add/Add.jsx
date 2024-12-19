import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
const Add = () => {

    const url="http://localhost:3000"
    const [image,setImage]=useState(false);

    const [data,setData]=useState({
        name:"",
        description:"",
        price:"",
        category:"Salad"
    })

    useEffect(()=>{
        console.log(data);
    },[data])

    const onSubmitHandler=async (event)=>{
        event.preventDefault()

        const formData=new FormData();
        formData.append("name",data.name);
        formData.append("description",data.description);
        formData.append("price",Number(data.price));
        formData.append("category",data.category);
        formData.append("image",image)

        const response=await axios.post(`${url}/api/food/addFoodItem`,formData)
        console.log(response)

        if(response.data.success)
        {
            setData({
                name:"",
                description:"",
                price:"",
                category:""
            })
            setImage(false);
            toast.success("successfuly added data")
        }
        else{
            console.log('hello world');
            toast.error("Internal Server error");
        }
    }

    const onChangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;

        setData(data=>({
            ...data,[name]:value
        }))
    }

  return (
    <div className='add'>
        <form  className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>

                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden required />

            </div>
            <div className="add-product-name flex-col">
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' />
            </div>
            <div className="add-product-description flex-col">
                <p>Product description</p>
                <textarea  onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product category</p>
                    <select onChange={onChangeHandler} value={data.category} name="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                        <option value="Pens">Pens</option>
                        <option value="Notebooks">Notebooks</option>
                        <option value="Art Supplies">Art Supplies</option>
                        <option value="A4 Papers">A4 Papers</option>
                        <option value="Electronics and Accessories">Electronics and Accessories</option>
                        <option value="files">files</option>
                        <option value="Snacks and Beverages">Snacks and Beverages</option>
                        <option value="Merchandise and Gifts">Merchandise and Gifts</option>

                    </select>
                </div>

                <div className="add-price flex-col">
                    <p>Product Price</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' />
                </div>
            </div>

            <button type='submit' className='add-btn'> ADD</button>
        </form>
     
    </div>
  )
}

export default Add
