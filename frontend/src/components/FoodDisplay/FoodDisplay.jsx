import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePriceFilter = (e) => {
    setMaxPrice(e.target.value);
  };

  const filteredList = food_list.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);
    const matchesPrice = maxPrice === '' || item.price <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <input
          type="number"
          placeholder="Max price..."
          value={maxPrice}
          onChange={handlePriceFilter}
          className="price-filter"
        />
      </div>

      <div className="food-display-list">
        {filteredList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
