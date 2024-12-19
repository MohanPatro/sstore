import { useEffect, useState } from "react";
import { createContext } from "react";
// import { food_list } from "../assets/assets";
export const StoreContext=createContext(null);
import axios from'axios'

const StoreContextProvider=(props)=>{


    const [cartItems,setCartItems]=useState({});
    const [token,setToken]=useState("");
    const [food_list,setFoodList]=useState([])
    const url='http://localhost:3000'

    const addItemToCart=async (itemId)=>{
        if(!cartItems[itemId])
        {
            setCartItems(prev=>{return {...prev,[itemId]:1}})
        }
        else{
            setCartItems(prev=>{return {...prev,[itemId]:prev[itemId]+1}})
        }
        if(token)
        {
            const data=await axios.post(`${url}/api/cart/addToCart`,{itemId},{headers:{token:token}})

        }
    }


    const removeFormCart=async (itemId)=>{
        setCartItems(prev=>{return {...prev,[itemId]:prev[itemId]-1}})
        if(token)
        {
            const data=await axios.post(`${url}/api/cart/removeFromCart`,{itemId},{headers:{token:token}})

        }
    }

    const getTotalAmount=()=>{
        let totalAmount=0;

        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo=food_list.find((product)=>product._id===item)
                totalAmount+=itemInfo.price * cartItems[item]
            }
        }

        return totalAmount;
    }

    const loadCartData=async ()=>{
        

        const response=await axios.post(`${url}/api/cart/getCart`,{},{headers:{token:localStorage.getItem("token")}});

        setCartItems(()=>response.data.cartData);
    }

    useEffect(async ()=>{
        const loadData=async ()=>{
            await fecthFoodList()

            if(localStorage.getItem("token"))
            {
                await setToken(localStorage.getItem("token"))

                await loadCartData();
                
            }

        }

        await loadData();
        
    },[])

    
    const contextValue={
        food_list,
        addItemToCart,
        removeFormCart,
        cartItems,
        setCartItems,
        getTotalAmount,
        token,
        setToken,
        url

    }

    const fecthFoodList=async ()=>{
        const response=await axios.get(`${url}/api/food/getAllItemsWithoutPagination`)

        if(response.data.success)
        {
            setFoodList(response.data.data);
        }
        else{
            alert("error while fetching the data")
        }
    }
    // useEffect(()=>{
    //     console.log(cartItems)
    // },[cartItems])

    


    return(
    <StoreContext.Provider value={contextValue}>
        {props.children}
    </StoreContext.Provider>
    )
}



export default StoreContextProvider;