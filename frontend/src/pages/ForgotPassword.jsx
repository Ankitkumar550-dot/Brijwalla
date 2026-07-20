import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]=useState(false)

  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      return alert("Please enter email");
    }
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      console.log(result.data);
      alert("OTP Sent Successfully");
      setStep(2);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      alert(error.response?.data?.message || "Failed to send OTP");

    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {

    if (!otp) {
      return alert("Please enter OTP");
    }
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      console.log(result.data);
      alert("OTP Verified");
      setStep(3);
      setLoading(false)
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Invalid OTP");
      setLoading(false)
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );

      console.log(result.data);

      alert("Password Reset Successfully");
      setLoading(false)
      navigate("/signin");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Password reset failed");
      setLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email to reset your password.
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                OTP
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;