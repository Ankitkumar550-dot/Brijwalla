import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import MithaiCard from "./MithaiCard";
import ProductDetailsModal from "./ProductDetailsModal";
import AiBot from "./AiBot";
import { FaStore, FaUtensils, FaMapMarkerAlt, FaGift } from "react-icons/fa";

import lordKrishnaImg from "../assets/lordkrishna.png";

const UserDashboard = () => {
  const { currentCity } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Pedha", "Laddoo", "Kaju Katli", "Rasgulla", "Namkeen", "Barfi"];

  // Fetch shops and items based on the detected city
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all shops
        const shopRes = await axios.get(
          `${serverUrl}/api/shop/all${currentCity ? `?city=${currentCity}` : ""}`
        );
        setShops(shopRes.data);

        // Fetch sweets search/filter
        const itemRes = await axios.get(`${serverUrl}/api/item/search`);
        setItems(itemRes.data);
      } catch (error) {
        console.error("Fetch dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCity]);

  // Fetch festival data and log to console as requested
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/festivals`);
        console.log("Dynamic Festival Data from Backend:", res.data);
      } catch (error) {
        console.error("Error fetching festival data:", error);
      }
    };
    fetchFestivals();
  }, []);

  // Handle Search and Filter logic locally
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const mithaiItems = filteredItems.filter((item) => {
    return item.foodType === "sweet" || item.category?.toLowerCase() !== "namkeen";
  });

  const namkeenItems = filteredItems.filter((item) => {
    return item.foodType === "Namkeen" || item.category?.toLowerCase() === "namkeen";
  });

  return (
    <div className="w-full max-w-6xl px-4 py-8 flex flex-col gap-8">


      {/* Category Icons Selector */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
          <FaUtensils className="text-teal-600" />
          Faverate Sweets
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "All") {
                  setSelectedCategory("All");
                } else {
                  navigate(`/category/${cat.toLowerCase()}`);
                }
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all whitespace-nowrap cursor-pointer ${selectedCategory === cat
                ? " bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 bg-clip-text text-transparent hover:bg-teal-750"
                : "bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-700 bg-clip-text text-transparent hover:bg-teal-50 hover:text-teal-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>



      {/* Sweet Shops Panel */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
          <FaStore className="text-teal-600" />
          Nearby Sweet Shops in {currentCity || "Brij"}
        </h3>
        {loading ? (
          <div className="text-center py-6 text-gray-500 font-medium animate-pulse">Loading shops...</div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-orange-50/50 flex flex-col h-full"
              >
                <div className="h-40 relative">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <h4 className="absolute bottom-3 left-3 text-lg font-bold text-white">
                    {shop.name}
                  </h4>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{shop.address}</p>
                    <p className="text-xs font-semibold text-teal-600">
                      {shop.items?.length || 0} delicious sweets listed
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-gray-100 rounded-3xl text-gray-400 text-sm">
            No sweet shops found near your current location.
          </div>
        )}
      </div>

      {/* Sweets & Namkeens Section */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium animate-pulse">Loading delicious items...</div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Trending Mithai (Sweets) */}
          {mithaiItems.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
                <span className="text-2xl">🍬</span>
                Trending Mithai (Sweets)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mithaiItems.map((item) => (
                  <MithaiCard
                    key={item._id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Trending Namkeen */}
          {namkeenItems.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
                <span className="text-2xl">🌶️</span>
                Trending Namkeen
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {namkeenItems.map((item) => (
                  <MithaiCard
                    key={item._id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 bg-white border border-gray-100 rounded-3xl text-gray-400 text-sm">
              No matching sweet or namkeen items found.
            </div>
          )}
        </div>
      )}

      {/* AI Bot Floating assistant */}
      <AiBot />

      {/* Product Details popup */}
      <ProductDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default UserDashboard;
