import express from "express"

import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { addItem, editItem, deleteItem, searchAndFilterItems, getItemById } from "../controllers/itemControllers.js"


const itemRouter=express.Router()

itemRouter.post("/add-item",isAuth,upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId",isAuth,upload.single("image"), editItem)
itemRouter.delete("/delete-item/:itemId",isAuth, deleteItem)
itemRouter.get("/search", searchAndFilterItems)
itemRouter.get("/get-item/:itemId", getItemById)

export default itemRouter