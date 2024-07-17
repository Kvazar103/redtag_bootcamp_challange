import {Route,Routes} from "react-router-dom";
import React from "react";
import Login from "./Components/Login/Login";
import AddBook from "./Components/AddBook/AddBook";
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header/Header";
import Register from "./Components/Register/Register";
import UpdateBook from "./Components/UpdateBook/UpdateBook";
import StickyHeadTable from "./Components/StickyHeadTable/StickyHeadTable";

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/headTable" element={<StickyHeadTable/>}/>
        <Route exact path="/addBook" element={<AddBook/>}/>
        <Route exact path="/updateBook" element={<UpdateBook/>}/>
      </Routes>
      {/* <StickyHeadTable/> */}
    </div>
  );
}

export default App;
