import React, { useState } from "react";
import { FaEnvelope, FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => { 
const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const dispatch=useDispatch()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
        
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data))

      alert("Signin Successful!");

      navigate("/");
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
      alert(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
   const handleGoogleAuth=async () => {
      
      const provider=new GoogleAuthProvider()
      const result=await signInWithPopup(auth,provider)
      try {
        const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
          
          email:result.user.email,
          
        },{withCredentials:true})
        dispatch(setUserData(data))
      } catch (error) {
        console.log(error);
  
      }
    }

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        Welcome Back
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Sign in to your Brijwalla account
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Email
        </label>

        <div className="relative">
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-full border rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-teal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" value={email} required/>
        </div>
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full border rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-teal-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
       
      </div>
      <div className='text-right mb-4 cursor-pointer text-teal-600 font-medium' onClick={() => navigate("/forgot-password")}>
        Forgot Password
      </div>

      {/* Sign In */}
      <button
        onClick={handleSignIn}
        className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color="#000" /> : "Sign In"}
      </button>

      {/* Google */}
      <button
        className="w-full mt-4 flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-gray-50" onClick={handleGoogleAuth}
      >
        <FcGoogle size={22} />
        Sign In with Google
      </button>

      <p
        className="text-center mt-6 text-gray-600 cursor-pointer"
        onClick={() => navigate("/signup")}
      >
        Don't have an account?{" "}
        <span className="font-semibold text-teal-500">
          Sign Up
        </span>
      </p>
    </div>
  </div>
);
};

export default SignIn;