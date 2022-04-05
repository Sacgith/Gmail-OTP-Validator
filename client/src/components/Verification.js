/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import Spinner from "../components/Spinner";

const Verification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const { email, otp } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };


  const onSubmit =  async(e) => {
    e.preventDefault();
    try {
    const data=await axios.post("/users/verify-email",{email});
    } catch (error) {
      toast.error(error);
    }
    navigate('/');
    
  };
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Verify Email</h1>
      <p style={{ textAlign: "center" }}>Please Enter OTP</p>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              id="otp"
              name="otp"
              value={otp}
              placeholder="enter OTP"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Verification;
