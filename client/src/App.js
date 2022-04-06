/* eslint-disable no-unused-vars */
import React from "react";
import Navb from "./components/Navb";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verification from "./components/Verification";


function App() {
  return (
    <>
      <Router>
        <Navb />
        <h1>First Register Yourself or Login</h1>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
         
          <Route exact path="/verification" element={<Verification />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
