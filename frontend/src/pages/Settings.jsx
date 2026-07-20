import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "../components/Nav";
import { toggleWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { FaTrash, FaShoppingCart, FaHeart, FaCog, FaCheck } from "react-icons/fa";
import { resolveLocalImage } from "../utils/imageResolver";

function Settings() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [vegOnly, setVegOnly] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const handleRemoveWishlist = (item) => {
    dispatch(toggleWishlist(item));
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item));
    alert(`${item.name} moved to cart!`);
  };

  return (
    <>
      <Nav />
      <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Preferences Settings Box */}
          <div className="md:col-span-1 bg-white rounded-3xl shadow-xl p-6 border border-orange-100/50 h-fit space-y-6">
            <h2 className="text-2xl font-black text-teal-950 flex items-center gap-2">
              <FaCog className="text-teal-650" />
              Settings
            </h2>

            <div className="space-y-4">
              {/* Veg Only Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Vegetarian Only</h4>
                  <p className="text-[10px] text-gray-450">Filter sweets and namkeen</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Allow Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Push Notifications</h4>
                  <p className="text-[10px] text-gray-450">Order dispatch updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowNotifications}
                    onChange={(e) => setAllowNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Email updates */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Email Newsletters</h4>
                  <p className="text-[10px] text-gray-450">Promo discounts and recipes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailUpdates}
                    onChange={(e) => setEmailUpdates(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <span className="p-1 bg-teal-50 text-teal-600 rounded-md">
                <FaCheck size={10} />
              </span>
              <p className="text-[10px] text-gray-450 leading-normal">
                Preferences automatically sync with local browser storage.
              </p>
            </div>
          </div>

          {/* Wishlist Box */}
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100/50">
            <h2 className="text-2xl font-black text-teal-950 flex items-center gap-2 mb-6">
              <FaHeart className="text-red-500" />
              My Wishlist ({wishlistItems.length})
            </h2>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <FaHeart size={64} className="text-gray-200 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-gray-700 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-gray-450 max-w-[240px]">
                  Explore sweets and tap the heart icon on any product to save them here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#fff9f6]/30 border border-orange-100/30 p-3.5 rounded-2xl flex gap-4 items-center justify-between"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img
                        src={resolveLocalImage(item.image)}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-400 truncate">
                          By {item.shop?.name || "Local Shop"}
                        </p>
                        <p className="text-sm font-extrabold text-teal-950 mt-1">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                        title="Add to Cart"
                      >
                        <FaShoppingCart size={14} />
                        <span className="text-xs font-bold hidden sm:inline">Add</span>
                      </button>

                      <button
                        onClick={() => handleRemoveWishlist(item)}
                        className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-red-150"
                        title="Remove Wishlist"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
