import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { setGetMyShopData } from "../redux/ownerSlice";

const AddItemModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [foodType, setFoodType] = useState("sweet");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || !imageFile) {
      return alert("Please fill all fields and select an image.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("foodType", foodType);
      formData.append("image", imageFile);

      await axios.post(`${serverUrl}/api/item/add-item`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Food Item Added Successfully!");


      // shop data updated items list
      const shopResult = await axios.get(`${serverUrl}/api/shop/get-my`, {
        withCredentials: true,
      });
      dispatch(setGetMyShopData(shopResult.data));
      console.log("updated shop", shopResult.data);

      // Reset state and close modal
      setName("");
      setCategory("");
      setPrice("");
      setFoodType("sweet");
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-50 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Food Item</h2>
          <button onClick={onClose} className="text-white hover:text-teal-200 text-3xl font-light focus:outline-none leading-none">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kaju Katli, Samosa"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Dessert, Snack"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition"
                required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 transition bg-white">
              <option value="sweet">Mithai</option>
              <option value="Namkeen">Namkeen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              required />
            {imagePreview && (
              <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover" />
              </div>)}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
