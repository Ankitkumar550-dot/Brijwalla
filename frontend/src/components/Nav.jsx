import React, { useState, useEffect } from "react";
import { IoLocationSharp, IoCartOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaPlus, FaHeart, FaGift } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import flute from "../assets/flute.png";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { IoReceiptOutline } from "react-icons/io5";
import AddItemModal from "./AddItemModal";
import CartDrawer from "./CartDrawer";

function Nav() {
  const { userData, currentCity } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenCart = () => {
      setShowCartDrawer(true);
    };
    window.addEventListener("open-cart-drawer", handleOpenCart);
    return () => window.removeEventListener("open-cart-drawer", handleOpenCart);
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="w-full h-[100px] fixed top-0 left-0 z-[9999] bg-[#fff9f6] shadow-md flex items-center justify-between px-5">

        {/* Mobile Search */}
        {showSearch && userData?.role === "user" && (
          <div className="fixed top-[110px] left-[5%] w-[90%] h-[60px] bg-white rounded-xl shadow-xl flex items-center px-4 z-[9999]">
            <IoMdSearch size={22} className="text-teal-500 mr-3" />
            <input
              type="text"
              placeholder="Search sweets..."
              className="flex-1 outline-none text-gray-800"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-red-500 text-xl font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Logo */}
        <div className="relative flex flex-col items-center justify-center w-[320px] h-[140px] cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="absolute top-7 right-4 text-5xl font-black bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-700 bg-clip-text text-transparent drop-shadow-lg z-20" style={{ fontFamily: "'Cinzel', serif" }}>
            Brijwalla
          </h1>
          <img src={flute} alt="Krishna Flute" className="absolute down-[12px] w-[220px] z-10" />
          <p className="absolute bottom-10 right-7 text-[15px] tracking-[0.35em] text-amber-700 font-semibold uppercase">
            Taste of Brij
          </p>
        </div>

        {/* Search For User */}
        {userData?.role === "user" && (
          <div className="hidden md:flex md:w-[40%] lg:w-[45%] h-[55px] bg-white rounded-xl shadow-lg items-center px-4">
            <div className="flex items-center gap-2 border-r border-gray-300 pr-5">
              <IoLocationSharp size={22} className="text-rose-500" />
              <span className="font-medium text-gray-750 text-sm max-w-[120px] truncate">
                {currentCity || "Location"}
              </span>
            </div>

            <div className="flex items-center flex-1 pl-4">
              <IoMdSearch size={22} className="text-teal-500 mr-2" />
              <input
                type="text"
                placeholder="Search delicious sweets..."
                className="w-full outline-none text-sm text-gray-800"
              />
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* User Mobile Search */}
          {userData?.role === "user" && (
            <IoMdSearch
              size={26}
              className="md:hidden text-rose-500 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          )}

          {/* USER UI */}
          {userData?.role === "user" && (
            <>
              {/* Custom Box CTA */}
              <button
                onClick={() => navigate("/custom-box")}
                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 rounded-xl text-white font-bold hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer"
              >
                <FaGift size={16} />
                <span>Start Building</span>
              </button>
              {/* Wishlist */}
              <div
                onClick={() => navigate("/settings")}
                className="relative cursor-pointer hover:scale-105 transition-all text-amber-600 hover:text-red-500"
                title="Wishlist (In Settings/Preferences)"
              >
                <FaHeart size={26} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </div>

              {/* Cart */}
              <div
                onClick={() => setShowCartDrawer(true)}
                className="relative cursor-pointer hover:scale-105 transition-all"
              >
                <IoCartOutline size={30} className="text-teal-500" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>

              <button
                onClick={() => navigate("/orders")}
                className="hidden md:block bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 px-4.5 py-2.5 rounded-xl font-bold hover:bg-teal-650 transition-all shadow-md cursor-pointer"
              >
                My Orders
              </button>
            </>
          )}

          {/* OWNER UI */}
          {userData?.role === "owner" && (
            <>
              {myShopData && (
                <>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 hover:bg-rose-700 font-bold shadow-md cursor-pointer"
                  >
                    <FaPlus size={16} />
                    <span>Add Sweet Item</span>
                  </button>

                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="md:hidden flex items-center gap-1 p-2.5 rounded-full bg-teal-550 text-white hover:bg-teal-600 cursor-pointer"
                  >
                    <FaPlus size={20} />
                  </button>
                </>
              )}

              <div
                onClick={() => navigate("/orders")}
                className="hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2.5 rounded-xl bg-teal-500 text-white font-bold shadow-md hover:bg-teal-600 transition-all"
              >
                <IoReceiptOutline size={20} />
                <span>Manage Orders</span>
              </div>
            </>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 flex items-center justify-center font-black shadow-md cursor-pointer hover:bg-teal-700 transition-colors uppercase border border-teal-200"
            >
              {userData?.fullName?.charAt(0) || "U"}
            </div>

            {showProfile && (
              <div className="absolute right-0 top-12 w-[220px] bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3.5 z-[9999] border border-orange-100/40">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm truncate">
                    {userData?.fullName}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {userData?.email}
                  </p>
                  <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mt-0.5">
                    {userData?.role}
                  </p>
                </div>

                <hr className="border-gray-100" />

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfile(false);
                  }}
                  className="text-left text-sm text-gray-600 hover:text-teal-600 font-semibold cursor-pointer"
                >
                  My Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/orders");
                    setShowProfile(false);
                  }}
                  className="text-left text-sm text-gray-600 hover:text-teal-600 font-semibold cursor-pointer"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowProfile(false);
                  }}
                  className="text-left text-sm text-gray-600 hover:text-teal-600 font-semibold cursor-pointer"
                >
                  Preferences & Settings
                </button>

                {userData?.role === "owner" && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/create-edit-shop");
                        setShowProfile(false);
                      }}
                      className="text-left text-sm text-gray-600 hover:text-teal-600 font-semibold cursor-pointer"
                    >
                      {myShopData ? "Edit Shop Details" : "Add Sweet Shop"}
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogOut}
                  className="text-left text-sm text-red-500 hover:text-red-700 font-bold pt-1 border-t border-gray-50 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
      />

      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
      />

      <div className="h-[100px]" />
    </>
  );
}

export default Nav;