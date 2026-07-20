import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import Nav from "../components/Nav";
import { FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";

function MyOrders() {
  const { userData } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        userData?.role === "owner"
          ? `${serverUrl}/api/order/shop-orders`
          : `${serverUrl}/api/order/my-orders`;

      const res = await axios.get(url, { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchOrders();
    }
  }, [userData]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${serverUrl}/api/order/update-status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      alert(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-500" />;
      case "Confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      case "Out for Delivery":
        return <FaTruck className="text-purple-500" />;
      case "Delivered":
        return <FaCheckCircle className="text-teal-600" />;
      default:
        return <FaBoxOpen className="text-gray-400" />;
    }
  };

  return (
    <>
      <Nav />
      <div className="w-screen min-h-screen bg-[#fff9f6] flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-orange-100/50">
          <h2 className="text-3xl font-black text-teal-950 mb-6 flex items-center gap-2">
            <FaBoxOpen className="text-teal-650" />
            {userData?.role === "owner" ? "Incoming Shop Orders" : "My Order History"}
          </h2>

          {loading ? (
            <div className="text-center py-10 font-bold text-gray-500 animate-pulse">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <FaBoxOpen size={64} className="text-gray-350 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-gray-700 mb-1">No Orders Found</h3>
              <p className="text-sm text-gray-450 max-w-sm">
                {userData?.role === "owner"
                  ? "Your shop hasn't received any orders yet. Ensure your items are up to date!"
                  : "You haven't ordered any delicious mithai yet! Head over to Home to get started."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-orange-100/40 rounded-2xl p-5 bg-[#fff9f6]/20 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400">Order ID:</span>
                      <span className="text-xs font-mono text-gray-650 ml-1.5">{order._id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-orange-100/30">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-bold text-gray-750">{order.status}</span>
                    </div>
                  </div>

                  {/* Order Status Tracker */}
                  {userData?.role === "user" && (
                  <div className="py-6 px-2 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center min-w-[350px]">
                      {["Pending", "Confirmed", "Out for Delivery", "Delivered"].map((step, index, array) => {
                        const stepIndex = array.indexOf(order.status);
                        const isCompleted = index <= stepIndex && order.status !== "Cancelled";
                        const isCancelled = order.status === "Cancelled";

                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${isCancelled ? 'bg-red-100 text-red-500 border border-red-300' : isCompleted ? 'bg-teal-500 text-white shadow-teal-500/30' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                {isCompleted ? <FaCheckCircle size={14} /> : index + 1}
                              </div>
                              <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center absolute top-8 whitespace-nowrap ${isCancelled ? 'text-red-500' : isCompleted ? 'text-teal-700' : 'text-gray-400'}`}>
                                {step}
                              </span>
                            </div>
                            {index < array.length - 1 && (
                              <div className={`flex-1 h-1.5 mx-2 rounded-full ${isCancelled ? 'bg-red-100' : index < stepIndex ? 'bg-teal-500' : 'bg-gray-100'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                  )}

                  {order.status === "Delivered" && (
                    <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 shadow-sm">
                      <FaCheckCircle className="text-teal-600 text-xl" />
                      <span className="font-bold">Order Delivered Successfully!</span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-2.5">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <FaUtensils className="text-amber-600 text-xs" />
                          <span className="font-bold text-gray-800">{it.name}</span>
                          <span className="text-xs text-gray-450">× {it.quantity}</span>
                        </div>
                        <span className="font-mono text-gray-700">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order metadata / actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 gap-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      {userData?.role === "owner" && (
                        <p>
                          <span className="font-bold">Customer:</span> {order.user?.fullName} (
                          {order.user?.mobile})
                        </p>
                      )}
                      {userData?.role === "user" && (
                        <p>
                          <span className="font-bold">Shop:</span> {order.shop?.name || "Local Shop"}
                        </p>
                      )}
                      <p className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-teal-650 text-xs" />
                        <span className="font-bold">Address:</span> {order.deliveryAddress}
                      </p>
                      {/* Customer Action to Mark Received */}
                      {userData?.role === "user" && order.status === "Out for Delivery" && (
                        <button
                          onClick={() => handleStatusChange(order._id, "Delivered")}
                          className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                        >
                          <FaCheckCircle /> I Received My Order
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-xl font-black text-teal-950">₹{order.totalAmount}</span>
                      </div>

                      {/* Owner actions */}
                      {userData?.role === "owner" && order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          {order.status === "Pending" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "Confirmed")}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                            >
                              Confirm Order
                            </button>
                          )}
                          {order.status === "Confirmed" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "Out for Delivery")}
                              className="bg-purple-650 hover:bg-purple-750 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                            >
                              Dispatch
                            </button>
                          )}
                          {order.status === "Out for Delivery" && (
                            <button
                              onClick={() => handleStatusChange(order._id, "Delivered")}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(order._id, "Cancelled")}
                            className="bg-red-500 hover:bg-red-650 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
