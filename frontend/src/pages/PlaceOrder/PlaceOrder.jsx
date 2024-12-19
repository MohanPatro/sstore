import React, {useState, useContext, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from  'axios'

const PlaceOrder = () => {
  const { cartItems, getTotalAmount,food_list,url,token } = useContext(StoreContext);
  const [address,setAddress]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const navigate = useNavigate();

  const onChangeHandler=(e)=>{
      const name=e.target.name;
      const value=e.target.value;

      setAddress(()=>({...address,[name]:value}));
  }

 

  useEffect(()=>{
    if(!token)
    {
      navigate('/cart');
    }
    else if(getTotalAmount()===0)
    {
      navigate('/cart')
    }
  },[token])

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  }

  const proceedToPayment = async (event) => {
    try {
        event.preventDefault();
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      let orderItems=[];
      food_list.map((item)=>{
        if(cartItems[item._id]>0)
        {
          let itemInfo=item;
          item["quantity"]=cartItems[item._id];
          orderItems.push(itemInfo);
        }

      })

      const orderData={
        address:address,
        items:orderItems,
        amount:getTotalAmount() + 2,
        currency: "INR",
        receipt: `order_rcpt_${Date.now()}`
      }
      // console.log(token);

      const response= await axios.post(`${url}/create-order`,orderData,{headers:{token:token}})

    

      const data = await response.data;

      if (!data.success) {
        alert("Error creating order. Please try again!");
        return;
      }

      const { order } = data;

      // Open Razorpay Checkout
      const options = {
        key: "rzp_test_jkTTCCYipbBybt", 
        amount: order.amount,
        currency: order.currency,
        name: "Food Delivery App",
        description: "Order Payment",
        order_id: order.id, // Razorpay order ID
        handler: async (paymentResponse) => {
          // Step 3: Verify payment on backend
          const verifyResponse = await fetch(
            "http://localhost:3000/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResponse),
            }
          );

          const verifyData = await verifyResponse.json();


          navigate(`/verify?success=${verifyData.success}&orderId=${data.cratedOrderId}`)
        },
        modal: {
          onDismiss: () => {
            // Handle payment cancellation
            navigate(`/verify?success=false&orderId=${data.cratedOrderId} `)

            console.log("User closed the payment window.");
          },
        },
  
        prefill: {
          name: "Customer Name", // Can dynamically set the customer's name
          email: "customer@example.com", // Replace with customer's email
          contact: "1234567890", // Replace with customer's phone
        },
        theme: {
          color: "#000080", // Razorpay theme color
        },
      };
      

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in payment process:", error);
      alert("Payment process failed. Please try again.");
    }
  };

  return (
    <div>
      <form className="place-order" onSubmit={proceedToPayment}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input onChange={onChangeHandler} value={address.firstName} type="text" placeholder="First Name" name='firstName' required/>
            <input onChange={onChangeHandler} value={address.lastName} type="text" placeholder="Last Name" name="lastName" required />
          </div>
          <input type="text" onChange={onChangeHandler} placeholder="Email Address" value={address.email}  name="email" required/>
          <input type="text" onChange={onChangeHandler} placeholder="Street" value={address.street} name="street" required />
          <div className="multi-fields">
            <input onChange={onChangeHandler}  type="text" value={address.city} placeholder="City" name="city" required/>
            <input onChange={onChangeHandler} type="text" value={address.state} placeholder="State" name="state" required />
          </div>
          <div className="multi-fields">
            <input onChange={onChangeHandler} type="text" value={address.zipcode} placeholder="Zipcode" name="zipcode" required/>
            <input onChange={onChangeHandler} type="text" value={address.country} placeholder="Country" name="country" required />
          </div>
          <input onChange={onChangeHandler} type="text" value={address.phone} placeholder="Phone" name="phone" required/>
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalAmount() === 0 ? 0 : getTotalAmount() + 2}</b>
              </div>
              <hr />
            </div>
            <button type="submit">
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default PlaceOrder;
