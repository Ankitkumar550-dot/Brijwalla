import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body
        let image;
        if (req.file) {
            console.log(req.file)
            image = await uploadOnCloudinary(req.file.path)
        }
        let shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            shop = await Shop.create({
                name, city, state, address, image, owner: req.userId
            })
        } else {
            const updateData = { name, city, state, address, owner: req.userId }
            if (image) {
                updateData.image = image
            }
            shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true })
        }

        await shop.populate("owner items")
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `create shop error ${error}` })

    }
}

export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner items")
        if (!shop) {
            return res.status(200).json(null)
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `get my shop error ${error}` })
    }
}

export const getAllShops = async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city: { $regex: new RegExp(city, "i") } } : {};
    const shops = await Shop.find(query).populate("items");
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ message: `Get shops error: ${error.message}` });
  }
};