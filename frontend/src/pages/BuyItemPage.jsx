import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { resolveLocalImage } from "../utils/imageResolver";
import Nav from "../components/Nav";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaStore,
  FaMapMarkerAlt,
  FaTruck,
  FaCheckCircle,
  FaSpinner,
  FaAward,
  FaMobileAlt,
  FaKeyboard
} from "react-icons/fa";

function BuyItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { userData, currentAddress } = useSelector((state) => state.user);

  // States
  const [item, setItem] = useState(null);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopItem, setSelectedShopItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(currentAddress || "");
  const [phone, setPhone] = useState(userData?.mobile || "");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Fetch item and shop options
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch current item details
        const res = await axios.get(`${serverUrl}/api/item/get-item/${itemId}`, {
          withCredentials: true,
        });
        const currentItem = res.data;
        setItem(currentItem);

        // 2. Fetch all items matching this name to get other shops
        const searchRes = await axios.get(
          `${serverUrl}/api/item/search?query=${encodeURIComponent(currentItem.name)}`,
          { withCredentials: true }
        );

        // Filter exact matches to get shops selling the same item name
        let matchingItems = searchRes.data.filter(
          (i) => i.name.toLowerCase() === currentItem.name.toLowerCase()
        );

        // If only 1 shop is returned, let's dynamically inject alternative shops for a premium demo
        if (matchingItems.length <= 1) {
          const mainShop = currentItem.shop;
          const altShops = [
            {
              _id: `mock-shop-cheaper-${currentItem._id}`,
              name: "Radhe Radhe Sweet House",
              address: "Near ISKCON Temple, Vrindavan",
              city: mainShop?.city || "Vrindavan",
              image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af",
            },
            {
              _id: `mock-shop-premium-${currentItem._id}`,
              name: "Vrindavan Mithai Bhandar",
              address: "Chatikara Road, Vrindavan",
              city: mainShop?.city || "Vrindavan",
              image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
            },
          ];

          // Create virtual items for these alternative shops
          const mockItems = altShops.map((shop, index) => {
            // Cheaper option (Best Price suggestion)
            const priceFactor = index === 0 ? 0.9 : 1.15;
            const price = Math.round(currentItem.price * priceFactor);
            return {
              _id: index === 0 ? `mock-item-cheaper` : `mock-item-premium`,
              name: currentItem.name,
              category: currentItem.category,
              foodType: currentItem.foodType,
              price: price,
              image: currentItem.image,
              shop: shop,
              isMock: true,
            };
          });

          matchingItems = [...matchingItems, ...mockItems];
        }

        // Remove duplicates (based on shop name) just in case
        const uniqueShopItems = [];
        const seenShops = new Set();
        matchingItems.forEach((shopItem) => {
          const sId = shopItem.shop?._id || shopItem.shop;
          if (sId && !seenShops.has(sId)) {
            seenShops.add(sId);
            uniqueShopItems.push(shopItem);
          }
        });

        // Determine recommended shop (lowest price)
        const sortedByPrice = [...uniqueShopItems].sort((a, b) => a.price - b.price);
        const cheapestItem = sortedByPrice[0];

        // Add a "recommended" flag to the cheapest item
        const processedOptions = uniqueShopItems.map((opt) => ({
          ...opt,
          isRecommended: opt._id === cheapestItem?._id,
        }));

        setShopOptions(processedOptions);

        // Auto-select the recommended (cheapest) shop
        setSelectedShopItem(cheapestItem || currentItem);
      } catch (error) {
        console.error("Error fetching buy page details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const handleProceedOrder = async (e) => {
    e.preventDefault();
    if (!selectedShopItem) return;
    if (!address.trim()) {
      alert("Please provide a delivery address!");
      return;
    }
    if (!phone.trim()) {
      alert("Please provide a phone number for delivery contact!");
      return;
    }

    try {
      setSubmitting(true);

      const itemsPayload = [
        {
          item: selectedShopItem.isMock ? item._id : selectedShopItem._id, // use real item id if mock
          name: selectedShopItem.name,
          price: selectedShopItem.price,
          quantity: quantity,
        },
      ];

      const shopId = selectedShopItem.isMock
        ? item.shop?._id || item.shop
        : selectedShopItem.shop?._id || selectedShopItem.shop;

      const grandTotal = selectedShopItem.price * quantity;

      const res = await axios.post(
        `${serverUrl}/api/order/create`,
        {
          shopId,
          items: itemsPayload,
          totalAmount: grandTotal,
          deliveryAddress: `${address} (Phone: ${phone})${instructions ? ` - Notes: ${instructions}` : ""}`,
        },
        { withCredentials: true }
      );

      setOrderId(res.data._id);
      setSuccess(true);
    } catch (error) {
      console.error("Checkout page error:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="w-screen min-h-screen bg-[#fff9f6] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <FaSpinner className="text-4xl text-amber-600 animate-spin" />
            <p className="text-gray-500 font-bold tracking-wide animate-pulse">Loading sweet details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Nav />
        <div className="w-screen min-h-screen bg-[#fff9f6] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-md border border-red-100 max-w-md text-center">
            <h2 className="text-2xl font-black text-red-600 mb-2">Item Not Found</h2>
            <p className="text-gray-500 text-sm mb-6">The sweet or namkeen you are trying to buy is not available.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // Calculate prices
  const itemPrice = selectedShopItem?.price || item.price;
  const subtotal = itemPrice * quantity;
  const deliveryFee = 30;
  const grandTotal = subtotal + deliveryFee;

  if (success) {
    return (
      <>
        <Nav />
        <div className="w-screen min-h-screen bg-[#fff9f6] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-orange-100/50 max-w-lg text-center flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <FaCheckCircle className="text-5xl animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-teal-950 mb-3">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
              Your order for <span className="font-extrabold text-orange-600">{quantity}x {item.name}</span> has been saved. The shop is preparing your fresh order.
            </p>

            <div className="bg-[#fff9f6] border border-orange-100/30 rounded-2xl p-4 w-full mb-8 text-left space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Order ID:</span>
                <span className="font-bold text-gray-700 font-mono">{orderId || "Generating..."}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Selected Shop:</span>
                <span className="font-bold text-teal-900">{selectedShopItem?.shop?.name}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total Amount paid:</span>
                <span className="font-extrabold text-teal-950 text-sm">₹{grandTotal} (COD)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Track My Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="w-screen min-h-screen bg-[#fff9f6] pb-12">
        {/* Header Breadcrumbs / Back button */}
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-teal-900 hover:text-orange-600 transition-colors group cursor-pointer"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Item info and Shop Selection */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Sweet Detail Card */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-100/30 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                <img
                  src={resolveLocalImage(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <span className="bg-orange-50 text-orange-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h1 className="text-2xl font-black text-teal-950 mt-3">{item.name}</h1>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mt-1">
                    {item.foodType === "sweet" ? "Mithai Special" : "Crispy Namkeen"}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Authentic Taste from Vrindavan</p>
                  <p className="text-xl font-extrabold text-teal-950 mt-0.5">₹{item.price} <span className="text-xs font-bold text-gray-500">/ per unit</span></p>
                </div>
              </div>
            </div>

            {/* Shop Selection Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-orange-100/30">
              <div className="flex items-center gap-2 text-teal-950 mb-4">
                <FaStore className="text-teal-600 text-xl" />
                <h3 className="text-lg font-black">Choose Confectionery Shop</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                We found multiple local sweet shops offering this item. Select your preferred shop. We recommend the shop offering the best price!
              </p>

              <div className="space-y-4">
                {shopOptions.map((opt) => {
                  const isCheapest = opt.isRecommended;
                  const isSelected = selectedShopItem?._id === opt._id;
                  const shopDetails = opt.shop || {};

                  return (
                    <div
                      key={opt._id}
                      onClick={() => setSelectedShopItem(opt)}
                      className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/10 shadow-md"
                          : "border-gray-100 hover:border-orange-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-inner bg-gray-50">
                          <img
                            src={shopDetails.image || "https://images.unsplash.com/photo-1587314168485-3236d6710814"}
                            alt={shopDetails.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-teal-950 text-sm">{shopDetails.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FaMapMarkerAlt className="text-amber-600" size={10} />
                            {shopDetails.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-base font-extrabold text-teal-950">₹{opt.price}</span>
                        {isCheapest && (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide">
                            <FaAward size={10} />
                            Best Price
                          </span>
                        )}
                        {!isCheapest && opt.price > item.price && (
                          <span className="text-[10px] text-gray-400 font-semibold">
                            +₹{opt.price - item.price} extra
                          </span>
                        )}
                        {opt.isMock && (
                          <span className="text-[9px] text-orange-400 bg-orange-50/30 px-1.5 py-0.5 rounded border border-orange-100 font-medium tracking-wide">
                            Demo Partner
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Buy form and totals */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-orange-100/50 relative overflow-hidden">
              {/* Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute top-4 -right-8 w-28 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black text-center py-1 uppercase tracking-widest rotate-45 shadow-sm">
                  Fresh
                </div>
              </div>

              <h3 className="text-lg font-black text-teal-950 mb-6 flex items-center gap-2">
                <FaTruck className="text-teal-600" />
                Delivery Details
              </h3>

              <form onSubmit={handleProceedOrder} className="space-y-5">
                {/* Quantity selector */}
                <div className="flex justify-between items-center bg-[#fff9f6] p-4 rounded-2xl border border-orange-100/30">
                  <div>
                    <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                      Quantity
                    </label>
                    <span className="text-[10px] text-gray-400">Specify units to buy</span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-xl bg-white text-gray-600 hover:text-amber-600 flex items-center justify-center shadow-sm border border-gray-100 transition-colors cursor-pointer"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="text-base font-extrabold text-teal-950 w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-8 h-8 rounded-xl bg-white text-gray-600 hover:text-amber-600 flex items-center justify-center shadow-sm border border-gray-100 transition-colors cursor-pointer"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>

                {/* Mobile phone number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <FaMobileAlt className="absolute left-4 top-3.5 text-teal-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      required
                      className="w-full text-sm pl-11 pr-4 py-3 bg-[#fff9f6] border border-orange-100/30 rounded-xl outline-none focus:border-teal-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Delivery address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter complete house address, street, landmark, city..."
                    rows={2}
                    required
                    className="w-full text-sm p-4 bg-[#fff9f6] border border-orange-100/30 rounded-xl outline-none focus:border-teal-500 transition-all leading-relaxed"
                  />
                </div>

                {/* Special Instructions */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                    <FaKeyboard size={12} className="text-teal-600" />
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="E.g., Make it extra spicy, deliver after 6 PM, ring the bell..."
                    rows={2}
                    className="w-full text-sm p-4 bg-[#fff9f6] border border-orange-100/30 rounded-xl outline-none focus:border-teal-500 transition-all leading-relaxed"
                  />
                </div>

                {/* Pricing Summary */}
                <div className="pt-4 border-t border-dashed border-gray-200 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Price ({quantity} units)</span>
                    <span className="font-semibold text-gray-700">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-700">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Payment Method</span>
                    <span className="font-bold text-teal-800 uppercase tracking-wide text-xs">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between items-center text-teal-950 pt-2 border-t border-gray-100">
                    <span className="font-bold">Grand Total</span>
                    <span className="text-xl font-extrabold text-amber-600">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-teal-650/15 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      Placing Order...
                    </>
                  ) : (
                    "Confirm & Proceed"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuyItemPage;
