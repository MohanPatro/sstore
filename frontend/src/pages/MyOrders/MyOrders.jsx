import React,{useState,useContext, useEffect} from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import {assets} from '../../assets/assets' 
const MyOrders = () => {
    const {url,token}=useContext(StoreContext)
    const [data,setData]=useState([]);

    const fecthOrders=async()=>{
        const response=await axios.post(url+"/userOrders",{},{headers:{token:token}});
        setData(response.data.data);
        console.log(response.data.data);

    }

    useEffect(()=>{
        if(token)
        {
            fecthOrders()
        }
    },[token])
  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {
                data.map((order,index)=>{
                    return(
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items.map((item,itemIndex)=>{
                                if(itemIndex===order.items.length-1)
                                {
                                    return item.name+" x "+item.quantity
                                }
                                else{
                                    return item.name+" x "+item.quantity+","
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items : {order.items.length}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button onClick={fecthOrders}>Track Order</button>
                        </div>
                    )
                })
            }
        </div>
        
    </div>
  )
}

export default MyOrders
