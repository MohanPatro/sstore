import React, { useContext,useEffect } from 'react'
import './Verify.css'
// import { useSearchParams } from 'react-router-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';

const Verify = () => {
    const [searchParams,setSearchParams]=useSearchParams();
    const {url,token}=useContext(StoreContext);
    const success=searchParams.get("success");
    const orderId=searchParams.get("orderId");

    console.log(success,orderId)
    const navigate=useNavigate()

    const verifyPayment=async()=>{
        console.log(token);
        const response=await axios.post(url+"/verify-order",{success,orderId},{headers:{token:localStorage.getItem('token')}});

        if(response.data.success){
            navigate("/myorders")
        }
        else{
            navigate("/")
        }
    }

    useEffect(()=>{
        if(token)
        {
            verifyPayment()
        }
    },[])
  return (
    <div className='verify'>
        <div className="spinner">

        </div>

    </div>
  )
}

export default Verify
