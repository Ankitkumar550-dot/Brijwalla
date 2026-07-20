import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaRobot } from "react-icons/fa";
import { resolveLocalImage } from "../utils/imageResolver";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

function MithaiCard({ item, onClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlist.some((w) => w._id === item._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(item));
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    alert(`${item.name} added to cart!`);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    navigate(`/buy-item/${item._id}`);
  };

  const handleAiQueryClick = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("ask-mithai-bot", { detail: item }));
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative border border-orange-50/50 flex flex-col h-full"
    >
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-amber-600 hover:text-red-500 hover:scale-110 transition-all z-10"
      >
        {isWishlisted ? <FaHeart className="text-red-500" size={18} /> : <FaRegHeart size={18} />}
      </button>

      {/* AI Bot Question Trigger */}
      <button
        onClick={handleAiQueryClick}
        className="absolute top-3 right-14 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 hover:text-teal-800 hover:scale-110 transition-all z-10"
        title="Ask AI about this sweet"
      >
        <FaRobot size={18} />
      </button>

      {/* Image Container */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={resolveLocalImage(item.image)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500  text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {item.category}
        </div>
        <div className="absolute bottom-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <FaStar size={12} />
          <span>4.5</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-1">
            {item.foodType}
          </span>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
            By {item.shop?.name || "Brijwalla Special"}
          </p>
        </div>

        {/* Pricing & Add to Cart / Buy Now */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-3">
          <div className="flex flex-col min-w-max">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-teal-950">₹{item.price}</span>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={handleAddToCartClick}
              className="bg-teal-50 hover:bg-teal-100 text-teal-750 p-2 rounded-xl transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
              title="Add to Cart"
            >
              <FaShoppingCart size={15} />
            </button>
            <button
              onClick={handleBuyNowClick}
              className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-500 hover:bg-rose-750 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MithaiCard;
