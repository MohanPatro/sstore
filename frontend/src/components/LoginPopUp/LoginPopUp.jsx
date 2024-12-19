import React, { useState,useContext, useEffect } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import {toast} from 'react-toastify'
const LoginPopUp = ({setShowLogin}) => {
    
    const [currState,setCurrState]=useState("Sign Up")
    const [data,setData]=useState({
      name:"",
      email:"",
      password:""
    });

    const {url,setToken,token}=useContext(StoreContext)

    const onChangeHandler=(e)=>{
        const name=e.target.name
        const value=e.target.value

        setData(()=>({
          ...data,[name]:value
        }))
    }

    let newUrl=url;
    const onSubmitHandler=async (event)=>{

      event.preventDefault();
      if(currState=='Login')
      {
        newUrl=url+'/api/user/login'
      }
      else{
        newUrl=url+'/api/user/registerUser'
      }

      const response=await axios.post(newUrl,data);

      if(response.data.success)
      {
          console.log("successfully login");
          setToken(()=>response.data.token);
          // alert(token)
          localStorage.setItem("token",response.data.token);
          setShowLogin(false);
      }
      else{
          toast.error("error while login")
      }


    }

    useEffect(()=>{
      console.log(url);
    },[data])


  return (
    <div className='login-popup'>
      <form onSubmit={onSubmitHandler} className='login-popup-container'>
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
            
            {currState==="Login"?<></>: <input type="text" placeholder='Your name ' name="name" onChange={onChangeHandler} required/>}
            <input type="email" placeholder='your email' name='email'  onChange={onChangeHandler} required />
            <input type="password" placeholder='password' name='password'  onChange={onChangeHandler} required />

        </div>

        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>

        <div className="login-pop-up-condition">
            <input type="checkbox" required/>
            <p>By continuing , i agree to the terms of the use & privacy policy</p>
        </div>
        {currState==="Login" 
        ?
         <p>Create a new account ? <span onClick={()=>setCurrState("Sign Up")}>Click Here</span></p>
         :
         <p>Already have an account ? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
         }
       
        
      </form>
    </div>
  )
}

export default LoginPopUp
