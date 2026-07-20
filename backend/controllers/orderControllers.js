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
