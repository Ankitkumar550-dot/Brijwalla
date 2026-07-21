import Order from "../models/orderModel.js";
import Shop from "../models/shopModel.js";

// Place a new order
export const createOrder = async (req, res) => {
  try {
    const { shopId, items, totalAmount, deliveryAddress, isCustomBox, customBoxDetails } = req.body;
    const order = await Order.create({
      user: req.userId,
      shop: shopId,
      items,
      totalAmount,
      deliveryAddress,
      isCustomBox,
      customBoxDetails,
    });
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: `Create order error: ${error.message}` });
  }
};

// Get orders placed by current user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("shop")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `Get my orders error: ${error.message}` });
  }
};

// Get orders received by the owner's shop
export const getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const orders = await Order.find({ shop: shop._id })
      .populate("user")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `Get shop orders error: ${error.message}` });
  }
};

// Update order status (Owner / Delivery Boy)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `Update status error: ${error.message}` });
  }
};

// --- Delivery Boy Operations ---

// Get all available orders (Pending or Confirmed, and not yet assigned to a delivery boy)
export const getAvailableOrdersForDelivery = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["Pending", "Confirmed"] },
      deliveryBoy: { $exists: false }
    }).populate("shop").populate("user", "fullName mobile").sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `Get available orders error: ${error.message}` });
  }
};

// Get orders currently assigned to the delivery boy (Out for Delivery)
export const getAssignedDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.userId,
      status: { $ne: "Delivered" }
    }).populate("shop").populate("user", "fullName mobile").sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `Get assigned orders error: ${error.message}` });
  }
};

// Get orders already delivered by the delivery boy
export const getDeliveredOrdersForDeliveryBoy = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.userId,
      status: "Delivered"
    }).populate("shop").populate("user", "fullName mobile").sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: `Get delivered orders error: ${error.message}` });
  }
};

// Accept an order for delivery
export const acceptDeliveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Check if the order is already assigned
    const orderCheck = await Order.findById(orderId);
    if (!orderCheck) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (orderCheck.deliveryBoy) {
      return res.status(400).json({ message: "Order already assigned to a delivery boy" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryBoy: req.userId, status: "Out for Delivery" },
      { new: true }
    );
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `Accept order error: ${error.message}` });
  }
};

// Mark an assigned order as delivered
export const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, deliveryBoy: req.userId },
      { status: "Delivered" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found or not assigned to you" });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `Mark delivered error: ${error.message}` });
  }
};
