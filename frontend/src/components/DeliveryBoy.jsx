import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import {
  FaMotorcycle,
  FaBoxOpen,
  FaHistory,
  FaWallet,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaRupeeSign,
  FaRoute
} from "react-icons/fa";

const DeliveryBoy = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [orders, setOrders] = useState({
    available: [],
    assigned: [],
    history: [],
  });
  const [loading, setLoading] = useState(false);

  // Fetch orders based on active tab
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === "available") {
        res = await axios.get(`${serverUrl}/api/orders/delivery/available`, { withCredentials: true });
        setOrders((prev) => ({ ...prev, available: res.data }));
      } else if (activeTab === "assigned") {
        res = await axios.get(`${serverUrl}/api/orders/delivery/assigned`, { withCredentials: true });
        setOrders((prev) => ({ ...prev, assigned: res.data }));
      } else if (activeTab === "history" || activeTab === "earnings") {
        res = await axios.get(`${serverUrl}/api/orders/delivery/history`, { withCredentials: true });
        setOrders((prev) => ({ ...prev, history: res.data }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`${serverUrl}/api/orders/delivery/accept/${orderId}`, {}, { withCredentials: true });
      // Remove from available list or refresh
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      alert(error.response?.data?.message || "Error accepting order");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await axios.put(`${serverUrl}/api/orders/delivery/deliver/${orderId}`, {}, { withCredentials: true });
      // Remove from assigned list or refresh
      fetchOrders();
    } catch (error) {
      console.error("Error marking delivered:", error);
      alert(error.response?.data?.message || "Error marking delivered");
    }
  };

  const tabs = [
    { id: "available", label: "Available", icon: <FaBoxOpen /> },
    { id: "assigned", label: "Assigned", icon: <FaMotorcycle /> },
    { id: "history", label: "History", icon: <FaHistory /> },
    { id: "earnings", label: "Earnings", icon: <FaWallet /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <FaMotorcycle size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Delivery Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your deliveries and track your earnings</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-gray-400"}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[500px]">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Available Orders */}
                {activeTab === "available" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FaBoxOpen className="text-orange-500" /> New Delivery Requests
                    </h2>
                    {orders.available.length === 0 ? (
                      <EmptyState message="No new orders available right now. Take a quick break!" />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {orders.available.map((order) => (
                          <OrderCard
                            key={order._id}
                            order={order}
                            actionBtn={
                              <button
                                onClick={() => handleAcceptOrder(order._id)}
                                className="w-full bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <FaCheckCircle /> Accept Order
                              </button>
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Assigned Orders */}
                {activeTab === "assigned" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FaMotorcycle className="text-amber-500" /> Currently Assigned
                    </h2>
                    {orders.assigned.length === 0 ? (
                      <EmptyState message="You have no active deliveries. Head to the 'Available' tab!" />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {orders.assigned.map((order) => (
                          <OrderCard
                            key={order._id}
                            order={order}
                            actionBtn={
                              <div className="flex gap-2 w-full">
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                    order.deliveryAddress
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                  <FaRoute /> Navigate
                                </a>
                                <button
                                  onClick={() => handleMarkDelivered(order._id)}
                                  className="flex-1 bg-green-500 text-white hover:bg-green-600 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                  <FaCheckCircle /> Mark Delivered
                                </button>
                              </div>
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* History */}
                {activeTab === "history" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FaHistory className="text-gray-500" /> Delivery History
                    </h2>
                    {orders.history.length === 0 ? (
                      <EmptyState message="No past deliveries found. Start delivering to build your history!" />
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {orders.history.map((order) => (
                          <OrderCard key={order._id} order={order} isHistory />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Earnings */}
                {activeTab === "earnings" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FaWallet className="text-green-500" /> Earnings Summary
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {/* Earning Card 1 */}
                      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 text-white shadow-lg shadow-green-500/30">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-2xl">
                            <FaWallet size={24} />
                          </div>
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                            Total
                          </span>
                        </div>
                        <p className="text-green-50 font-medium mb-1">Total Earnings</p>
                        <h3 className="text-4xl font-bold flex items-center">
                          <FaRupeeSign className="text-3xl mr-1" />
                          {orders.history.length * 50}
                        </h3>
                        <p className="text-sm mt-3 text-green-100 bg-black/10 inline-block px-3 py-1 rounded-lg">
                          Based on ₹50 / delivery
                        </p>
                      </div>

                      {/* Earning Card 2 */}
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/30">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-white/20 rounded-2xl">
                            <FaBoxOpen size={24} />
                          </div>
                        </div>
                        <p className="text-blue-50 font-medium mb-1">Deliveries Completed</p>
                        <h3 className="text-4xl font-bold">
                          {orders.history.length}
                        </h3>
                        <p className="text-sm mt-3 text-blue-100 bg-black/10 inline-block px-3 py-1 rounded-lg">
                          All time successful
                        </p>
                      </div>
                    </div>

                    {/* Recent Payouts placeholder */}
                    <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                      <h4 className="font-bold text-gray-700 mb-4">Recent Delivered Value</h4>
                      <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600">Total Goods Value Delivered</span>
                        <span className="font-bold text-gray-800 flex items-center">
                          <FaRupeeSign size={14} /> 
                          {orders.history.reduce((acc, order) => acc + order.totalAmount, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Order Card Component
const OrderCard = ({ order, actionBtn, isHistory }) => {
  return (
    <div className="border border-gray-100 rounded-3xl p-5 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {order.status}
        </div>
        <div className="text-gray-400 text-sm font-medium">
          {new Date(order.createdAt).toLocaleDateString('en-GB')}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight line-clamp-1">
        {order.shop?.name || "Local Shop"}
      </h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-1">Customer: {order.user?.fullName || "Guest"}</p>
      
      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" />
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {order.deliveryAddress}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order Value</p>
          <p className="text-lg font-bold text-gray-800 flex items-center">
            <FaRupeeSign size={16} className="text-gray-500 mr-0.5" />
            {order.totalAmount}
          </p>
        </div>
        <div>
           <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Payment</p>
           <p className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
             {order.paymentMethod}
           </p>
        </div>
      </div>

      {!isHistory && actionBtn}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 border border-gray-100 border-dashed rounded-3xl">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
      <FaBoxOpen size={40} />
    </div>
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

export default DeliveryBoy;
