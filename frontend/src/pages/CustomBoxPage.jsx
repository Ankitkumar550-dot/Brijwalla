import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import { FaCheckCircle, FaGift, FaTag } from "react-icons/fa";

const BOX_TYPES = [
  { id: "Silver Box", price: 500, desc: "A beautiful basic setup." },
  { id: "Gold Box", price: 1000, desc: "Premium quality and feel." },
  { id: "Premium Box", price: 1500, desc: "Luxury finishing, perfect for weddings." },
];

const RIBBON_COLORS = ["Red", "Gold", "Pink", "Blue", "Silver"];

const CustomBoxPage = () => {
  const { currentCity } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [boxType, setBoxType] = useState(BOX_TYPES[0].id);
  const [ribbonColor, setRibbonColor] = useState(RIBBON_COLORS[0]);
  const [greetingCard, setGreetingCard] = useState("");
  const [address, setAddress] = useState("");
  
  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fulfillmentShopId, setFulfillmentShopId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get items for selection
        const itemRes = await axios.get(`${serverUrl}/api/item/search`);
        setAvailableItems(itemRes.data.filter(i => i.foodType === "sweet" || i.category?.toLowerCase() !== "namkeen"));
        
        // Get a shop to tie the order to
        const shopRes = await axios.get(`${serverUrl}/api/shop/all${currentCity ? `?city=${currentCity}` : ""}`);
        if (shopRes.data.length > 0) {
          setFulfillmentShopId(shopRes.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to load custom box data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentCity]);

  const toggleItemSelection = (item) => {
    const exists = selectedItems.find(i => i._id === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const calculateTotal = () => {
    const boxBase = BOX_TYPES.find(b => b.id === boxType)?.price || 0;
    const sweetsTotal = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    return boxBase + sweetsTotal;
  };

  const handleBooking = async () => {
    if (!fulfillmentShopId) {
      alert("No sweet shop available in your area to fulfill this custom box.");
      return;
    }
    if (!address) {
      alert("Please enter a delivery address.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one sweet to put in your box.");
      return;
    }

    try {
      setSubmitting(true);
      const itemsPayload = selectedItems.map(i => ({
        item: i._id,
        name: i.name,
        price: i.price,
        quantity: 1
      }));

      const payload = {
        shopId: fulfillmentShopId,
        items: itemsPayload,
        totalAmount: calculateTotal(),
        deliveryAddress: address,
        isCustomBox: true,
        customBoxDetails: {
          boxType,
          greetingCard,
          ribbonColor
        }
      };

      await axios.post(`${serverUrl}/api/order/create`, payload, { withCredentials: true });
      alert("Your custom box order has been placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fff9f6] min-h-screen pb-12">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-teal-500 to-teal-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold font-serif mb-2 flex items-center justify-center gap-3">
              <FaGift /> Design Your Custom Sweet Box
            </h1>
            <p className="text-teal-100">Personalize a premium box for your loved ones.</p>
          </div>

          <div className="p-6 md:p-10">
            {/* Steps Navigation */}
            <div className="flex flex-wrap justify-between mb-10 border-b pb-4 border-gray-100">
              {['Box & Ribbon', 'Greeting Card', 'Sweet Selection', 'Checkout'].map((label, idx) => (
                <div key={idx} className={`font-semibold ${step >= idx + 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                  Step {idx + 1}: {label}
                </div>
              ))}
            </div>

            {/* Step 1: Box Type & Ribbon */}
            {step === 1 && (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Select Box Tier</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {BOX_TYPES.map(box => (
                    <div 
                      key={box.id} 
                      onClick={() => setBoxType(box.id)}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${boxType === box.id ? 'border-teal-500 bg-teal-50 shadow-md transform scale-105' : 'border-gray-200 hover:border-teal-300'}`}
                    >
                      <h3 className="font-bold text-lg text-gray-800">{box.id}</h3>
                      <p className="text-sm text-gray-500 mb-3">{box.desc}</p>
                      <p className="font-bold text-teal-700 font-serif">₹{box.price}</p>
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-bold mb-6 text-gray-800">Choose Ribbon Color</h2>
                <div className="flex gap-4 flex-wrap mb-8">
                  {RIBBON_COLORS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setRibbonColor(color)}
                      className={`px-6 py-3 rounded-full font-semibold border-2 transition-all ${ribbonColor === color ? 'border-teal-500 bg-teal-500 text-white shadow-lg' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => setStep(2)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-md">Next Step</button>
                </div>
              </div>
            )}

            {/* Step 2: Greeting Card */}
            {step === 2 && (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add a Personal Message</h2>
                <p className="text-gray-500 mb-6">We will print this beautifully on a greeting card and place it inside the box.</p>
                <textarea 
                  value={greetingCard}
                  onChange={(e) => setGreetingCard(e.target.value)}
                  placeholder="Dear [Name], wishing you..."
                  className="w-full h-40 border border-gray-200 rounded-2xl p-4 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none mb-8"
                />
                
                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="text-gray-500 font-bold py-3 px-6 hover:text-gray-800">Back</button>
                  <button onClick={() => setStep(3)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-md">Next Step</button>
                </div>
              </div>
            )}

            {/* Step 3: Sweet Selection */}
            {step === 3 && (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Curate Your Sweets</h2>
                <p className="text-gray-500 mb-6">Select the sweets you want included in your custom box.</p>
                
                {loading ? (
                  <div className="py-10 text-center animate-pulse text-gray-400">Loading exquisite sweets...</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                    {availableItems.map(item => {
                      const isSelected = selectedItems.find(i => i._id === item._id);
                      return (
                        <div 
                          key={item._id}
                          onClick={() => toggleItemSelection(item)}
                          className={`relative border-2 rounded-xl p-3 cursor-pointer transition-all ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                          <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                          <p className="text-xs text-teal-700 font-bold mt-1">₹{item.price}</p>
                          {isSelected && <FaCheckCircle className="absolute top-2 right-2 text-teal-500 text-xl bg-white rounded-full" />}
                        </div>
                      )
                    })}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setStep(2)} className="text-gray-500 font-bold py-3 px-6 hover:text-gray-800">Back</button>
                  <div className="font-bold text-gray-700">Selected: {selectedItems.length} item(s)</div>
                  <button onClick={() => setStep(4)} disabled={selectedItems.length === 0} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-md disabled:bg-gray-300">Next Step</button>
                </div>
              </div>
            )}

            {/* Step 4: Checkout */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in duration-300">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Review & Book</h2>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                  <div className="flex justify-between border-b pb-4 mb-4">
                    <span className="font-semibold text-gray-600">Base Box ({boxType})</span>
                    <span className="font-bold">₹{BOX_TYPES.find(b => b.id === boxType)?.price}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4 mb-4 text-sm text-gray-500">
                    <span>Ribbon Color: {ribbonColor}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4 mb-4 text-sm text-gray-500">
                    <span className="max-w-[70%]">Card Message: "{greetingCard || "No message"}"</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-700 mb-2">Selected Sweets:</h4>
                    {selectedItems.map(item => (
                      <div key={item._id} className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{item.name}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <span className="font-bold text-xl text-gray-800">Total Price</span>
                    <span className="font-bold text-2xl text-teal-700">₹{calculateTotal()}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-gray-700 mb-2">Delivery Address</h3>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                    className="w-full h-24 border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(3)} className="text-gray-500 font-bold py-3 px-6 hover:text-gray-800">Back</button>
                  <button 
                    onClick={handleBooking} 
                    disabled={submitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-full shadow-lg disabled:bg-gray-300 flex items-center gap-2 text-lg"
                  >
                    {submitting ? 'Booking...' : <><FaCheckCircle /> Confirm & Book</>}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBoxPage;
