import React, { useEffect, useState } from 'react';
import './List.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const List = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [totalRecords,setTotalRecords]=useState(0);
  const [pageSize,setPageSize]=useState(10);
  const [currentPage,setCurrentPage]=useState(4);
  const url = 'http://localhost:3000';

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/getAllItems`,{
      params: {
        page: currentPage,
        limit: 10,

       }
      });

    if (response.data.success) {
      setList(response.data.data);
      setTotalRecords(response.data.totalCount)
      setFilteredList(response.data.data);
    } else {
      console.error('Error while fetching the data');
      toast.error('Error while fetching the data');
    }
  };

  const pageCount = Math.ceil(totalRecords / pageSize);

  const removeItem = async (id) => {
    const response = await axios.delete(`${url}/api/food/removeItem/${id}`);

    if (response.data.success) {
      toast.success('Successfully deleted');
      fetchList();
    } else {
      toast.error('Error while deleting');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, maxPrice);
  };

  const handlePriceFilter = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (searchTerm, maxPrice) => {
    let filtered = list;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter((item) => item.price <= maxPrice);
    }

    setFilteredList(filtered);
  };



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  useEffect(() => {
    fetchList();
  }, [currentPage]);

  return (
    <div className="list add flex-col">
      <p className="list-header">All Foods List</p>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or category..."
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
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {filteredList.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p className="cursor" onClick={() => removeItem(item._id)}>X</p>
          </div>
        ))}
      </div>




      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(pageCount).keys()].map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber + 1)}
            className={pageNumber + 1 === currentPage ? 'active' : ''}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Next
        </button>
      </div>


    </div>
  );
};

export default List;
