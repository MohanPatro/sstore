import React from "react";
import NavBar from "./components/Navbar/NavBar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes,Route } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import {ToastContainer,toast} from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css';

const App=()=>{
  const url="http://localhost:3000"
  return (
    <div>
      <ToastContainer/>
      <NavBar/>
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/add" element={<Add/>}/>
          <Route path="/list" element={<List/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
          
        </Routes>
      </div>
    </div>
  )
}


export default App;