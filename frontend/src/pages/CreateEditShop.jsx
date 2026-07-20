import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaUtensils, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { serverUrl } from "../App";
import { setGetMyShopData } from "../redux/ownerSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  const [isEditMode, setIsEditMode] = useState(!!myShopData);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");

  const [frontendImage, setFrontendImage] = useState(
    myShopData?.image || null
  );
  const [backendImage, setBackendImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !city.trim() || !state.trim() || !address.trim()) {
      return alert("Please fill all fields.");
    }

    if (!isEditMode && !backendImage) {
      return alert("Shop image is required.");
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(result.data);

      // Change this if your backend returns { shop: {...} }
      dispatch(setGetMyShopData(result.data.shop || result.data));

      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 cursor-pointer z-50 bg-white p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-orange-100 flex items-center justify-center hover:scale-105"
        aria-label="Go back to home"
      >
        <IoArrowBack size={24} className="text-teal-500" />
      </button>

      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaUtensils className="w-16 h-16 text-teal-500" />
          </div>

          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Shop" : "Add Shop"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Shop Name</label>

            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter shop name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Shop Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full border rounded-lg px-4 py-2"
            />

            {frontendImage && (
              <img
                src={frontendImage}
                alt="Preview"
                className="mt-4 w-full h-52 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">City</label>

              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">State</label>

              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>

            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400"
              placeholder="Enter shop address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition text-center"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {isEditMode ? "Update Shop" : "Create Shop"}
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-orange-50 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 mb-6">
              <FaCheckCircle className="h-12 w-12 text-teal-500" />
            </div>

            <h2 className="text-3xl font-extrabold text-teal-900 mb-3">
              {isEditMode ? "Shop Updated!" : "Shop Created!"}
            </h2>

            <p className="text-gray-600 mb-8">
              {isEditMode
                ? "Your shop details have been successfully updated."
                : "Your new shop has been successfully registered on Brijwalla."}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setName("");
                  setAddress(currentAddress || "");
                  setCity(currentCity || "");
                  setState(currentState || "");
                  setFrontendImage(null);
                  setBackendImage(null);
                  setIsEditMode(false);
                  setShowSuccessModal(false);
                }}
                className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-3 px-4 rounded-xl border border-teal-200 transition duration-200"
              >
                Add More Shop
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEditShop;