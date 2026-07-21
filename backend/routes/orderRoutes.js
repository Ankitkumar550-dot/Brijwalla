import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
  getAvailableOrdersForDelivery,
  getAssignedDeliveryOrders,
  getDeliveredOrdersForDeliveryBoy,
  acceptDeliveryOrder,
  markOrderDelivered
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();
orderRouter.post("/create", isAuth, createOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.get("/shop-orders", isAuth, getShopOrders);
orderRouter.put("/update-status/:orderId", isAuth, updateOrderStatus);

// Delivery Boy Routes
orderRouter.get("/delivery/available", isAuth, getAvailableOrdersForDelivery);
orderRouter.get("/delivery/assigned", isAuth, getAssignedDeliveryOrders);
orderRouter.get("/delivery/history", isAuth, getDeliveredOrdersForDeliveryBoy);
orderRouter.put("/delivery/accept/:orderId", isAuth, acceptDeliveryOrder);
orderRouter.put("/delivery/deliver/:orderId", isAuth, markOrderDelivered);

export default orderRouter;
