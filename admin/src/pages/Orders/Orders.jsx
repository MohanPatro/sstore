import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderStatus, setOrderStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/list');
    if (response.data.success) {
      setData(response.data.data);
      setFilteredData(response.data.data);
    } else {
      toast.error('Error');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + '/updateOrderStatus', {
      orderId,
      status: event.target.value,
    });

    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  const filterOrders = () => {
    let filtered = [...data];

    // Filter by Order Status
    if (orderStatus !== 'All') {
      filtered = filtered.filter(order => order.status === orderStatus);
    }

    // Filter by Date Range
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date); // Assuming createdAt field exists
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
    }

    // Filter by User Name (Address)
    if (userFilter) {
      filtered = filtered.filter(order => {
        const userName = order.address.firstName + ' ' + order.address.lastName;
        return userName.toLowerCase().includes(userFilter.toLowerCase());
      });
    }

    setFilteredData(filtered);
  };




  useEffect(() => {
    fetchAllOrders();
  }, []);



  useEffect(() => {
    filterOrders();
  }, [orderStatus, startDate, endDate, userFilter]);

  return (
    <div className='order add'>
      <h3 className='heading'>Order Page</h3>

      {/* Filter Section */}
      <div className='order-filters'>
        <select
          onChange={(e) => setOrderStatus(e.target.value)}
          value={orderStatus}
          className='filter-dropdown'>
          <option value="All" selected>All Orders</option>
          <option value="Food Processing">Food Processing</option>
          <option value="Out for delivery">Out for delivery</option>
          <option value="Delivered">Delivered</option>
        </select>

        <div className='date-range'>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='date-input'
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='date-input'
          />
        </div>

        <input
          type="text"
          placeholder="Search by customer"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className='user-search'
        />
      </div>

      {/* Order List */}
      <div className='order-list'>
        {filteredData.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, itemIndex) => {
                  return `${item.name} x ${item.quantity}${itemIndex === order.items.length - 1 ? '' : ','}`;
                })}
              </p>
              <p className='order-item-name'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country},{' '}
                  {order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>

            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
