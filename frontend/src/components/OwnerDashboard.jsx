import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaMapMarkerAlt, FaEdit, FaPlus, FaStore } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setGetMyShopData } from "../redux/ownerSlice";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleDeleteClick = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      await axios.delete(`${serverUrl}/api/item/delete-item/${itemId}`, {
        withCredentials: true,
      });
      alert("Food Item Deleted Successfully!");

      const shopResult = await axios.get(`${serverUrl}/api/shop/get-my`, {
        withCredentials: true,
      });
      dispatch(setGetMyShopData(shopResult.data));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete food item.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">

      {!myShopData && (
        <div className="flex justify-center items-center flex-1 w-full px-4 py-8">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-teal-500 w-16 h-16 sm:w-20 sm:h-20 mb-4" />

              <h2 className="text-2xl font-bold text-teal-900 mb-2">
                Add Your Restaurant
              </h2>

              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>

              <button
                onClick={() => navigate("/create-edit-shop")}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full max-w-6xl px-4 py-8 flex flex-col gap-8">
          {/* Shop details banner card */}
          <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100/50 flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
            {/* Left side: Image */}
            <div className="md:w-1/3 h-64 md:h-auto relative min-h-[250px] cursor-pointer" onClick={() => navigate("/create-edit-shop")}>
              <img
                src={myShopData.image}
                alt={myShopData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />
            </div>

            {/* Right side: Shop info */}
            <div className="md:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-600 font-semibold uppercase text-xs tracking-wider mb-2">
                  <FaStore />
                  <span>Verified Partner Shop</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-950 mb-4">
                  {myShopData.name}
                </h1>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <FaMapMarkerAlt className="text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {myShopData.address}
                      </p>
                      <p className="text-sm">
                        {myShopData.city}, {myShopData.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons for shop */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => navigate("/create-edit-shop")}
                  className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-6 py-3 rounded-xl font-bold shadow-sm transition-all duration-200 border border-teal-200"
                >
                  <FaEdit />
                  Edit Shop Details
                </button>

                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <FaPlus />
                  Add Food Item
                </button>
              </div>
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-teal-950 flex items-center gap-2">
                <FaUtensils className="text-teal-600" />
                Our Food Menu
              </h2>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {myShopData.items?.length || 0} Items
              </span>
            </div>

            {myShopData.items && myShopData.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myShopData.items.map((item) => (
                  <OwnerItemCard
                    key={item._id}
                    data={item}
                    onEdit={(itemData) => {
                      setEditingItem(itemData);
                      setShowEditItem(true);
                    }}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                <FaUtensils className="text-gray-300 w-16 h-16 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Your Menu is Empty
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6">
                  Add delicious sweets and snacks to your shop to attract customers!
                </p>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold shadow transition-all duration-200"
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddItemModal isOpen={showAddItem} onClose={() => setShowAddItem(false)} />
      <EditItemModal isOpen={showEditItem} onClose={() => { setShowEditItem(false); setEditingItem(null); }} item={editingItem} />
    </div>
  );
};

export default OwnerDashboard;