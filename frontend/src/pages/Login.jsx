import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, getMyProfile, userExist, userNotExist } from "../redux/slices/userSlice.js";
import { AiOutlineClose } from "react-icons/ai";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [phoneSubmitting, setPhoneSubmitting] = useState(false);
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length !== 10 || isNaN(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setPhoneSubmitting(true);
    dispatch(sendOTP(phone)).then((data) => {
      if (data?.payload.success) {
        toast.success("OTP sent to your phone");
        setStep(2);
      } else {
        toast.error("Something went wrong. Try again to send OTP.");
      }
      setPhoneSubmitting(false);
    });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (e.key === "Backspace" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };


  const getMyDetails = ()=>{
    dispatch(getMyProfile()).then((profileData) => {
      if (profileData.payload?.success) {
           dispatch(userExist(profileData.payload.user));
           navigate("/");
      } else {
        userNotExist();
      }
    });  
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpSubmitting(true);
    dispatch(verifyOTP({ phone, otp: otp.join("") })).then((data) => {
      if (data.payload?.success) {
        toast.success(data.payload.message);
        localStorage.setItem("token", data.payload.token);
        getMyDetails();
      } else {
        toast.error(data.payload?.message || "Invalid OTP");
      }
      setOtpSubmitting(false);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white shadow-xl p-8 rounded-2xl w-full max-w-md border border-gray-200">
        <AiOutlineClose
          className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500"
          size={24}
          onClick={() => navigate("/")}
        />
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login with Phone</h2>
            <form onSubmit={handlePhoneSubmit}>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={phoneSubmitting}
                className={`w-full py-3 rounded-lg text-lg font-semibold cursor-pointer ${
                  !phoneSubmitting ? "text-white bg-blue-500 hover:bg-blue-700" : "text-black bg-gray-300"
                }`}
              >
                {phoneSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Enter OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-between gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={otpSubmitting}
                className="w-full cursor-pointer bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
              >
                {otpSubmitting ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
            <p
              className="text-sm text-blue-600 text-center mt-4 cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Change Phone Number
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
