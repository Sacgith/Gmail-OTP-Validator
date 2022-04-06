/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { register, reset } from "../features/auth/authSlice";

import Spinner from "../components/Spinner";

const Verification = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [otpCheck, setotpCheck] = useState("");
  const [formData, setFormData] = useState({
    otp: "",
  });
  const [checked, setChecked]=useState(false);
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const { otp } = formData;

  useEffect(()=>{
    if(checked){
      navigate('/');
    }
  }, [navigate, checked]);

  const sendOTP = async (e) => {
    e.preventDefault();
    try {
      const random = Math.floor(1000 + Math.random() * 9000);
      setotpCheck(random);
      setSent(true);
      toast.success("Please check your mail!");
      await axios.post("/users/mail", {
        email: user.email,
        code: random.toString()
      });
    } catch (error) {
      toast.error(error);
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    console.log(otp, otpCheck);
    if (otp.toString() === otpCheck.toString()) {
      try {
        setChecked(true);
        const temp="23";
        toast.success("You have registered successfully!!");
        const message = "You registered successfully";
        await axios.post("/users/mail", {
          email: user.email,
          code: temp,
        });
       
        
      } catch (error) {
        toast.error("Please Enter correct OTP");
      }
    } else {
      toast.error("Wrong OTP");
    }
   setChecked(true);
  };
  console.log("sent ", sent);
  return (
    <>
      {!sent ? (
        <>
          <button type="submit" className="btn btn-block" onClick={sendOTP}>
            Send Mail
          </button>
        </>
      ) : (
        <section className="form">
          <form onSubmit={verifyOTP}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="otp"
                name="otp"
                value={otp}
                onChange={onChange}
                placeholder="enter otp"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-block">
                verify
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default Verification;
