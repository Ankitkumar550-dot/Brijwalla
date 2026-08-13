import React from "react";
import { FaTimes, FaStar, FaStore, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { resolveLocalImage } from "../utils/imageResolver";

function ProductDetailsModal({ item, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  if (!item) return null;

  const handleAddToCart = () => {
    if (!userData) {
      navigate("/signin");
      return;
    }
    dispatch(addToCart(item));
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/95 rounded-full shadow-lg text-gray-700 hover:text-red-500 hover:scale-105 transition-all"
        >
          <FaTimes size={18} />
        </button>

        {/* Left Side: Image */}
        <div className="md:w-1/2 h-64 md:h-auto relative min-h-[300px]">
          <img src={resolveLocalImage(item.image)} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {item.category}
            </span>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              {item.foodType} Delight
            </span>
            <h2 className="text-2xl font-black text-teal-950 mb-2">{item.name}</h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-amber-500 gap-1">
                <FaStar />
                <span className="text-sm font-bold text-gray-800">4.5 Rating</span>
              </div>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-teal-600 font-semibold uppercase">100% Vegetarian</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Experience the authentic taste of premium traditional Indian sweets, handcrafted using original pure ghee recipes direct from the heart of Brij.
            </p>

            {/* Shop Box */}
            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 mb-6 flex items-center gap-3">
              <FaStore className="text-teal-600 w-8 h-8" />
              <div>
                <h4 className="text-sm font-bold text-gray-850">
                  {item.shop?.name || "Local Shop"}
                </h4>
                <p className="text-xs text-gray-500">
                  {item.shop?.address ? `${item.shop.address}, ${item.shop.city}` : "Mathura, Uttar Pradesh"}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Add Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total Price</span>
              <span className="text-2xl font-black text-teal-950">₹{item.price}</span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-teal-600/20 font-bold transition-all flex items-center gap-2"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
