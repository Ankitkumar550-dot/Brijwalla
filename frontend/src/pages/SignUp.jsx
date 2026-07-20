import React, { useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading]=useState(false)
  const dispatch = useDispatch()

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,email,password,mobile,role,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(result.data))

      
      
      alert("Signup Successful!");
      navigate("/signin");
      setLoading(false)
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Something went wrong"
      );
      setLoading(false)
    }
  };

  const handleGoogleAuth=async () => {
    if(!mobile){
      return alert("mobile is required")
    }
    const provider=new GoogleAuthProvider()
    const result=await signInWithPopup(auth,provider)
    try {
      const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile
      },{withCredentials:true})
       dispatch(setUserData(data))
    } catch (error) {
      console.log(error);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold">
            Welcome to Brijwalla
          </h1>
          <p className="mt-2 text-sm opacity-90">
            Create your account and start ordering delicious sweets.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>

            <div className="relative">
              <input
                type="tel"
                placeholder="Enter Phone Number"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
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

          {/* Role */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Role
            </label>

            <div className="grid grid-cols-3 gap-3">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-xl py-2 font-medium transition-all ${
                    role === r
                      ? "bg-cyan-500 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignUp}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Create Account"}
          </button>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-500 text-sm">
              OR
            </span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition" onClick={handleGoogleAuth}
          >
            <FcGoogle size={22} />
            <span className="font-medium">
              Continue with Google
            </span>
          </button>

          {/* Sign In */}
          <p
            className="mt-6 text-center text-gray-600 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Already have an account?{" "}
            <span className="text-cyan-500 font-semibold">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;