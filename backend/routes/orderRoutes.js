import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  createOrder,
  getMyOrders,
  getShopOrders,
  updateOrderStatus,
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();
orderRouter.post("/create", isAuth, createOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.get("/shop-orders", isAuth, getShopOrders);
orderRouter.put("/update-status/:orderId", isAuth, updateOrderStatus);

export default orderRouter;
