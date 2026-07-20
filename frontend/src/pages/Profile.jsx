import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "../components/Nav";
import { setUserData } from "../redux/userSlice";
import { FaUser, FaEnvelope, FaPhone, FaShieldAlt } from "react-icons/fa";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [mobile, setMobile] = useState(userData?.mobile || "");
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) return;

    setSaving(true);
    // Simulate updating profile in database/redux state
    setTimeout(() => {
      const updatedUser = { ...userData, fullName, mobile };
      dispatch(setUserData(updatedUser));
      setSaving(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  return (
    <>
      <Nav />
      <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100/50">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-teal-600 text-white rounded-full flex items-center justify-center font-black text-3xl shadow-md border-2 border-teal-200 uppercase mb-3">
              {userData?.fullName?.charAt(0) || "U"}
            </div>
            <h2 className="text-2xl font-black text-teal-950">{userData?.fullName}</h2>
            <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mt-0.5">
              {userData?.role}
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-3.5 text-teal-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#fff9f6] border border-orange-100/30 rounded-xl outline-none focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={userData?.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Mobile Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-3.5 text-teal-500" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#fff9f6] border border-orange-100/30 rounded-xl outline-none focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                User Role
              </label>
              <div className="relative">
                <FaShieldAlt className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={userData?.role}
                  disabled
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 text-sm cursor-not-allowed capitalize"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-4 cursor-pointer"
            >
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
