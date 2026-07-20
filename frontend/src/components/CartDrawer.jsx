import React, { useState } from "react";
import { FaTimes, FaMinus, FaPlus, FaTrash, FaShoppingBag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeFromCart, clearCart } from "../redux/cartSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { resolveLocalImage } from "../utils/imageResolver";

function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { currentAddress } = useSelector((state) => state.user);

  const [address, setAddress] = useState(currentAddress || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    try {
      setLoading(true);

      const shopGroups = {};
      cartItems.forEach((item) => {
        const shopId = item.shop?._id || item.shop;
        if (!shopGroups[shopId]) {
          shopGroups[shopId] = [];
        }
        shopGroups[shopId].push({
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      });

      // Place an order for each shop group
      for (const shopId of Object.keys(shopGroups)) {
        const items = shopGroups[shopId];
        const groupTotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

        const res = await axios.post(
          `${serverUrl}/api/order/create`,
          {
            shopId,
            items,
            totalAmount: groupTotal,
            deliveryAddress: address,
          },
          { withCredentials: true }
        );
        console.log("Order successfully created & saved in MongoDB backend:", res.data);
      }

      alert("Order Placed Successfully!");
      dispatch(clearCart());
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end transition-all duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#fff9f6] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 z-10">
        {/* Header */}
        <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-950">
            <FaShoppingBag size={20} className="text-teal-600" />
            <h2 className="text-lg font-bold">Shopping Cart ({cartItems.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FaShoppingBag size={48} className="text-gray-300 mb-3 animate-pulse" />
              <h3 className="font-bold text-gray-700 mb-1">Your cart is empty</h3>
              <p className="text-xs text-gray-400 max-w-[200px]">
                Add some tasty sweets and namkeens to make your day!
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-3 rounded-2xl border border-orange-50/50 shadow-sm flex gap-3 items-center">
                <img
                  src={resolveLocalImage(item.image)}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover" />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-gray-450 truncate">
                    By {item.shop?.name || "Sweet Shop"}
                  </p>
                  <p className="text-sm font-extrabold text-teal-950 mt-1">₹{item.price}</p>
                </div>

                {/* Quantity Manager */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(updateQuantity({ itemId: item._id, change: -1 }))}
                    className="p-1 rounded-md bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors" >
                    <FaMinus size={10} />
                  </button>
                  <span className="text-sm font-bold text-gray-850 w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(updateQuantity({ itemId: item._id, change: 1 }))}
                    className="p-1 rounded-md bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-600 transition-colors">
                    <FaPlus size={10} />
                  </button>

                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-1.5 ml-2 text-red-400 hover:text-red-650 hover:bg-red-50 rounded-md transition-colors">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 space-y-4">
            {/* Delivery Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery address..."
                className="w-full text-sm p-3 bg-[#fff9f6] border border-orange-100/50 rounded-xl outline-none focus:border-teal-500 transition-colors"
                rows={2} />
            </div>

            <div className="flex justify-between items-center text-gray-700">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-extrabold text-teal-950">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-teal-600/10 transition-all flex items-center justify-center gap-2" >
              {loading ? "Placing Order..." : "Proceed to Checkout (COD)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
